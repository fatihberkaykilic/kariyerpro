const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const iconv = require('iconv-lite');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dns = require('dns'); // MX kaydı doğrulaması için

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'kariyer_super_secret_key_2026';

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Statik dosyaları (HTML, CSS, JS) sunmak için eklendi

// --- VERİTABANI (SQLite) KURULUMU ---
const db = new Database('./kariyer.db');
console.log("✅ SQLite Veritabanı başarıyla bağlandı.");

// Tabloları Oluştur
db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

db.exec(`CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    cities TEXT,
    score TEXT,
    quota INTEGER,
    link TEXT,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'Beklemede',
    FOREIGN KEY(user_id) REFERENCES users(id)
)`);

// Migrasyon: favorites tablosuna status kolonu ekleme
try {
    db.exec(`ALTER TABLE favorites ADD COLUMN status TEXT DEFAULT 'Beklemede'`);
    console.log("✅ Tablo Güncellendi: 'status' kolonu başarıyla eklendi.");
} catch (err) {
    // Kolon zaten varsa hata verir, sorun değil
}

// --- JWT AUTH MIDDLEWARE ---
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ success: false, message: "Oturum açmanız gerekiyor." });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: "Geçersiz veya süresi dolmuş token." });
        req.user = user;
        next();
    });
}

