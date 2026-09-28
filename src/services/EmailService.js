// ==================================================
// EmailService.js  (FRONTEND - slim version)
//
// Ab customer ke emails (pending / confirmed / waiting /
// cancelled / completed) aur owner ke Telegram alerts
// BACKEND (FastAPI + SMTP) se automatically jaate hain.
//
// Isliye niche ke functions ab kuch nahi bhejte - inhe
// sirf isliye rakha hai taaki purane pages (Reservation,
// Room Booking, Admin) jo inhe import/call karte hain
// unme koi error na aaye aur double email na jaye.
//
// Sirf Contact form ka Telegram alert abhi yahin se jaata hai.
// ==================================================

import { notifyOwner } from "./Telegramnotify";

const handledByBackend = async () => ({
  skipped: true,
  reason: "Email is sent by the backend",
});


// --------------------------------------------------
// BACKEND HANDLES THESE NOW (no-op)
// --------------------------------------------------

export const sendReservation = handledByBackend;
export const sendReservationRequest = handledByBackend;
export const sendReservationStatusEmail = handledByBackend;
export const sendReservationPromotionEmail = handledByBackend;
export const sendRoomBooking = handledByBackend;
export const sendRoomStatusEmail = handledByBackend;


// --------------------------------------------------
// CONTACT FORM
// Owner ko Telegram (poora message).
// Telegram fail ho toh bhi form crash nahi hoga.
// --------------------------------------------------

export const sendContactEmail = async (formData) => {
  const name =
    formData.fullname ??
    formData.fullName ??
    formData.name ??
    "";

  const email = formData.email ?? "";
  const subject = formData.subject ?? "";
  const message = formData.message ?? "";

  try {
    await notifyOwner(
      [
        "📩 New Contact Message",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        `Message: ${String(message).slice(0, 1500)}`,
      ].join("\n")
    );
  } catch (error) {
    console.error("Telegram notification failed:", error);
  }

  return { skipped: true };
};