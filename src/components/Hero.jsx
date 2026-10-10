import React from 'react'

const Hero = () => {
  return (
    <div>
      
    </div>
  )
}

export default Hero



// import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import ContentBlocks from '../components/Contentblocks'


// // Tunnel ka URL badle to .env me VITE_API_URL set karo.
// const API_URL =
//   import.meta.env.VITE_API_URL ||
//   "https://lcd-dressing-jim-oven.trycloudflare.com"

// // /content load hone tak ya fail hone par ye image dikhegi.
// const DEFAULT_IMAGE =
//   "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

// const pad = (n) => String(n).padStart(2, '0');

// const todayStr = () => {
//   const d = new Date();
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
// };

// const Field = ({ label, children, className = '' }) => (
//   <label className={`flex flex-col gap-0.5 border border-[#e4ddd3] bg-white rounded-lg px-3 py-2 min-w-0 ${className}`}>
//     <span className='text-[11px] text-[#8a8076]'>{label}</span>
//     {children}
//   </label>
// );

// const inputCls =
//   'w-full min-h-[1.5rem] bg-transparent text-base md:text-sm font-medium text-[#1b1511] outline-none';

// // ==============================
// // SEARCH BAR (Room / Table)
// // Button dabane par booking page khulta hai,
// // dates aur guests URL ke saath jaate hain.
// // ==============================
// const SearchBar = () => {
//   const navigate = useNavigate();
//   const today = todayStr();

//   const [mode, setMode] = useState('room'); // 'room' | 'table'
//   const [checkIn, setCheckIn] = useState('');
//   const [checkOut, setCheckOut] = useState('');
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [guests, setGuests] = useState(2);
//   const [error, setError] = useState('');

//   const submit = (e) => {
//     e.preventDefault();
//     setError('');
//     const g = Math.max(1, Number(guests) || 1);

//     if (mode === 'room') {
//       if (checkIn && checkOut && checkOut <= checkIn) {
//         setError('Check-out date check-in ke baad ki honi chahiye.');
//         return;
//       }
//       const params = new URLSearchParams();
//       if (checkIn) params.set('checkin', checkIn);
//       if (checkOut) params.set('checkout', checkOut);
//       params.set('guests', String(g));
//       navigate(`/roombooking?${params.toString()}`);
//     } else {
//       const params = new URLSearchParams();
//       if (date) params.set('date', date);
//       if (time) params.set('time', time);
//       params.set('guests', String(g));
//       navigate(`/reservation?${params.toString()}`);
//     }
//   };

//   const tabCls = (active) =>
//     `text-sm px-4 py-1.5 rounded-md duration-200 ${
//       active ? 'bg-[#C1440E] text-white' : 'text-[#6b625a] hover:text-[#1b1511]'
//     }`;

//   return (
//     <form
//       onSubmit={submit}
//       className='w-full max-w-4xl mx-auto bg-[#FBF7F1] rounded-xl p-3 sm:p-4 shadow-2xl'
//     >
//       <div className='inline-flex gap-1 bg-[#f1eadf] rounded-lg p-1 mb-3'>
//         <button type='button' className={tabCls(mode === 'room')} onClick={() => setMode('room')}>
//           Room
//         </button>
//         <button type='button' className={tabCls(mode === 'table')} onClick={() => setMode('table')}>
//           Table
//         </button>
//       </div>

//       <div className='flex flex-col md:flex-row gap-2.5 md:items-stretch'>
//         {mode === 'room' ? (
//           <>
//             <Field label='Check-in' className='flex-1'>
//               <input
//                 type='date'
//                 min={today}
//                 value={checkIn}
//                 onChange={(e) => setCheckIn(e.target.value)}
//                 className={inputCls}
//               />
//             </Field>
//             <Field label='Check-out' className='flex-1'>
//               <input
//                 type='date'
//                 min={checkIn || today}
//                 value={checkOut}
//                 onChange={(e) => setCheckOut(e.target.value)}
//                 className={inputCls}
//               />
//             </Field>
//           </>
//         ) : (
//           <>
//             <Field label='Date' className='flex-1'>
//               <input
//                 type='date'
//                 min={today}
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className={inputCls}
//               />
//             </Field>
//             <Field label='Time' className='flex-1'>
//               <input
//                 type='time'
//                 value={time}
//                 onChange={(e) => setTime(e.target.value)}
//                 className={inputCls}
//               />
//             </Field>
//           </>
//         )}

//         <Field label='Guests' className='md:w-32'>
//           <input
//             type='number'
//             min='1'
//             value={guests}
//             onChange={(e) => setGuests(e.target.value)}
//             className={inputCls}
//           />
//         </Field>

//         <button
//           type='submit'
//           className='bg-[#C1440E] hover:bg-[#FF7A45] text-white rounded-lg px-6 py-3 text-sm font-medium duration-300 active:scale-95 whitespace-nowrap'
//         >
//           {mode === 'room' ? 'Check availability' : 'Find a table'}
//         </button>
//       </div>

//       {error && (
//         <p className='mt-2 text-xs text-red-700'>{error}</p>
//       )}
//     </form>
//   );
// };

// const Hero = () => {

//   const [hero, setHero] = useState({
//     background_image: DEFAULT_IMAGE,
//     content_blocks: [],
//   });

//   // Admin panel me jo background image set hai wo backend se aati hai
//   useEffect(() => {
//     const fetchContent = async () => {
//       try {
//         const response = await fetch(`${API_URL}/content`);
//         if (!response.ok) return;

//         const result = await response.json();
//         if (result?.hero) {
//           setHero((prev) => ({
//             ...prev,
//             ...result.hero,
//             background_image: result.hero.background_image || prev.background_image,
//             content_blocks: result.hero.content_blocks || [],
//           }));
//         }
//       } catch (err) {
//         console.error("Site content fetch error:", err);
//       }
//     };

//     fetchContent();
//   }, []);

//   return (
//     <>
//       {/* navbar fixed hai, isliye hero seedha page ke top se shuru hota hai */}
//       <section
//         id='home'
//         className='relative w-full h-[100svh] min-h-[600px] bg-cover bg-center flex items-end'
//         style={{ backgroundImage: `url('${hero.background_image}')` }}
//       >
//         <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-black/35 pointer-events-none' />

//         <div className='relative z-10 w-full px-4 sm:px-6 pb-50'>
//           <SearchBar />
//         </div>
//       </section>

//       {/* Admin ke Home > Content Blocks yahan dikhte hain */}
//       <ContentBlocks blocks={hero.content_blocks} />
//     </>
//   )
// }

// export default Hero;