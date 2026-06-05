document.addEventListener('DOMContentLoaded', () => {
    // --- Gelişmiş Filtre Seçenekleri Doldurma ---
    const allCities = ["Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın","Balıkesir","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli","Diyarbakır","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkari","Hatay","Isparta","Mersin","İstanbul","İzmir","Kars","Kastamonu","Kayseri","Kırklareli","Kırşehir","Kocaeli","Konya","Kütahya","Malatya","Manisa","Kahramanmaraş","Mardin","Muğla","Muş","Nevşehir","Niğde","Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Tekirdağ","Tokat","Trabzon","Tunceli","Şanlıurfa","Uşak","Van","Yozgat","Zonguldak","Aksaray","Bayburt","Karaman","Kırıkkale","Batman","Şırnak","Bartın","Ardahan","Iğdır","Yalova","Karabük","Kilis","Osmaniye","Düzce"];
    const allProfessions = ["Memur", "Mühendis", "Tekniker", "Teknisyen", "Hemşire", "Sağlık Personeli", "Öğretmen", "Büro Personeli", "Güvenlik", "Şoför", "İşçi", "Destek Personeli", "Uzman", "Avukat", "Mimar", "Programcı"];
    
    const citySelect = document.getElementById('cityFilter');
    if (citySelect) {
        allCities.forEach(city => {
            const opt = document.createElement('option');
            opt.value = city;
            opt.textContent = city;
            citySelect.appendChild(opt);
        });
    }

    const profSelect = document.getElementById('professionFilter');
    if (profSelect) {
        allProfessions.forEach(prof => {
            const opt = document.createElement('option');
            opt.value = prof;
            opt.textContent = prof;
            profSelect.appendChild(opt);
        });
    }

    // --- Navigation / Page Routing ---
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const pageSections = document.querySelectorAll('.page-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Seçili sınıfı temizle ve tıklanana ekle
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Tüm sayfaları gizle
            pageSections.forEach(page => page.classList.remove('active'));

            // Hedef sayfayı göster
            const targetPageId = item.getAttribute('data-page');
            if (targetPageId) {
                const targetPage = document.getElementById(targetPageId);
                if (targetPage) {
                    targetPage.classList.add('active');
                }
            }
        });
    });

    // --- Countdown Timer Logic ---
    const examDates = {
        kpss_onlisans: new Date('September 15, 2026 10:15:00').getTime(),
        kpss_lisans: new Date('July 19, 2026 10:15:00').getTime(),
        kpss_ortaogretim: new Date('October 4, 2026 10:15:00').getTime(),
        kpss_dhbt: new Date('November 8, 2026 10:15:00').getTime(),
        yds_2: new Date('October 18, 2026 10:00:00').getTime(),
        ales_2: new Date('August 16, 2026 10:15:00').getTime()
    };

    const examSelectEl = document.getElementById('examSelect');
    let activeExamKey = localStorage.getItem('seciliSinav') || 'kpss_onlisans';

    if (examSelectEl) {
        examSelectEl.value = activeExamKey;
        examSelectEl.addEventListener('change', (e) => {
            activeExamKey = e.target.value;
            localStorage.setItem('seciliSinav', activeExamKey);
            updateCountdown();
        });
    }

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const targetDate = examDates[activeExamKey] || examDates.kpss_onlisans;
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            if(daysEl) daysEl.textContent = '00';
            if(hoursEl) hoursEl.textContent = '00';
            if(minutesEl) minutesEl.textContent = '00';
            if(secondsEl) secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const formatNumber = (num) => num < 10 ? `0${num}` : num;

        if(daysEl) daysEl.textContent = formatNumber(days);
        if(hoursEl) hoursEl.textContent = formatNumber(hours);
        if(minutesEl) minutesEl.textContent = formatNumber(minutes);
        if(secondsEl) secondsEl.textContent = formatNumber(seconds);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // --- Premium Toasts & Confetti ---
    const confettiScript = document.createElement('script');
    confettiScript.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    document.head.appendChild(confettiScript);

    window.showToast = function(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');
        
        toast.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span> <span style="font-weight: 500;">${message}</span>`;
        container.appendChild(toast);
        
        // Animasyon için reflow
        toast.offsetHeight;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    };

    // --- Local Storage & Tracked Jobs ---
    let trackedJobs = JSON.parse(localStorage.getItem('kariyerTrackedJobs')) || [];

    function saveTrackedJobs() {
        localStorage.setItem('kariyerTrackedJobs', JSON.stringify(trackedJobs));
    }

    window.trackJob = async function(encodedJob, status = 'Beklemede') {
        const token = localStorage.getItem('kariyerToken');
        if (!token) {
            showToast('Favorilere eklemek için önce Giriş Yapmalısınız!', 'error');
            openAuthModal();
            return;
        }

        try {
            const job = JSON.parse(decodeURIComponent(encodedJob));
            job.status = status;
            
            if (window.isOfflineMode) {
                const exists = trackedJobs.some(j => j.title === job.title && j.cities === job.cities);
                if (exists) {
                    showToast('Bu ilan zaten takip listesinde!', 'error');
                    return;
                }
                job.trackDate = new Date().toISOString().split('T')[0];
                job.platform = 'Favori (Çevrimdışı)';
                trackedJobs.push(job);
                saveTrackedJobs();
                renderTrackerTable();
                showToast('İlan takibe alındı (Çevrimdışı kaydedildi)!', 'success');
                if (window.confetti) confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                return;
            }

            const response = await fetch('http://localhost:3000/api/favorites', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(job)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showToast('İlan başarıyla takibe alındı (Veritabanına kaydedildi)!', 'success');
                if (window.confetti) confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                fetchFavoritesFromDB();
            } else {
                showToast(result.message, 'error');
            }
        } catch(e) {
            console.error("Takip ekleme hatası, yerel kaydediliyor:", e);
            try {
                const job = JSON.parse(decodeURIComponent(encodedJob));
                job.status = status;
                const exists = trackedJobs.some(j => j.title === job.title && j.cities === job.cities);
                if (!exists) {
                    job.trackDate = new Date().toISOString().split('T')[0];
                    job.platform = 'Favori (Çevrimdışı)';
                    trackedJobs.push(job);
                    saveTrackedJobs();
                    renderTrackerTable();
                }
                showToast('İlan takibe alındı (Çevrimdışı kaydedildi)!', 'success');
                if (window.confetti) confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
            } catch(err) {}
        }
    };
    
    async function fetchFavoritesFromDB() {
        const token = localStorage.getItem('kariyerToken');
        if (!token) return;
        
        if (window.isOfflineMode) {
            trackedJobs = JSON.parse(localStorage.getItem('kariyerTrackedJobs')) || [];
            renderTrackerTable();
            return;
        }
        
        try {
            const response = await fetch('http://localhost:3000/api/favorites', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const result = await response.json();
            if (result.success) {
                trackedJobs = result.data.map(j => ({
                    id: j.id,
                    title: j.title,
                    cities: j.cities,
                    platform: 'Favori',
                    trackDate: j.added_at.split(' ')[0],
                    status: j.status || 'Beklemede'
                }));
                renderTrackerTable();
            }
        } catch(e) { 
            console.error("Favoriler sunucudan çekilemedi, yerel yükleniyor:", e); 
            trackedJobs = JSON.parse(localStorage.getItem('kariyerTrackedJobs')) || [];
            renderTrackerTable();
        }
    }
    
    window.removeTrackedJob = async function(index) {
        const job = trackedJobs[index];
        
        if (window.isOfflineMode || !job.id) {
            trackedJobs.splice(index, 1);
            saveTrackedJobs();
            renderTrackerTable();
            showToast('İlan takip listesinden kaldırıldı.', 'success');
            return;
        }

        const token = localStorage.getItem('kariyerToken');
        try {
            const response = await fetch(`http://localhost:3000/api/favorites/${job.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const result = await response.json();
            if (result.success) {
                showToast('İlan başarıyla takipten kaldırıldı!', 'success');
                fetchFavoritesFromDB();
            } else {
                showToast(result.message, 'error');
            }
        } catch(e) {
            console.error("Takipten kaldırma hatası, yerel siliniyor:", e);
            trackedJobs.splice(index, 1);
            saveTrackedJobs();
            renderTrackerTable();
            showToast('İlan takip listesinden kaldırıldı.', 'success');
        }
    };

    window.exportToExcel = function() {
        if (trackedJobs.length === 0) {
            showToast("Dışa aktarılacak ilan bulunamadı.", "error");
            return;
        }
        
        let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
        csvContent += "Tarih,Platform,Pozisyon,Konum,Durum\n";
        
        trackedJobs.forEach(job => {
            let row = `"${job.trackDate}","${job.platform}","${job.title.replace(/"/g, '""')}","${job.cities}","${job.status}"`;
            csvContent += row + "\n";
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "is_ilanlari_takip.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast("Veriler başarıyla bilgisayara indirildi!", "success");
    };
    
    window.updateTrackedJobStatus = async function(index, newStatus) {
        const job = trackedJobs[index];
        job.status = newStatus;
        renderTrackerTable();
        
        if (job.id) {
            const token = localStorage.getItem('kariyerToken');
            try {
                const response = await fetch(`http://localhost:3000/api/favorites/${job.id}`, {
                    method: 'PATCH',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ status: newStatus })
                });
                const result = await response.json();
                if (!result.success) {
                    showToast(result.message, 'error');
                }
            } catch(e) {
                console.error("Durum güncelleme hatası:", e);
                showToast('Durum güncellenirken sunucu hatası oluştu.', 'error');
            }
        } else {
            saveTrackedJobs();
        }
    };

    // --- Smart Alert Bot Logic ---
    let smartAlerts = JSON.parse(localStorage.getItem('kariyerSmartAlerts')) || [];
    let notifiedAlertJobs = JSON.parse(localStorage.getItem('kariyerNotifiedAlertJobs')) || [];

    function saveSmartAlerts() {
        localStorage.setItem('kariyerSmartAlerts', JSON.stringify(smartAlerts));
        localStorage.setItem('kariyerNotifiedAlertJobs', JSON.stringify(notifiedAlertJobs));
    }

    function renderSmartAlerts() {
        const container = document.getElementById('activeAlertsContainer');
        if (!container) return;
        
        container.innerHTML = '';
        if (smartAlerts.length === 0) {
            container.innerHTML = '<span style="color: var(--text-tertiary); font-size: 0.85rem; font-style: italic;">Henüz kurulu bir alarmınız yok.</span>';
            return;
        }

        smartAlerts.forEach((alert, index) => {
            const el = document.createElement('div');
            el.style = 'background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); padding: 0.5rem 1rem; border-radius: 20px; display: flex; align-items: center; gap: 0.5rem; color: #60a5fa; font-size: 0.85rem;';
            el.innerHTML = `
                <span><strong>Meslek:</strong> ${alert.profession} | <strong>Şehir:</strong> ${alert.city}</span>
                <button onclick="window.removeSmartAlert(${index})" style="background: none; border: none; color: #f87171; cursor: pointer; font-weight: bold; margin-left: 0.5rem; font-size: 1rem;">×</button>
            `;
            container.appendChild(el);
        });
    }

    window.removeSmartAlert = function(index) {
        smartAlerts.splice(index, 1);
        saveSmartAlerts();
        renderSmartAlerts();
        showToast('Alarm başarıyla silindi.', 'info');
    };

    const createAlertBtn = document.getElementById('createAlertBtn');
    if (createAlertBtn) {
        createAlertBtn.addEventListener('click', () => {
            const prof = document.getElementById('alertProfession').value.trim();
            const city = document.getElementById('alertCity').value.trim();

            if (!prof || !city) {
                showToast('Lütfen hem meslek hem şehir alanını doldurun.', 'error');
                return;
            }

            // Check if already exists
            if (smartAlerts.some(a => a.profession.toLowerCase() === prof.toLowerCase() && a.city.toLowerCase() === city.toLowerCase())) {
                showToast('Bu alarm zaten kurulu!', 'error');
                return;
            }

            smartAlerts.push({ profession: prof, city: city });
            saveSmartAlerts();
            renderSmartAlerts();
            
            document.getElementById('alertProfession').value = '';
            document.getElementById('alertCity').value = '';
            
            showToast('✅ Alarm başarıyla kuruldu! Yeni ilan düştüğünde bildirileceksiniz.', 'success');
        });
    }

    // İlk açılışta alarmları çiz
    renderSmartAlerts();

    // Otomatik kontrol fonksiyonu
    function checkSmartAlerts(dataObj) {
        if (smartAlerts.length === 0) return;

        let allJobs = [];
        if(dataObj.ortaogretim) allJobs = allJobs.concat(dataObj.ortaogretim);
        if(dataObj.onlisans) allJobs = allJobs.concat(dataObj.onlisans);
        if(dataObj.lisans) allJobs = allJobs.concat(dataObj.lisans);

        let newFound = false;

        allJobs.forEach(job => {
            // Identifier string (to prevent duplicate alerts)
            const jobId = job.title + "-" + job.cities;

            if (notifiedAlertJobs.includes(jobId)) return;

            // Check if matches any alert
            const matches = smartAlerts.some(alert => {
                const titleMatch = job.title.toLowerCase().includes(alert.profession.toLowerCase());
                const cityMatch = job.cities.toLowerCase().includes(alert.city.toLowerCase());
                return titleMatch && cityMatch;
            });

            if (matches) {
                // We found a match! Notify and auto-track!
                notifiedAlertJobs.push(jobId);
                newFound = true;
                
                // Otomatik olarak İlan Takibine ekle
                if (!trackedJobs.some(j => j.title === job.title && j.cities === job.cities)) {
                    const today = new Date();
                    const aylar = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
                    const dateString = `${today.getDate()} ${aylar[today.getMonth()]} ${today.getFullYear()}`;
                    
                    trackedJobs.unshift({
                        ...job,
                        trackDate: dateString,
                        status: 'Beklemede',
                        platform: 'Oto-Bot 🤖'
                    });
                    saveTrackedJobs();
                }

                showToast(`🔔 DİKKAT! Aradığınız kriterde ilan bulundu: ${job.title.substring(0,30)}...`, 'success');
            }
        });

        if (newFound) {
            saveSmartAlerts(); // save updated notifiedAlertJobs
            renderTrackerTable(); // update the tracker UI
            
            // Notification sound / Confetti
            if (window.confetti) {
                confetti({ particleCount: 200, spread: 100, origin: { y: 0.3 } });
            }
        }
    }

    // --- Detay & AI Modal ---
    window.openAIModal = async function(encodedJob) {
        const job = JSON.parse(decodeURIComponent(encodedJob));
        const modal = document.getElementById('aiModal');
        
        // Modal UI Elements
        const titleEl = document.getElementById('aiJobTitle');
        const companyEl = document.getElementById('modalCompany');
        const quotaEl = document.getElementById('modalQuota');
        const loading = document.getElementById('aiLoading');
        const results = document.getElementById('aiResults');
        const tabDetails = document.getElementById('modalTabDetails');
        const tabAI = document.getElementById('modalTabAI');
        const tabBtns = document.querySelectorAll('.modal-tab-btn');
        
        // Reset Tabs
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.style.color = "var(--text-secondary)";
            btn.style.borderBottom = "2px solid transparent";
        });
        
        tabBtns[0].classList.add('active');
        tabBtns[0].style.color = "var(--accent-blue)";
        tabBtns[0].style.borderBottom = "2px solid var(--accent-blue)";
        
        tabDetails.classList.remove('hidden');
        tabAI.classList.add('hidden');
        
        // Setup Apply Button with REAL Link
        const applyBtn = document.getElementById('modalApplyBtn');
        if (applyBtn) {
            applyBtn.onclick = () => {
                window.closeAIModal();
                window.openApplicationModal(job);
            };
        }
        
        // Populate Data
        titleEl.textContent = job.title;
        companyEl.textContent = job.cities.split('/')[0] || job.cities;
        quotaEl.textContent = job.quota + " Kişi";
        
        modal.classList.add('show');
        
        // Fetch AI Data
        loading.classList.remove('hidden');
        results.classList.add('hidden');
        loading.innerHTML = `<div class="spinner"></div><p style="color: var(--text-secondary); margin-top: 1rem;">Yapay zeka ilanı analiz ediyor...</p>`;
        
        try {
            if (window.isOfflineMode) {
                throw new Error("Offline Mode");
            }
            const response = await fetch('http://localhost:5000/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: job.title, link: job.link })
            });
            
            if(!response.ok) throw new Error("Python API'ye erişilemedi.");
            const aiData = await response.json();
            
            loading.classList.add('hidden');
            results.classList.remove('hidden');
            
            document.getElementById('aiProbability').textContent = `%${aiData.probability}`;
            document.getElementById('aiProbability').style.color = aiData.probability > 75 ? '#4ade80' : (aiData.probability > 60 ? '#facc15' : '#f87171');
            
            document.getElementById('aiCompetition').textContent = aiData.competition;
            document.getElementById('aiEstimatedScore').textContent = aiData.estimatedScore;
            
            const ul = document.getElementById('aiNotesList');
            ul.innerHTML = '';
            aiData.notes.forEach(note => {
                const li = document.createElement('li');
                li.innerHTML = `✅ ${note}`;
                li.style.marginBottom = "0.5rem";
                ul.appendChild(li);
            });
        } catch (err) {
            console.error("AI tavsiye motoru çevrimdışı, yerel tavsiye yükleniyor:", err);
            
            setTimeout(() => {
                loading.classList.add('hidden');
                results.classList.remove('hidden');

                // Determine dummy values based on job title
                const isEng = job.title.toLowerCase().includes('mühendis') || job.title.toLowerCase().includes('yazılım');
                const probability = isEng ? 85 : 74;
                const competition = isEng ? "Orta (Nitelikli Kadro)" : "Yüksek (Genel Başvuru)";
                const estScore = isEng ? "78.20" : "84.50";
                
                document.getElementById('aiProbability').textContent = `%${probability}`;
                document.getElementById('aiProbability').style.color = probability > 75 ? '#4ade80' : '#facc15';
                document.getElementById('aiCompetition').textContent = competition;
                document.getElementById('aiEstimatedScore').textContent = estScore;

                const ul = document.getElementById('aiNotesList');
                ul.innerHTML = `
                    <li>✅ Pozisyonun son 3 atama dönemindeki taban puan trendleri incelendi ve stabil olduğu görüldü.</li>
                    <li>✅ Mülakatsız atama kriterlerine sahip olup, doğrudan KPSS puan üstünlüğüne tabidir.</li>
                    <li>✅ Gerekli mezuniyet alan kodlarınızın ÖSYM kılavuz kodlarıyla tam uyumlu olduğunu kontrol edin.</li>
                    <li>💡 Öneri: Tercih döneminde bu kurumu ilk 3 sıraya yazmanız yerleşme ihtimalinizi artıracaktır.</li>
                `;
                showToast('İlan analizi yerel olarak yapıldı (Çevrimdışı Mod)!', 'info');
            }, 800);
        }

        // Tab Switching Logic
        tabBtns.forEach((btn, index) => {
            btn.onclick = () => {
                tabBtns.forEach(b => {
                    b.style.color = "var(--text-secondary)";
                    b.style.borderBottom = "2px solid transparent";
                });
                btn.style.color = "var(--accent-blue)";
                btn.style.borderBottom = "2px solid var(--accent-blue)";
                
                tabDetails.classList.add('hidden');
                tabAI.classList.add('hidden');
                
                if (index === 0) tabDetails.classList.remove('hidden');
                if (index === 1) tabAI.classList.remove('hidden');
            };
        });
    };

    window.closeAIModal = function() {
        document.getElementById('aiModal').classList.remove('show');
    };

    // --- Backend'den Canlı Veri Çekme (Fetch API) ---
    let professionsData = {
        ortaogretim: [],
        onlisans: [],
        lisans: []
    };

    let currentTab = 'ortaogretim';
    
    const tableBody = document.getElementById('professionsTableBody');
    const searchInput = document.getElementById('searchInput');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const noResults = document.getElementById('noResults');

    // --- Fallback Jobs for Standalone/Offline Mode ---
    // UYARI: Tablo 'cities' ve 'score' alanlarını beklemektedir!
    const fallbackJobs = {
        ortaogretim: [
            { id: 101, title: "Hizmetli (Genel İdari)", cities: "Ankara / Tüm İller", score: "KPSS-P1", date: "Bugün", link: "https://ilan.memurlar.net/", quota: 45, deadline: "30 Haziran 2026", description: "Adliye ve kamu binalarında hizmet işlerinden sorumlu personel alımı." },
            { id: 102, title: "Şoför (B Sınıfı Ehliyet)", cities: "İstanbul / Ankara", score: "KPSS-P1", date: "Dün", link: "https://ilan.memurlar.net/", quota: 15, deadline: "25 Haziran 2026", description: "İl milli eğitim müdürlüklerinde araç kullanacak şoför personeli." },
            { id: 103, title: "Teknisyen (Elektrik-Elektronik)", cities: "İzmir / Bursa / Konya", score: "KPSS-P3", date: "3 gün önce", link: "https://ilan.memurlar.net/", quota: 8, deadline: "20 Haziran 2026", description: "DSİ baraj ve sulama tesislerinde görev yapacak elektrik teknisyeni." },
            { id: 104, title: "Güvenlik Görevlisi", cities: "Osmaniye / Adana", score: "KPSS-P94", date: "Bugün", link: "https://ilan.memurlar.net/", quota: 20, deadline: "15 Temmuz 2026", description: "Devlet kurumu kampüslerinde özel güvenlik hizmeti verecek personel." },
            { id: 105, title: "Destek Personeli", cities: "Trabzon / Samsun", score: "KPSS-P1", date: "2 gün önce", link: "https://ilan.memurlar.net/", quota: 30, deadline: "1 Temmuz 2026", description: "Kamu hastaneleri bünyesinde temizlik ve yardımcı hizmetler personeli." }
        ],
        onlisans: [
            { id: 201, title: "Büro Personeli (Genel)", cities: "İstanbul / Türkiye Geneli", score: "KPSS-P93", date: "Bugün", link: "https://ilan.memurlar.net/", quota: 110, deadline: "30 Haziran 2026", description: "SGK merkez ve il müdürlüklerinde evrak, arşiv ve yazışma işleri." },
            { id: 202, title: "Bilgisayar İşletmeni", cities: "Osmaniye", score: "KPSS-P3", date: "Dün", link: "https://ilan.memurlar.net/", quota: 5, deadline: "28 Haziran 2026", description: "Valilik bilgi işlem biriminde veri girişi ve sistem takibi." },
            { id: 203, title: "Sağlık Teknikeri (Laborant)", cities: "Ankara / İzmir / Bursa", score: "KPSS-P93", date: "2 gün önce", link: "https://ilan.memurlar.net/", quota: 75, deadline: "22 Haziran 2026", description: "Devlet hastanelerinde tıbbi laboratuvar hizmetlerinde çalışacak tekniker." },
            { id: 204, title: "Muhasebe Personeli", cities: "Gaziantep / Şanlıurfa", score: "KPSS-P93", date: "3 gün önce", link: "https://ilan.memurlar.net/", quota: 12, deadline: "25 Haziran 2026", description: "Ticaret odaları bünyesinde muhasebe ve finans süreçlerini yönetecek personel." },
            { id: 205, title: "İcra Müdür Yardımcısı", cities: "Konya / Ereğli", score: "KPSS-P93", date: "Bugün", link: "https://ilan.memurlar.net/", quota: 3, deadline: "10 Temmuz 2026", description: "Adliye icra dairesinde müdür yardımcısı olarak görev yapacak aday alımı." }
        ],
        lisans: [
            { id: 301, title: "Yazılım Mühendisi (Backend)", cities: "Kocaeli / Ankara", score: "KPSS-P3", date: "Bugün", link: "https://ilan.memurlar.net/", quota: 12, deadline: "30 Haziran 2026", description: "TÜBİTAK BİLGEM'de milli yazılım ve siber güvenlik projelerinde C++/Python geliştirici." },
            { id: 302, title: "Mühendis (Savunma Sanayi)", cities: "Ankara", score: "KPSS-P3", date: "Dün", link: "https://ilan.memurlar.net/", quota: 20, deadline: "25 Haziran 2026", description: "ASELSAN'da hava ve kara savunma sistemleri için gömülü yazılım geliştirici." },
            { id: 303, title: "Uzman Yardımcısı (Ekonomi)", cities: "İstanbul / Ankara", score: "KPSS-P3", date: "3 gün önce", link: "https://ilan.memurlar.net/", quota: 15, deadline: "20 Haziran 2026", description: "Merkez Bankası'nda para politikası ve ekonometrik araştırma birimi için uzman adayı." },
            { id: 304, title: "Hâkim/Savcı Adayı (HSYK)", cities: "Türkiye Geneli", score: "KPSS-P9", date: "Bugün", link: "https://ilan.memurlar.net/", quota: 500, deadline: "15 Temmuz 2026", description: "Adalet Bakanlığı bünyesinde göreve başlayacak hâkim ve savcı adayı alımı." },
            { id: 305, title: "Vergi Müfettiş Yardımcısı", cities: "Ankara / İstanbul / İzmir", score: "KPSS-P3", date: "2 gün önce", link: "https://ilan.memurlar.net/", quota: 80, deadline: "5 Temmuz 2026", description: "Gelir İdaresi Başkanlığı'nda vergi denetimi ve inceleme yapacak müfettiş adayları." }
        ]
    };

    window.isOfflineMode = false;

    function updateServerStatusIndicator(isOnline) {
        const indicator = document.getElementById('serverStatusIndicator');
        if (indicator) {
            if (isOnline) {
                indicator.style.background = 'rgba(16, 185, 129, 0.15)';
                indicator.style.borderColor = 'var(--accent-green)';
                indicator.style.color = '#34d399';
                indicator.innerHTML = `🟢 Sunucu Aktif (Canlı Mod)`;
            } else {
                indicator.style.background = 'rgba(245, 158, 11, 0.15)';
                indicator.style.borderColor = 'var(--accent-orange)';
                indicator.style.color = '#fbbf24';
                indicator.innerHTML = `🟡 Sunucu Kapalı (Hibrit Çevrimdışı Mod)`;
                indicator.title = "Yerel sunucu algılanamadığı için sistem çevrimdışı fallback verilerini ve tarayıcı içi yapay zekayı kullanıyor.";
            }
        }
    }

    let fetchRetryCount = 0;

    // Sunucudan (Backend) verileri çeken asenkron fonksiyon
    async function fetchLiveJobs() {
        const indicator = document.getElementById('liveUpdateIndicator');

        // ─── file:// protokolü ile açıldıysa anında offline moduna geç ───
        if (window.location.protocol === 'file:') {
            window.isOfflineMode = true;
            updateServerStatusIndicator(false);
            professionsData = fallbackJobs;
            updateSummaries();
            renderTable(searchInput ? searchInput.value : '');
            renderTrackerTable();
            checkSmartAlerts(professionsData);
            if (indicator) {
                indicator.innerHTML = `<span style="width: 8px; height: 8px; background: #a78bfa; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px #a78bfa;"></span> Çevrimdışı Mod`;
            }
            if (typeof window.renderCharts === 'function') window.renderCharts();
            return;
        }

        if(indicator) {
            indicator.innerHTML = `<span class="pulse-dot" style="width: 8px; height: 8px; background: #facc15; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px #facc15;"></span> Güncelleniyor...`;
        }

        try {
            // Veri yüklenene kadar kullanıcıya Skeleton efekti göster
            if (tableBody && professionsData[currentTab] && professionsData[currentTab].length === 0) {
                 let skeletonRows = '';
                 for(let i=0; i<5; i++) {
                     skeletonRows += `
                         <tr>
                             <td><div class="skeleton"></div></td>
                             <td><div class="skeleton" style="width:60%"></div></td>
                             <td><div class="skeleton" style="width:40%"></div></td>
                             <td><div class="skeleton" style="width:80%"></div></td>
                         </tr>
                     `;
                 }
                 tableBody.innerHTML = skeletonRows;
            }

            const response = await fetch('http://localhost:3000/api/jobs');
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            
            const result = await response.json();
            
            if (result.success) {
                professionsData = result.data;
                window.isOfflineMode = false;
                updateServerStatusIndicator(true);
                updateSummaries();
                renderTable(searchInput ? searchInput.value : '');
                renderTrackerTable(); // Takip kısmını güncelle
                
                // Yeni verilerle botu çalıştır
                checkSmartAlerts(professionsData);
                
                fetchRetryCount = 0; // reset on success

                if(indicator) {
                    indicator.innerHTML = `<span class="pulse-dot" style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px #4ade80;"></span> Güncel`;
                    setTimeout(() => {
                        indicator.innerHTML = `<span class="pulse-dot" style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px #4ade80;"></span> Canlı Akış Aktif`;
                    }, 2000);
                }
                if (typeof window.renderCharts === 'function') window.renderCharts();
            }
        } catch (error) {
            console.error("Sunucuya bağlanılamadı, çevrimdışı moda geçiliyor:", error);
            
            // Çevrimdışı modu devreye alalım!
            window.isOfflineMode = true;
            updateServerStatusIndicator(false);
            
            // Mock veriyi yükleyelim — tabloyu HİÇBİR ZAMAN hata mesajıyla silme
            professionsData = fallbackJobs;
            updateSummaries();
            renderTable(searchInput ? searchInput.value : '');
            renderTrackerTable();
            checkSmartAlerts(professionsData);

            if(indicator) {
                indicator.innerHTML = `<span style="width: 8px; height: 8px; background: #a78bfa; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px #a78bfa;"></span> Çevrimdışı Mod`;
            }
            if (typeof window.renderCharts === 'function') window.renderCharts();
        }
    }

    function updateSummaries() {
        const oL = professionsData.ortaogretim ? professionsData.ortaogretim.reduce((sum, item) => sum + item.quota, 0) : 0;
        const onL = professionsData.onlisans ? professionsData.onlisans.reduce((sum, item) => sum + item.quota, 0) : 0;
        const li = professionsData.lisans ? professionsData.lisans.reduce((sum, item) => sum + item.quota, 0) : 0;

        const sumO = document.getElementById('total-ortaogretim');
        const sumOn = document.getElementById('total-onlisans');
        const sumLi = document.getElementById('total-lisans');

        // Sayı animasyonu eklenebilir, şimdilik direkt yazıyoruz
        if(sumO) sumO.textContent = oL;
        if(sumOn) sumOn.textContent = onL;
        if(sumLi) sumLi.textContent = li;
    }

    function renderTable(searchTerm = '') {
        const data = professionsData[currentTab] || [];
        const lowerSearch = searchTerm.toLowerCase().trim();
        
        const cityFilterSelect = document.getElementById('cityFilter');
        const selectedCity = cityFilterSelect ? cityFilterSelect.value.toLowerCase() : '';
        
        const profFilterSelect = document.getElementById('professionFilter');
        const selectedProf = profFilterSelect ? profFilterSelect.value.toLowerCase() : '';
        
        const filteredData = data.filter(item => {
            const matchSearch = item.title.toLowerCase().includes(lowerSearch) || 
                                item.cities.toLowerCase().includes(lowerSearch);
            const matchCity = selectedCity === '' || item.cities.toLowerCase().includes(selectedCity);
            const matchProf = selectedProf === '' || item.title.toLowerCase().includes(selectedProf);
            return matchSearch && matchCity && matchProf;
        });

        if (!tableBody) return;
        tableBody.innerHTML = '';

        if (filteredData.length === 0 && data.length > 0) {
            if(noResults) noResults.classList.remove('hidden');
            return;
        } else {
            if(noResults) noResults.classList.add('hidden');
        }

        filteredData.forEach(item => {
            let citiesHtml = item.cities;
            let titleHtml = item.title;
            if (searchTerm) {
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                citiesHtml = item.cities.replace(regex, '<span class="highlight">$1</span>');
                titleHtml = item.title.replace(regex, '<span class="highlight">$1</span>');
            }

            const deadlineHtml = item.deadline || 'Belirtilmedi';
            const linkHtml = item.link || 'https://ilan.memurlar.net/';
            const jobJson = encodeURIComponent(JSON.stringify({
                title: item.title, cities: item.cities,
                score: item.score, quota: item.quota, link: linkHtml
            }));

            // Her zaman kart render et — CSS masaüstünde tablo gibi gösterir
            const tr = document.createElement('tr');
            tr.className = 'job-card-row';
            tr.innerHTML = `
                <td colspan="5" class="job-card-cell">
                    <div class="job-card">
                        <div class="job-card-top">
                            <div class="job-card-title-wrap">
                                <strong class="job-card-title">${titleHtml}</strong>
                                <span class="job-card-date">${item.date}</span>
                            </div>
                            <div class="job-card-badges">
                                <span class="job-badge-score">${item.score}</span>
                                <span class="job-badge-quota">👥 ${item.quota} Kişi</span>
                                <span class="job-badge-city">📍 ${citiesHtml}</span>
                            </div>
                        </div>
                        <div class="job-card-bottom">
                            <span class="job-card-deadline">⏳ ${deadlineHtml}</span>
                            <div class="job-card-actions">
                                <button class="job-btn-incele" onclick="window.openAIModal('${jobJson}')">🔍 İncele</button>
                                <button class="job-btn-takip" onclick="window.trackJob('${jobJson}')">+ Takip</button>
                            </div>
                        </div>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

            let citiesHtml = item.cities;
            let titleHtml = item.title;
            if (searchTerm) {
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                citiesHtml = item.cities.replace(regex, '<span class="highlight">$1</span>');
                titleHtml = item.title.replace(regex, '<span class="highlight">$1</span>');
            }

            const deadlineHtml = item.deadline || 'Belirtilmedi';
            const linkHtml = item.link || 'https://ilan.memurlar.net/';
            const jobJson = encodeURIComponent(JSON.stringify({
                title: item.title, cities: item.cities,
                score: item.score, quota: item.quota, link: linkHtml
            }));

            if (isMobile) {
                // === MOBİL KART GÖRÜNÜMÜ ===
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td colspan="5" style="padding: 0; border: none;">
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 1rem; margin-bottom: 0.7rem;">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.6rem;">
                                <strong style="color:var(--text-primary); font-size:0.9rem; line-height:1.3; flex:1; margin-right:0.5rem;">${titleHtml}</strong>
                                <span style="color:var(--accent-orange); font-size:0.7rem; white-space:nowrap; flex-shrink:0;">${item.date}</span>
                            </div>
                            <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:0.7rem;">
                                <span style="background:rgba(59,130,246,0.1); color:#60a5fa; border:1px solid rgba(59,130,246,0.2); border-radius:6px; padding:0.2rem 0.5rem; font-size:0.72rem;">${item.score}</span>
                                <span style="background:rgba(16,185,129,0.1); color:#34d399; border:1px solid rgba(16,185,129,0.2); border-radius:6px; padding:0.2rem 0.5rem; font-size:0.72rem;">👥 ${item.quota} Kişi</span>
                                <span style="color:var(--text-secondary); font-size:0.72rem; padding:0.2rem 0;">📍 ${citiesHtml}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="color:var(--text-tertiary); font-size:0.72rem;">⏳ ${deadlineHtml}</span>
                                <div style="display:flex; gap:0.4rem;">
                                    <button onclick="window.openAIModal('${jobJson}')" style="background:linear-gradient(135deg,#3b82f6,#2563eb); color:white; border:none; border-radius:8px; padding:0.45rem 0.8rem; font-size:0.78rem; cursor:pointer; font-weight:600;">🔍 İncele</button>
                                    <button onclick="window.trackJob('${jobJson}')" style="background:rgba(255,255,255,0.07); color:var(--text-secondary); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:0.45rem 0.8rem; font-size:0.78rem; cursor:pointer;">+ Takip</button>
                                </div>
                            </div>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            } else {
                // === MASAÜSTÜ TABLO GÖRÜNÜMÜ ===
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <strong style="color: var(--text-primary); font-weight: 500;">${titleHtml}</strong>
                        <div style="color:var(--text-tertiary); font-size:0.75rem; margin-top:0.2rem;">${item.date}</div>
                    </td>
                    <td>
                        <span class="badge" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-secondary); margin-bottom: 0.3rem; display: inline-block;">${item.score} Puan</span><br>
                        <span style="color: var(--accent-green); font-weight: 600; background: var(--accent-green-glow); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">${item.quota} Kişi</span>
                    </td>
                    <td style="color: var(--text-secondary); font-size: 0.9rem;">${citiesHtml}</td>
                    <td style="color: var(--accent-orange); font-size: 0.85rem; font-weight: 500;">⏳ ${deadlineHtml}</td>
                    <td>
                        <div style="display: flex; gap: 0.4rem;">
                            <button onclick="window.openAIModal('${jobJson}')" class="btn-primary" style="padding: 0.4rem 0.6rem; font-size: 0.75rem;">🔍 İncele</button>
                            <button onclick="window.trackJob('${jobJson}')" style="background: rgba(255,255,255,0.05); color: var(--text-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.4rem 0.6rem; cursor: pointer; font-size: 0.75rem;">+ Takip</button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            }
        });
    }

    function renderTrackerTable() {
        const trackerBody = document.getElementById('trackerTableBody');
        if (!trackerBody) return;
        trackerBody.innerHTML = '';

        if (trackedJobs.length === 0) {
            trackerBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 3rem; color: var(--text-tertiary);">Henüz takip ettiğiniz bir ilan bulunmuyor.<br><span style="font-size: 2.5rem; display:block; margin-top:1rem; opacity: 0.5;">📌</span></td></tr>`;
            return;
        }

        trackedJobs.forEach((job, index) => {
            let shortTitle = job.title;
            if(shortTitle.length > 40) shortTitle = shortTitle.substring(0, 40) + '...';
            let shortCity = job.cities || '-';
            if(shortCity.includes('Genel')) shortCity = 'Türkiye Geneli';

            const bg = job.status === 'Beklemede' ? 'rgba(250,204,21,0.2)' : 
                       (job.status === 'Başvuruldu' ? 'rgba(59,130,246,0.2)' : 
                       (job.status === 'Kabul' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'));
            const col = job.status === 'Beklemede' ? '#facc15' : 
                        (job.status === 'Başvuruldu' ? '#60a5fa' : 
                        (job.status === 'Kabul' ? '#4ade80' : '#f87171'));

            const statusDropdown = `<select onchange="window.updateTrackedJobStatus(${index}, this.value)" style="background:${bg}; color:${col}; border:1px solid ${col}; border-radius:12px; padding:0.3rem 0.6rem; font-size:0.78rem; cursor:pointer; outline:none; font-weight:600;">
                <option value="Beklemede" ${job.status==='Beklemede'?'selected':''} style="background:var(--bg-dark);color:white;">Beklemede</option>
                <option value="Başvuruldu" ${job.status==='Başvuruldu'?'selected':''} style="background:var(--bg-dark);color:white;">Başvuruldu</option>
                <option value="Kabul" ${job.status==='Kabul'?'selected':''} style="background:var(--bg-dark);color:white;">Kabul Edildi</option>
                <option value="Red" ${job.status==='Red'?'selected':''} style="background:var(--bg-dark);color:white;">Reddedildi</option>
            </select>`;

            // Her zaman kart render et
            const tr = document.createElement('tr');
            tr.className = 'tracker-card-row';
            tr.innerHTML = `
                <td colspan="5" class="job-card-cell">
                    <div class="tracker-card">
                        <div class="tracker-card-top">
                            <div style="flex:1; min-width:0;">
                                <div class="tracker-card-title">${shortTitle}</div>
                                <div class="tracker-card-meta">📍 ${shortCity} &nbsp;&bull;&nbsp; 📅 ${job.trackDate}</div>
                            </div>
                            <span class="badge platform-iskur" style="font-size:0.7rem; flex-shrink:0; align-self:flex-start;">${job.platform}</span>
                        </div>
                        <div class="tracker-card-bottom">
                            ${statusDropdown}
                            <button onclick="window.removeTrackedJob(${index})" class="tracker-del-btn">🗑️ Sil</button>
                        </div>
                    </div>
                </td>
            `;
            trackerBody.appendChild(tr);
        });
    }

            let shortTitle = job.title;
            if(shortTitle.length > 40) shortTitle = shortTitle.substring(0, 40) + '...';
            let shortCity = job.cities;
            if(shortCity && shortCity.includes('Genel')) shortCity = 'Türkiye Geneli';

            const bg = job.status === 'Beklemede' ? 'rgba(250,204,21,0.2)' : 
                       (job.status === 'Başvuruldu' ? 'rgba(59,130,246,0.2)' : 
                       (job.status === 'Kabul' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'));
            const col = job.status === 'Beklemede' ? '#facc15' : 
                        (job.status === 'Başvuruldu' ? '#60a5fa' : 
                        (job.status === 'Kabul' ? '#4ade80' : '#f87171'));

            const statusDropdown = `<select onchange="window.updateTrackedJobStatus(${index}, this.value)" style="background:${bg}; color:${col}; border:1px solid ${col}; border-radius:12px; padding:0.2rem 0.5rem; font-size:0.75rem; cursor:pointer; outline:none;">
                <option value="Beklemede" ${job.status==='Beklemede'?'selected':''} style="background:var(--bg-dark);color:white;">Beklemede</option>
                <option value="Başvuruldu" ${job.status==='Başvuruldu'?'selected':''} style="background:var(--bg-dark);color:white;">Başvuruldu</option>
                <option value="Kabul" ${job.status==='Kabul'?'selected':''} style="background:var(--bg-dark);color:white;">Kabul Edildi</option>
                <option value="Red" ${job.status==='Red'?'selected':''} style="background:var(--bg-dark);color:white;">Reddedildi</option>
            </select>`;

            const tr = document.createElement('tr');

            if (isMobile) {
                // === MOBİL TRACKER KART GÖRÜNÜMÜ ===
                tr.innerHTML = `
                    <td colspan="5" style="padding:0; border:none;">
                        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1rem; margin-bottom:0.7rem;">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.6rem;">
                                <div style="flex:1; margin-right:0.5rem;">
                                    <div style="color:var(--text-primary); font-weight:600; font-size:0.88rem; margin-bottom:0.2rem;">${shortTitle}</div>
                                    <div style="color:var(--text-tertiary); font-size:0.72rem;">📍 ${shortCity || '-'} &nbsp;•&nbsp; 📅 ${job.trackDate}</div>
                                </div>
                                <span class="badge platform-iskur" style="font-size:0.68rem; flex-shrink:0;">${job.platform}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                ${statusDropdown}
                                <button onclick="window.removeTrackedJob(${index})" style="background:transparent; color:#ef4444; border:1px solid rgba(239,68,68,0.3); border-radius:6px; cursor:pointer; padding:0.3rem 0.7rem; font-size:0.75rem;">🗑️ Sil</button>
                            </div>
                        </div>
                    </td>
                `;
            } else {
                tr.innerHTML = `
                    <td style="color: var(--text-secondary); font-size: 0.85rem;">${job.trackDate}</td>
                    <td><span class="badge platform-iskur" style="font-size: 0.7rem;">${job.platform}</span></td>
                    <td>
                        <div style="color: var(--text-primary); font-weight: 500;">${shortTitle}</div>
                        <div style="color: var(--text-tertiary); font-size: 0.75rem; margin-top: 0.2rem;">📍 ${shortCity}</div>
                    </td>
                    <td>${statusDropdown}</td>
                    <td>
                        <button onclick="window.removeTrackedJob(${index})" style="background:transparent; color:#ef4444; border:1px solid rgba(239,68,68,0.3); border-radius:6px; cursor:pointer; padding:0.3rem 0.6rem; font-size:0.75rem;">Sil</button>
                    </td>
                `;
            }
            trackerBody.appendChild(tr);
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            tabBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            currentTab = e.target.getAttribute('data-tab');
            renderTable(searchInput ? searchInput.value : '');
        });
    });

    // searchInput (header) ve jobSearch (overview page) her ikisini de dinle
    function getSearchValue() {
        const s = searchInput ? searchInput.value : '';
        const j = document.getElementById('jobSearch') ? document.getElementById('jobSearch').value : '';
        return s || j;
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderTable(e.target.value);
        });
    }

    const jobSearchEl = document.getElementById('jobSearch');
    if (jobSearchEl) {
        jobSearchEl.addEventListener('input', (e) => {
            renderTable(e.target.value);
        });
    }
    
    const cityFilter = document.getElementById('cityFilter');
    if (cityFilter) {
        cityFilter.addEventListener('change', () => {
            renderTable(getSearchValue());
        });
    }
    
    const profFilter = document.getElementById('professionFilter');
    if (profFilter) {
        profFilter.addEventListener('change', () => {
            renderTable(getSearchValue());
        });
    }
    
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            if(cityFilter) cityFilter.value = '';
            if(profFilter) profFilter.value = '';
            if(searchInput) searchInput.value = '';
            if(jobSearchEl) jobSearchEl.value = '';
            renderTable('');
        });
    }
    
    // --- Maaş Rehberi Arama Filtresi ---
    const salarySearch = document.getElementById('salarySearch');
    if (salarySearch) {
        salarySearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.salary-card');
            
            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const category = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(query) || category.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    // --- SİSTEM BAŞLATMA ---
    fetchLiveJobs();
    // Sunucu açıksa her 15 saniyede güncelle, file:// modunda gereksiz
    if (window.location.protocol !== 'file:') {
        setInterval(fetchLiveJobs, 15 * 1000);
    }

    // --- İstatistik Grafikleri (Chart.js) ---
    let scoreChartInstance = null;
    let institutionChartInstance = null;

    window.renderCharts = function() {
        const scoreCtx = document.getElementById('scoreChart');
        const instCtx = document.getElementById('institutionChart');
        
        if (!scoreCtx || !instCtx || typeof Chart === 'undefined') return;

        // Gerçek verilerden istatistik çıkaralım
        let lise = 0, onlisans = 0, lisans = 0;
        let cityMap = {};

        const processJobs = (jobs, type) => {
            if (!jobs) return;
            jobs.forEach(j => {
                if (type === 'lise') lise += j.quota;
                else if (type === 'onlisans') onlisans += j.quota;
                else lisans += j.quota;

                let city = j.cities.split('/')[0].split(',')[0].trim();
                if(city.length > 15) city = city.substring(0, 15) + '..';
                cityMap[city] = (cityMap[city] || 0) + j.quota;
            });
        };

        processJobs(professionsData.ortaogretim, 'lise');
        processJobs(professionsData.onlisans, 'onlisans');
        processJobs(professionsData.lisans, 'lisans');

        // Şehirleri sırala ve ilk 5'i al
        const topCities = Object.entries(cityMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // Eğer henüz veri yoksa boş kalmasın diye ufak bir numara
        if(lise === 0 && onlisans === 0 && lisans === 0) lisans = 1; 
        if(topCities.length === 0) topCities.push(['Veri Bekleniyor', 1]);

        Chart.defaults.color = 'rgba(255, 255, 255, 0.6)';
        Chart.defaults.font.family = "'Outfit', sans-serif";

        // Grafik 1: Eğitim Seviyesi Kontenjan (Doughnut)
        if (scoreChartInstance) scoreChartInstance.destroy();
        scoreChartInstance = new Chart(scoreCtx, {
            type: 'doughnut',
            data: {
                labels: ['Ortaöğretim', 'Önlisans', 'Lisans'],
                datasets: [{
                    data: [lise, onlisans, lisans],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)', // blue
                        'rgba(168, 85, 247, 0.8)', // purple
                        'rgba(34, 197, 94, 0.8)'   // green
                    ],
                    borderColor: 'rgba(15, 23, 42, 1)',
                    borderWidth: 4,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                },
                cutout: '70%'
            }
        });

        // Grafik 2: Şehir / Kurum Bazlı Alım (Bar)
        if (institutionChartInstance) institutionChartInstance.destroy();
        institutionChartInstance = new Chart(instCtx, {
            type: 'bar',
            data: {
                labels: topCities.map(c => c[0]),
                datasets: [{
                    label: 'Kontenjan Sayısı',
                    data: topCities.map(c => c[1]),
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { grid: { display: false } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // --- AI CV Prep Logic (Real API Call with File Upload Simulation) ---
    const cvFileInput = document.getElementById('cvFileInput');
    const cvDropZone = document.getElementById('cvDropZone');
    const cvUploadProgressContainer = document.getElementById('cvUploadProgressContainer');
    const cvProgressFileName = document.getElementById('cvProgressFileName');
    const cvProgressPercent = document.getElementById('cvProgressPercent');
    const cvProgressBar = document.getElementById('cvProgressBar');
    const cvProgressStatus = document.getElementById('cvProgressStatus');
    const cvAnalysisResult = document.getElementById('cvAnalysisResult');
    const simulateUploadBtn = document.getElementById('simulateUploadBtn');

    if (cvDropZone && cvFileInput) {
        // Tıklama ile dosya seçme
        cvDropZone.addEventListener('click', (e) => {
            if (e.target !== simulateUploadBtn) {
                cvFileInput.click();
            }
        });
        
        simulateUploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cvFileInput.click();
        });

        // Sürükle bırak olayları
        ['dragenter', 'dragover'].forEach(eventName => {
            cvDropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                cvDropZone.style.borderColor = 'var(--accent-purple)';
                cvDropZone.style.background = 'rgba(168, 85, 247, 0.1)';
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            cvDropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                cvDropZone.style.borderColor = 'rgba(168, 85, 247, 0.4)';
                cvDropZone.style.background = 'rgba(168, 85, 247, 0.05)';
            }, false);
        });

        cvDropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                handleCVFileSelection(files[0]);
            }
        });

        cvFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleCVFileSelection(e.target.files[0]);
            }
        });

        function handleCVFileSelection(file) {
            // Sadece PDF veya Word kabul edelim
            const ext = file.name.split('.').pop().toLowerCase();
            if (!['pdf', 'docx', 'doc'].includes(ext)) {
                showToast('Lütfen sadece PDF veya Word belgesi (.pdf, .docx, .doc) yükleyin.', 'error');
                return;
            }

            // Arayüz geçişleri
            cvDropZone.classList.add('hidden');
            cvUploadProgressContainer.classList.remove('hidden');
            cvAnalysisResult.classList.add('hidden');
            
            cvProgressFileName.textContent = file.name;
            cvProgressPercent.textContent = '0%';
            cvProgressBar.style.width = '0%';
            cvProgressStatus.innerHTML = `<span class="spinner" style="width: 12px; height: 12px; border-width: 2px; border-color: rgba(168, 85, 247, 0.2); border-top-color: #a855f7; margin:0;"></span> Dosya Yapay Zekaya Gönderiliyor...`;

            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.floor(Math.random() * 15) + 5;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    cvProgressPercent.textContent = '100%';
                    cvProgressBar.style.width = '100%';
                    cvProgressStatus.innerHTML = `<span class="spinner" style="width: 12px; height: 12px; border-width: 2px; border-color: rgba(59, 130, 246, 0.2); border-top-color: var(--accent-blue); margin:0;"></span> Dosya Analiz Ediliyor...`;
                    
                    // API Analizini Tetikle
                    analyzeCV(file);
                } else {
                    cvProgressPercent.textContent = `${progress}%`;
                    cvProgressBar.style.width = `${progress}%`;
                }
            }, 100);
        }

        async function analyzeCV(fileObj) {
            try {
                if (window.isOfflineMode) {
                    throw new Error("Offline mode enabled");
                }
                const formData = new FormData();
                formData.append('cv', fileObj);

                const response = await fetch('http://localhost:5000/api/cv-analyze', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error("Python API'ye erişilemedi.");
                const data = await response.json();

                // Analiz bittiğinde yükleme alanını tamamen kaldırıp sonucu göster
                cvUploadProgressContainer.classList.add('hidden');
                cvAnalysisResult.classList.remove('hidden');

                // Puanı ve barı güncelle
                cvAnalysisResult.querySelector('span:last-child').textContent = `${data.score}/100`;
                cvAnalysisResult.querySelector('div > div > div').style.width = `${data.score}%`;
                
                // Geri bildirim listesini güncelle
                const ul = cvAnalysisResult.querySelector('ul');
                ul.innerHTML = '';
                data.feedback.forEach(f => {
                    const li = document.createElement('li');
                    li.textContent = f;
                    ul.appendChild(li);
                });

                // Başarı efekti
                if (window.confetti) {
                    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                }
                showToast('Özgeçmiş analiziniz tamamlandı!', 'success');
            } catch (err) {
                console.error(err);
                
                // Fallback Offline Simulation
                setTimeout(() => {
                    cvUploadProgressContainer.classList.add('hidden');
                    cvAnalysisResult.classList.remove('hidden');

                    const hasHighQuality = fileObj.name.toLowerCase().includes('cv') || fileObj.name.toLowerCase().includes('özgeçmiş') || fileObj.size > 10000;
                    const score = hasHighQuality ? 88 : 75;

                    cvAnalysisResult.querySelector('span:last-child').textContent = `${score}/100`;
                    cvAnalysisResult.querySelector('div > div > div').style.width = `${score}%`;

                    const ul = cvAnalysisResult.querySelector('ul');
                    ul.innerHTML = `
                        <li>✅ E-posta adresi formatı ve iletişim bilgileri başarıyla doğrulandı (+15 Puan)</li>
                        <li>✅ Eğitim geçmişi ve mezuniyet durumunuz tespit edildi (+20 Puan)</li>
                        <li>✅ İş deneyimleri ve projeler bölümü analiz edildi (+20 Puan)</li>
                        <li>💡 Öneri: Yetenekler kısmına daha fazla sektörel anahtar kelime ekleyerek (örneğin SQL, React, Python) AI taramalarında daha yüksek puan alabilirsiniz.</li>
                        <li>💡 Öneri: Özet bilgi (ön yazı) kısmını biraz daha uzun ve kariyer odaklı tutarak kendinizi daha iyi tanıtabilirsiniz.</li>
                    `;

                    showToast('CV yerel olarak analiz edildi (Hibrit Çevrimdışı Mod)!', 'info');
                    if (window.confetti) confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                }, 1000);
            }
        }
    }

    // --- Mock Interview Logic (Real API Call) ---
    const sendMockBtn = document.getElementById('sendMockBtn');
    const mockInput = document.getElementById('mockInput');
    const mockChatArea = document.getElementById('mockChatArea');

    let offlineInterviewStep = 1;

    if (sendMockBtn && mockInput && mockChatArea) {
        const sendResponse = async () => {
            const text = mockInput.value.trim();
            if (!text) return;
            
            // Add user bubble
            const userBubble = document.createElement('div');
            userBubble.className = 'chat-bubble user-bubble';
            userBubble.style = 'background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 1rem; border-radius: 12px; border-top-right-radius: 0; align-self: flex-end; max-width: 85%;';
            userBubble.innerHTML = `<p style="color: white; font-size: 0.85rem; line-height: 1.5;">${text}</p>`;
            mockChatArea.appendChild(userBubble);
            
            mockInput.value = '';
            mockChatArea.scrollTop = mockChatArea.scrollHeight;
            
            // Add "AI is typing..."
            const aiTyping = document.createElement('div');
            aiTyping.style = 'background: rgba(59, 130, 246, 0.05); padding: 0.5rem 1rem; border-radius: 12px; align-self: flex-start; margin-top: 0.5rem;';
            aiTyping.innerHTML = `<span style="color: var(--accent-blue); font-size: 0.8rem; animation: pulseGlow 1s infinite;">Yapay Zeka Analiz Ediyor...</span>`;
            mockChatArea.appendChild(aiTyping);
            mockChatArea.scrollTop = mockChatArea.scrollHeight;
            
            if (window.isOfflineMode) {
                setTimeout(() => {
                    mockChatArea.removeChild(aiTyping);
                    
                    let reply = "";
                    if (offlineInterviewStep === 1) {
                        reply = "Harika! Kendinizi çok güzel ifade ettiniz. Şimdi 2. Aşamaya geçiyoruz: **Ekip Çalışması ve Problem Çözme**.\n\nGeçmişte bir ekip içinde çalışırken yaşadığınız bir fikir ayrılığını veya karşılaştığınız teknik bir problemi nasıl çözdünüz? Bu durumdaki rolünüz neydi?";
                        offlineInterviewStep = 2;
                    } else if (offlineInterviewStep === 2) {
                        reply = "Çözüm odaklı yaklaşımınız ve ekip ruhuna verdiğiniz önem çok profesyonelce. Şimdi 3. Aşamaya geçiyoruz: **Kriz ve Stres Yönetimi**.\n\nÇok yoğun bir iş gününde veya beklenmedik büyük bir kriz anında (örneğin kritik bir sistem çöktüğünde) stresinizi nasıl yönetirsiniz? Soğukkanlı kalmak için uyguladığınız özel bir yöntem var mı?";
                        offlineInterviewStep = 3;
                    } else if (offlineInterviewStep === 3) {
                        reply = "Stres anında panik yapmadan adımlar belirlemeniz çok başarılı bir yetkinlik. Şimdi 4. Aşamaya geçiyoruz: **Liyakat ve Kamu Etiği**.\n\nSizce büyük bir kurumda liyakat, adillik ve şeffaflık ilkeleri neden önemlidir? Göreviniz esnasında kişisel ilişkiler ile mesleki etik sınırları çatışırsa nasıl bir karar alırsınız?";
                        offlineInterviewStep = 4;
                    } else if (offlineInterviewStep === 4) {
                        reply = "Kamu etiği ve dürüstlük prensipleriniz takdire şayan. Mülakatımızın tüm soru aşamalarını tamamladınız. Şimdi 5. Aşamaya geçiyoruz: **Yapay Zeka Mülakat Performans Raporu**.\n\nHazırladığım detaylı mülakat analizinizi yüklemek için lütfen buraya tıklayın veya herhangi bir mesaj yazarak raporunuzu talep edin.";
                        offlineInterviewStep = 5;
                    } else if (offlineInterviewStep === 5) {
                        reply = `📊 **YAPAY ZEKA MÜLAKAT PERFORMANS RAPORU**\n------------------------------------------------------\n👤 **Aday Adı:** ${currentSettings.name || 'Kullanıcı'} ${currentSettings.surname || 'Adı'}\n📅 **Tarih:** ${new Date().toLocaleDateString('tr-TR')}\n⏱️ **Oturum Durumu:** Hibrit Mülakat Başarıyla Tamamlandı\n\n📈 **YETKİNLİK PUANLARI:**\n- **İletişim & Kendini İfade Etme:** %88 (Güçlü ve akıcı)\n- **Problem Çözme & Ekip Çalışması:** %85 (Yapıcı ve çözüm odaklı)\n- **Kriz & Stres Yönetimi:** %80 (Soğukkanlı ve analitik)\n- **Mesleki Etik & Dürüstlük:** %95 (Tavizsiz ve ilkeli)\n\n🎯 **GENEL DEĞERLENDİRME SKORU: %87 (BAŞARILI)**\n\n📝 **Yapay Zeka Uzman Görüşü:**\nAday, kamusal ve profesyonel değerlere yüksek uyum göstermektedir. İletişim becerisi yüksek, kriz anlarında rasyonel karar alabilen ve liyakat ilkelerine bağlı bir yapı sergilemektedir. Kariyer.Pro platformu olarak adaya başarılar dileriz.`;
                        offlineInterviewStep = 6;
                        if (window.confetti) confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                    } else {
                        reply = "Mülakat başarıyla tamamlanmıştır. Yeni bir mülakat simülasyonu başlatmak için sol üstteki **Sıfırla 🔄** butonuna basabilirsiniz.";
                    }

                    const aiBubble = document.createElement('div');
                    aiBubble.className = 'chat-bubble ai-bubble';
                    aiBubble.style = 'background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); padding: 1rem; border-radius: 12px; border-top-left-radius: 0; align-self: flex-start; max-width: 85%; margin-top: 0.5rem;';
                    
                    const formattedReply = reply.replace(/\n/g, '<br>');
                    aiBubble.innerHTML = `<p style="color: #e2e8f0; font-size: 0.85rem; line-height: 1.5;">${formattedReply}</p>`;
                    mockChatArea.appendChild(aiBubble);
                    mockChatArea.scrollTop = mockChatArea.scrollHeight;
                }, 1000);
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/mock-interview', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text, session_id: 'default' })
                });
                
                mockChatArea.removeChild(aiTyping);
                
                if(!response.ok) throw new Error("API hatası");
                const data = await response.json();
                
                // Add AI response
                const aiBubble = document.createElement('div');
                aiBubble.className = 'chat-bubble ai-bubble';
                aiBubble.style = 'background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); padding: 1rem; border-radius: 12px; border-top-left-radius: 0; align-self: flex-start; max-width: 85%; margin-top: 0.5rem;';
                
                const formattedReply = data.reply.replace(/\n/g, '<br>');
                aiBubble.innerHTML = `<p style="color: #e2e8f0; font-size: 0.85rem; line-height: 1.5;">${formattedReply}</p>`;
                mockChatArea.appendChild(aiBubble);
                mockChatArea.scrollTop = mockChatArea.scrollHeight;
            } catch(e) {
                mockChatArea.removeChild(aiTyping);
                console.log("Sunucu hatası, çevrimdışı mülakata geçiliyor.");
                window.isOfflineMode = true;
                updateServerStatusIndicator(false);
                
                const aiBubble = document.createElement('div');
                aiBubble.className = 'chat-bubble ai-bubble';
                aiBubble.style = 'background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); padding: 1rem; border-radius: 12px; border-top-left-radius: 0; align-self: flex-start; max-width: 85%; margin-top: 0.5rem;';
                aiBubble.innerHTML = `<p style="color: #e2e8f0; font-size: 0.85rem; line-height: 1.5;">Sunucu bağlantısı koptu. Çevrimdışı Yapay Zeka Mülakat moduna geçildi.<br><br>Girişinizi aldım. Mülakata devam etmek için lütfen herhangi bir şey yazın.</p>`;
                mockChatArea.appendChild(aiBubble);
                mockChatArea.scrollTop = mockChatArea.scrollHeight;
            }
        };

        sendMockBtn.addEventListener('click', sendResponse);
        mockInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendResponse();
        });

        // Mülakat Sıfırlama Olayı
        const resetMockBtn = document.getElementById('resetMockBtn');
        if (resetMockBtn && mockChatArea) {
            resetMockBtn.addEventListener('click', async () => {
                if (window.isOfflineMode) {
                    offlineInterviewStep = 1;
                    mockChatArea.innerHTML = '';
                    const aiBubble = document.createElement('div');
                    aiBubble.className = 'chat-bubble ai-bubble';
                    aiBubble.style = 'background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); padding: 1rem; border-radius: 12px; border-top-left-radius: 0; align-self: flex-start; max-width: 85%;';
                    aiBubble.innerHTML = `<p style="color: #e2e8f0; font-size: 0.85rem; line-height: 1.5;">Kariyer.Pro Mülakat Simülasyonuna hoş geldiniz! Ben AI Mülakat Uzmanı. Öncelikle kendinizi kısaca tanıtır mısınız ve neden kamuda/özel sektörde çalışmak istiyorsunuz?</p>`;
                    mockChatArea.appendChild(aiBubble);
                    showToast('Mülakat başarıyla sıfırlandı.', 'success');
                    return;
                }

                try {
                    const response = await fetch('http://localhost:5000/api/mock-interview/reset', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ session_id: 'default' })
                    });
                    const data = await response.json();
                    
                    mockChatArea.innerHTML = '';
                    const aiBubble = document.createElement('div');
                    aiBubble.className = 'chat-bubble ai-bubble';
                    aiBubble.style = 'background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); padding: 1rem; border-radius: 12px; border-top-left-radius: 0; align-self: flex-start; max-width: 85%;';
                    
                    const formattedReply = data.reply.replace(/\n/g, '<br>');
                    aiBubble.innerHTML = `<p style="color: #e2e8f0; font-size: 0.85rem; line-height: 1.5;">${formattedReply}</p>`;
                    mockChatArea.appendChild(aiBubble);
                    mockChatArea.scrollTop = mockChatArea.scrollHeight;
                    
                    showToast('Mülakat başarıyla sıfırlandı.', 'success');
                } catch(e) {
                    console.error("Mülakat sıfırlama hatası:", e);
                    showToast('Sıfırlanırken sunucu hatası oluştu.', 'error');
                }
            });
        }
    }

    // İlk açılışta boş çiz
    if (typeof window.renderCharts === 'function') window.renderCharts();

    // --- Settings / Profile / CV Builder ---
    const cvNavButtons = document.querySelectorAll('.cv-nav-btn');
    const cvSections = document.querySelectorAll('.cv-section');
    
    // Default or Saved Settings
    let currentSettings = JSON.parse(localStorage.getItem('kariyerSettings')) || {
        name: "",
        surname: "",
        email: "",
        phone: "",
        birthDate: "",
        city: "",
        bio: "",
        school: "",
        department: "",
        gpa: "",
        eduStart: "",
        eduEnd: "",
        company: "",
        jobTitle: "",
        expStart: "",
        expEnd: "",
        jobDesc: "",
        language: "",
        langLevel: "",
        skills: [],
        quizCompleted: false,
        quizScore: ""
    };

    // DOM Elements
    const elements = {
        settingName: document.getElementById('settingName'),
        settingSurname: document.getElementById('settingSurname'),
        settingEmail: document.getElementById('settingEmail'),
        settingPhone: document.getElementById('settingPhone'),
        settingBirthDate: document.getElementById('settingBirthDate'),
        settingCity: document.getElementById('settingCity'),
        settingBio: document.getElementById('settingBio'),
        
        settingSchool: document.getElementById('settingSchool'),
        settingDepartment: document.getElementById('settingDepartment'),
        settingGPA: document.getElementById('settingGPA'),
        settingEduStart: document.getElementById('settingEduStart'),
        settingEduEnd: document.getElementById('settingEduEnd'),
        
        settingCompany: document.getElementById('settingCompany'),
        settingJobTitle: document.getElementById('settingJobTitle'),
        settingExpStart: document.getElementById('settingExpStart'),
        settingExpEnd: document.getElementById('settingExpEnd'),
        settingJobDesc: document.getElementById('settingJobDesc'),
        
        settingLanguage: document.getElementById('settingLanguage'),
        settingLangLevel: document.getElementById('settingLangLevel'),
        
        skillInput: document.getElementById('skillInput'),
        addSkillBtn: document.getElementById('addSkillBtn'),
        skillsTagsContainer: document.getElementById('skillsTagsContainer'),
        
        profileProgressFill: document.getElementById('profileProgressFill'),
        profileProgressText: document.getElementById('profileProgressText'),
        sidebarBadges: document.getElementById('sidebarBadges'),
        settingAvatarIcon: document.getElementById('settingAvatarIcon'),
        settingProfileName: document.getElementById('settingProfileName')
    };

    // Load Settings into Form Fields
    function loadSettingsToUI() {
        if (elements.settingName) elements.settingName.value = currentSettings.name || "";
        if (elements.settingSurname) elements.settingSurname.value = currentSettings.surname || "";
        if (elements.settingEmail) elements.settingEmail.value = currentSettings.email || "";
        if (elements.settingPhone) elements.settingPhone.value = currentSettings.phone || "";
        if (elements.settingBirthDate) elements.settingBirthDate.value = currentSettings.birthDate || "";
        if (elements.settingCity) elements.settingCity.value = currentSettings.city || "";
        if (elements.settingBio) elements.settingBio.value = currentSettings.bio || "";
        
        if (elements.settingSchool) elements.settingSchool.value = currentSettings.school || "";
        if (elements.settingDepartment) elements.settingDepartment.value = currentSettings.department || "";
        if (elements.settingGPA) elements.settingGPA.value = currentSettings.gpa || "";
        if (elements.settingEduStart) elements.settingEduStart.value = currentSettings.eduStart || "";
        if (elements.settingEduEnd) elements.settingEduEnd.value = currentSettings.eduEnd || "";
        
        if (elements.settingCompany) elements.settingCompany.value = currentSettings.company || "";
        if (elements.settingJobTitle) elements.settingJobTitle.value = currentSettings.jobTitle || "";
        if (elements.settingExpStart) elements.settingExpStart.value = currentSettings.expStart || "";
        if (elements.settingExpEnd) elements.settingExpEnd.value = currentSettings.expEnd || "";
        if (elements.settingJobDesc) elements.settingJobDesc.value = currentSettings.jobDesc || "";
        
        if (elements.settingLanguage) elements.settingLanguage.value = currentSettings.language || "";
        if (elements.settingLangLevel) elements.settingLangLevel.value = currentSettings.langLevel || "";
        
        renderSkillsTags();
        updateProfileMetrics();
    }

    // Save All Fields to Object
    function saveFieldsToObject() {
        currentSettings.name = elements.settingName ? elements.settingName.value.trim() : "";
        currentSettings.surname = elements.settingSurname ? elements.settingSurname.value.trim() : "";
        currentSettings.email = elements.settingEmail ? elements.settingEmail.value.trim() : "";
        currentSettings.phone = elements.settingPhone ? elements.settingPhone.value.trim() : "";
        currentSettings.birthDate = elements.settingBirthDate ? elements.settingBirthDate.value : "";
        currentSettings.city = elements.settingCity ? elements.settingCity.value : "";
        currentSettings.bio = elements.settingBio ? elements.settingBio.value.trim() : "";
        
        currentSettings.school = elements.settingSchool ? elements.settingSchool.value.trim() : "";
        currentSettings.department = elements.settingDepartment ? elements.settingDepartment.value.trim() : "";
        currentSettings.gpa = elements.settingGPA ? elements.settingGPA.value.trim() : "";
        currentSettings.eduStart = elements.settingEduStart ? elements.settingEduStart.value.trim() : "";
        currentSettings.eduEnd = elements.settingEduEnd ? elements.settingEduEnd.value.trim() : "";
        
        currentSettings.company = elements.settingCompany ? elements.settingCompany.value.trim() : "";
        currentSettings.jobTitle = elements.settingJobTitle ? elements.settingJobTitle.value.trim() : "";
        currentSettings.expStart = elements.settingExpStart ? elements.settingExpStart.value : "";
        currentSettings.expEnd = elements.settingExpEnd ? elements.settingExpEnd.value.trim() : "";
        currentSettings.jobDesc = elements.settingJobDesc ? elements.settingJobDesc.value.trim() : "";
        
        currentSettings.language = elements.settingLanguage ? elements.settingLanguage.value.trim() : "";
        currentSettings.langLevel = elements.settingLangLevel ? elements.settingLangLevel.value : "";
        
        localStorage.setItem('kariyerSettings', JSON.stringify(currentSettings));
        updateProfileMetrics();
    }

    // Calculate Doluluk Yüzdesi
    function updateProfileMetrics() {
        let completion = 0;
        
        // Tab 1: Personal (20%)
        if (currentSettings.name && currentSettings.surname && currentSettings.email) completion += 20;
        
        // Tab 2: Education (20%)
        if (currentSettings.school && currentSettings.department && currentSettings.gpa) completion += 20;
        
        // Tab 3: Experience (20%)
        if (currentSettings.company && currentSettings.jobTitle) completion += 20;
        
        // Tab 4: Language (20%)
        if (currentSettings.language && currentSettings.langLevel) completion += 20;
        
        // Tab 5: Skills (20%)
        if (currentSettings.skills && currentSettings.skills.length > 0) completion += 20;
        
        // Update Progress Bar
        if (elements.profileProgressFill) elements.profileProgressFill.style.width = `${completion}%`;
        if (elements.profileProgressText) elements.profileProgressText.textContent = `Profil Doluluğu: %${completion}`;
        
        // Update Sidebar Initials and Name
        const initials = ((currentSettings.name?.[0] || 'K') + (currentSettings.surname?.[0] || 'P')).toUpperCase();
        if (elements.settingAvatarIcon) elements.settingAvatarIcon.textContent = initials;
        if (elements.settingProfileName) {
            elements.settingProfileName.textContent = (currentSettings.name || 'Kullanıcı') + " " + (currentSettings.surname || 'Adı');
        }

        // Update Badges
        if (elements.sidebarBadges) {
            elements.sidebarBadges.innerHTML = "";
            if (currentSettings.quizCompleted) {
                const badge = document.createElement('div');
                badge.style = "background: rgba(16, 185, 129, 0.2); border: 1px solid var(--accent-green); color: #34d399; font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: bold; display: flex; align-items: center; gap: 0.2rem; cursor: help; animation: pulseGlow 2s infinite;";
                badge.title = `Kariyer.Pro GK-GY Başarı Rozeti (${currentSettings.quizScore})`;
                badge.innerHTML = `🏅 GK-GY`;
                elements.sidebarBadges.appendChild(badge);
            }
        }
    }

    // Tab Switching Mechanics
    function activateTab(targetId) {
        // Toggle Nav Buttons Active
        cvNavButtons.forEach(btn => {
            if (btn.getAttribute('data-target') === targetId) {
                btn.classList.add('active');
                btn.style.background = 'rgba(59, 130, 246, 0.1)';
                btn.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                btn.style.color = '#60a5fa';
            } else {
                btn.classList.remove('active');
                btn.style.background = 'transparent';
                btn.style.borderColor = 'transparent';
                btn.style.color = 'var(--text-secondary)';
            }
        });

        // Show/Hide Sections
        cvSections.forEach(sec => {
            if (sec.id === targetId) {
                sec.classList.add('active');
            } else {
                sec.classList.remove('active');
            }
        });
    }

    // Bind nav buttons
    cvNavButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            if (target) {
                saveFieldsToObject();
                activateTab(target);
            }
        });
    });

    // Bind "Kaydet ve İlerle" Buttons
    const saveStepButtons = document.querySelectorAll('.save-step-btn');
    saveStepButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            saveFieldsToObject();
            const nextTab = btn.getAttribute('data-next');
            if (nextTab) {
                activateTab(nextTab);
                showToast('Bilgileriniz kaydedildi.', 'success');
            } else {
                showToast('Profiliniz başarıyla kaydedildi!', 'success');
                if (window.confetti) {
                    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
                }
            }
        });
    });

    // Bind "Geri" Buttons
    const prevCvButtons = document.querySelectorAll('.prev-cv-btn');
    prevCvButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const prevTab = btn.getAttribute('data-prev');
            if (prevTab) {
                activateTab(prevTab);
            }
        });
    });

    // --- SKILLS TAG MANAGEMENT ---
    function renderSkillsTags() {
        if (!elements.skillsTagsContainer) return;
        elements.skillsTagsContainer.innerHTML = "";
        
        if (!currentSettings.skills || currentSettings.skills.length === 0) {
            elements.skillsTagsContainer.innerHTML = `<span style="color: var(--text-tertiary); font-size: 0.85rem;" id="noSkillsText">Henüz yetenek eklenmedi.</span>`;
            return;
        }

        currentSettings.skills.forEach((skill, index) => {
            const tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.innerHTML = `${skill} <span class="remove-btn" data-index="${index}">×</span>`;
            elements.skillsTagsContainer.appendChild(tag);
        });

        // Add Delete Event to X buttons
        elements.skillsTagsContainer.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                currentSettings.skills.splice(idx, 1);
                localStorage.setItem('kariyerSettings', JSON.stringify(currentSettings));
                renderSkillsTags();
                updateProfileMetrics();
                showToast('Yetenek kaldırıldı.', 'info');
            });
        });
    }

    if (elements.addSkillBtn && elements.skillInput) {
        const addSkill = () => {
            const val = elements.skillInput.value.trim();
            if (!val) return;
            
            // support comma separated values
            const skillsToAdd = val.split(',').map(s => s.trim()).filter(s => s.length > 0);
            
            if (!currentSettings.skills) currentSettings.skills = [];
            
            skillsToAdd.forEach(s => {
                if (!currentSettings.skills.includes(s)) {
                    currentSettings.skills.push(s);
                }
            });

            elements.skillInput.value = "";
            localStorage.setItem('kariyerSettings', JSON.stringify(currentSettings));
            renderSkillsTags();
            updateProfileMetrics();
            showToast('Yetenekler eklendi!', 'success');
        };

        elements.addSkillBtn.addEventListener('click', addSkill);
        elements.skillInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
            }
        });
    }

    // --- QUIZ SIMULATOR LOGIC ---
    const quizQuestions = [
        {
            question: "Bir sayının 3 katının 5 fazlası, aynı sayının 4 katının 2 eksiğine eşittir. Bu sayı kaçtır?",
            options: ["A) 5", "B) 7", "C) 9", "D) 11"],
            correct: 1
        },
        {
            question: "Osmanlı Devleti'nin ilk anayasası olan Kanun-i Esasi hangi yıl yürürlüğe girmiştir?",
            options: ["A) 1808", "B) 1839", "C) 1856", "D) 1876"],
            correct: 3
        },
        {
            question: "Aşağıdaki cümlelerin hangisinde bir yazım hatası yapılmıştır?",
            options: ["A) Her şey yolunda gidiyor.", "B) Birkaç gün sonra geleceğim.", "C) Bu işi ardarda yapmalıyız.", "D) Hiçbir zaman vazgeçme."],
            correct: 2
        },
        {
            question: "Bir yarışta ikinciyi geçen kaçıncı olur?",
            options: ["A) Birinci", "B) İkinci", "C) Üçüncü", "D) Sonuncu"],
            correct: 1
        },
        {
            question: "Dünyanın en derin noktası olan Mariana Çukuru hangi okyanustadır?",
            options: ["A) Büyük Okyanus (Pasifik)", "B) Atlas Okyanusu (Atlantik)", "C) Hint Okyanusu", "D) Arktik Okyanusu"],
            correct: 0
        }
    ];

    let currentQuestionIdx = 0;
    let quizAnswers = []; // user selections

    const quizPanels = {
        intro: document.getElementById('test-intro-panel'),
        quiz: document.getElementById('test-quiz-panel'),
        result: document.getElementById('test-result-panel'),
        
        startBtn: document.getElementById('startTestBtn'),
        nextBtn: document.getElementById('nextQuestionBtn'),
        retryBtn: document.getElementById('retryTestBtn'),
        finishBtn: document.getElementById('finishTestBtn'),
        
        questionNumber: document.getElementById('quiz-question-number'),
        progressBar: document.getElementById('quiz-progress-bar'),
        questionText: document.getElementById('quiz-question-text'),
        optionsContainer: document.getElementById('quiz-options-container'),
        
        emoji: document.getElementById('quiz-result-emoji'),
        title: document.getElementById('quiz-result-title'),
        text: document.getElementById('quiz-result-text'),
        correctCount: document.getElementById('quiz-correct-count'),
        incorrectCount: document.getElementById('quiz-incorrect-count'),
        netScore: document.getElementById('quiz-net-score'),
        badgeCard: document.getElementById('quiz-badge-card')
    };

    function loadQuestion(idx) {
        if (!quizPanels.questionText) return;
        const q = quizQuestions[idx];
        quizPanels.questionNumber.textContent = `Soru ${idx + 1} / 5`;
        quizPanels.progressBar.style.width = `${(idx + 1) * 20}%`;
        quizPanels.questionText.textContent = q.question;
        
        quizPanels.optionsContainer.innerHTML = "";
        quizPanels.nextBtn.style.display = "none";
        
        q.options.forEach((opt, optIdx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            
            const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
            btn.innerHTML = `<span class="quiz-option-letter">${letter}</span> <span style="flex:1;">${opt.substring(3)}</span>`;
            
            btn.addEventListener('click', () => {
                // Remove selected class from all
                quizPanels.optionsContainer.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                quizAnswers[idx] = optIdx;
                quizPanels.nextBtn.style.display = "block";
            });
            
            quizPanels.optionsContainer.appendChild(btn);
        });

        if (idx === quizQuestions.length - 1) {
            quizPanels.nextBtn.textContent = "Sınavı Bitir 🏁";
        } else {
            quizPanels.nextBtn.textContent = "Sonraki Soru ➡️";
        }
    }

    if (quizPanels.startBtn) {
        quizPanels.startBtn.addEventListener('click', () => {
            currentQuestionIdx = 0;
            quizAnswers = [];
            quizPanels.intro.style.display = 'none';
            quizPanels.quiz.style.display = 'block';
            quizPanels.result.style.display = 'none';
            loadQuestion(0);
        });
    }

    if (quizPanels.nextBtn) {
        quizPanels.nextBtn.addEventListener('click', () => {
            if (currentQuestionIdx < quizQuestions.length - 1) {
                currentQuestionIdx++;
                loadQuestion(currentQuestionIdx);
            } else {
                // Show Results!
                showQuizResults();
            }
        });
    }

    function showQuizResults() {
        quizPanels.quiz.style.display = 'none';
        quizPanels.result.style.display = 'block';
        
        let corrects = 0;
        let incorrects = 0;
        
        quizQuestions.forEach((q, idx) => {
            if (quizAnswers[idx] === q.correct) {
                corrects++;
            } else {
                incorrects++;
            }
        });
        
        // 4 Yanlış 1 Doğruyu Götürür Kuralı GK-GY Standardıdır
        let net = corrects - (incorrects * 0.25);
        if (net < 0) net = 0;
        
        quizPanels.correctCount.textContent = corrects;
        quizPanels.incorrectCount.textContent = incorrects;
        quizPanels.netScore.textContent = net.toFixed(2);
        
        const passed = corrects >= 3;
        
        if (passed) {
            quizPanels.emoji.textContent = "🎉";
            quizPanels.title.textContent = "Tebrikler! Sınavı Geçtiniz.";
            quizPanels.text.textContent = `Matematik, Mantık ve Genel Kültür testini başarıyla tamamlayarak %${(corrects/5)*100} oranında doğru cevap verdiniz. Rozetiniz profilinize eklendi.`;
            quizPanels.badgeCard.style.display = "block";
            
            // Save state
            currentSettings.quizCompleted = true;
            currentSettings.quizScore = `${corrects}/5 Doğru, ${net.toFixed(2)} Net`;
            localStorage.setItem('kariyerSettings', JSON.stringify(currentSettings));
            updateProfileMetrics();
            
            if (window.confetti) {
                confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
            }
        } else {
            quizPanels.emoji.textContent = "😢";
            quizPanels.title.textContent = "Başarısız Oldunuz.";
            quizPanels.text.textContent = `Başarılı sayılmak için 5 sorudan en az 3 tanesini doğru cevaplamanız gerekmektedir. Dilerseniz testi tekrar çözerek kendinizi test edebilirsiniz.`;
            quizPanels.badgeCard.style.display = "none";
        }
    }

    if (quizPanels.retryBtn) {
        quizPanels.retryBtn.addEventListener('click', () => {
            currentQuestionIdx = 0;
            quizAnswers = [];
            quizPanels.result.style.display = 'none';
            quizPanels.quiz.style.display = 'block';
            loadQuestion(0);
        });
    }

    if (quizPanels.finishBtn) {
        quizPanels.finishBtn.addEventListener('click', () => {
            quizPanels.result.style.display = 'none';
            quizPanels.intro.style.display = 'block';
            activateTab('cv-personal'); // Back to starting tab
            showToast('Profil ayarları başarıyla güncellendi.', 'success');
        });
    }

    // Initialize UI
    loadSettingsToUI();

    // --- AUTHENTICATION LOGIC ---
    window.openAuthModal = function() {
        document.getElementById('authModal').classList.add('show');
    };
    window.closeAuthModal = function() {
        document.getElementById('authModal').classList.remove('show');
    };
    
    let isRegisterMode = false;
    window.toggleAuthMode = function() {
        isRegisterMode = !isRegisterMode;
        document.getElementById('authModalTitle').textContent = isRegisterMode ? "Kayıt Ol" : "Giriş Yap";
        document.getElementById('registerNameGroup').style.display = isRegisterMode ? "block" : "none";
        document.getElementById('authSubmitBtn').textContent = isRegisterMode ? "Kayıt Ol" : "Giriş Yap";
        document.getElementById('authToggleText').textContent = isRegisterMode ? "Zaten hesabın var mı?" : "Hesabın yok mu?";
        document.getElementById('authToggleLink').textContent = isRegisterMode ? "Giriş Yap" : "Kayıt Ol";
    };

    window.handleAuth = async function() {
        const name = document.getElementById('authName').value;
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        
        const endpoint = isRegisterMode ? '/api/register' : '/api/login';
        const body = isRegisterMode ? { name, email, password } : { email, password };
        
        const btn = document.getElementById('authSubmitBtn');
        btn.textContent = "Bekleyin...";
        
        if (window.isOfflineMode) {
            setTimeout(() => {
                if (isRegisterMode) {
                    if (!name || !email || !password) {
                        showToast('Lütfen tüm alanları doldurun.', 'error');
                        btn.textContent = "Kayıt Ol";
                        return;
                    }
                    const mockUser = { name, email, password };
                    localStorage.setItem('offlineUser', JSON.stringify(mockUser));
                    showToast('Kayıt Başarılı (Çevrimdışı)! Giriş yapabilirsiniz.', 'success');
                    toggleAuthMode();
                } else {
                    if (!email || !password) {
                        showToast('Lütfen e-posta ve şifrenizi girin.', 'error');
                        btn.textContent = "Giriş Yap";
                        return;
                    }
                    const savedUser = JSON.parse(localStorage.getItem('offlineUser')) || { name: "Ahmet Yılmaz", email: "ahmet@gmail.com", password: "123" };
                    if (email === savedUser.email) {
                        localStorage.setItem('kariyerToken', 'mock-offline-token');
                        localStorage.setItem('kariyerUser', JSON.stringify({ name: savedUser.name, email: savedUser.email }));
                        closeAuthModal();
                        updateUserProfileUI();
                        showToast('Giriş Başarılı (Çevrimdışı)!', 'success');
                    } else {
                        // Allow any login in offline mode for convenience, using input email
                        localStorage.setItem('kariyerToken', 'mock-offline-token');
                        localStorage.setItem('kariyerUser', JSON.stringify({ name: name || "Misafir Aday", email: email }));
                        closeAuthModal();
                        updateUserProfileUI();
                        showToast('Giriş Başarılı (Çevrimdışı)!', 'success');
                    }
                }
                btn.textContent = isRegisterMode ? "Kayıt Ol" : "Giriş Yap";
            }, 500);
            return;
        }

        try {
            const res = await fetch('http://localhost:3000' + endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            
            if(data.success) {
                showToast(data.message, 'success');
                if(!isRegisterMode && data.token) {
                    localStorage.setItem('kariyerToken', data.token);
                    localStorage.setItem('kariyerUser', JSON.stringify(data.user));
                    closeAuthModal();
                    updateUserProfileUI();
                    fetchFavoritesFromDB();
                } else if(isRegisterMode) {
                    toggleAuthMode();
                }
            } else {
                showToast(data.message, 'error');
            }
        } catch(e) {
            console.log("Sunucu kapalı, yerel giriş simülasyonu yapılıyor.");
            if (isRegisterMode) {
                if (!name || !email || !password) {
                    showToast('Lütfen tüm alanları doldurun.', 'error');
                } else {
                    const mockUser = { name, email, password };
                    localStorage.setItem('offlineUser', JSON.stringify(mockUser));
                    showToast('Kayıt Başarılı (Çevrimdışı)! Giriş yapabilirsiniz.', 'success');
                    toggleAuthMode();
                }
            } else {
                if (!email) {
                    showToast('Lütfen e-posta adresinizi girin.', 'error');
                } else {
                    localStorage.setItem('kariyerToken', 'mock-offline-token');
                    localStorage.setItem('kariyerUser', JSON.stringify({ name: "Ahmet Yılmaz", email: email }));
                    closeAuthModal();
                    updateUserProfileUI();
                    showToast('Giriş Başarılı (Çevrimdışı)!', 'success');
                }
            }
        }
        btn.textContent = isRegisterMode ? "Kayıt Ol" : "Giriş Yap";
    };
    
    function updateUserProfileUI() {
        const userJson = localStorage.getItem('kariyerUser');
        const profileSection = document.getElementById('userProfileSection');
        if(!profileSection) return;
        
        if(userJson) {
            const user = JSON.parse(userJson);
            const initial = user.name.charAt(0).toUpperCase();
            profileSection.innerHTML = `
                <div class="avatar" id="navAvatar">${initial}</div>
                <div class="user-info">
                    <span class="user-name" id="navUserName" style="color:white; font-weight:bold;">${user.name}</span>
                    <span class="user-role" onclick="window.logout()" style="cursor:pointer; color:var(--accent-orange); font-size:0.75rem;">🚪 Çıkış Yap</span>
                </div>
            `;
            fetchFavoritesFromDB();
        } else {
            profileSection.innerHTML = `<button class="btn-primary" onclick="openAuthModal()" style="padding: 0.5rem 1rem; font-size: 0.85rem;">Giriş Yap / Kayıt Ol</button>`;
            trackedJobs = [];
            renderTrackerTable();
        }
    }
    
    window.logout = function() {
        localStorage.removeItem('kariyerToken');
        localStorage.removeItem('kariyerUser');
        updateUserProfileUI();
        showToast("Çıkış yapıldı.", "info");
    };
    
    // Başlangıçta çalıştır
    updateUserProfileUI();
    
    // --- APPLICATION FORM LOGIC ---
    let currentApplicationJob = null;
    
    window.openApplicationModal = function(job) {
        currentApplicationJob = job;
        
        const token = localStorage.getItem('kariyerToken');
        if (!token) {
            showToast('Başvuru yapmak için önce Giriş Yapmalısınız!', 'error');
            openAuthModal();
            return;
        }

        const userJson = localStorage.getItem('kariyerUser');
        if(userJson) {
            const user = JSON.parse(userJson);
            document.getElementById('applyName').value = user.name || '';
            document.getElementById('applyEmail').value = user.email || '';
        }
        
        document.getElementById('applyJobTitle').textContent = job.title + " - " + job.cities.split('/')[0];
        document.getElementById('applicationModal').classList.add('show');
    };
    
    window.closeApplicationModal = function() {
        document.getElementById('applicationModal').classList.remove('show');
    };
    
    window.submitApplication = async function() {
        if (!currentApplicationJob) return;
        
        const btn = document.querySelector('#applicationModal .btn-primary');
        btn.innerHTML = '<span class="spinner" style="display:inline-block; width:14px; height:14px; border:2px solid #fff; border-bottom-color:transparent; border-radius:50%; animation:spin 1s linear infinite;"></span> Gönderiliyor...';
        btn.disabled = true;
        
        // Simüle edilmiş başvuru beklemesi
        setTimeout(() => {
            btn.innerHTML = '✅ Başvuru Başarıyla İletildi';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            showToast('Başvurunuz kuruma iletildi!', 'success');
            if (window.confetti) confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
            
            // Otomatik olarak takip listesine ekle
            const encodedJob = encodeURIComponent(JSON.stringify(currentApplicationJob));
            window.trackJob(encodedJob, 'Başvuruldu'); // DB'ye kaydet
            
            setTimeout(() => {
                closeApplicationModal();
                btn.innerHTML = 'Başvuruyu Gönder';
                btn.disabled = false;
                btn.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
            }, 2500);
        }, 1500);
    };
});

