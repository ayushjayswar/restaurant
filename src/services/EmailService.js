import emailjs from "@emailjs/browser";
import { notifyOwner, buildOwnerMessage } from "./Telegramnotify";

const SERVICE_ID = "manu_project2";
const RESERVATION_TEMPLATE_ID = "manu_project2";

// Contact form wala EmailJS template ID (dashboard > Email Templates se copy karke yahan daalo)
// Khali chhodoge toh contact message sirf owner ko Telegram par jaayega (customer ko email nahi)
const CONTACT_TEMPLATE_ID = "";

const PUBLIC_KEY = "leo2_XGg1E-aR4lBo";


// --------------------------------------------------
// COMMON RESERVATION DATA
// --------------------------------------------------

const getReservationParams = (formData, extra = {}) => ({
  // Normal table reservation
  locationLabel: "Table",

  date:
    formData.date ?? "",

  time:
    formData.time ?? "",

  partySize:
    formData.partySize ??
    formData.guests ??
    "",

  tableRef:
    formData.tableRef ??
    (formData.table_number
      ? `Table ${formData.table_number}`
      : ""),

  fullName:
    formData.fullName ??
    formData.name ??
    "",

  phone:
    formData.phone ??
    "-",

  email:
    formData.email ??
    formData.user_email ??
    "",

  feedback:
    formData.feedback ??
    formData.message ??
    "",

  submittedAt:
    new Date().toLocaleString(),

  status:
    formData.status ??
    "",

  tableNumber:
    formData.table_number ??
    formData.tableNumber ??
    "",

  waitingPosition:
    formData.waiting_position ??
    formData.waitingPosition ??
    "",

  ...extra,
});


// --------------------------------------------------
// NORMAL TABLE RESERVATION
// Customer ko email + owner ko Telegram
// --------------------------------------------------

export const sendReservation = async (formData) => {
  const baseParams = getReservationParams(formData);

  // Owner ko Telegram notification
  notifyOwner(
    buildOwnerMessage(
      "🆕 New Table Booking",
      baseParams,
      baseParams.feedback
    )
  );

  // Customer email
  return emailjs.send(
    SERVICE_ID,
    RESERVATION_TEMPLATE_ID,
    {
      ...baseParams,
      to_email: formData.email,
    },
    PUBLIC_KEY
  );
};


// --------------------------------------------------
// NEW TABLE RESERVATION REQUEST (PENDING)
// Customer ko "request received" mail + owner ko Telegram
// Confirmed/Waiting/Cancelled mail admin ke status badalne par jaati hai
// --------------------------------------------------

export const sendReservationRequest = async (formData) => {
  const baseParams = getReservationParams(formData, {
    statusColor: "#eab308",
    statusIcon: "⏳",
    statusTitle: "Booking Request Received",
    statusMessage:
      "We have received your table reservation request. It is pending confirmation, and we'll email you once it's approved.",
    status: "RESERVATION PENDING",
    tableNumber: "Not assigned",
    waitingPosition: "N/A",
    footerMessage: "We'll update you shortly.",
  });

  // Owner ko Telegram notification
  notifyOwner(
    buildOwnerMessage(
      "🆕 NEW TABLE BOOKING REQUEST (Pending)",
      baseParams,
      baseParams.feedback
    )
  );

  // Customer ko "request received" email
  return emailjs.send(
    SERVICE_ID,
    RESERVATION_TEMPLATE_ID,
    {
      ...baseParams,
      to_email: baseParams.email,
    },
    PUBLIC_KEY
  );
};


// --------------------------------------------------
// STATUS CONFIG (table reservation)
// --------------------------------------------------

const getStatusConfig = (
  status,
  { tableNumber, waitingPosition }
) => {
  const key = String(status || "confirmed").toLowerCase();

  const configs = {
    pending: {
      statusColor: "#eab308",
      statusIcon: "⏳",
      statusTitle: "Booking Pending",
      statusMessage:
        "Your reservation is pending confirmation. We'll notify you once it's approved.",
      statusText: "RESERVATION PENDING",
      feedbackMessage:
        "Your reservation is pending confirmation. We'll notify you once it's approved.",
      footerMessage: "We'll update you shortly.",
    },

    confirmed: {
      statusColor: "#16a34a",
      statusIcon: "✔",
      statusTitle: "Booking Confirmed",
      statusMessage: `Thank you for your reservation. Your booking is confirmed. Your table number is ${
        tableNumber || "assigned by restaurant"
      }.`,
      statusText: "RESERVATION CONFIRMED",
      feedbackMessage: `Your reservation is confirmed. Your table number is ${
        tableNumber || "assigned by restaurant"
      }.`,
      footerMessage: "We look forward to serving you!",
    },

    waiting: {
      statusColor: "#f97316",
      statusIcon: "!",
      statusTitle: "Waiting List",
      statusMessage: `Your reservation is currently on the waiting list. Your waiting position is ${
        waitingPosition || "pending"
      }.`,
      statusText: "WAITING LIST",
      feedbackMessage: `Your reservation is currently on the waiting list. Waiting position: ${
        waitingPosition || "pending"
      }. We will contact you automatically when a table becomes available.`,
      footerMessage:
        "We will contact you automatically when a table becomes available.",
    },

    completed: {
      statusColor: "#2563eb",
      statusIcon: "✔",
      statusTitle: "Booking Completed",
      statusMessage:
        "Thank you for dining with us! We hope you had a great experience.",
      statusText: "RESERVATION COMPLETED",
      feedbackMessage:
        "Thank you for dining with us! We hope you had a great experience.",
      footerMessage: "Hope to see you again soon!",
    },

    cancelled: {
      statusColor: "#dc2626",
      statusIcon: "✕",
      statusTitle: "Booking Cancelled",
      statusMessage:
        "We're sorry to inform you that your reservation has been cancelled.",
      statusText: "RESERVATION CANCELLED",
      feedbackMessage:
        "Your reservation has been cancelled. If this was a mistake, please contact us.",
      footerMessage: "If this was a mistake, please contact us.",
    },
  };

  return configs[key] || configs.confirmed;
};


