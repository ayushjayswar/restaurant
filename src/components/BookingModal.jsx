import React from 'react'
import { FaCheck } from "react-icons/fa";

const BookingModal = ({ isOpen, onClose, bookingData }) => {
    if (!isOpen || !bookingData) return null;
    return (
        <div className='fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.25s_ease-out]'>
            <div className='bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-lg animate-[popIn_0.35s_cubic-bezier(0.34,1.56,0.64,1)]'>
                <div className='text-center'>
                    <div className='relative w-16 h-16 mx-auto mb-4 flex items-center justify-center'>
                        <span className='absolute inline-flex h-16 w-16 rounded-full bg-green-400 opacity-75 animate-ping'></span>
                        <div className='relative w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
                            <FaCheck
                                className='bg-green-400 text-white h-6 w-6 px-2 py-1 rounded-full animate-[popIn_0.4s_ease-out_0.15s_both]'
                            />
                        </div>
                    </div>
                    <h3 className='text-2xl font-bold text-gray-800 mb-2 animate-[fadeInUp_0.4s_ease-out_0.1s_both]'>
                    Pending — Awaiting Admin Confirmation!
                    </h3>
                    <p className='text-gray-600 mb-6 animate-[fadeInUp_0.4s_ease-out_0.2s_both]'>
                    Your table reservation has been received successfully. We will confirm your reservation shortly!
                    </p>
                    <div className='bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2 animate-[fadeInUp_0.4s_ease-out_0.3s_both]'>
                        <p>
                            <span className='font-semibold'>Date:</span>{' '}
                            {bookingData.date}
                        </p>
                        <p>
                            <span className='font-semibold'>Time:</span>{' '}
                            {bookingData.time}
                        </p>
                        <p>
                            <span className='font-semibold'>Party Size:</span>{' '}
                            {bookingData.partySize}
                        </p>
                        <p>
                            <span className='font-semibold'>Table:</span>{' '}
                            {bookingData.tableRef}
                        </p>
                        <p>
                            <span className='font-semibold'>Full Name:</span>{' '}
                            {bookingData.fullName}
                        </p>
                        <p>
                            <span className='font-semibold'>Phone:</span>{' '}
                            {bookingData.phone}
                        </p>
                        <p>
                            <span className='font-semibold'>Email:</span>{' '}
                            {bookingData.email}
                        </p>
                        <p>
                            <span className='font-semibold'>Feedback:</span>{' '}
                            {bookingData.feedback}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className='bg-red-700 hover:bg-red-800 text-white py-2 px-6 rounded-full transition cursor-pointer animate-[fadeInUp_0.4s_ease-out_0.4s_both]'
                    >
                        Confirmed
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.85); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}

export default BookingModal;