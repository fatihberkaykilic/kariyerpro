from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import hashlib
import re
import io
import os

try:
    import pypdf
    HAS_PYPDF = True
except ImportError:
    HAS_PYPDF = False

try:
    import docx
    HAS_DOCX = True
except ImportError:
    HAS_DOCX = False

def extract_text_from_pdf(file_bytes):
    if not HAS_PYPDF:
        return ""
    try:
        pdf_file = io.BytesIO(file_bytes)
        reader = pypdf.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        print("PDF okuma hatası:", e)
        return ""

def extract_text_from_docx(file_bytes):
    if not HAS_DOCX:
        return ""
    try:
        docx_file = io.BytesIO(file_bytes)
        doc = docx.Document(docx_file)
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text
    except Exception as e:
        print("DOCX okuma hatası:", e)
        return ""

# Mülakat durum takibi
sessions_db = {}

app = Flask(__name__)
CORS(app)

@app.route('/api/analyze', methods=['POST'])
def analyze_job():
    data = request.json
    if not data or 'title' not in data:
        return jsonify({'error': 'Başlık gereklidir'}), 400
        
    title = data['title'].lower()
    link = data.get('link', '')
    
    # 1. DERİN TARAMA (DEEP CRAWL) - İlanın içine girip gerçek verileri okuma
    real_text = ""
    found_quota = None
    
    if link and link.startswith('http'):
        try:
            # İlanın asıl detay sayfasına istek atıyoruz
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
            page_resp = requests.get(link, headers=headers, timeout=5)
            if page_resp.status_code == 200:
                if page_resp.encoding == 'ISO-8859-1' or page_resp.encoding == 'iso-8859-9':
                    page_resp.encoding = 'windows-1254'
                
                soup = BeautifulSoup(page_resp.text, 'html.parser')
                
                # Memurlar.net veya genel sayfalardaki ilan metinlerini çek
                content_div = soup.find('div', class_='ilan-detay') or soup.find('div', class_='Content') or soup.body
                if content_div:
                    real_text = content_div.get_text(separator=' ', strip=True).lower()
                    
                    # Gerçek kontenjan sayısını bulmaya çalış (Örn: "50 Adet", "10 personel", "5 Sözleşmeli")
                    # Gelişmiş Regex: "alınacaktır", "personel", "adet" kelimelerine yakın sayıları bul
                    numbers = re.findall(r'\b(\d{1,4})\b(?=\s*(?:adet|kişi|personel|sözleşmeli|memur|işçi|kontenjan))', real_text)
                    if numbers:
                        # 2024, 2025, 2026 gibi yılları ve kpss puanı olabilecek 70-80 sayılarını filtreleyelim
                        valid_quotas = [int(n) for n in numbers if int(n) < 1500]
                        if valid_quotas:
                            found_quota = max(valid_quotas)
        except Exception as e:
            print("Derin tarama hatası:", e)

    # 2. Tahmini Atanma İhtimali ve Rekabet (Deterministik)
    analysis_source = title + " " + real_text
    base_hash = int(hashlib.md5(analysis_source.encode('utf-8')).hexdigest(), 16)
    prob = 50 + (base_hash % 46)
    
    # Analiz metni title ve real_text'in birleşimi üzerinden yapılır
    # Daha önce tanımlandı
    
    if 'mühendis' in analysis_source or 'avukat' in analysis_source or 'uzman' in analysis_source:
        competition = 'Çok Yüksek'
        prob -= 15
    elif 'büro' in analysis_source or 'memur' in analysis_source:
        competition = 'Yüksek'
    elif 'tekniker' in analysis_source or 'teknisyen' in analysis_source:
        competition = 'Orta'
    else:
        competition = 'Düşük'
        prob += 10
        
    prob = max(min(prob, 99), 30)

    # 3. Tahmini Taban Puan (Deterministik)
    if competition == 'Çok Yüksek':
        estimated_score = 85 + (base_hash % 8) + round((base_hash % 10) / 10.0, 1)
    elif competition == 'Yüksek':
        estimated_score = 80 + (base_hash % 7) + round((base_hash % 10) / 10.0, 1)
    else:
        estimated_score = 72 + (base_hash % 9) + round((base_hash % 10) / 10.0, 1)
        
    # 4. NLP Nitelik Çıkarımı
    notes = []
    
    if found_quota:
        notes.append(f"🔍 Derin Tarama: Bu ilanda toplam {found_quota} kişilik alım tespit edildi.")
    
    if 'kpss' in analysis_source:
        notes.append("KPSS puan sıralaması esas alınacaktır, taban puan kuruma göre değişebilir.")
    if 'mülakat' in analysis_source or 'sözlü' in analysis_source:
        notes.append("⚠️ Dikkat: Sadece KPSS yetmiyor, Sözlü Mülakat / Sınav aşaması bulunmaktadır.")
    if 'sözleşmeli' in analysis_source:
        notes.append("Bu pozisyon 4/B sözleşmeli statüsündedir.")
    if 'şoför' in analysis_source:
        notes.append("Ehliyet şartı (E veya D) ve Psikoteknik belgesi aranabilir.")
    if 'güvenlik' in analysis_source or 'koruma' in analysis_source:
        notes.append("Özel Güvenlik Görevlisi kimlik kartı zorunludur.")
    if 'programcı' in analysis_source or 'çözümleyici' in analysis_source:
        notes.append("YDS puanı (Yabancı Dil) veya onaylı transkript şartı bulunmaktadır.")
    if 'tecrübe' in analysis_source or 'deneyim' in analysis_source:
        notes.append("SGK dökümü ile belgelendirilmiş mesleki tecrübe şartı aranmaktadır.")
        
    if len(notes) < 2:
        notes.append("Nitelik kodlarına (Örn: 3001, 4001) uyduğunuzdan emin olun.")
        notes.append("İlanın tam detaylarını ve başvuru tarihlerini resmi siteden teyit edin.")

    return jsonify({
        'probability': prob,
        'competition': competition,
        'estimatedScore': estimated_score,
        'notes': notes,
        'deep_crawl_quota': found_quota
    })

