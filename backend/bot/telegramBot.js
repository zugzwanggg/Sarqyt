import axios from "axios";
import TelegramBot from "node-telegram-bot-api";

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN || '';

export function initBot() {
  const bot = new TelegramBot(TG_BOT_TOKEN, { polling: true });

  // Command: /start
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      `Hello Zigger! 👋\nWelcome to our Telegram Mini App bot.`
    );

    
    bot.sendMessage(msg.chat.id, "Open the Mini App:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Open App",
              web_app: { url: "https://sarqyt-frontend.vercel.app" }
            }
          ]
        ]
      }
    });
  });

  console.log("Telegram Bot started");
  return bot;
}

export async function sendTelegramMessage(chatId, text) {
  if (!chatId) return;
  try {
    await axios.post(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    });
  } catch (err) {
    console.error("Error sending Telegram message:", err.message);
  }
}