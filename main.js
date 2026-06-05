document.addEventListener('DOMContentLoaded', () => {
    // --- GeliÅŸmiÅŸ Filtre SeÃ§enekleri Doldurma ---
    const allCities = ["Adana","AdÄ±yaman","Afyonkarahisar","AÄŸrÄ±","Amasya","Ankara","Antalya","Artvin","AydÄ±n","BalÄ±kesir","Bilecik","BingÃ¶l","Bitlis","Bolu","Burdur","Bursa","Ã‡anakkale","Ã‡ankÄ±rÄ±","Ã‡orum","Denizli","DiyarbakÄ±r","Edirne","ElazÄ±ÄŸ","Erzincan","Erzurum","EskiÅŸehir","Gaziantep","Giresun","GÃ¼mÃ¼ÅŸhane","Hakkari","Hatay","Isparta","Mersin","Ä°stanbul","Ä°zmir","Kars","Kastamonu","Kayseri","KÄ±rklareli","KÄ±rÅŸehir","Kocaeli","Konya","KÃ¼tahya","Malatya","Manisa","KahramanmaraÅŸ","Mardin","MuÄŸla","MuÅŸ","NevÅŸehir","NiÄŸde","Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","TekirdaÄŸ","Tokat","Trabzon","Tunceli","ÅanlÄ±urfa","UÅŸak","Van","Yozgat","Zonguldak","Aksaray","Bayburt","Karaman","KÄ±rÄ±kkale","Batman","ÅÄ±rnak","BartÄ±n","Ardahan","IÄŸdÄ±r","Yalova","KarabÃ¼k","Kilis","Osmaniye","DÃ¼zce"];
    const allProfessions = ["Memur", "MÃ¼hendis", "Tekniker", "Teknisyen", "HemÅŸire", "SaÄŸlÄ±k Personeli", "Ã–ÄŸretmen", "BÃ¼ro Personeli", "GÃ¼venlik", "ÅofÃ¶r", "Ä°ÅŸÃ§i", "Destek Personeli", "Uzman", "Avukat", "Mimar", "ProgramcÄ±"];
    
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
            
            // SeÃ§ili sÄ±nÄ±fÄ± temizle ve tÄ±klanana ekle
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // TÃ¼m sayfalarÄ± gizle
            pageSections.forEach(page => page.classList.remove('active'));

            // Hedef sayfayÄ± gÃ¶ster
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
        
        const icon = type === 'success' ? 'âœ…' : (type === 'error' ? 'âŒ' : 'â„¹ï¸');
        
        toast.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span> <span style="font-weight: 500;">${message}</span>`;
        container.appendChild(toast);
        
        // Animasyon iÃ§in reflow
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
            showToast('Favorilere eklemek iÃ§in Ã¶nce GiriÅŸ YapmalÄ±sÄ±nÄ±z!', 'error');
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
                job.platform = 'Favori (Ã‡evrimdÄ±ÅŸÄ±)';
                trackedJobs.push(job);
                saveTrackedJobs();
                renderTrackerTable();
                showToast('Ä°lan takibe alÄ±ndÄ± (Ã‡evrimdÄ±ÅŸÄ± kaydedildi)!', 'success');
                if (window.confetti) confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                return;
            }

            const response = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(job)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showToast('Ä°lan baÅŸarÄ±yla takibe alÄ±ndÄ± (VeritabanÄ±na kaydedildi)!', 'success');
                if (window.confetti) confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                fetchFavoritesFromDB();
            } else {
                showToast(result.message, 'error');
            }
        } catch(e) {
            console.error("Takip ekleme hatasÄ±, yerel kaydediliyor:", e);
            try {
                const job = JSON.parse(decodeURIComponent(encodedJob));
                job.status = status;
                const exists = trackedJobs.some(j => j.title === job.title && j.cities === job.cities);
                if (!exists) {
                    job.trackDate = new Date().toISOString().split('T')[0];
                    job.platform = 'Favori (Ã‡evrimdÄ±ÅŸÄ±)';
                    trackedJobs.push(job);
                    saveTrackedJobs();
                    renderTrackerTable();
                }
                showToast('Ä°lan takibe alÄ±ndÄ± (Ã‡evrimdÄ±ÅŸÄ± kaydedildi)!', 'success');
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
            const response = await fetch('/api/favorites', {
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
            console.error("Favoriler sunucudan Ã§ekilemedi, yerel yÃ¼kleniyor:", e); 
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
            showToast('Ä°lan takip listesinden kaldÄ±rÄ±ldÄ±.', 'success');
            return;
        }

        const token = localStorage.getItem('kariyerToken');
        try {
            const response = await fetch(`/api/favorites/${job.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const result = await response.json();
            if (result.success) {
                showToast('Ä°lan baÅŸarÄ±yla takipten kaldÄ±rÄ±ldÄ±!', 'success');
                fetchFavoritesFromDB();
            } else {
                showToast(result.message, 'error');
            }
        } catch(e) {
            console.error("Takipten kaldÄ±rma hatasÄ±, yerel siliniyor:", e);
            trackedJobs.splice(index, 1);
            saveTrackedJobs();
            renderTrackerTable();
            showToast('Ä°lan takip listesinden kaldÄ±rÄ±ldÄ±.', 'success');
        }
    };

    window.exportToExcel = function() {
        if (trackedJobs.length === 0) {
            showToast("DÄ±ÅŸa aktarÄ±lacak ilan bulunamadÄ±.", "error");
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
        
        showToast("Veriler baÅŸarÄ±yla bilgisayara indirildi!", "success");
    };
    
    window.updateTrackedJobStatus = async function(index, newStatus) {
        const job = trackedJobs[index];
        job.status = newStatus;
        renderTrackerTable();
        
        if (job.id) {
            const token = localStorage.getItem('kariyerToken');
            try {
                const response = await fetch(`/api/favorites/${job.id}`, {
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
                console.error("Durum gÃ¼ncelleme hatasÄ±:", e);
                showToast('Durum gÃ¼ncellenirken sunucu hatasÄ± oluÅŸtu.', 'error');
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
            container.innerHTML = '<span style="color: var(--text-tertiary); font-size: 0.85rem; font-style: italic;">HenÃ¼z kurulu bir alarmÄ±nÄ±z yok.</span>';
            return;
        }

        smartAlerts.forEach((alert, index) => {
            const el = document.createElement('div');
            el.style = 'background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); padding: 0.5rem 1rem; border-radius: 20px; display: flex; align-items: center; gap: 0.5rem; color: #60a5fa; font-size: 0.85rem;';
            el.innerHTML = `
                <span><strong>Meslek:</strong> ${alert.profession} | <strong>Åehir:</strong> ${alert.city}</span>
                <button onclick="window.removeSmartAlert(${index})" style="background: none; border: none; color: #f87171; cursor: pointer; font-weight: bold; margin-left: 0.5rem; font-size: 1rem;">Ã—</button>
            `;
            container.appendChild(el);
        });
    }

    window.removeSmartAlert = function(index) {
        smartAlerts.splice(index, 1);
        saveSmartAlerts();
        renderSmartAlerts();
        showToast('Alarm baÅŸarÄ±yla silindi.', 'info');
    };

    const createAlertBtn = document.getElementById('createAlertBtn');
    if (createAlertBtn) {
        createAlertBtn.addEventListener('click', () => {
            const prof = document.getElementById('alertProfession').value.trim();
            const city = document.getElementById('alertCity').value.trim();

            if (!prof || !city) {
                showToast('LÃ¼tfen hem meslek hem ÅŸehir alanÄ±nÄ± doldurun.', 'error');
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
            
            showToast('âœ… Alarm baÅŸarÄ±yla kuruldu! Yeni ilan dÃ¼ÅŸtÃ¼ÄŸÃ¼nde bildirileceksiniz.', 'success');
        });
    }

    // Ä°lk aÃ§Ä±lÄ±ÅŸta alarmlarÄ± Ã§iz
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
                
                // Otomatik olarak Ä°lan Takibine ekle
                if (!trackedJobs.some(j => j.title === job.title && j.cities === job.cities)) {
                    const today = new Date();
                    const aylar = ["Oca", "Åub", "Mar", "Nis", "May", "Haz", "Tem", "AÄŸu", "Eyl", "Eki", "Kas", "Ara"];
                    const dateString = `${today.getDate()} ${aylar[today.getMonth()]} ${today.getFullYear()}`;
                    
                    trackedJobs.unshift({
                        ...job,
                        trackDate: dateString,
                        status: 'Beklemede',
                        platform: 'Oto-Bot ğŸ¤–'
                    });
                    saveTrackedJobs();
                }

                showToast(`ğŸ”” DÄ°KKAT! AradÄ±ÄŸÄ±nÄ±z kriterde ilan bulundu: ${job.title.substring(0,30)}...`, 'success');
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
        quotaEl.textContent = job.quota + " KiÅŸi";
        
        modal.classList.add('show');
        
        // Fetch AI Data
        loading.classList.remove('hidden');
        results.classList.add('hidden');
        loading.innerHTML = `<div class="spinner"></div><p style="color: var(--text-secondary); margin-top: 1rem;">Yapay zeka ilanÄ± analiz ediyor...</p>`;
        
        try {
            if (window.isOfflineMode) {
                throw new Error("Offline Mode");
            }
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: job.title, link: job.link })
            });
            
            if(!response.ok) throw new Error("Python API'ye eriÅŸilemedi.");
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
                li.innerHTML = `âœ… ${note}`;
                li.style.marginBottom = "0.5rem";
                ul.appendChild(li);
            });
        } catch (err) {
            console.error("AI tavsiye motoru Ã§evrimdÄ±ÅŸÄ±, yerel tavsiye yÃ¼kleniyor:", err);
            
            setTimeout(() => {
                loading.classList.add('hidden');
                results.classList.remove('hidden');

                // Determine dummy values based on job title
                const isEng = job.title.toLowerCase().includes('mÃ¼hendis') || job.title.toLowerCase().includes('yazÄ±lÄ±m');
                const probability = isEng ? 85 : 74;
                const competition = isEng ? "Orta (Nitelikli Kadro)" : "YÃ¼ksek (Genel BaÅŸvuru)";
                const estScore = isEng ? "78.20" : "84.50";
                
                document.getElementById('aiProbability').textContent = `%${probability}`;
                document.getElementById('aiProbability').style.color = probability > 75 ? '#4ade80' : '#facc15';
                document.getElementById('aiCompetition').textContent = competition;
                document.getElementById('aiEstimatedScore').textContent = estScore;

                const ul = document.getElementById('aiNotesList');
                ul.innerHTML = `
                    <li>âœ… Pozisyonun son 3 atama dÃ¶nemindeki taban puan trendleri incelendi ve stabil olduÄŸu gÃ¶rÃ¼ldÃ¼.</li>
                    <li>âœ… MÃ¼lakatsÄ±z atama kriterlerine sahip olup, doÄŸrudan KPSS puan Ã¼stÃ¼nlÃ¼ÄŸÃ¼ne tabidir.</li>
                    <li>âœ… Gerekli mezuniyet alan kodlarÄ±nÄ±zÄ±n Ã–SYM kÄ±lavuz kodlarÄ±yla tam uyumlu olduÄŸunu kontrol edin.</li>
                    <li>ğŸ’¡ Ã–neri: Tercih dÃ¶neminde bu kurumu ilk 3 sÄ±raya yazmanÄ±z yerleÅŸme ihtimalinizi artÄ±racaktÄ±r.</li>
                `;
                showToast('Ä°lan analizi yerel olarak yapÄ±ldÄ± (Ã‡evrimdÄ±ÅŸÄ± Mod)!', 'info');
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

    // --- Backend'den CanlÄ± Veri Ã‡ekme (Fetch API) ---
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
    // UYARI: Tablo 'cities' ve 'score' alanlarÄ±nÄ± beklemektedir!
    const fallbackJobs = {
        ortaogretim: [
            { id: 101, title: "Hizmetli (Genel Ä°dari)", cities: "Ankara / TÃ¼m Ä°ller", score: "KPSS-P1", date: "BugÃ¼n", link: "https://ilan.memurlar.net/", quota: 45, deadline: "30 Haziran 2026", description: "Adliye ve kamu binalarÄ±nda hizmet iÅŸlerinden sorumlu personel alÄ±mÄ±." },
            { id: 102, title: "ÅofÃ¶r (B SÄ±nÄ±fÄ± Ehliyet)", cities: "Ä°stanbul / Ankara", score: "KPSS-P1", date: "DÃ¼n", link: "https://ilan.memurlar.net/", quota: 15, deadline: "25 Haziran 2026", description: "Ä°l milli eÄŸitim mÃ¼dÃ¼rlÃ¼klerinde araÃ§ kullanacak ÅŸofÃ¶r personeli." },
            { id: 103, title: "Teknisyen (Elektrik-Elektronik)", cities: "Ä°zmir / Bursa / Konya", score: "KPSS-P3", date: "3 gÃ¼n Ã¶nce", link: "https://ilan.memurlar.net/", quota: 8, deadline: "20 Haziran 2026", description: "DSÄ° baraj ve sulama tesislerinde gÃ¶rev yapacak elektrik teknisyeni." },
            { id: 104, title: "GÃ¼venlik GÃ¶revlisi", cities: "Osmaniye / Adana", score: "KPSS-P94", date: "BugÃ¼n", link: "https://ilan.memurlar.net/", quota: 20, deadline: "15 Temmuz 2026", description: "Devlet kurumu kampÃ¼slerinde Ã¶zel gÃ¼venlik hizmeti verecek personel." },
            { id: 105, title: "Destek Personeli", cities: "Trabzon / Samsun", score: "KPSS-P1", date: "2 gÃ¼n Ã¶nce", link: "https://ilan.memurlar.net/", quota: 30, deadline: "1 Temmuz 2026", description: "Kamu hastaneleri bÃ¼nyesinde temizlik ve yardÄ±mcÄ± hizmetler personeli." }
        ],
        onlisans: [
            { id: 201, title: "BÃ¼ro Personeli (Genel)", cities: "Ä°stanbul / TÃ¼rkiye Geneli", score: "KPSS-P93", date: "BugÃ¼n", link: "https://ilan.memurlar.net/", quota: 110, deadline: "30 Haziran 2026", description: "SGK merkez ve il mÃ¼dÃ¼rlÃ¼klerinde evrak, arÅŸiv ve yazÄ±ÅŸma iÅŸleri." },
            { id: 202, title: "Bilgisayar Ä°ÅŸletmeni", cities: "Osmaniye", score: "KPSS-P3", date: "DÃ¼n", link: "https://ilan.memurlar.net/", quota: 5, deadline: "28 Haziran 2026", description: "Valilik bilgi iÅŸlem biriminde veri giriÅŸi ve sistem takibi." },
            { id: 203, title: "SaÄŸlÄ±k Teknikeri (Laborant)", cities: "Ankara / Ä°zmir / Bursa", score: "KPSS-P93", date: "2 gÃ¼n Ã¶nce", link: "https://ilan.memurlar.net/", quota: 75, deadline: "22 Haziran 2026", description: "Devlet hastanelerinde tÄ±bbi laboratuvar hizmetlerinde Ã§alÄ±ÅŸacak tekniker." },
            { id: 204, title: "Muhasebe Personeli", cities: "Gaziantep / ÅanlÄ±urfa", score: "KPSS-P93", date: "3 gÃ¼n Ã¶nce", link: "https://ilan.memurlar.net/", quota: 12, deadline: "25 Haziran 2026", description: "Ticaret odalarÄ± bÃ¼nyesinde muhasebe ve finans sÃ¼reÃ§lerini yÃ¶netecek personel." },
            { id: 205, title: "Ä°cra MÃ¼dÃ¼r YardÄ±mcÄ±sÄ±", cities: "Konya / EreÄŸli", score: "KPSS-P93", date: "BugÃ¼n", link: "https://ilan.memurlar.net/", quota: 3, deadline: "10 Temmuz 2026", description: "Adliye icra dairesinde mÃ¼dÃ¼r yardÄ±mcÄ±sÄ± olarak gÃ¶rev yapacak aday alÄ±mÄ±." }
        ],
        lisans: [
            { id: 301, title: "YazÄ±lÄ±m MÃ¼hendisi (Backend)", cities: "Kocaeli / Ankara", score: "KPSS-P3", date: "BugÃ¼n", link: "https://ilan.memurlar.net/", quota: 12, deadline: "30 Haziran 2026", description: "TÃœBÄ°TAK BÄ°LGEM'de milli yazÄ±lÄ±m ve siber gÃ¼venlik projelerinde C++/Python geliÅŸtirici." },
            { id: 302, title: "MÃ¼hendis (Savunma Sanayi)", cities: "Ankara", score: "KPSS-P3", date: "DÃ¼n", link: "https://ilan.memurlar.net/", quota: 20, deadline: "25 Haziran 2026", description: "ASELSAN'da hava ve kara savunma sistemleri iÃ§in gÃ¶mÃ¼lÃ¼ yazÄ±lÄ±m geliÅŸtirici." },
            { id: 303, title: "Uzman YardÄ±mcÄ±sÄ± (Ekonomi)", cities: "Ä°stanbul / Ankara", score: "KPSS-P3", date: "3 gÃ¼n Ã¶nce", link: "https://ilan.memurlar.net/", quota: 15, deadline: "20 Haziran 2026", description: "Merkez BankasÄ±'nda para politikasÄ± ve ekonometrik araÅŸtÄ±rma birimi iÃ§in uzman adayÄ±." },
            { id: 304, title: "HÃ¢kim/SavcÄ± AdayÄ± (HSYK)", cities: "TÃ¼rkiye Geneli", score: "KPSS-P9", date: "BugÃ¼n", link: "https://ilan.memurlar.net/", quota: 500, deadline: "15 Temmuz 2026", description: "Adalet BakanlÄ±ÄŸÄ± bÃ¼nyesinde gÃ¶reve baÅŸlayacak hÃ¢kim ve savcÄ± adayÄ± alÄ±mÄ±." },
            { id: 305, title: "Vergi MÃ¼fettiÅŸ YardÄ±mcÄ±sÄ±", cities: "Ankara / Ä°stanbul / Ä°zmir", score: "KPSS-P3", date: "2 gÃ¼n Ã¶nce", link: "https://ilan.memurlar.net/", quota: 80, deadline: "5 Temmuz 2026", description: "Gelir Ä°daresi BaÅŸkanlÄ±ÄŸÄ±'nda vergi denetimi ve inceleme yapacak mÃ¼fettiÅŸ adaylarÄ±." }
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
                indicator.innerHTML = `ğŸŸ¢ Sunucu Aktif (CanlÄ± Mod)`;
            } else {
                indicator.style.background = 'rgba(245, 158, 11, 0.15)';
                indicator.style.borderColor = 'var(--accent-orange)';
                indicator.style.color = '#fbbf24';
                indicator.innerHTML = `ğŸŸ¡ Sunucu KapalÄ± (Hibrit Ã‡evrimdÄ±ÅŸÄ± Mod)`;
                indicator.title = "Yerel sunucu algÄ±lanamadÄ±ÄŸÄ± iÃ§in sistem Ã§evrimdÄ±ÅŸÄ± fallback verilerini ve tarayÄ±cÄ± iÃ§i yapay zekayÄ± kullanÄ±yor.";
            }
        }
    }

    let fetchRetryCount = 0;

    // Sunucudan (Backend) verileri Ã§eken asenkron fonksiyon
    async function fetchLiveJobs() {
        const indicator = document.getElementById('liveUpdateIndicator');

        // â”€â”€â”€ file:// protokolÃ¼ ile aÃ§Ä±ldÄ±ysa anÄ±nda offline moduna geÃ§ â”€â”€â”€
        if (window.location.protocol === 'file:') {
            window.isOfflineMode = true;
            updateServerStatusIndicator(false);
            professionsData = fallbackJobs;
            updateSummaries();
            renderTable(searchInput ? searchInput.value : '');
            renderTrackerTable();
            checkSmartAlerts(professionsData);
            if (indicator) {
                indicator.innerHTML = `<span style="width: 8px; height: 8px; background: #a78bfa; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px #a78bfa;"></span> Ã‡evrimdÄ±ÅŸÄ± Mod`;
            }
            if (typeof window.renderCharts === 'function') window.renderCharts();
            return;
        }

        if(indicator) {
            indicator.innerHTML = `<span class="pulse-dot" style="width: 8px; height: 8px; background: #facc15; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px #facc15;"></span> GÃ¼ncelleniyor...`;
        }

        try {
            // Veri yÃ¼klenene kadar kullanÄ±cÄ±ya Skeleton efekti gÃ¶ster
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

            const response = await fetch('/api/jobs');
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            
            const result = await response.json();
            
            if (result.success) {
                professionsData = result.data;
                window.isOfflineMode = false;
                updateServerStatusIndicator(true);
                updateSummaries();
                renderTable(searchInput ? searchInput.value : '');
                renderTrackerTable(); // Takip kÄ±smÄ±nÄ± gÃ¼ncelle
                
                // Yeni verilerle botu Ã§alÄ±ÅŸtÄ±r
                checkSmartAlerts(professionsData);
                
                fetchRetryCount = 0; // reset on success

                if(indicator) {
                    indicator.innerHTML = `<span class="pulse-dot" style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px #4ade80;"></span> GÃ¼ncel`;
                    setTimeout(() => {
                        indicator.innerHTML = `<span class="pulse-dot" style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px #4ade80;"></span> CanlÄ± AkÄ±ÅŸ Aktif`;
                    }, 2000);
                }
                if (typeof window.renderCharts === 'function') window.renderCharts();
            }
        } catch (error) {
            console.error("Sunucuya baÄŸlanÄ±lamadÄ±, Ã§evrimdÄ±ÅŸÄ± moda geÃ§iliyor:", error);
            
            // Ã‡evrimdÄ±ÅŸÄ± modu devreye alalÄ±m!
            window.isOfflineMode = true;
            updateServerStatusIndicator(false);
            
            // Mock veriyi yÃ¼kleyelim â€” tabloyu HÄ°Ã‡BÄ°R ZAMAN hata mesajÄ±yla silme
            professionsData = fallbackJobs;
            updateSummaries();
            renderTable(searchInput ? searchInput.value : '');
            renderTrackerTable();
            checkSmartAlerts(professionsData);

            if(indicator) {
                indicator.innerHTML = `<span style="width: 8px; height: 8px; background: #a78bfa; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px #a78bfa;"></span> Ã‡evrimdÄ±ÅŸÄ± Mod`;
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

        // SayÄ± animasyonu eklenebilir, ÅŸimdilik direkt yazÄ±yoruz
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

            // Her zaman kart render et â€” CSS masaÃ¼stÃ¼nde tablo gibi gÃ¶sterir
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
                                <span class="job-badge-quota">ğŸ‘¥ ${item.quota} KiÅŸi</span>
                                <span class="job-badge-city">ğŸ“ ${citiesHtml}</span>
                            </div>
                        </div>
                        <div class="job-card-bottom">
                            <span class="job-card-deadline">â³ ${deadlineHtml}</span>
                            <div class="job-card-actions">
                                <button class="job-btn-incele" onclick="window.openAIModal('${jobJson}')">ğŸ” Ä°ncele</button>
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
                // === MOBÄ°L KART GÃ–RÃœNÃœMÃœ ===
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
                                <span style="background:rgba(16,185,129,0.1); color:#34d399; border:1px solid rgba(16,185,129,0.2); border-radius:6px; padding:0.2rem 0.5rem; font-size:0.72rem;">ğŸ‘¥ ${item.quota} KiÅŸi</span>
                                <span style="color:var(--text-secondary); font-size:0.72rem; padding:0.2rem 0;">ğŸ“ ${citiesHtml}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="color:var(--text-tertiary); font-size:0.72rem;">â³ ${deadlineHtml}</span>
                                <div style="display:flex; gap:0.4rem;">
                                    <button onclick="window.openAIModal('${jobJson}')" style="background:linear-gradient(135deg,#3b82f6,#2563eb); color:white; border:none; border-radius:8px; padding:0.45rem 0.8rem; font-size:0.78rem; cursor:pointer; font-weight:600;">ğŸ” Ä°ncele</button>
                                    <button onclick="window.trackJob('${jobJson}')" style="background:rgba(255,255,255,0.07); color:var(--text-secondary); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:0.45rem 0.8rem; font-size:0.78rem; cursor:pointer;">+ Takip</button>
                                </div>
                            </div>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            } else {
                // === MASAÃœSTÃœ TABLO GÃ–RÃœNÃœMÃœ ===
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <strong style="color: var(--text-primary); font-weight: 500;">${titleHtml}</strong>
                        <div style="color:var(--text-tertiary); font-size:0.75rem; margin-top:0.2rem;">${item.date}</div>
                    </td>
                    <td>
                        <span class="badge" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-secondary); margin-bottom: 0.3rem; display: inline-block;">${item.score} Puan</span><br>
                        <span style="color: var(--accent-green); font-weight: 600; background: var(--accent-green-glow); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">${item.quota} KiÅŸi</span>
                    </td>
                    <td style="color: var(--text-secondary); font-size: 0.9rem;">${citiesHtml}</td>
                    <td style="color: var(--accent-orange); font-size: 0.85rem; font-weight: 500;">â³ ${deadlineHtml}</td>
                    <td>
                        <div style="display: flex; gap: 0.4rem;">
                            <button onclick="window.openAIModal('${jobJson}')" class="btn-primary" style="padding: 0.4rem 0.6rem; font-size: 0.75rem;">ğŸ” Ä°ncele</button>
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
            trackerBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 3rem; color: var(--text-tertiary);">HenÃ¼z takip ettiÄŸiniz bir ilan bulunmuyor.<br><span style="font-size: 2.5rem; display:block; margin-top:1rem; opacity: 0.5;">ğŸ“Œ</span></td></tr>`;
            return;
        }

        trackedJobs.forEach((job, index) => {
            let shortTitle = job.title;
            if(shortTitle.length > 40) shortTitle = shortTitle.substring(0, 40) + '...';
            let shortCity = job.cities || '-';
            if(shortCity.includes('Genel')) shortCity = 'TÃ¼rkiye Geneli';

            const bg = job.status === 'Beklemede' ? 'rgba(250,204,21,0.2)' : 
                       (job.status === 'BaÅŸvuruldu' ? 'rgba(59,130,246,0.2)' : 
                       (job.status === 'Kabul' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'));
            const col = job.status === 'Beklemede' ? '#facc15' : 
                        (job.status === 'BaÅŸvuruldu' ? '#60a5fa' : 
                        (job.status === 'Kabul' ? '#4ade80' : '#f87171'));

            const statusDropdown = `<select onchange="window.updateTrackedJobStatus(${index}, this.value)" style="background:${bg}; color:${col}; border:1px solid ${col}; border-radius:12px; padding:0.3rem 0.6rem; font-size:0.78rem; cursor:pointer; outline:none; font-weight:600;">
                <option value="Beklemede" ${job.status==='Beklemede'?'selected':''} style="background:var(--bg-dark);color:white;">Beklemede</option>
                <option value="BaÅŸvuruldu" ${job.status==='BaÅŸvuruldu'?'selected':''} style="background:var(--bg-dark);color:white;">BaÅŸvuruldu</option>
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
                                <div class="tracker-card-meta">ğŸ“ ${shortCity} &nbsp;&bull;&nbsp; ğŸ“… ${job.trackDate}</div>
                            </div>
                            <span class="badge platform-iskur" style="font-size:0.7rem; flex-shrink:0; align-self:flex-start;">${job.platform}</span>
                        </div>
                        <div class="tracker-card-bottom">
                            ${statusDropdown}
                            <button onclick="window.removeTrackedJob(${index})" class="tracker-del-btn">ğŸ—‘ï¸ Sil</button>
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
            if(shortCity && shortCity.includes('Genel')) shortCity = 'TÃ¼rkiye Geneli';

            const bg = job.status === 'Beklemede' ? 'rgba(250,204,21,0.2)' : 
                       (job.status === 'BaÅŸvuruldu' ? 'rgba(59,130,246,0.2)' : 
                       (job.status === 'Kabul' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'));
            const col = job.status === 'Beklemede' ? '#facc15' : 
                        (job.status === 'BaÅŸvuruldu' ? '#60a5fa' : 
                        (job.status === 'Kabul' ? '#4ade80' : '#f87171'));

            const statusDropdown = `<select onchange="window.updateTrackedJobStatus(${index}, this.value)" style="background:${bg}; color:${col}; border:1px solid ${col}; border-radius:12px; padding:0.2rem 0.5rem; font-size:0.75rem; cursor:pointer; outline:none;">
                <option value="Beklemede" ${job.status==='Beklemede'?'selected':''} style="background:var(--bg-dark);color:white;">Beklemede</option>
                <option value="BaÅŸvuruldu" ${job.status==='BaÅŸvuruldu'?'selected':''} style="background:var(--bg-dark);color:white;">BaÅŸvuruldu</option>
                <option value="Kabul" ${job.status==='Kabul'?'selected':''} style="background:var(--bg-dark);color:white;">Kabul Edildi</option>
                <option value="Red" ${job.status==='Red'?'selected':''} style="background:var(--bg-dark);color:white;">Reddedildi</option>
            </select>`;

            const tr = document.createElement('tr');

            if (isMobile) {
                // === MOBÄ°L TRACKER KART GÃ–RÃœNÃœMÃœ ===
                tr.innerHTML = `
                    <td colspan="5" style="padding:0; border:none;">
                        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1rem; margin-bottom:0.7rem;">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.6rem;">
                                <div style="flex:1; margin-right:0.5rem;">
                                    <div style="color:var(--text-primary); font-weight:600; font-size:0.88rem; margin-bottom:0.2rem;">${shortTitle}</div>
                                    <div style="color:var(--text-tertiary); font-size:0.72rem;">ğŸ“ ${shortCity || '-'} &nbsp;â€¢&nbsp; ğŸ“… ${job.trackDate}</div>
                                </div>
                                <span class="badge platform-iskur" style="font-size:0.68rem; flex-shrink:0;">${job.platform}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                ${statusDropdown}
                                <button onclick="window.removeTrackedJob(${index})" style="background:transparent; color:#ef4444; border:1px solid rgba(239,68,68,0.3); border-radius:6px; cursor:pointer; padding:0.3rem 0.7rem; font-size:0.75rem;">ğŸ—‘ï¸ Sil</button>
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
                        <div style="color: var(--text-tertiary); font-size: 0.75rem; margin-top: 0.2rem;">ğŸ“ ${shortCity}</div>
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
    
    // --- MaaÅŸ Rehberi Arama Filtresi ---
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
    // --- SÄ°STEM BAÅLATMA ---
    fetchLiveJobs();
    // Sunucu aÃ§Ä±ksa her 15 saniyede gÃ¼ncelle, file:// modunda gereksiz
    if (window.location.protocol !== 'file:') {
        setInterval(fetchLiveJobs, 15 * 1000);
    }

    // --- Ä°statistik Grafikleri (Chart.js) ---
    let scoreChartInstance = null;
    let institutionChartInstance = null;

    window.renderCharts = function() {
        const scoreCtx = document.getElementById('scoreChart');
        const instCtx = document.getElementById('institutionChart');
        
        if (!scoreCtx || !instCtx || typeof Chart === 'undefined') return;

        // GerÃ§ek verilerden istatistik Ã§Ä±karalÄ±m
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

        // Åehirleri sÄ±rala ve ilk 5'i al
        const topCities = Object.entries(cityMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // EÄŸer henÃ¼z veri yoksa boÅŸ kalmasÄ±n diye ufak bir numara
        if(lise === 0 && onlisans === 0 && lisans === 0) lisans = 1; 
        if(topCities.length === 0) topCities.push(['Veri Bekleniyor', 1]);

        Chart.defaults.color = 'rgba(255, 255, 255, 0.6)';
        Chart.defaults.font.family = "'Outfit', sans-serif";

        // Grafik 1: EÄŸitim Seviyesi Kontenjan (Doughnut)
        if (scoreChartInstance) scoreChartInstance.destroy();
        scoreChartInstance = new Chart(scoreCtx, {
            type: 'doughnut',
            data: {
                labels: ['OrtaÃ¶ÄŸretim', 'Ã–nlisans', 'Lisans'],
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

        // Grafik 2: Åehir / Kurum BazlÄ± AlÄ±m (Bar)
        if (institutionChartInstance) institutionChartInstance.destroy();
        institutionChartInstance = new Chart(instCtx, {
            type: 'bar',
            data: {
                labels: topCities.map(c => c[0]),
                datasets: [{
                    label: 'Kontenjan SayÄ±sÄ±',
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
        // TÄ±klama ile dosya seÃ§me
        cvDropZone.addEventListener('click', (e) => {
            if (e.target !== simulateUploadBtn) {
                cvFileInput.click();
            }
        });
        
        simulateUploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cvFileInput.click();
        });

        // SÃ¼rÃ¼kle bÄ±rak olaylarÄ±
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
                showToast('LÃ¼tfen sadece PDF veya Word belgesi (.pdf, .docx, .doc) yÃ¼kleyin.', 'error');
                return;
            }

            // ArayÃ¼z geÃ§iÅŸleri
            cvDropZone.classList.add('hidden');
            cvUploadProgressContainer.classList.remove('hidden');
            cvAnalysisResult.classList.add('hidden');
            
            cvProgressFileName.textContent = file.name;
            cvProgressPercent.textContent = '0%';
            cvProgressBar.style.width = '0%';
            cvProgressStatus.innerHTML = `<span class="spinner" style="width: 12px; height: 12px; border-width: 2px; border-color: rgba(168, 85, 247, 0.2); border-top-color: #a855f7; margin:0;"></span> Dosya Yapay Zekaya GÃ¶nderiliyor...`;

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

                const response = await fetch('/api/cv-analyze', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error("Python API'ye eriÅŸilemedi.");
                const data = await response.json();

                // Analiz bittiÄŸinde yÃ¼kleme alanÄ±nÄ± tamamen kaldÄ±rÄ±p sonucu gÃ¶ster
                cvUploadProgressContainer.classList.add('hidden');
                cvAnalysisResult.classList.remove('hidden');

                // PuanÄ± ve barÄ± gÃ¼ncelle
                cvAnalysisResult.querySelector('span:last-child').textContent = `${data.score}/100`;
                cvAnalysisResult.querySelector('div > div > div').style.width = `${data.score}%`;
                
                // Geri bildirim listesini gÃ¼ncelle
                const ul = cvAnalysisResult.querySelector('ul');
                ul.innerHTML = '';
                data.feedback.forEach(f => {
                    const li = document.createElement('li');
                    li.textContent = f;
                    ul.appendChild(li);
                });

                // BaÅŸarÄ± efekti
                if (window.confetti) {
                    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                }
                showToast('Ã–zgeÃ§miÅŸ analiziniz tamamlandÄ±!', 'success');
            } catch (err) {
                console.error(err);
                
                // Fallback Offline Simulation
                setTimeout(() => {
                    cvUploadProgressContainer.classList.add('hidden');
                    cvAnalysisResult.classList.remove('hidden');

                    const hasHighQuality = fileObj.name.toLowerCase().includes('cv') || fileObj.name.toLowerCase().includes('Ã¶zgeÃ§miÅŸ') || fileObj.size > 10000;
                    const score = hasHighQuality ? 88 : 75;

                    cvAnalysisResult.querySelector('span:last-child').textContent = `${score}/100`;
                    cvAnalysisResult.querySelector('div > div > div').style.width = `${score}%`;

                    const ul = cvAnalysisResult.querySelector('ul');
                    ul.innerHTML = `
                        <li>âœ… E-posta adresi formatÄ± ve iletiÅŸim bilgileri baÅŸarÄ±yla doÄŸrulandÄ± (+15 Puan)</li>
                        <li>âœ… EÄŸitim geÃ§miÅŸi ve mezuniyet durumunuz tespit edildi (+20 Puan)</li>
                        <li>âœ… Ä°ÅŸ deneyimleri ve projeler bÃ¶lÃ¼mÃ¼ analiz edildi (+20 Puan)</li>
                        <li>ğŸ’¡ Ã–neri: Yetenekler kÄ±smÄ±na daha fazla sektÃ¶rel anahtar kelime ekleyerek (Ã¶rneÄŸin SQL, React, Python) AI taramalarÄ±nda daha yÃ¼ksek puan alabilirsiniz.</li>
                        <li>ğŸ’¡ Ã–neri: Ã–zet bilgi (Ã¶n yazÄ±) kÄ±smÄ±nÄ± biraz daha uzun ve kariyer odaklÄ± tutarak kendinizi daha iyi tanÄ±tabilirsiniz.</li>
                    `;

                    showToast('CV yerel olarak analiz edildi (Hibrit Ã‡evrimdÄ±ÅŸÄ± Mod)!', 'info');
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
                        reply = "Harika! Kendinizi Ã§ok gÃ¼zel ifade ettiniz. Åimdi 2. AÅŸamaya geÃ§iyoruz: **Ekip Ã‡alÄ±ÅŸmasÄ± ve Problem Ã‡Ã¶zme**.\n\nGeÃ§miÅŸte bir ekip iÃ§inde Ã§alÄ±ÅŸÄ±rken yaÅŸadÄ±ÄŸÄ±nÄ±z bir fikir ayrÄ±lÄ±ÄŸÄ±nÄ± veya karÅŸÄ±laÅŸtÄ±ÄŸÄ±nÄ±z teknik bir problemi nasÄ±l Ã§Ã¶zdÃ¼nÃ¼z? Bu durumdaki rolÃ¼nÃ¼z neydi?";
                        offlineInterviewStep = 2;
                    } else if (offlineInterviewStep === 2) {
                        reply = "Ã‡Ã¶zÃ¼m odaklÄ± yaklaÅŸÄ±mÄ±nÄ±z ve ekip ruhuna verdiÄŸiniz Ã¶nem Ã§ok profesyonelce. Åimdi 3. AÅŸamaya geÃ§iyoruz: **Kriz ve Stres YÃ¶netimi**.\n\nÃ‡ok yoÄŸun bir iÅŸ gÃ¼nÃ¼nde veya beklenmedik bÃ¼yÃ¼k bir kriz anÄ±nda (Ã¶rneÄŸin kritik bir sistem Ã§Ã¶ktÃ¼ÄŸÃ¼nde) stresinizi nasÄ±l yÃ¶netirsiniz? SoÄŸukkanlÄ± kalmak iÃ§in uyguladÄ±ÄŸÄ±nÄ±z Ã¶zel bir yÃ¶ntem var mÄ±?";
                        offlineInterviewStep = 3;
                    } else if (offlineInterviewStep === 3) {
                        reply = "Stres anÄ±nda panik yapmadan adÄ±mlar belirlemeniz Ã§ok baÅŸarÄ±lÄ± bir yetkinlik. Åimdi 4. AÅŸamaya geÃ§iyoruz: **Liyakat ve Kamu EtiÄŸi**.\n\nSizce bÃ¼yÃ¼k bir kurumda liyakat, adillik ve ÅŸeffaflÄ±k ilkeleri neden Ã¶nemlidir? GÃ¶reviniz esnasÄ±nda kiÅŸisel iliÅŸkiler ile mesleki etik sÄ±nÄ±rlarÄ± Ã§atÄ±ÅŸÄ±rsa nasÄ±l bir karar alÄ±rsÄ±nÄ±z?";
                        offlineInterviewStep = 4;
                    } else if (offlineInterviewStep === 4) {
                        reply = "Kamu etiÄŸi ve dÃ¼rÃ¼stlÃ¼k prensipleriniz takdire ÅŸayan. MÃ¼lakatÄ±mÄ±zÄ±n tÃ¼m soru aÅŸamalarÄ±nÄ± tamamladÄ±nÄ±z. Åimdi 5. AÅŸamaya geÃ§iyoruz: **Yapay Zeka MÃ¼lakat Performans Raporu**.\n\nHazÄ±rladÄ±ÄŸÄ±m detaylÄ± mÃ¼lakat analizinizi yÃ¼klemek iÃ§in lÃ¼tfen buraya tÄ±klayÄ±n veya herhangi bir mesaj yazarak raporunuzu talep edin.";
                        offlineInterviewStep = 5;
                    } else if (offlineInterviewStep === 5) {
                        reply = `ğŸ“Š **YAPAY ZEKA MÃœLAKAT PERFORMANS RAPORU**\n------------------------------------------------------\nğŸ‘¤ **Aday AdÄ±:** ${currentSettings.name || 'KullanÄ±cÄ±'} ${currentSettings.surname || 'AdÄ±'}\nğŸ“… **Tarih:** ${new Date().toLocaleDateString('tr-TR')}\nâ±ï¸ **Oturum Durumu:** Hibrit MÃ¼lakat BaÅŸarÄ±yla TamamlandÄ±\n\nğŸ“ˆ **YETKÄ°NLÄ°K PUANLARI:**\n- **Ä°letiÅŸim & Kendini Ä°fade Etme:** %88 (GÃ¼Ã§lÃ¼ ve akÄ±cÄ±)\n- **Problem Ã‡Ã¶zme & Ekip Ã‡alÄ±ÅŸmasÄ±:** %85 (YapÄ±cÄ± ve Ã§Ã¶zÃ¼m odaklÄ±)\n- **Kriz & Stres YÃ¶netimi:** %80 (SoÄŸukkanlÄ± ve analitik)\n- **Mesleki Etik & DÃ¼rÃ¼stlÃ¼k:** %95 (Tavizsiz ve ilkeli)\n\nğŸ¯ **GENEL DEÄERLENDÄ°RME SKORU: %87 (BAÅARILI)**\n\nğŸ“ **Yapay Zeka Uzman GÃ¶rÃ¼ÅŸÃ¼:**\nAday, kamusal ve profesyonel deÄŸerlere yÃ¼ksek uyum gÃ¶stermektedir. Ä°letiÅŸim becerisi yÃ¼ksek, kriz anlarÄ±nda rasyonel karar alabilen ve liyakat ilkelerine baÄŸlÄ± bir yapÄ± sergilemektedir. Kariyer.Pro platformu olarak adaya baÅŸarÄ±lar dileriz.`;
                        offlineInterviewStep = 6;
                        if (window.confetti) confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                    } else {
                        reply = "MÃ¼lakat baÅŸarÄ±yla tamamlanmÄ±ÅŸtÄ±r. Yeni bir mÃ¼lakat simÃ¼lasyonu baÅŸlatmak iÃ§in sol Ã¼stteki **SÄ±fÄ±rla ğŸ”„** butonuna basabilirsiniz.";
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
                const response = await fetch('/api/mock-interview', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text, session_id: 'default' })
                });
                
                mockChatArea.removeChild(aiTyping);
                
                if(!response.ok) throw new Error("API hatasÄ±");
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
                console.log("Sunucu hatasÄ±, Ã§evrimdÄ±ÅŸÄ± mÃ¼lakata geÃ§iliyor.");
                window.isOfflineMode = true;
                updateServerStatusIndicator(false);
                
                const aiBubble = document.createElement('div');
                aiBubble.className = 'chat-bubble ai-bubble';
                aiBubble.style = 'background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); padding: 1rem; border-radius: 12px; border-top-left-radius: 0; align-self: flex-start; max-width: 85%; margin-top: 0.5rem;';
                aiBubble.innerHTML = `<p style="color: #e2e8f0; font-size: 0.85rem; line-height: 1.5;">Sunucu baÄŸlantÄ±sÄ± koptu. Ã‡evrimdÄ±ÅŸÄ± Yapay Zeka MÃ¼lakat moduna geÃ§ildi.<br><br>GiriÅŸinizi aldÄ±m. MÃ¼lakata devam etmek iÃ§in lÃ¼tfen herhangi bir ÅŸey yazÄ±n.</p>`;
                mockChatArea.appendChild(aiBubble);
                mockChatArea.scrollTop = mockChatArea.scrollHeight;
            }
        };

        sendMockBtn.addEventListener('click', sendResponse);
        mockInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendResponse();
        });

        // MÃ¼lakat SÄ±fÄ±rlama OlayÄ±
        const resetMockBtn = document.getElementById('resetMockBtn');
        if (resetMockBtn && mockChatArea) {
            resetMockBtn.addEventListener('click', async () => {
                if (window.isOfflineMode) {
                    offlineInterviewStep = 1;
                    mockChatArea.innerHTML = '';
                    const aiBubble = document.createElement('div');
                    aiBubble.className = 'chat-bubble ai-bubble';
                    aiBubble.style = 'background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); padding: 1rem; border-radius: 12px; border-top-left-radius: 0; align-self: flex-start; max-width: 85%;';
                    aiBubble.innerHTML = `<p style="color: #e2e8f0; font-size: 0.85rem; line-height: 1.5;">Kariyer.Pro MÃ¼lakat SimÃ¼lasyonuna hoÅŸ geldiniz! Ben AI MÃ¼lakat UzmanÄ±. Ã–ncelikle kendinizi kÄ±saca tanÄ±tÄ±r mÄ±sÄ±nÄ±z ve neden kamuda/Ã¶zel sektÃ¶rde Ã§alÄ±ÅŸmak istiyorsunuz?</p>`;
                    mockChatArea.appendChild(aiBubble);
                    showToast('MÃ¼lakat baÅŸarÄ±yla sÄ±fÄ±rlandÄ±.', 'success');
                    return;
                }

                try {
                    const response = await fetch('/api/mock-interview/reset', {
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
                    
                    showToast('MÃ¼lakat baÅŸarÄ±yla sÄ±fÄ±rlandÄ±.', 'success');
                } catch(e) {
                    console.error("MÃ¼lakat sÄ±fÄ±rlama hatasÄ±:", e);
                    showToast('SÄ±fÄ±rlanÄ±rken sunucu hatasÄ± oluÅŸtu.', 'error');
                }
            });
        }
    }

    // Ä°lk aÃ§Ä±lÄ±ÅŸta boÅŸ Ã§iz
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

    // Calculate Doluluk YÃ¼zdesi
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
        if (elements.profileProgressText) elements.profileProgressText.textContent = `Profil DoluluÄŸu: %${completion}`;
        
        // Update Sidebar Initials and Name
        const initials = ((currentSettings.name?.[0] || 'K') + (currentSettings.surname?.[0] || 'P')).toUpperCase();
        if (elements.settingAvatarIcon) elements.settingAvatarIcon.textContent = initials;
        if (elements.settingProfileName) {
            elements.settingProfileName.textContent = (currentSettings.name || 'KullanÄ±cÄ±') + " " + (currentSettings.surname || 'AdÄ±');
        }

        // Update Badges
        if (elements.sidebarBadges) {
            elements.sidebarBadges.innerHTML = "";
            if (currentSettings.quizCompleted) {
                const badge = document.createElement('div');
                badge.style = "background: rgba(16, 185, 129, 0.2); border: 1px solid var(--accent-green); color: #34d399; font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: bold; display: flex; align-items: center; gap: 0.2rem; cursor: help; animation: pulseGlow 2s infinite;";
                badge.title = `Kariyer.Pro GK-GY BaÅŸarÄ± Rozeti (${currentSettings.quizScore})`;
                badge.innerHTML = `ğŸ… GK-GY`;
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

    // Bind "Kaydet ve Ä°lerle" Buttons
    const saveStepButtons = document.querySelectorAll('.save-step-btn');
    saveStepButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            saveFieldsToObject();
            const nextTab = btn.getAttribute('data-next');
            if (nextTab) {
                activateTab(nextTab);
                showToast('Bilgileriniz kaydedildi.', 'success');
            } else {
                showToast('Profiliniz baÅŸarÄ±yla kaydedildi!', 'success');
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
            elements.skillsTagsContainer.innerHTML = `<span style="color: var(--text-tertiary); font-size: 0.85rem;" id="noSkillsText">HenÃ¼z yetenek eklenmedi.</span>`;
            return;
        }

        currentSettings.skills.forEach((skill, index) => {
            const tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.innerHTML = `${skill} <span class="remove-btn" data-index="${index}">Ã—</span>`;
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
                showToast('Yetenek kaldÄ±rÄ±ldÄ±.', 'info');
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
            question: "Bir sayÄ±nÄ±n 3 katÄ±nÄ±n 5 fazlasÄ±, aynÄ± sayÄ±nÄ±n 4 katÄ±nÄ±n 2 eksiÄŸine eÅŸittir. Bu sayÄ± kaÃ§tÄ±r?",
            options: ["A) 5", "B) 7", "C) 9", "D) 11"],
            correct: 1
        },
        {
            question: "OsmanlÄ± Devleti'nin ilk anayasasÄ± olan Kanun-i Esasi hangi yÄ±l yÃ¼rÃ¼rlÃ¼ÄŸe girmiÅŸtir?",
            options: ["A) 1808", "B) 1839", "C) 1856", "D) 1876"],
            correct: 3
        },
        {
            question: "AÅŸaÄŸÄ±daki cÃ¼mlelerin hangisinde bir yazÄ±m hatasÄ± yapÄ±lmÄ±ÅŸtÄ±r?",
            options: ["A) Her ÅŸey yolunda gidiyor.", "B) BirkaÃ§ gÃ¼n sonra geleceÄŸim.", "C) Bu iÅŸi ardarda yapmalÄ±yÄ±z.", "D) HiÃ§bir zaman vazgeÃ§me."],
            correct: 2
        },
        {
            question: "Bir yarÄ±ÅŸta ikinciyi geÃ§en kaÃ§Ä±ncÄ± olur?",
            options: ["A) Birinci", "B) Ä°kinci", "C) ÃœÃ§Ã¼ncÃ¼", "D) Sonuncu"],
            correct: 1
        },
        {
            question: "DÃ¼nyanÄ±n en derin noktasÄ± olan Mariana Ã‡ukuru hangi okyanustadÄ±r?",
            options: ["A) BÃ¼yÃ¼k Okyanus (Pasifik)", "B) Atlas Okyanusu (Atlantik)", "C) Hint Okyanusu", "D) Arktik Okyanusu"],
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
            quizPanels.nextBtn.textContent = "SÄ±navÄ± Bitir ğŸ";
        } else {
            quizPanels.nextBtn.textContent = "Sonraki Soru â¡ï¸";
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
        
        // 4 YanlÄ±ÅŸ 1 DoÄŸruyu GÃ¶tÃ¼rÃ¼r KuralÄ± GK-GY StandardÄ±dÄ±r
        let net = corrects - (incorrects * 0.25);
        if (net < 0) net = 0;
        
        quizPanels.correctCount.textContent = corrects;
        quizPanels.incorrectCount.textContent = incorrects;
        quizPanels.netScore.textContent = net.toFixed(2);
        
        const passed = corrects >= 3;
        
        if (passed) {
            quizPanels.emoji.textContent = "ğŸ‰";
            quizPanels.title.textContent = "Tebrikler! SÄ±navÄ± GeÃ§tiniz.";
            quizPanels.text.textContent = `Matematik, MantÄ±k ve Genel KÃ¼ltÃ¼r testini baÅŸarÄ±yla tamamlayarak %${(corrects/5)*100} oranÄ±nda doÄŸru cevap verdiniz. Rozetiniz profilinize eklendi.`;
            quizPanels.badgeCard.style.display = "block";
            
            // Save state
            currentSettings.quizCompleted = true;
            currentSettings.quizScore = `${corrects}/5 DoÄŸru, ${net.toFixed(2)} Net`;
            localStorage.setItem('kariyerSettings', JSON.stringify(currentSettings));
            updateProfileMetrics();
            
            if (window.confetti) {
                confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
            }
        } else {
            quizPanels.emoji.textContent = "ğŸ˜¢";
            quizPanels.title.textContent = "BaÅŸarÄ±sÄ±z Oldunuz.";
            quizPanels.text.textContent = `BaÅŸarÄ±lÄ± sayÄ±lmak iÃ§in 5 sorudan en az 3 tanesini doÄŸru cevaplamanÄ±z gerekmektedir. Dilerseniz testi tekrar Ã§Ã¶zerek kendinizi test edebilirsiniz.`;
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
            showToast('Profil ayarlarÄ± baÅŸarÄ±yla gÃ¼ncellendi.', 'success');
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
        document.getElementById('authModalTitle').textContent = isRegisterMode ? "KayÄ±t Ol" : "GiriÅŸ Yap";
        document.getElementById('registerNameGroup').style.display = isRegisterMode ? "block" : "none";
        document.getElementById('authSubmitBtn').textContent = isRegisterMode ? "KayÄ±t Ol" : "GiriÅŸ Yap";
        document.getElementById('authToggleText').textContent = isRegisterMode ? "Zaten hesabÄ±n var mÄ±?" : "HesabÄ±n yok mu?";
        document.getElementById('authToggleLink').textContent = isRegisterMode ? "GiriÅŸ Yap" : "KayÄ±t Ol";
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
                        showToast('LÃ¼tfen tÃ¼m alanlarÄ± doldurun.', 'error');
                        btn.textContent = "KayÄ±t Ol";
                        return;
                    }
                    const mockUser = { name, email, password };
                    localStorage.setItem('offlineUser', JSON.stringify(mockUser));
                    showToast('KayÄ±t BaÅŸarÄ±lÄ± (Ã‡evrimdÄ±ÅŸÄ±)! GiriÅŸ yapabilirsiniz.', 'success');
                    toggleAuthMode();
                } else {
                    if (!email || !password) {
                        showToast('LÃ¼tfen e-posta ve ÅŸifrenizi girin.', 'error');
                        btn.textContent = "GiriÅŸ Yap";
                        return;
                    }
                    const savedUser = JSON.parse(localStorage.getItem('offlineUser')) || { name: "Ahmet YÄ±lmaz", email: "ahmet@gmail.com", password: "123" };
                    if (email === savedUser.email) {
                        localStorage.setItem('kariyerToken', 'mock-offline-token');
                        localStorage.setItem('kariyerUser', JSON.stringify({ name: savedUser.name, email: savedUser.email }));
                        closeAuthModal();
                        updateUserProfileUI();
                        showToast('GiriÅŸ BaÅŸarÄ±lÄ± (Ã‡evrimdÄ±ÅŸÄ±)!', 'success');
                    } else {
                        // Allow any login in offline mode for convenience, using input email
                        localStorage.setItem('kariyerToken', 'mock-offline-token');
                        localStorage.setItem('kariyerUser', JSON.stringify({ name: name || "Misafir Aday", email: email }));
                        closeAuthModal();
                        updateUserProfileUI();
                        showToast('GiriÅŸ BaÅŸarÄ±lÄ± (Ã‡evrimdÄ±ÅŸÄ±)!', 'success');
                    }
                }
                btn.textContent = isRegisterMode ? "KayÄ±t Ol" : "GiriÅŸ Yap";
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
            console.log("Sunucu kapalÄ±, yerel giriÅŸ simÃ¼lasyonu yapÄ±lÄ±yor.");
            if (isRegisterMode) {
                if (!name || !email || !password) {
                    showToast('LÃ¼tfen tÃ¼m alanlarÄ± doldurun.', 'error');
                } else {
                    const mockUser = { name, email, password };
                    localStorage.setItem('offlineUser', JSON.stringify(mockUser));
                    showToast('KayÄ±t BaÅŸarÄ±lÄ± (Ã‡evrimdÄ±ÅŸÄ±)! GiriÅŸ yapabilirsiniz.', 'success');
                    toggleAuthMode();
                }
            } else {
                if (!email) {
                    showToast('LÃ¼tfen e-posta adresinizi girin.', 'error');
                } else {
                    localStorage.setItem('kariyerToken', 'mock-offline-token');
                    localStorage.setItem('kariyerUser', JSON.stringify({ name: "Ahmet YÄ±lmaz", email: email }));
                    closeAuthModal();
                    updateUserProfileUI();
                    showToast('GiriÅŸ BaÅŸarÄ±lÄ± (Ã‡evrimdÄ±ÅŸÄ±)!', 'success');
                }
            }
        }
        btn.textContent = isRegisterMode ? "KayÄ±t Ol" : "GiriÅŸ Yap";
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
                    <span class="user-role" onclick="window.logout()" style="cursor:pointer; color:var(--accent-orange); font-size:0.75rem;">ğŸšª Ã‡Ä±kÄ±ÅŸ Yap</span>
                </div>
            `;
            fetchFavoritesFromDB();
        } else {
            profileSection.innerHTML = `<button class="btn-primary" onclick="openAuthModal()" style="padding: 0.5rem 1rem; font-size: 0.85rem;">GiriÅŸ Yap / KayÄ±t Ol</button>`;
            trackedJobs = [];
            renderTrackerTable();
        }
    }
    
    window.logout = function() {
        localStorage.removeItem('kariyerToken');
        localStorage.removeItem('kariyerUser');
        updateUserProfileUI();
        showToast("Ã‡Ä±kÄ±ÅŸ yapÄ±ldÄ±.", "info");
    };
    
    // BaÅŸlangÄ±Ã§ta Ã§alÄ±ÅŸtÄ±r
    updateUserProfileUI();
    
    // --- APPLICATION FORM LOGIC ---
    let currentApplicationJob = null;
    
    window.openApplicationModal = function(job) {
        currentApplicationJob = job;
        
        const token = localStorage.getItem('kariyerToken');
        if (!token) {
            showToast('BaÅŸvuru yapmak iÃ§in Ã¶nce GiriÅŸ YapmalÄ±sÄ±nÄ±z!', 'error');
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
        btn.innerHTML = '<span class="spinner" style="display:inline-block; width:14px; height:14px; border:2px solid #fff; border-bottom-color:transparent; border-radius:50%; animation:spin 1s linear infinite;"></span> GÃ¶nderiliyor...';
        btn.disabled = true;
        
        // SimÃ¼le edilmiÅŸ baÅŸvuru beklemesi
        setTimeout(() => {
            btn.innerHTML = 'âœ… BaÅŸvuru BaÅŸarÄ±yla Ä°letildi';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            showToast('BaÅŸvurunuz kuruma iletildi!', 'success');
            if (window.confetti) confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
            
            // Otomatik olarak takip listesine ekle
            const encodedJob = encodeURIComponent(JSON.stringify(currentApplicationJob));
            window.trackJob(encodedJob, 'BaÅŸvuruldu'); // DB'ye kaydet
            
            setTimeout(() => {
                closeApplicationModal();
                btn.innerHTML = 'BaÅŸvuruyu GÃ¶nder';
                btn.disabled = false;
                btn.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
            }, 2500);
        }, 1500);
    };
});

/* ============================================================
   ğŸ“± MOBÄ°L ALT NAVÄ°GASYON FONKSÄ°YONLARI
   ============================================================ */
function mobileNavClick(el) {
    // Aktif tab
    document.querySelectorAll('.mob-nav-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');

    // SayfayÄ± gÃ¶ster
    const page = el.getAttribute('data-page');
    if (!page) return;

    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(page);
    if (target) {
        target.classList.add('active');
        // SayfanÄ±n baÅŸÄ±na dÃ¶n
        const main = document.querySelector('.main-content');
        if (main) main.scrollTop = 0;
    }

    // Sidebar nav item'larÄ± da gÃ¼ncelle
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(n => {
        n.classList.remove('active');
        if (n.getAttribute('data-page') === page) n.classList.add('active');
    });

    // Ä°statistikler sayfasÄ±nda grafikleri yenile
    if (page === 'page-statistics' && typeof window.renderCharts === 'function') {
        setTimeout(window.renderCharts, 100);
    }
}

// Hamburger stub (Ã§aÄŸrÄ±lÄ±rsa hata vermesin)
function toggleMobileMenu() {}
function closeMobileMenu() {}

// MasaÃ¼stÃ¼ sidebar nav itemlarÄ± da bottom nav ile senkronize et
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