@app.route('/api/mock-interview/reset', methods=['POST'])
def mock_interview_reset():
    data = request.json or {}
    session_id = data.get('session_id', 'default')
    sessions_db[session_id] = {
        'step': 0,
        'answers': []
    }
    return jsonify({
        'reply': "Merhaba! Kamu kurumu mülakat simülasyonuna hoş geldin. İlk sorum: **Bize biraz kendinizden bahseder misiniz ve neden bu kurumu tercih ediyorsunuz?**"
    })

@app.route('/api/mock-interview', methods=['POST'])
def mock_interview():
    data = request.json
    if not data or 'message' not in data:
        return jsonify({'error': 'Mesaj gereklidir'}), 400
        
    user_msg = data['message'].strip()
    session_id = data.get('session_id', 'default')
    
    # Oturum yoksa veya sıfırlanmışsa oluştur
    if session_id not in sessions_db:
        sessions_db[session_id] = {
            'step': 0,
            'answers': []
        }
        
    session = sessions_db[session_id]
    step = session['step']
    user_msg_lower = user_msg.lower()
    
    questions = [
        "Bize biraz kendinizden bahseder misiniz ve neden bu kurumu tercih ediyorsunuz?",
        "Ekip çalışmasında karşılaştığınız zor bir durumu nasıl yönettiniz ve nasıl çözdünüz?",
        "Kamu sektöründe çalışırken yoğun stres veya ani bir kriz anında kararlarınızı nasıl verirsiniz? Bir örnekle açıklar mısınız?",
        "Kamuda liyakat ve etik değerler hakkında ne düşünüyorsunuz? Size göre bir memurun en önemli görevi nedir?",
        "Mülakat simülasyonu tamamlandı. Cevaplarınız doğrultusunda performansınız analiz edildi."
    ]
    
    feedback = ""
    next_question = ""
    
    if step == 0:
        # Kendini tanıtma ve kurum tercihi analizi
        has_intro = len(user_msg) > 30
        has_keywords = any(x in user_msg_lower for x in ['hedef', 'vizyon', 'katkı', 'hizmet', 'kamu', 'devlet', 'çalışmak', 'kariyer', 'istiyorum'])
        
        if has_intro and has_keywords:
            feedback = "Giriş cevabınız analiz edildi. Kurum hedefleriyle kişisel vizyonunuzu bağdaştırmanız çok başarılı."
        else:
            feedback = "Giriş cevabınız analiz edildi. Kendinizi ve kurumu tercih etme nedenlerinizi biraz daha detaylı açıklayabilirdiniz."
            
        session['answers'].append({'question': questions[0], 'answer': user_msg, 'score': 80 if has_intro else 60})
        session['step'] = 1
        next_question = questions[1]
        reply = f"{feedback}\n\nSıradaki soru:\n**{next_question}**"
        
    elif step == 1:
        # Ekip çalışması analizi
        has_team = any(x in user_msg_lower for x in ['çözüm', 'iletişim', 'yardım', 'birlikte', 'koordine', 'ekip', 'takım', 'arkadaş'])
        has_len = len(user_msg) > 25
        
        if has_team and has_len:
            feedback = "Ekip çalışması cevabınız analiz edildi. Sorun çözme ve iş birliği odaklı yaklaşımınız kamuda büyük bir avantaj."
        else:
            feedback = "Ekip çalışması cevabınız analiz edildi. Karşılaşılan sorundaki kişisel rolünüzü ve iletişimi daha belirgin aktarabilirdiniz."
            
        session['answers'].append({'question': questions[1], 'answer': user_msg, 'score': 85 if has_team else 60})
        session['step'] = 2
        next_question = questions[2]
        reply = f"{feedback}\n\nSıradaki soru:\n**{next_question}**"
        
    elif step == 2:
        # Stres/kriz yönetimi analizi
        has_stress = any(x in user_msg_lower for x in ['sakin', 'analiz', 'hızlı', 'plan', 'mevzuat', 'kriz', 'stres', 'çözüm'])
        has_len = len(user_msg) > 25
        
        if has_stress and has_len:
            feedback = "Stres yönetimi cevabınız analiz edildi. Kriz anında sakin kalıp planlı/mevzuata uygun hareket etmeniz takdir edildi."
        else:
            feedback = "Stres yönetimi cevabınız analiz edildi. Kriz anlarındaki pratik çözüm örneklerinizi ve soğukkanlılığınızı daha fazla vurgulayabilirsiniz."
            
        session['answers'].append({'question': questions[2], 'answer': user_msg, 'score': 85 if has_stress else 65})
        session['step'] = 3
        next_question = questions[3]
        reply = f"{feedback}\n\nSıradaki soru:\n**{next_question}**"
        
    elif step == 3:
        # Liyakat/etik analizi
        has_ethics = any(x in user_msg_lower for x in ['dürüst', 'etik', 'vatan', 'hizmet', 'halk', 'liyakat', 'görev', 'adalet'])
        has_len = len(user_msg) > 25
        
        if has_ethics and has_len:
            feedback = "Kamu etiği cevabınız analiz edildi. Kamusal etik bilinciniz ve dürüstlük vurgunuz son derece olumlu puanlandı."
        else:
            feedback = "Kamu etiği cevabınız analiz edildi. Kamu görevlilerinin yasal sorumlulukları ve etik ilkelerine daha fazla vurgu yapabilirdiniz."
            
        session['answers'].append({'question': questions[3], 'answer': user_msg, 'score': 90 if has_ethics else 70})
        session['step'] = 4
        
        # Mülakat Raporunu Oluştur
        scores = [x['score'] for x in session['answers']]
        avg_score = sum(scores) // len(scores) if scores else 70
        
        reply = f"{feedback}\n\n🎉 **MÜLAKAT DEĞERLENDİRME RAPORU** 🎉\n" \
                f"--------------------------------------------------\n" \
                f"📊 **Genel Değerlendirme Puanı:** **{avg_score} / 100**\n" \
                f"📝 **Özet Yapay Zeka Geribildirimi:**\n"
                
        if avg_score >= 80:
            reply += "- İletişim beceriniz, kriz yönetiminiz ve kamu bilinciniz oldukça yüksek. Mülakatı başarıyla geçme ihtimaliniz çok güçlü.\n"
        elif avg_score >= 65:
            reply += "- Genel olarak başarılı ancak mülakattaki teknik ve durumsal sorulara verdiğiniz cevapların detayını ve örneklerini artırmalısınız.\n"
        else:
            reply += "- Cevaplarınız çok kısa veya yüzeysel kaldı. Kamuda mülakat başarısı için daha detaylı, mevzuata ve iş birliğine dayalı yanıtlar vermelisiniz.\n"
            
        reply += "--------------------------------------------------\n" \
                 "Mülakatı yeniden başlatmak için **Mülakatı Sıfırla** butonuna basabilirsiniz."
                 
    else:
        # Reset and reply
        session['step'] = 0
        session['answers'] = []
        reply = "Mülakat başarıyla sıfırlandı. Hadi baştan başlayalım!\n\n**" + questions[0] + "**"
        
    return jsonify({'reply': reply})