// --------------------------------------------------
// TABLE RESERVATION STATUS EMAIL
// Admin status badalta hai tab ye call hoga
// Customer ko email + owner ko Telegram
// --------------------------------------------------

export const sendReservationStatusEmail = async (reservation) => {
  const tableNumber =
    reservation.table_number ??
    reservation.tableNumber ??
    "";

  const waitingPosition =
    reservation.waiting_position ??
    reservation.waitingPosition ??
    "";

  const config = getStatusConfig(reservation.status, {
    tableNumber,
    waitingPosition,
  });

  const isWaiting =
    String(reservation.status || "").toLowerCase() === "waiting";

  const baseParams = getReservationParams(reservation, {
    statusColor: config.statusColor,
    statusIcon: config.statusIcon,
    statusTitle: config.statusTitle,
    statusMessage: config.statusMessage,
    status: config.statusText,

    tableNumber: tableNumber || "Not assigned",

    waitingPosition: isWaiting ? (waitingPosition || "N/A") : "N/A",

    feedback: config.feedbackMessage,
    footerMessage: config.footerMessage,
  });

  // Owner ko Telegram notification
  notifyOwner(
    buildOwnerMessage(
      `${config.statusIcon} ${config.statusText}`,
      baseParams
    )
  );

  // Customer ko status email
  return emailjs.send(
    SERVICE_ID,
    RESERVATION_TEMPLATE_ID,
    {
      ...baseParams,
      to_email: reservation.email,
    },
    PUBLIC_KEY
  );
};


// --------------------------------------------------
// WAITING LIST → CONFIRMED
// --------------------------------------------------

export const sendReservationPromotionEmail = async (reservation) => {
  const tableNumber =
    reservation.table_number ??
    reservation.tableNumber ??
    "";

  const baseParams = getReservationParams(reservation, {
    statusColor: "#16a34a",
    statusIcon: "✔",
    statusTitle: "Booking Confirmed",

    statusMessage:
      "Good news! A table has become available and your waiting-list reservation has now been confirmed.",

    status: "RESERVATION CONFIRMED FROM WAITING LIST",

    tableNumber: tableNumber || "Assigned",

    waitingPosition: "Confirmed",

    feedback: `Good news! A table has become available and your waiting-list reservation has now been confirmed. Your table number is ${
      tableNumber || "assigned by restaurant"
    }.`,

    footerMessage: "We look forward to serving you!",
  });

  // Owner ko Telegram notification
  notifyOwner(
    buildOwnerMessage(
      "✔ WAITING LIST → CONFIRMED",
      baseParams
    )
  );

  // Customer email
  return emailjs.send(
    SERVICE_ID,
    RESERVATION_TEMPLATE_ID,
    {
      ...baseParams,
      to_email: reservation.email,
    },
    PUBLIC_KEY
  );
};


// --------------------------------------------------
// ROOM BOOKING (naya booking)
//
// Flow:
// Customer books → PENDING mail customer ko + Telegram owner ko
// Admin confirm/cancel kare → sendRoomStatusEmail() (customer ko confirmed/cancelled mail)
// --------------------------------------------------

export const sendRoomBooking = async (formData) => {
  const baseParams = {
    locationLabel: "Room",

    fullName: formData.name,

    date: formData.date,

    time: formData.time,

    partySize: formData.guests,

    tableRef: formData.roomName,

    feedback: `Room: ${formData.roomName} (${formData.roomPrice})`,

    phone: "-",

    email: formData.email,

    submittedAt: new Date().toLocaleString(),

    // Abhi booking PENDING hai (confirmed nahi)
    statusColor: "#eab308",
    statusIcon: "⏳",
    statusTitle: "Booking Request Received",
    statusMessage:
      "We have received your room booking request. It is pending confirmation, and we'll email you once it's approved.",
    status: "ROOM BOOKING PENDING",
    footerMessage: "We'll update you shortly.",
  };

  // Owner ko Telegram notification
  notifyOwner(
    buildOwnerMessage(
      "🛏 NEW ROOM BOOKING REQUEST (Pending)",
      baseParams,
      baseParams.feedback
    )
  );

  // Customer ko "request received" (pending) email
  return emailjs.send(
    SERVICE_ID,
    RESERVATION_TEMPLATE_ID,
    {
      ...baseParams,
      to_email: formData.email,
    },
    PUBLIC_KEY
  );
};