// --- KULLANICI İŞLEMLERİ (KAYIT & GİRİŞ) ---
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) return res.status(400).json({ success: false, message: "Tüm alanları doldurun." });

    // 1. Basit E-Posta Format Kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Geçerli bir e-posta adresi giriniz." });
    }

    // 2. MX Kaydı Kontrolü (Gerçek E-Posta Doğrulaması - Çevrimdışı Toleranslı)
    const domain = email.split('@')[1];
    dns.resolveMx(domain, async (err, addresses) => {
        const isValidDomainFormat = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain);
        const isDNSError = err && (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN' || err.code === 'ENODATA' || err.code === 'EREFUSED');
        
        if (err && !isDNSError && !isValidDomainFormat) {
            return res.status(400).json({ success: false, message: "Geçersiz e-posta sağlayıcısı. Lütfen gerçek bir e-posta adresi kullanın." });
        }
        
        if (!err && (!addresses || addresses.length === 0)) {
            return res.status(400).json({ success: false, message: "E-posta domaini için MX kaydı bulunamadı." });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const stmt = db.prepare(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`);
            try {
                stmt.run(name, email, hashedPassword);
                res.json({ success: true, message: "Kayıt başarılı! Giriş yapabilirsiniz." });
            } catch (dbErr) {
                if (dbErr.message.includes("UNIQUE")) return res.status(400).json({ success: false, message: "Bu e-posta zaten kayıtlı." });
                return res.status(500).json({ success: false, message: "Kayıt olurken hata oluştu." });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Sunucu hatası." });
        }
    });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
        const user = stmt.get(email);
        if (!user) return res.status(400).json({ success: false, message: "Kullanıcı bulunamadı." });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ success: false, message: "Hatalı şifre." });

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token, user: { name: user.name, email: user.email } });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Sunucu hatası." });
    }
});

// --- FAVORİ İŞLEMLERİ (SADECE GİRİŞ YAPANLAR) ---
app.post('/api/favorites', authenticateToken, (req, res) => {
    const { title, cities, score, quota, link, status } = req.body;
    const jobStatus = status || 'Beklemede';
    try {
        const stmt = db.prepare(`INSERT INTO favorites (user_id, title, cities, score, quota, link, status) VALUES (?, ?, ?, ?, ?, ?, ?)`);
        stmt.run(req.user.id, title, cities, score, quota, link, jobStatus);
        res.json({ success: true, message: "İlan favorilere eklendi." });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Favori eklenemedi." });
    }
});

app.get('/api/favorites', authenticateToken, (req, res) => {
    try {
        const stmt = db.prepare(`SELECT * FROM favorites WHERE user_id = ? ORDER BY added_at DESC`);
        const rows = stmt.all(req.user.id);
        res.json({ success: true, data: rows });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Favoriler getirilemedi." });
    }
});

// FAVORİ SİLME (TAKİPTEN KALDIRMA)
app.delete('/api/favorites/:id', authenticateToken, (req, res) => {
    try {
        const stmt = db.prepare(`DELETE FROM favorites WHERE id = ? AND user_id = ?`);
        const result = stmt.run(req.params.id, req.user.id);
        if (result.changes === 0) return res.status(404).json({ success: false, message: "Silinecek ilan bulunamadı." });
        res.json({ success: true, message: "İlan takipten kaldırıldı." });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Favori silinemedi." });
    }
});

// FAVORİ DURUMU GÜNCELLEME (BAŞVURU TAKİBİ)
app.patch('/api/favorites/:id', authenticateToken, (req, res) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: "Durum bilgisi gereklidir." });
    
    try {
        const stmt = db.prepare(`UPDATE favorites SET status = ? WHERE id = ? AND user_id = ?`);
        const result = stmt.run(status, req.params.id, req.user.id);
        if (result.changes === 0) return res.status(404).json({ success: false, message: "Güncellenecek ilan bulunamadı." });
        res.json({ success: true, message: "İlan durumu başarıyla güncellendi." });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Durum güncellenemedi." });
    }
});


// --- ARKA PLAN İLAN KAZIMA (WEB SCRAPING) SİSTEMİ ---
let cachedJobs = {
    ortaogretim: [],
    onlisans: [],
    lisans: [],
    lastUpdate: null
};

const citiesList = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
    "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
    "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
    "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
    "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
    "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
    "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
    "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];

async function runScrapers() {
    console.log(`[${new Date().toLocaleTimeString()}] 🔄 Arka plan tarayıcıları çalışıyor... (Memurlar.net & İşkur API)`);
    let allRealJobs = [];

    // 1. KAYNAK: Memurlar.net (Maksimum Veri - 10 Sayfa)
    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        for (let page = 1; page <= 10; page++) {
            const url = page === 1 ? 'https://ilan.memurlar.net/' : `https://ilan.memurlar.net/?Page=${page}`;
            try {
                const response = await axios.get(url, {
                    httpsAgent: agent, responseType: 'arraybuffer', timeout: 15000,
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
                });
                
                const htmlData = iconv.decode(response.data, 'iso-8859-9');
                const $ = cheerio.load(htmlData);
                
                $('a').each((i, el) => {
                    const href = $(el).attr('href');
                    if (href && (href.includes('/ilan/') || href.includes('ilan.memurlar.net/ilan/'))) {
                        const text = $(el).text().replace(/\s+/g, ' ').trim();
                        if(text && text.length > 15 && (text.toLowerCase().includes('personel') || text.toLowerCase().includes('alacak') || text.toLowerCase().includes('alımı') || text.toLowerCase().includes('memur') || text.toLowerCase().includes('işçi') || text.toLowerCase().includes('mühendis') || text.toLowerCase().includes('tekniker') || text.toLowerCase().includes('teknisyen') || text.toLowerCase().includes('avukat') || text.toLowerCase().includes('hemşire'))) {
                            let absoluteLink = href;
                            if (href.startsWith('//')) {
                                absoluteLink = 'https:' + href;
                            } else if (!href.startsWith('http')) {
                                absoluteLink = 'https://ilan.memurlar.net' + href;
                            }
                            
                            let quotaMatch = text.match(/\b(\d{1,4})\b/);
                            let quota = quotaMatch ? parseInt(quotaMatch[1]) : 1;
                            if(quota > 5000) quota = 10;
                            
                            let foundCity = "Genel / Türkiye Geneli";
                            for(let c of citiesList) {
                                if(text.includes(c)) { foundCity = c; break; }
                            }
                            
                            allRealJobs.push({
                                title: text,
                                score: "KPSS Puanı",
                                cities: foundCity,
                                quota: quota,
                                deadline: "Güncel İlan",
                                source: "Memurlar.net",
                                link: absoluteLink
                            });
                        }
                    }
                });
                console.log(`✅ Memurlar.net Sayfa ${page} taranarak veri alındı.`);
            } catch (pageErr) {
                console.log(`⚠️ Memurlar.net Sayfa ${page} taranamadı, atlanıyor.`);
            }
        }
    } catch (e) { console.error("❌ Memurlar.net scraping hatası:", e.message); }

    // 2. KAYNAK: İlan.gov.tr veya İşkur Kamu İlanları (Simüle edilmiş gerçekçi veri yapısı, anti-bot engeline takılmamak için)
    // Gerçek bir sistemde bu kısımlara puppeteer veya özel API tokenları eklenir.
    // Gerçek bir sistemde bu kısımlara puppeteer veya özel API tokenları eklenir.
    try {
        console.log(`✅ İşkur ve İlan.gov.tr Kamu panoları entegrasyonu bekleniyor...`);
    } catch(e) {}

    // Tekrar eden ilanları temizle
    const uniqueJobs = [];
    const seen = new Set();
    allRealJobs.forEach(job => {
        if(!seen.has(job.title)) { seen.add(job.title); uniqueJobs.push(job); }
    });

    // Kategorize et
    const finalLisans = [];
    const finalOnlisans = [];
    const finalOrtaogretim = [];

    uniqueJobs.forEach((job) => {
        const titleLower = job.title.toLowerCase();
        if (titleLower.includes('ortaöğretim') || titleLower.includes('lise') || titleLower.includes('işçi') || titleLower.includes('zabıta')) {
            finalOrtaogretim.push(job);
        } else if (titleLower.includes('önlisans') || titleLower.includes('ön lisans') || titleLower.includes('tekniker')) {
            finalOnlisans.push(job);
        } else if (titleLower.includes('lisans') || titleLower.includes('uzman') || titleLower.includes('mühendis')) {
            finalLisans.push(job);
        } else {
            finalLisans.push(job); finalOnlisans.push(job); finalOrtaogretim.push(job);
        }
    });

    cachedJobs = {
        ortaogretim: finalOrtaogretim.sort((a,b) => b.quota - a.quota),
        onlisans: finalOnlisans.sort((a,b) => b.quota - a.quota),
        lisans: finalLisans.sort((a,b) => b.quota - a.quota),
        lastUpdate: new Date()
    };

    console.log(`🎉 Arka plan taraması tamamlandı. Havuzda ${uniqueJobs.length} tekil ilan var.`);
}

// Sunucu başlarken ilk taramayı yap, sonra her 15 dakikada bir güncelle
runScrapers();
setInterval(runScrapers, 15 * 60 * 1000);

// Client bu endpoint'e geldiğinde beklemeden anında cached (önbellek) veriyi alır
app.get('/api/jobs', (req, res) => {
    res.json({ success: true, data: cachedJobs });
});

// --- PYTHON AI BACKEND PROXY (Yayınlandığında CORS ve bağlantı sorunu olmaması için) ---
app.post('/api/analyze', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:5000/api/analyze', req.body);
        res.json(response.data);
    } catch (error) {
        console.error("Python API Proxy Hatası:", error.message);
        res.status(500).json({ success: false, message: "Yapay zeka analiz motoruna ulaşılamadı. Arka plan servisinin çalıştığından emin olun." });
    }
});

// Sunucuyu Başlat
app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 PROFESYONEL FULL-STACK SUNUCU (SQLite + AUTH) BAŞLATILDI`);
    console.log(`🔗 API Adresi: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
});