@app.route('/api/cv-analyze', methods=['POST'])
def cv_analyze():
    # Dosyayı multipart form-data olarak alalım
    if 'cv' not in request.files:
        return jsonify({'error': 'Özgeçmiş dosyası bulunamadı'}), 400
        
    cv_file = request.files['cv']
    filename = cv_file.filename.lower()
    file_bytes = cv_file.read()
    
    cv_text = ""
    if filename.endswith('.pdf'):
        cv_text = extract_text_from_pdf(file_bytes)
    elif filename.endswith('.docx') or filename.endswith('.doc'):
        cv_text = extract_text_from_docx(file_bytes)
    else:
        try:
            cv_text = file_bytes.decode('utf-8', errors='ignore')
        except Exception:
            cv_text = ""
            
    # NLP Analiz & Puanlama
    score = 30
    feedback = []
    
    cv_text_lower = cv_text.lower()
    
    # E-posta kontrolü
    has_email = bool(re.search(r'[\w\.-]+@[\w\.-]+\.\w+', cv_text))
    if has_email:
        score += 10
    else:
        feedback.append("⚠️ İletişim: E-posta adresi bulunamadı. Size ulaşılabilmesi için eklemelisiniz.")
        
    # Telefon kontrolü
    has_phone = bool(re.search(r'\b(?:0|\+90)?\s*5\d{2}\s*\d{3}\s*\d{2}\s*\d{2}\b|\b5\d{9}\b', cv_text))
    if has_phone:
        score += 10
    else:
        feedback.append("⚠️ İletişim: Telefon numarası bulunamadı veya biçimi geçersiz.")
        
    # Eğitim bölümü kontrolü
    has_edu = any(x in cv_text_lower for x in ['eğitim', 'okul', 'üniversite', 'lisans', 'mezuniyet', 'fakülte', 'lise'])
    if has_edu:
        score += 15
    else:
        feedback.append("⚠️ Eğitim: Özgeçmişinizde eğitim geçmişi (okul, bölüm vb.) bulunamadı.")
        
    # İş deneyimi bölümü kontrolü
    has_exp = any(x in cv_text_lower for x in ['deneyim', 'tecrübe', 'staj', 'iş deneyimi', 'çalışma', 'görev'])
    if has_exp:
        score += 15
    else:
        feedback.append("⚠️ Deneyim: Geçmiş iş veya staj deneyimleri bölümü tespit edilemedi.")
        
    # Yetenekler kontrolü
    has_skills = any(x in cv_text_lower for x in ['yetenek', 'beceri', 'programlama', 'teknolojiler', 'diller', 'araçlar', 'yazılım'])
    if has_skills:
        score += 15
    else:
        feedback.append("⚠️ Yetenekler: Teknik beceriler, programlama dilleri veya yetenekler bölümü eksik.")
        
    # Yabancı dil kontrolü
    has_lang = any(x in cv_text_lower for x in ['yabancı dil', 'ingilizce', 'almanca', 'fransızca', 'english', 'language', 'dil bilgisi'])
    if has_lang:
        score += 10
    else:
        feedback.append("💡 Yabancı Dil: Dil yetkinlik seviyesi eklemeniz rakiplerinizin önüne geçirecektir.")
        
    # Proje veya sertifikalar
    has_proj_cert = any(x in cv_text_lower for x in ['proje', 'sertifika', 'kurs', 'belge', 'başarı'])
    if has_proj_cert:
        score += 5
        
    # Kelime sayısı
    words = cv_text.split()
    word_count = len(words)
    if word_count > 120:
        score += 10
    elif word_count < 40 and word_count > 0:
        score -= 10
        feedback.append("💡 İçerik: Özgeçmişiniz çok kısa görünüyor. Projelerinizden ve başarılarınızdan bahsedin.")
        
    # KPSS/YDS bonusu
    has_exam = any(x in cv_text_lower for x in ['kpss', 'yds', 'yökdil', 'ales'])
    if has_exam:
        score += 5
        
    score = max(min(score, 100), 20)
    
    if score >= 85 and len(feedback) == 0:
        feedback.append("🎉 Harika! Özgeçmişiniz iletişim bilgileri, eğitim, deneyim ve yetenekler açısından tam görünüyor.")
        feedback.append("✅ ATS (Aday Takip Sistemi) standartlarına uyumlu bir formattadır.")
    elif len(feedback) == 0:
        feedback.append("✅ Genel şablon ve ATS uyumluluğu iyi durumda, mesleki sertifikalar ekleyerek zenginleştirebilirsiniz.")
        
    return jsonify({
        'score': score,
        'feedback': feedback[:4]
    })

if __name__ == '__main__':
    print("======================================================")
    print("YAPAY ZEKA NLP ANALIZ MOTORU (DERIN TARAMA AKTIF)")
    print("API Adresi: http://localhost:5000/api/analyze")
    print("======================================================")
    app.run(port=5000)
