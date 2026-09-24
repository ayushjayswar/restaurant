import emailjs from "@emailjs/browser";
import { notifyOwner, buildOwnerMessage } from "./Telegramnotify";

const SERVICE_ID = "manu_project2";
const RESERVATION_TEMPLATE_ID = "manu_project2";
const PUBLIC_KEY = "leo2_XGg1E-aR4lBo";


// --------------------------------------------------
// COMMON RESERVATION DATA
// --------------------------------------------------

const getReservationParams = (formData, extra = {}) => ({
  date: formData.date,
  time: formData.time,

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

  submittedAt: new Date().toLocaleString(),

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
// NORMAL RESERVATION
// --------------------------------------------------

export const sendReservation = async (formData) => {

  const baseParams = getReservationParams(formData);

  // Telegram notification
  await notifyOwner(
    buildOwnerMessage(
      "🆕 NEW TABLE BOOKING",
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
// STATUS CONFIG
// --------------------------------------------------

const getStatusConfig = (
  status,
  { tableNumber, waitingPosition }
) => {

  const key =
    String(status || "confirmed").toLowerCase();

  const configs = {

    pending: {
      statusColor: "#eab308",
      statusIcon: "⏳",
      statusTitle: "Booking Pending",

      statusMessage:
        "Your reservation is pending confirmation. We'll notify you once it's approved.",

      statusText:
        "RESERVATION PENDING",

      feedbackMessage:
        "Your reservation is pending confirmation. We'll notify you once it's approved.",

      footerMessage:
        "We'll update you shortly.",
    },

    confirmed: {
      statusColor: "#16a34a",
      statusIcon: "✔",
      statusTitle: "Booking Confirmed",

      statusMessage:
        `Thank you for your reservation. Your booking is confirmed. Your table number is ${
          tableNumber || "assigned by restaurant"
        }.`,

      statusText:
        "RESERVATION CONFIRMED",

      feedbackMessage:
        `Your reservation is confirmed. Your table number is ${
          tableNumber || "assigned by restaurant"
        }.`,

      footerMessage:
        "We look forward to serving you!",
    },

    waiting: {
      statusColor: "#f97316",
      statusIcon: "!",
      statusTitle: "Waiting List",

      statusMessage:
        `Your reservation is currently on the waiting list. Your waiting position is ${
          waitingPosition || "pending"
        }.`,

      statusText:
        "WAITING LIST",

      feedbackMessage:
        `Your reservation is currently on the waiting list. Waiting position: ${
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

      statusText:
        "RESERVATION COMPLETED",

      feedbackMessage:
        "Thank you for dining with us! We hope you had a great experience.",

      footerMessage:
        "Hope to see you again soon!",
    },

    cancelled: {
      statusColor: "#dc2626",
      statusIcon: "✕",
      statusTitle: "Booking Cancelled",

      statusMessage:
        "We're sorry to inform you that your reservation has been cancelled.",

      statusText:
        "RESERVATION CANCELLED",

      feedbackMessage:
        "Your reservation has been cancelled. If this was a mistake, please contact us.",

      footerMessage:
        "If this was a mistake, please contact us.",
    },
  };

  return configs[key] || configs.confirmed;
};


// --------------------------------------------------
// RESERVATION STATUS EMAIL
// --------------------------------------------------

export const sendReservationStatusEmail = async (
  reservation
) => {

  const tableNumber =
    reservation.table_number ??
    reservation.tableNumber ??
    "";

  const waitingPosition =
    reservation.waiting_position ??
    reservation.waitingPosition ??
    "";

  const config = getStatusConfig(
    reservation.status,
    {
      tableNumber,
      waitingPosition,
    }
  );

  const isWaiting =
    String(reservation.status || "").toLowerCase() ===
    "waiting";

  const baseParams = getReservationParams(
    reservation,
    {
      statusColor:
        config.statusColor,

      statusIcon:
        config.statusIcon,

      statusTitle:
        config.statusTitle,

      statusMessage:
        config.statusMessage,

      status:
        config.statusText,

      tableNumber:
        tableNumber || "Not assigned",

      waitingPosition:
        isWaiting
          ? (waitingPosition || "N/A")
          : "N/A",

      feedback:
        config.feedbackMessage,

      footerMessage:
        config.footerMessage,
    }
  );


  // Telegram notification
  await notifyOwner(
    buildOwnerMessage(
      `${config.statusIcon} ${config.statusText}`,
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
// WAITING LIST → CONFIRMED
// --------------------------------------------------

export const sendReservationPromotionEmail = async (
  reservation
) => {

  const tableNumber =
    reservation.table_number ??
    reservation.tableNumber ??
    "";


  const baseParams = getReservationParams(
    reservation,
    {
      statusColor:
        "#16a34a",

      statusIcon:
        "✔",

      statusTitle:
        "Booking Confirmed",

      statusMessage:
        "Good news! A table has become available and your waiting-list reservation has now been confirmed.",

      status:
        "RESERVATION CONFIRMED FROM WAITING LIST",

      tableNumber:
        tableNumber || "Assigned",

      waitingPosition:
        "Confirmed",

      feedback:
        `Good news! A table has become available and your waiting-list reservation has now been confirmed. Your table number is ${
          tableNumber || "assigned by restaurant"
        }.`,

      footerMessage:
        "We look forward to serving you!",
    }
  );


  // Telegram notification
  await notifyOwner(
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
// ROOM BOOKING
// --------------------------------------------------

export const sendRoomBooking = async (
  formData
) => {

  const baseParams = {

    fullName:
      formData.name,

    date:
      formData.date,

    time:
      formData.time,

    partySize:
      formData.guests,

    tableRef:
      formData.roomName,

    feedback:
      `Room: ${formData.roomName} (${formData.roomPrice})`,

    phone:
      "-",

    email:
      formData.email,

    submittedAt:
      new Date().toLocaleString(),

    statusColor:
      "#16a34a",

    statusIcon:
      "✔",

    statusTitle:
      "Booking Confirmed",

    statusMessage:
      "Your room booking has been confirmed.",

    status:
      "ROOM BOOKING CONFIRMED",

    footerMessage:
      "We look forward to serving you!",
  };


  // Telegram notification
  await notifyOwner(
    buildOwnerMessage(
      "🛏 NEW ROOM BOOKING",
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