// --------------------------------------------------
// ROOM STATUS CONFIG
// --------------------------------------------------

const ROOM_STATUS_CONFIG = {
  pending: {
    statusColor: "#eab308",
    statusIcon: "⏳",
    statusTitle: "Booking Pending",
    statusMessage:
      "Your room booking is pending confirmation. We'll notify you once it's approved.",
    statusText: "ROOM BOOKING PENDING",
    footerMessage: "We'll update you shortly.",
  },

  confirmed: {
    statusColor: "#16a34a",
    statusIcon: "✔",
    statusTitle: "Booking Confirmed",
    statusMessage: "Your room booking has been confirmed.",
    statusText: "ROOM BOOKING CONFIRMED",
    footerMessage: "We look forward to serving you!",
  },

  waiting: {
    statusColor: "#f97316",
    statusIcon: "!",
    statusTitle: "Waiting List",
    statusMessage:
      "Your room booking is currently on the waiting list. We'll contact you as soon as a room becomes available.",
    statusText: "ROOM BOOKING WAITING LIST",
    footerMessage: "We'll contact you if a room becomes available.",
  },

  completed: {
    statusColor: "#2563eb",
    statusIcon: "✔",
    statusTitle: "Stay Completed",
    statusMessage:
      "Thank you for staying with us! We hope you had a great experience.",
    statusText: "ROOM STAY COMPLETED",
    footerMessage: "Hope to see you again soon!",
  },

  cancelled: {
    statusColor: "#dc2626",
    statusIcon: "✕",
    statusTitle: "Booking Cancelled",
    statusMessage:
      "We're sorry to inform you that your room booking has been cancelled.",
    statusText: "ROOM BOOKING CANCELLED",
    footerMessage: "If this was a mistake, please contact us.",
  },
};


// --------------------------------------------------
// ROOM STATUS EMAIL
// Admin room booking ko Confirm / Cancel / Complete kare tab call karo
// Example: sendRoomStatusEmail({ ...booking, status: "confirmed" })
// Customer ko email + owner ko Telegram
// --------------------------------------------------

export const sendRoomStatusEmail = async (booking) => {
  // Status na mile toh pending maano (galti se confirmed mail na jaye)
  const key = String(booking.status || "pending").toLowerCase();
  const config = ROOM_STATUS_CONFIG[key] || ROOM_STATUS_CONFIG.pending;

  const roomName =
    booking.roomName ??
    booking.room_name ??
    booking.room?.name ??
    "";

  const roomPrice =
    booking.roomPrice ??
    booking.total_amount ??
    "";

  const checkIn = String(booking.check_in ?? "");

  const baseParams = {
    locationLabel: "Room",

    fullName:
      booking.name ??
      booking.fullName ??
      "Guest",

    date:
      booking.date ??
      checkIn.split(/[ T]/)[0] ??
      "",

    time:
      booking.time ??
      checkIn.split(/[ T]/)[1] ??
      "",

    partySize:
      booking.guests ??
      "",

    tableRef: roomName,

    feedback: roomPrice
      ? `Room: ${roomName} (${roomPrice})`
      : `Room: ${roomName}`,

    phone: "-",

    email:
      booking.email ??
      booking.user_email ??
      "",

    submittedAt: new Date().toLocaleString(),

    statusColor: config.statusColor,
    statusIcon: config.statusIcon,
    statusTitle: config.statusTitle,
    statusMessage: config.statusMessage,
    status: config.statusText,
    footerMessage: config.footerMessage,
  };

  // Owner ko Telegram notification
  notifyOwner(
    buildOwnerMessage(
      `${config.statusIcon} ${config.statusText}`,
      baseParams,
      baseParams.feedback
    )
  );

  // Customer ko email
  return emailjs.send(
    SERVICE_ID,
    RESERVATION_TEMPLATE_ID,
    {
      ...baseParams,
      to_email: baseParams.email,
    },
    PUBLIC_KEY
  );
};


// --------------------------------------------------
// CONTACT FORM EMAIL
// Customer ko confirmation email + owner ko Telegram (poora message)
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

  // Owner ko Telegram notification
  notifyOwner(
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

  // Template ID nahi daala toh email skip (Telegram phir bhi chala gaya)
  if (!CONTACT_TEMPLATE_ID) {
    return { skipped: true };
  }

  // Customer email
  return emailjs.send(
    SERVICE_ID,
    CONTACT_TEMPLATE_ID,
    {
      fullName: name,
      fullname: name,
      name,

      email,
      user_email: email,

      subject,
      message,

      submittedAt: new Date().toLocaleString(),

      to_email: email,
    },
    PUBLIC_KEY
  );
};