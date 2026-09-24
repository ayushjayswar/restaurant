// src/services/Telegramnotify.js

// FastAPI backend ka Telegram notification endpoint
const NOTIFY_URL = "http://127.0.0.1:8000/notify";


// Owner ko Telegram notification bhejta hai
export const notifyOwner = async (message) => {
  try {
    const response = await fetch(NOTIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
    });

    // 404 / 500 etc. ko manually handle karna
    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Telegram notification failed: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();

    console.log("✅ Telegram notification sent:", data);

    return data;
  } catch (error) {
    console.error("❌ Telegram notification failed:", error);

    // Telegram fail hone par main booking/contact flow nahi rukega
    return null;
  }
};


// Empty values ko Telegram message se hide karne ke liye
const line = (label, value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const v = String(value).trim();

  if (!v || v === "-" || v === "N/A") {
    return null;
  }

  return `${label}: ${v}`;
};


// Owner ke Telegram ke liye readable message
export const buildOwnerMessage = (title, d, note = "") => {
  return [
    title,
    "",

    line("Name", d.fullName),
    line("Phone", d.phone),
    line("Email", d.email),

    line("Date", d.date),
    line("Time", d.time),
    line("Guests", d.partySize),

    line("Table/Room", d.tableRef),
    line("Table No", d.tableNumber),

    line("Waiting Position", d.waitingPosition),

    line("Note", note),
  ]
    .filter((x) => x !== null)
    .join("\n");
};