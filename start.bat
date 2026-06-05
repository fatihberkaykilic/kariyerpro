@echo off
title Kariyer Dashboard Baslatici
echo ======================================================
echo Kariyer Dashboard Uygulamasi Baslatiliyor...
echo Lutfen bekleyin...
echo ======================================================

echo [1/3] Node.js Canli Veri Sunucusu baslatiliyor...
start "Node Server" cmd /k "node server.js"

echo [2/3] Python Bagimliliklari ve AI Sunucusu baslatiliyor...
start "Python AI Server" cmd /k "pip install flask flask-cors beautifulsoup4 requests pypdf python-docx && python ai_engine.py"

echo [3/3] Tarayici aciliyor...
timeout /t 3 >nul
start http://localhost:3000

echo.
echo Islem tamam! Bu siyah pencereyi kapatabilirsiniz.
exit
