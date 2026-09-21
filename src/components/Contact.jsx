import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLocationArrow, FaPhoneAlt } from "react-icons/fa";
import { MdEmail, MdTimer } from "react-icons/md";
import InputField from './InputField';
import Textarea from "../components/Textarea";
import { sendContactEmail } from '../services/emailService';

const Contact = () => {

    const navigate = useNavigate();
    const { requireAuth } = useAuth();

    const [FormData, setFormData] = useState({
        fullname: '',
        email: '',
        message: '',
        subject: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Login check - agar user login nahi hai to yahi rok denge
        if (!requireAuth(navigate)) return;

        if (!FormData.fullname || !FormData.email || !FormData.subject || !FormData.message) {
            alert("Please fill all infomation");
            return;
        }

        setLoading(true);

        sendContactEmail(FormData)
            .then(() => {
                alert('Message sent successfully!');
                setFormData({
                    fullname: '',
                    email: '',
                    message: '',
                    subject: ''
                })
            })
            .catch((err) => {
                console.error(err);
                alert('Failed to send. Try again.');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div
            id='contact'
            className=' required relative py-15 bg-cover bg-center bg-no-repeat'
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1621293954908-907159247fc8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWwlMjByZWNlcHRpb258ZW58MHx8MHx8fDA%3D')"
            }}
        >

            {/* Main Content */}
            <div className='relative z-10 container mx-auto px-4 sm:px-6'>

                {/* Heading */}
                <div className='text-center mb-12'>

                    <h1 className='text-3xl sm:text-4xl text-black font-bold mb-4 underline underline-offset-4 decoration-red-600'>
                        Let's Talk
                    </h1>

                    <p className='font-bold text-black'>
                        We'd love to hear from you
                    </p>

                </div>


                <div className='flex flex-col md:flex-row items-center justify-between gap-10'>


                    {/* ================= LEFT SIDE ================= */}

                    <div className='w-full md:w-1/2 bg-white rounded-2xl shadow-2xl'>

                        <div className='w-full p-6 sm:p-8'>

                            <h1 className='text-2xl font-bold text-gray-700 mb-8'>
                                Get in Touch
                            </h1>


                            {/* Address */}
                            <div className='flex items-center gap-6 mb-6'>

                                <div className='w-12 h-12 shrink-0 bg-red-600 text-white rounded-full flex items-center justify-center'>
                                    <FaLocationArrow />
                                </div>

                                <div>
                                    <p className='text-base sm:text-xl text-black font-semibold'>
                                        Address
                                    </p>

                                    <p className='text-base sm:text-xl text-black font-semibold'>
                                        Adarsh Colony
                                    </p>
                                </div>

                            </div>


                            {/* Phone */}
                            <div className='flex items-center gap-6 mb-6'>

                                <div className='w-12 h-12 shrink-0 bg-red-600 text-white rounded-full flex items-center justify-center'>
                                    <FaPhoneAlt />
                                </div>

                                <div>
                                    <p className='text-base sm:text-xl text-black font-semibold'>
                                        Phone
                                    </p>

                                    <p className='text-base sm:text-xl text-black font-semibold'>
                                        1234567890
                                    </p>
                                </div>

                            </div>


                            {/* Email */}
                            <div className='flex items-center gap-6 mb-6'>

                                <div className='w-12 h-12 shrink-0 bg-red-600 text-white rounded-full flex items-center justify-center'>
                                    <MdEmail />
                                </div>

                                <div>
                                    <p className='text-base sm:text-xl text-black font-semibold'>
                                        Email
                                    </p>

                                    <p className='text-base sm:text-xl text-black font-semibold break-all'>
                                        Ayush@gmail.com
                                    </p>
                                </div>

                            </div>


                            {/* Time */}
                            <div className='flex items-start gap-6 mb-6'>

                                <div className='w-12 h-12 shrink-0 bg-red-600 text-white rounded-full flex items-center justify-center'>
                                    <MdTimer />
                                </div>

                                <div>

                                    <p className='text-base sm:text-xl text-black font-semibold'>
                                        Time
                                    </p>

                                    <p className='max-w-md text-sm sm:text-base text-black font-semibold leading-6'>
                                        Monday - Thursday: 5:00 PM - 10:00 PM
                                        <br />
                                        Friday - Saturday: 5:00 PM - 11:00 PM
                                        <br />
                                        Sunday: 11:00 AM - 9:00 PM
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ================= RIGHT SIDE ================= */}

                    <div className='w-full md:w-1/2 bg-white rounded-2xl shadow-2xl'>

                        <div className='w-full p-6 sm:p-8'>

                            <h1 className='text-2xl font-bold text-gray-700 mb-6'>
                                Send Message
                            </h1>

                            <form onSubmit={handleSubmit}>

                                {/* Full Name */}
                                <InputField
                                    label={"Full Name"}
                                    name={"fullname"}
                                    value={FormData.fullname}
                                    onChange={handleChange}
                                    placeholder={"Enter your name"}
                                />


                                {/* Email */}
                                <InputField
                                    label={"Email Address"}
                                    name={"email"}
                                    value={FormData.email}
                                    onChange={handleChange}
                                    placeholder={"Enter your email"}
                                />


                                {/* Subject */}
                                <InputField
                                    label={"Subject"}
                                    name={"subject"}
                                    value={FormData.subject}
                                    onChange={handleChange}
                                    placeholder={"Enter your Subject"}
                                />


                                {/* Message */}
                                <Textarea
                                    name={"message"}
                                    label={"Message"}
                                    value={FormData.message}
                                    onChange={handleChange}
                                    placeholder={"Enter message"}
                                />


                                {/* Send Button */}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative overflow-hidden px-8 py-3 rounded-lg bg-red-600 border-2 border-red-700 inline-flex items-center justify-center text-sm font-bold text-black shadow-sm gap-x-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <span className="relative z-10">
                                        {loading ? "Sending..." : "Send"}
                                    </span>
                                    <span className="absolute w-0 h-0 rounded-full bg-green-600 group-hover:w-[300%] group-hover:h-[500%] transition-all duration-700"></span>
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Contact