import emailjs from '@emailjs/browser';

const SERVICE_ID = 'manu_project2';
const RESERVATION_TEMPLATE_ID = 'manu_project2';
const PUBLIC_KEY = 'leo2_XGg1E-aR4lBo';

const OWNER_EMAIL = 'bgmigaming06012005@gmail.com';

// ================= Table Reservation =================
export const sendReservation = (formData) => {
    const baseParams = {
        date: formData.date,
        time: formData.time,
        partySize: formData.partySize,
        tableRef: formData.tableRef,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        feedback: formData.feedback,
        submittedAt: new Date().toLocaleString(),
    };

    return Promise.all([
        emailjs.send(SERVICE_ID, RESERVATION_TEMPLATE_ID, { ...baseParams, to_email: OWNER_EMAIL }, PUBLIC_KEY),
        emailjs.send(SERVICE_ID, RESERVATION_TEMPLATE_ID, { ...baseParams, to_email: formData.email }, PUBLIC_KEY),
    ]);
};

// ================= Room Booking =================
export const sendRoomBooking = (formData) => {
    const baseParams = {
        fullName: formData.name,
        date: formData.date,
        time: formData.time,
        partySize: formData.guests,          // "Party Size" field reuse kiya guests ke liye
        tableRef: formData.roomName,         // "Table Preference" field reuse kiya room ke naam ke liye
        feedback: `Room: ${formData.roomName} (${formData.roomPrice})`,
        phone: '-',                          // room booking form mai phone field nahi hai
        email: formData.email,
        submittedAt: new Date().toLocaleString(),
    };

    return Promise.all([
        emailjs.send(SERVICE_ID, RESERVATION_TEMPLATE_ID, { ...baseParams, to_email: OWNER_EMAIL }, PUBLIC_KEY),
        emailjs.send(SERVICE_ID, RESERVATION_TEMPLATE_ID, { ...baseParams, to_email: formData.email }, PUBLIC_KEY),
    ]);
};