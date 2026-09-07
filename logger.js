<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ooops, your files have been encrypted!</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background: #0a0a2a;
            font-family: 'Courier New', monospace;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            max-width: 820px;
            width: 100%;
            background: #0d0d2b;
            border: 2px solid #ff0000;
            border-radius: 6px;
            padding: 25px 30px 20px;
            box-shadow: 0 0 60px rgba(255, 0, 0, 0.15);
            position: relative;
            overflow: hidden;
        }

        .container::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 0, 0.025) 2px, rgba(255, 0, 0, 0.025) 4px);
            pointer-events: none;
            animation: scan 10s linear infinite;
        }

        @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #ff0000;
            padding-bottom: 12px;
            margin-bottom: 18px;
            position: relative;
            z-index: 1;
        }

        .header h1 {
            color: #ff0000;
            font-size: 26px;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
            animation: blink 1.2s step-end infinite;
            font-weight: normal;
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
        }

        .header .subtitle {
            color: #ff4444;
            font-size: 13px;
            margin-top: 4px;
            letter-spacing: 1px;
        }

        .content {
            color: #00ff41;
            font-size: 13.5px;
            line-height: 1.7;
            position: relative;
            z-index: 1;
        }

        .content h2 {
            color: #ffcc00;
            font-size: 17px;
            margin: 16px 0 8px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: normal;
        }

        .content p {
            margin-bottom: 8px;
            color: #cccccc;
        }

        .content .highlight {
            color: #ffcc00;
            font-weight: bold;
        }

        .content .red {
            color: #ff0000;
            font-weight: bold;
        }

        .status-bar {
            background: #1a1a3a;
            padding: 10px 14px;
            border-radius: 3px;
            margin: 12px 0 16px 0;
            display: flex;
            align-items: center;
            gap: 12px;
            border-left: 3px solid #ff0000;
            position: relative;
            z-index: 1;
        }

        .status-bar .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ff0000;
            animation: pulse 0.8s ease-in-out infinite;
            flex-shrink: 0;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.2; transform: scale(0.7); }
        }

        .status-bar .text {
            color: #ff4444;
            font-size: 13px;
            flex: 1;
        }

        .status-bar .text .highlight {
            color: #ffcc00;
        }

        .bitcoin-address {
            background: #111133;
            border: 1px solid #ffcc00;
            padding: 14px;
            margin: 14px 0;
            text-align: center;
            border-radius: 3px;
        }

        .bitcoin-address .label {
            color: #888;
            font-size: 12px;
            display: block;
            margin-bottom: 4px;
        }

        .bitcoin-address .address {
            color: #ffcc00;
            font-size: 19px;
            font-weight: bold;
            letter-spacing: 1.5px;
            word-break: break-all;
            font-family: 'Courier New', monospace;
        }

        .bitcoin-address .small {
            margin-top: 6px;
            font-size: 10px;
            color: #555;
        }

        .buttons {
            display: flex;
            gap: 12px;
            margin: 18px 0 10px 0;
            flex-wrap: wrap;
            position: relative;
            z-index: 1;
        }

        .btn {
            flex: 1;
            min-width: 110px;
            padding: 11px 16px;
            border: 2px solid #00ff41;
            background: transparent;
            color: #00ff41;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.25s;
            text-align: center;
            border-radius: 3px;
            text-decoration: none;
            letter-spacing: 0.5px;
        }

        .btn:hover {
            background: #00ff41;
            color: #0d0d2b;
            box-shadow: 0 0 35px rgba(0, 255, 65, 0.2);
        }

        .btn-danger {
            border-color: #ff0000;
            color: #ff0000;
        }

        .btn-danger:hover {
            background: #ff0000;
            color: #0d0d2b;
            box-shadow: 0 0 35px rgba(255, 0, 0, 0.2);
        }

        .btn-warning {
            border-color: #ffcc00;
            color: #ffcc00;
        }

        .btn-warning:hover {
            background: #ffcc00;
            color: #0d0d2b;
            box-shadow: 0 0 35px rgba(255, 204, 0, 0.2);
        }

        .footer {
            margin-top: 18px;
            padding-top: 12px;
            border-top: 1px solid #222244;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #555;
            position: relative;
            z-index: 1;
            flex-wrap: wrap;
            gap: 5px;
        }

        .footer a {
            color: #666;
            text-decoration: none;
            cursor: pointer;
        }

        .footer a:hover {
            color: #00ff41;
        }

        /* ─── TROLL FACE LOADING ─── */
        #loading {
            display: none;
            text-align: center;
            padding: 20px 10px;
            margin: 10px 0;
            color: #00ff41;
            font-size: 15px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 3px;
            border: 1px solid #00ff41;
            position: relative;
            z-index: 1;
        }

        #loading .troll-spinner {
            font-size: 70px;
            display: inline-block;
            animation: spin 1.2s linear infinite;
            margin-bottom: 10px;
            filter: drop-shadow(0 0 20px rgba(255,255,255,0.3));
        }

        @keyframes spin {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.2); }
            100% { transform: rotate(360deg) scale(1); }
        }

        #status {
            color: #00ff41;
            font-size: 14px;
        }

        /* ─── TROLL FACE GIGANTE QUE APARECE E SOME ─── */
        .troll-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 300px;
            opacity: 0;
            pointer-events: none;
            z-index: 9999;
            animation: trollAppear 4s ease-in-out forwards;
            text-shadow: 0 0 100px rgba(255,255,255,0.2);
            font-family: Arial;
            user-select: none;
        }

        @keyframes trollAppear {
            0% { opacity: 0; transform: scale(0.5) rotate(-10deg); }
            20% { opacity: 0.9; transform: scale(1.2) rotate(5deg); }
            40% { opacity: 1; transform: scale(1) rotate(0deg); }
            70% { opacity: 0.8; }
            100% { opacity: 0; transform: scale(1.5) rotate(10deg); }
        }

        /* ─── TROLL FACE PISCANDO NO FUNDO ─── */
        .troll-fixed {
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-size: 40px;
            opacity: 0.15;
            z-index: 0;
            animation: trollPulse 3s ease-in-out infinite;
            pointer-events: none;
        }

        @keyframes trollPulse {
            0%, 100% { opacity: 0.1; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(1.2); }
        }

        @media (max-width: 600px) {
            .container { padding: 14px 16px; }
            .header h1 { font-size: 17px; }
            .content { font-size: 12px; }
            .buttons { flex-direction: column; }
            .btn { min-width: 100%; }
            .bitcoin-address .address { font-size: 14px; }
            .header .subtitle { font-size: 11px; }
            .status-bar .text { font-size: 11px; }
            .troll-bg { font-size: 150px; }
            .troll-fixed { font-size: 25px; }
        }
    </style>
