import React from 'react'
import { FaCheckCircle, FaTimesCircle, FaClock as FaClockIcon, FaHourglassHalf, FaCalendarAlt, FaClock, FaUsers, FaChair } from "react-icons/fa";

const STATUS_CONFIG = {
    pending: {
        label: "Booking Pending",
        bg: "bg-yellow-500",
        icon: FaHourglassHalf,
        message: "Your reservation is pending confirmation. We'll notify you once it's approved."
    },
    confirmed: {
        label: "Booking Confirmed",
        bg: "bg-green-600",
        icon: FaCheckCircle,
        message: "Thank you for your reservation. Here are your booking details:"
    },
    waiting: {
        label: "Booking Waiting",
        bg: "bg-orange-500",
        icon: FaClockIcon,
        message: "You're on the waiting list. We'll let you know as soon as a table opens up."
    },
    completed: {
        label: "Booking Completed",
        bg: "bg-blue-600",
        icon: FaCheckCircle,
        message: "Thank you for dining with us! We hope you had a great experience."
    },
    cancelled: {
        label: "Booking Cancelled",
        bg: "bg-red-600",
        icon: FaTimesCircle,
        message: "We're sorry to inform you that your reservation has been cancelled."
    }
}

const BookingConfirmationEmail = ({ bookingData }) => {

    const data = bookingData || {
        fullName: "",
        date: "",
        time: "",
        partySize: "",
        tableRef: "",
        status: "confirmed"
    }

    const statusKey = (data.status || "confirmed").toLowerCase();
    const config = STATUS_CONFIG[statusKey] || STATUS_CONFIG.confirmed;
    const StatusIcon = config.icon;
    const isCancelled = statusKey === "cancelled";

    return (
        <div className='max-w-md mx-auto bg-white rounded-2xl shadow-lg
    border border-gray-100 overflow-hidden font-sans'>

            {/* header */}
            <div className={`${config.bg} text-white text-center py-6 px-4`}>
                <StatusIcon className='text-4xl mx-auto mb-2' />
                <h1 className='text-xl font-bold'>
                    {config.label}
                </h1>
            </div>

            {/* body */}
            <div className='p-6'>

                <p className='text-gray-700 mb-4'>
                    Hi <span className='font-bold'>{data.fullName}</span>
                </p>

                <p className='text-gray-600 text-sm mb-6'>
                    {config.message}
                </p>

                {/* detail card */}
                <div className='bg-gray-50 rounded-xl p-4 space-y-3'>

                    <div className='flex item-center gap-3'>
                        <FaCalendarAlt className='text-red-600' />
                        <span className='tex-sm text-gray-500'>Date:</span>
                        <span className='ml-auto font-semibold text-gray-800'>{data.date}</span>
                    </div>

                    <div className='flex items-center gap-3'>
                        <FaClock className='text-red-600' />
                        <span className='text-sm text-gray-500'>Time:</span>
                        <span className='ml-auto font-semibold text-gray-800'>{data.time}</span>
                    </div>

                    <div className='flex items-center gap-3'>
                        <FaUsers className='text-red-600' />
                        <span className='text-sm text-gray-500'>Party Size:</span>
                        <span className='ml-auto font-semibold text-gray-800'>{data.partySize}</span>
                    </div>

                    <div className='flex items-center gap-3'>
                        <FaChair className='text-red-600' />
                        <span className='text-sm text-gray-500'>Table:</span>
                        <span className='ml-auto font-semibold text-gray-800'>{data.tableRef}</span>
                    </div>

                </div>

                {!isCancelled && (
                    <p className='text-center text-gray-600 text-sm mt-6'>
                        We look forward to serving you
                    </p>
                )}

            </div>

            {/* Footer */}
            <div className='bg-gray-50 text-center py-4 text-xs text-gray-400'>
                This is an automated {statusKey} email.
            </div>

        </div>
    )
}

export default BookingConfirmationEmail