export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { message } = req.body || {};

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    console.log("BOT TOKEN EXISTS:", !!BOT_TOKEN);
    console.log("CHAT ID:", CHAT_ID);
    console.log("MESSAGE:", message);

    if (!BOT_TOKEN) {
      return res.status(500).json({
        success: false,
        message: "TELEGRAM_BOT_TOKEN missing",
      });
    }

    if (!CHAT_ID) {
      return res.status(500).json({
        success: false,
        message: "TELEGRAM_CHAT_ID missing",
      });
    }

    const telegramUrl =
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    console.log("Sending request to Telegram...");

    const telegramResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });

    const telegramData = await telegramResponse.json();

    console.log("Telegram response:", telegramData);

    if (!telegramResponse.ok || !telegramData.ok) {
      return res.status(502).json({
        success: false,
        message: "Telegram API failed",
        telegram: telegramData,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Telegram notification sent",
    });

  } catch (error) {
    console.error("Notify error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}