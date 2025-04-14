import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api'; // Import Telegram Bot API


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Allow cross-origin requests
app.use(cors());

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));


const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
bot.setWebHook(`${process.env.NGROK_URL}/webhook`);


app.get('/', (req, res) => {
    res.send('Welcome to Telegram Bot API');
});

app.get('/mini-app', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'mini-app.html'));
});

app.post('/webhook', (req, res) => {
    const update = req.body; // Telegram update data
    console.log( update);

    if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text;

        

        if (text === '/start') {
            bot.sendMessage(chatId, 'Welcome to the mini app!', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Launch Mini App',
                                web_app: {
                                    url: `${process.env.NGROK_URL}/mini-app`
                                }
                            }
                        ]
                    ]
                }
            });
        }
    }

    res.sendStatus(200); // Respond to Telegram webhook
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
    if (err) console.error(`Error starting server: ${err}`);

    console.log(`Server is running on port ${PORT}`);
}
);