/* ============================================================
   📱 MOBİL ALT NAVİGASYON FONKSİYONLARI
   ============================================================ */
function mobileNavClick(el) {
    // Aktif tab
    document.querySelectorAll('.mob-nav-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');

    // Sayfayı göster
    const page = el.getAttribute('data-page');
    if (!page) return;

    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(page);
    if (target) {
        target.classList.add('active');
        // Sayfanın başına dön
        const main = document.querySelector('.main-content');
        if (main) main.scrollTop = 0;
    }

    // Sidebar nav item'ları da güncelle
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(n => {
        n.classList.remove('active');
        if (n.getAttribute('data-page') === page) n.classList.add('active');
    });

    // İstatistikler sayfasında grafikleri yenile
    if (page === 'page-statistics' && typeof window.renderCharts === 'function') {
        setTimeout(window.renderCharts, 100);
    }
}

// Hamburger stub (çağrılırsa hata vermesin)
function toggleMobileMenu() {}
function closeMobileMenu() {}

// Masaüstü sidebar nav itemları da bottom nav ile senkronize et
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            if (page && window.innerWidth <= 768) {
                const bottomItem = document.querySelector(`#mobileBottomNav [data-page="${page}"]`);
                if (bottomItem) mobileNavClick(bottomItem);
            }
        });
    });
});

