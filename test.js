const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const iconv = require('iconv-lite');

async function testScrape() {
    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        const url = 'https://ilan.memurlar.net/';
        
        const response = await axios.get(url, {
            httpsAgent: agent,
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        
        const data = iconv.decode(response.data, 'iso-8859-9'); // Memurlar.net uses iso-8859-9 often
        const $ = cheerio.load(data);
        const ilanlar = [];
        
        $('.ilan-listesi .ilan-item, .ilan-list tbody tr, .Title, a').each((i, el) => {
            const text = $(el).text().replace(/\s+/g, ' ').trim();
            if(text && text.length > 20 && text.toLowerCase().includes('personel')) {
                 ilanlar.push(text);
            }
        });
        
        console.log("Found:", ilanlar.length);
        console.log(ilanlar.slice(0, 5));
    } catch (e) {
        console.error("Error:", e.message);
    }
}

testScrape();
