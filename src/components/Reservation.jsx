import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InputField from "../components/InputField";
import SelectInput from "../components/SelectInput";
import { timeOptions } from "../assets/time";
import { partySizeOptions } from "../assets/PartySize";
import { tableRefOptions } from "../assets/TableRef";
import Textarea from "../components/Textarea";
import BookingModal from '../components/BookingModal';
import { sendReservation } from '../services/Reservation';

const Reservation = () => {

  const navigate = useNavigate();
  const { requireAuth } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    fullName: '',
    phone: '',
    email: '',
    feedback: '',
    time: '',
    partySize: '',
    tableRef: '',
  });

  const [bookingData, setBookingData] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Login check - agar user login nahi hai to yahi rok denge
    if (!requireAuth(navigate)) return;

    setLoading(true);

    sendReservation(formData)
      .then(() => {
        setBookingData(formData);
        setIsModalOpen(true);

        setFormData({
          date: '',
          fullName: '',
          phone: '',
          email: '',
          feedback: '',
          time: '',
          partySize: '',
          tableRef: '',
        });
      })
      .catch((err) => {
        console.error('EmailJS Error:', err);
        alert('Fill the proper information. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      id='reservation'
      className='required relative min-h-screen w-full overflow-hidden py-12 flex items-center justify-center'
    >

      {/* Background Image */}
      <div
        className='absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: "url('https://t3.ftcdn.net/jpg/21/25/01/94/240_F_2125019413_UpeYMTJepysfByG8o4IIRm1RMp5p3W72.jpg')",
          backgroundPosition: 'center 30%'
        }}
      ></div>

      {/* Dark Overlay */}
      <div className='absolute inset-0 bg-black/40'></div>

      {/* Main Content — centered */}
      <div className='relative z-10 container mx-auto px-4 sm:px-6 flex justify-center'>

        <div className='max-w-2xl w-full mx-auto'>

          {/* Heading + Description */}
          <div className='text-center mb-6 bg-black/50 backdrop-blur-md p-5 sm:p-6 rounded-2xl shadow-2xl border border-white/20'>
            <h1 className='text-2xl sm:text-3xl font-bold text-white underline underline-offset-4 decoration-red-500'>
              Make a Reservation
            </h1>
            <div className='mt-2 text-sm text-gray-100 font-medium'>
              Book your table in advance to ensure the best dining experience
            </div>
          </div>

          {/* Reservation Form */}
          <div className='relative bg-white/95 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-white/30'>
            <form onSubmit={handleSubmit}>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>

                <InputField
                  label={"Date"}
                  name={"date"}
                  value={formData.date}
                  onChange={handleChange}
                  type='date'
                />

                <SelectInput
                  label={"Time"}
                  name={"time"}
                  value={formData.time}
                  onChange={handleChange}
                  options={timeOptions}
                />

                <SelectInput
                  label={"Party Size"}
                  name={"partySize"}
                  value={formData.partySize}
                  placeholder={"Enter how many persons"}
                  onChange={handleChange}
                  options={partySizeOptions}
                />

                <SelectInput
                  label={"Table Preference"}
                  name={"tableRef"}
                  value={formData.tableRef}
                  placeholder={"Which table you choose?"}
                  onChange={handleChange}
                  options={tableRefOptions}
                />

                <InputField
                  label={"Full Name"}
                  name={"fullName"}
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={'Enter your full name'}
                  maxLength={50}
                />

                <InputField
                  label={"Phone Number"}
                  type='text'
                  name={"phone"}
                  value={formData.phone}
                  placeholder={'Enter your mobile no'}
                  onChange={handleChange}
                />

                <InputField
                  label={"Email"}
                  type='email'
                  name={"email"}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={'Enter your email id'}
                />

                <Textarea
                  label={"Feedback"}
                  name={"feedback"}
                  value={formData.feedback}
                  onChange={handleChange}
                  placeholder={'Enter your feedback'}
                />

              </div>

              <button
                type='submit'
                disabled={loading}
                className='mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full px-6 py-2.5 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
              >
                {loading ? "Sending..." : "Confirm Reservation"}
              </button>

            </form>

            <BookingModal
              isOpen={isModalOpen}
              onClose={closeModal}
              bookingData={bookingData}
            />

          </div>

        </div>

      </div>

    </div>
  )
}

export default Reservation;