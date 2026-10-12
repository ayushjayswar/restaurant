import { useEffect, useRef, useState } from 'react';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';
import { sendRoomBooking } from '../services/EmailService';
import useRooms from './Userooms';

const pad = (n) => String(n).padStart(2, '0');

// "2026-10-10" -> "2026-10-11"
const nextDay = (dateStr) => {
  const dt = new Date(`${dateStr}T00:00`);
  dt.setDate(dt.getDate() + 1);
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
};

const inputClass =
  'bg-[#17110D] border border-white/10 text-[#F4EFE6] px-3 py-2.5 rounded-[3px] text-[0.95rem] focus:outline-none focus:border-[#FF7A45]';

export default function RoomBooking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { requireAuth, user, authFetch } = useAuth();
  const { rooms, loading, error: roomsError } = useRooms();

  const stampRef = useRef(null);
  const confirmRef = useRef(null);
  const keepOutDate = useRef(false); // true sirf tab jab Home search bar se check-out date aayi ho

  const [form, setForm] = useState({
    name: '',
    email: '',
    date: '',     // check-in date
    time: '',     // check-in time
    outDate: '',  // check-out date
    outTime: '',  // check-out time
    guests: '',
    roomsCount: 1,
    room: '',
    stayType: 'night', // 'night' | 'day' | 'daynight'
  });
  const [status, setStatus] = useState('idle'); // idle | sending | reserved
  const [error, setError] = useState('');

  // Logged-in user ka email form mein pehle se bhar do (user badal sakta hai)
  useEffect(() => {
    if (user?.email) {
      setForm((f) => (f.email ? f : { ...f, email: user.email }));
    }
  }, [user]);

  // Home search bar se aaye dates / guests pehle se bhar do
  useEffect(() => {
    const ci = searchParams.get('checkin');
    const co = searchParams.get('checkout');
    const g = searchParams.get('guests');
    if (!ci && !co && !g) return;
    if (co) keepOutDate.current = true;
    setForm((f) => ({
      ...f,
      date: ci || f.date,
      outDate: co || f.outDate,
      guests: g || f.guests,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rooms aane par room chuno: URL ka ?room=ID mile to wahi, nahi to pehla room
  useEffect(() => {
    if (rooms.length === 0) return;

    const wanted = searchParams.get('room');
    const match = rooms.find((r) => String(r.id) === String(wanted));

    setForm((f) => {
      if (f.room && rooms.some((r) => String(r.id) === String(f.room))) return f;
      return { ...f, room: String((match || rooms[0]).id) };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms]);

  // Check-in choose karte hi check-out agle din usi time par auto-fill hota hai.
  // User chahe to check-out date/time baad mein edit kar sakta hai.
  useEffect(() => {
    if (!form.date) return;
    setForm((f) => ({
      ...f,
      outDate:
        keepOutDate.current && f.outDate && f.outDate > f.date
          ? f.outDate
          : nextDay(f.date),
      outTime: f.time || f.outTime,
    }));
  }, [form.date, form.time]);

  const selectedRoom = rooms.find((r) => String(r.id) === String(form.room));
  const currentPrice =
    form.stayType === 'night'
      ? selectedRoom?.nightPrice
      : form.stayType === 'day'
      ? selectedRoom?.dayPrice
      : selectedRoom?.dayNightPrice;
  const roomsCount = Math.max(1, Number(form.roomsCount) || 1);

  // Din/raat ginti: check-in se check-out tak har poore 24 ghante = 1 din (kam se kam 1)
  const stayMs =
    form.date && form.time && form.outDate && form.outTime
      ? new Date(`${form.outDate}T${form.outTime}`) - new Date(`${form.date}T${form.time}`)
      : 0;
  const days = stayMs > 0 ? Math.ceil(stayMs / (24 * 60 * 60 * 1000)) : 1;

  // Total = room price x din x rooms
  const totalAmount = Number(currentPrice || 0) * days * roomsCount;

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requireAuth(navigate)) return;
    if (status !== 'idle') return;
    setError('');
    setStatus('sending');

    try {
      if (!selectedRoom) throw new Error('Room not found');
      if (!Number.isInteger(roomsCount) || roomsCount < 1) {
        throw new Error('Kam se kam 1 room select karo.');
      }

      const checkIn = `${form.date} ${form.time}`;
      const checkOut = `${form.outDate} ${form.outTime}`;

      if (
        new Date(`${form.outDate}T${form.outTime}`) <=
        new Date(`${form.date}T${form.time}`)
      ) {
        throw new Error('Check-out time check-in ke baad ka hona chahiye.');
      }

      const response = await authFetch('/room-bookings', {
        method: 'POST',
        body: JSON.stringify({
          // Form wale email par hi confirmation mail jaayegi
          user_email: form.email || user.email,
          room_id: Number(selectedRoom.id),
          check_in: checkIn,
          check_out: checkOut,
          guests: Number(form.guests),
          rooms_count: roomsCount,
          stay_type: form.stayType,
          total_amount: totalAmount,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'Room booking failed');

      // Booking pending hai: owner ko Telegram notification jaati hai.
      // Customer ko confirmation email tab jaayegi jab admin confirm karega.
      // (Error aaye toh bhi booking save ho chuki hai, isliye sirf console mein dikhate hain)
      sendRoomBooking({
        name: form.name,
        email: form.email,
        date: form.date,
        time: form.time,
        outDate: form.outDate,
        outTime: form.outTime,
        guests: form.guests,
        roomsCount,
        days,
        roomName: selectedRoom.name,
        roomPrice: `₹${totalAmount}`,
      }).catch((err) => console.error('Room notification error:', err));

      const tl = gsap.timeline({ onComplete: () => setStatus('reserved') });
      tl.to(stampRef.current, { scale: 0.94, duration: 0.12, ease: 'power1.in' })
        .to(stampRef.current, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' })
        .fromTo(confirmRef.current, { opacity: 0, x: 20, rotate: -3 }, { opacity: 1, x: 0, rotate: -2, duration: 0.5, ease: 'power3.out' }, '-=0.25');
    } catch (err) {
      console.error('Room Booking Error:', err);
      setError(err.message || 'Booking bhejne mein error aayi. Dobara try karo.');
      setStatus('idle');
    }
  };

  return (
    <div className="bg-[#17110D] text-[#F4EFE6] font-[Inter,system-ui,sans-serif] min-h-screen overflow-x-hidden">
      <section className="flex flex-col items-center px-6 py-12 sm:py-16">
        {/* Rooms page par wapas jaane ka link */}
        <div className="w-full max-w-[480px] mb-4">
          <Link
            to="/rooms"
            className="text-sm text-[#B08D57] hover:text-[#FF7A45] transition-colors"
          >
            ← All rooms
          </Link>
        </div>

        {loading && <p className="text-[#F4EFE6]/60 py-16">Loading…</p>}

        {!loading && roomsError && (
          <p className="text-red-300 py-16 text-center">{roomsError}</p>
        )}

        {!loading && !roomsError && rooms.length === 0 && (
          <p className="text-[#F4EFE6]/60 py-16 text-center">
            No rooms available right now.
          </p>
        )}

        {!loading && rooms.length > 0 && (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[480px] bg-[#1F1712] border border-white/10 rounded-md p-6 sm:p-9 relative"
          >
            <div className="flex justify-between items-baseline mb-6">
              <h1 className="font-[Fraunces,serif] text-2xl font-medium">Reserve a room</h1>
              <span className="text-[#B08D57] text-sm">No card required</span>
            </div>

            {/* ----- Chuna hua room ----- */}
            {selectedRoom && (
              <div className="flex gap-4 mb-6 bg-white/5 border border-white/10 rounded-[3px] p-3">
                <div
                  className="w-20 h-20 shrink-0 rounded-[3px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${selectedRoom.image})` }}
                />
                <div className="min-w-0">
                  <div className="font-medium truncate">{selectedRoom.name}</div>
                  <div className="text-xs text-[#B08D57] mt-0.5">
                    {selectedRoom.facilities.join(' · ')}
                  </div>
                  <div className="text-xs text-[#F4EFE6]/65 mt-1.5">
                    Night ₹{selectedRoom.nightPrice} · Day ₹{selectedRoom.dayPrice} · Day &amp; Night ₹{selectedRoom.dayNightPrice}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5 mb-4">
              <label htmlFor="rb-room" className="text-xs text-[#F4EFE6]/65">
                Room
              </label>
              <select
                id="rb-room"
                value={form.room}
                onChange={handleChange('room')}
                className={inputClass}
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 mb-4">
              <label htmlFor="rb-name" className="text-xs text-[#F4EFE6]/65">
                Name on the reservation
              </label>
              <input
                id="rb-name"
                required
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Ayush Sharma"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5 mb-4">
              <label htmlFor="rb-email" className="text-xs text-[#F4EFE6]/65">
                Email (booking confirm hone par yahin mail aayegi)
              </label>
              <input
                id="rb-email"
                type="email"
                required
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            {/* ----- Check-in ----- */}
            <div className="text-sm text-[#B08D57] mb-2">Check-in</div>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="rb-date" className="text-xs text-[#F4EFE6]/65">
                  Check-in date
                </label>
                <input
                  id="rb-date"
                  type="date"
                  required
                  value={form.date}
                  onChange={handleChange('date')}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="rb-time" className="text-xs text-[#F4EFE6]/65">
                  Check-in time
                </label>
                <input
                  id="rb-time"
                  type="time"
                  required
                  value={form.time}
                  onChange={handleChange('time')}
                  className={inputClass}
                />
              </div>
            </div>

            {/* ----- Check-out ----- */}
            <div className="text-sm text-[#B08D57] mb-2">Check-out</div>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="rb-outdate" className="text-xs text-[#F4EFE6]/65">
                  Check-out date
                </label>
                <input
                  id="rb-outdate"
                  type="date"
                  required
                  min={form.date}
                  value={form.outDate}
                  onChange={handleChange('outDate')}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="rb-outtime" className="text-xs text-[#F4EFE6]/65">
                  Check-out time
                </label>
                <input
                  id="rb-outtime"
                  type="time"
                  required
                  value={form.outTime}
                  onChange={handleChange('outTime')}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="rb-guests" className="text-xs text-[#F4EFE6]/65">
                  Guests
                </label>
                <input
                  id="rb-guests"
                  type="number"
                  min="1"
                  required
                  value={form.guests}
                  onChange={handleChange('guests')}
                  placeholder="2"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="rb-roomsCount" className="text-xs text-[#F4EFE6]/65">
                  Number of rooms
                </label>
                <input
                  id="rb-roomsCount"
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={form.roomsCount}
                  onChange={handleChange('roomsCount')}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mb-4">
              <label htmlFor="rb-stayType" className="text-xs text-[#F4EFE6]/65">
                Stay type
              </label>
              <select
                id="rb-stayType"
                value={form.stayType}
                onChange={handleChange('stayType')}
                className={inputClass}
              >
                <option value="night">Night only - ₹{selectedRoom?.nightPrice}</option>
                <option value="day">Day only - ₹{selectedRoom?.dayPrice}</option>
                <option value="daynight">Day &amp; Night - ₹{selectedRoom?.dayNightPrice}</option>
              </select>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[3px] px-4 py-3 mb-4 flex justify-between items-center">
              <span className="text-sm text-[#F4EFE6]/70">
                Total amount
                <span className="block text-xs text-[#F4EFE6]/50">
                  ₹{currentPrice} × {days} {days === 1 ? 'day' : 'days'} × {roomsCount} {roomsCount === 1 ? 'room' : 'rooms'}
                </span>
              </span>
              <span className="text-lg font-semibold text-[#FF7A45]">₹{totalAmount}</span>
            </div>

            <hr className="border-t border-dashed border-white/10 my-6" />

            {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500/40 text-red-300 text-sm px-4 py-2.5 rounded-[3px]">
                {error}
              </div>
            )}

            <div ref={stampRef}>
              <button
                type="submit"
                disabled={status !== 'idle' || !selectedRoom}
                className="w-full justify-center inline-flex items-center gap-2 bg-[#C1440E] hover:bg-[#FF7A45] text-[#F4EFE6] px-7 py-3.5 rounded-[3px] text-[0.95rem] font-medium transition-colors duration-300 disabled:opacity-70 disabled:cursor-default"
              >
                {status === 'idle' && 'Reserve room'}
                {status === 'sending' && 'Reserving…'}
                {status === 'reserved' && 'Request sent'}
              </button>
            </div>

            {status === 'reserved' && (
              <div
                ref={confirmRef}
                className="mt-6 bg-[#C1440E]/10 border border-[#C1440E] px-4 py-3.5 rounded-[3px] text-sm opacity-0"
              >
                Your request for {roomsCount} {roomsCount === 1 ? 'room' : 'rooms'} ({days} {days === 1 ? 'day' : 'days'}) from {form.date} {form.time} to{' '}
                {form.outDate} {form.outTime} (₹{totalAmount}) has been received and is
                pending confirmation. We'll email {form.email} once it's confirmed.
              </div>
            )}
          </form>
        )}
      </section>
    </div>
  );
}