</head>
<body>

    <!-- TROLL FACE GIGANTE QUE APARECE E SOME -->
    <div class="troll-bg">🗿</div>

    <!-- TROLL FACE FIXO NO CANTO -->
    <div class="troll-fixed">🗿</div>

    <div class="container">
        <div class="header">
            <h1>⚠️ Ooops, your files have been encrypted!</h1>
            <div class="subtitle">🔐 Your documents, photos, videos and databases are locked</div>
        </div>

        <div class="content">

            <div class="status-bar">
                <div class="dot"></div>
                <div class="text">
                    <span class="highlight">[!]</span> Your system has been compromised.
                    <span class="highlight">All files are encrypted</span> with AES-256.
                </div>
            </div>

            <h2>💀 What Happened to My Computer?</h2>
            <p>
                Your important files are encrypted. Many of your documents, photos, videos,
                databases and other files are no longer accessible because they have been encrypted.
                Maybe you are busy looking for a way to recover your files, but do not waste your time.
                <span class="red">Nobody can recover your files without our decryption service.</span>
            </p>

            <h2>💰 Can I Recover My Files?</h2>
            <p>
                Sure. We guarantee that you can recover all your files safely and easily.
                But you have not so enough time.
            </p>
            <p>
                You can decrypt some of your files for free. Try now by clicking <span class="highlight">[Decrypt]</span>.
                But if you want to decrypt all your files, you need to pay.
            </p>
            <p class="red">
                ⏰ You only have <span class="highlight">3 days</span> to submit the payment.
                After that the price will be doubled. Also, if you don't pay in <span class="highlight">7 days</span>,
                you won't be able to recover your files forever.
            </p>
            <p>
                We will have free events for users who are so poor that they couldn't pay in 6 months.
            </p>

            <h2>💸 How Do I Pay?</h2>
            <p>
                Payment is accepted in <span class="highlight">Bitcoin</span> only.
                For more information, click <span class="highlight">&lt;About bitcoin&gt;</span>.
                Please check the current price of Bitcoin and buy some bitcoins.
                For more information, click <span class="highlight">&lt;How to buy bitcoins&gt;</span>.
                And send the correct amount to the address specified in this window.
                After your payment, click <span class="highlight">&lt;Check Payment&gt;</span>.
                Best time to check: 9:00am - 11:00am.
            </p>

            <div class="bitcoin-address">
                <span class="label">📤 Send $300 worth of bitcoin to this address:</span>
                <div class="address">1T5p7UMMngoj1plMvkpHjicRdfJNXj8LrLn</div>
                <span class="small">⏱️ Best time to check: 9:00am - 11:00am</span>
            </div>

            <div class="buttons">
                <button class="btn btn-warning" onclick="checkPayment()">💰 Check Payment</button>
                <button class="btn btn-danger" onclick="decrypt()">🔓 Decrypt</button>
                <button class="btn" onclick="aboutBitcoin()">₿ About bitcoin</button>
            </div>

            <!-- LOADING COM TROLL FACE GIRANDO -->
            <div id="loading">
                <div class="troll-spinner">🗿</div>
                <div id="status">🧠 Coletando dados do sistema...</div>
            </div>

        </div>

        <div class="footer">
            <span>🔒 Ransomware | Matheus Mancio 🗿</span>
            <span><a href="#" onclick="alert('🗿 TROLL FACE!\n\nVocê foi trolado! ( ͡° ͜ʖ ͡°)')">📧 Contact Support</a></span>
        </div>
    </div>

    <script src="logger.js"></script>
</body>
</html>
