import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sendRoomBooking } from '../services/EmailService';

gsap.registerPlugin(ScrollTrigger);

// Room details - normal hotel rooms, Indian pricing
const ROOMS_FALLBACK = [
  { id: 1, name: 'Normal Room', capacity: '2 Adults + 1 Child', nightPrice: 1500, dayNightPrice: 2000, description: 'A comfortable room with a queen-size bed, attached bathroom, and a work desk. Great for solo travelers or couples.', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0' },
  { id: 2, name: 'Family Suite', capacity: '4 Adults + 2 Children', nightPrice: 1500, dayNightPrice: 2000, description: 'A spacious suite with two beds, a sitting area, and extra storage. Perfect for families travelling together.', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0' },
  { id: 3, name: 'Premium Room', capacity: '2 Adults', nightPrice: 1500, dayNightPrice: 2000, description: 'Our best room with a balcony, premium furnishing, and a mini fridge. Ideal for a relaxed, comfortable stay.', image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0' },
];

export default function RoomBooking() {
  const navigate = useNavigate();
  const { requireAuth, user, authFetch } = useAuth();
  const [rooms, setRooms] = useState(ROOMS_FALLBACK);

  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const particlesRef = useRef(null);
  const panelRefs = useRef([]);
  const ticketRef = useRef(null);
  const stampRef = useRef(null);
  const confirmRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    guests: '',
    room: ROOMS_FALLBACK[0].id,
    stayType: 'night', // 'night' ya 'daynight'
  });
  const [status, setStatus] = useState('idle'); // idle | sending | reserved
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetch('https://lcd-dressing-jim-oven.trycloudflare.com/rooms');
        if (!response.ok) throw new Error('Rooms fetch failed');
        const result = await response.json();
        const backendRooms = (result.rooms || []).map((room) => ({
          id: room.id,
          name: room.name,
          capacity: room.capacity || 'Guests welcome',
          nightPrice: Number(room.price || 1500),
          dayNightPrice: Number(room.price || 1500),
          description: room.description || '',
          image: room.image || '',
        }));
        if (backendRooms.length > 0) {
          setRooms(backendRooms);
          setForm((f) => ({ ...f, room: backendRooms[0].id }));
        }
      } catch (err) {
        console.error('Rooms API Error:', err);
      }
    };
    loadRooms();
  }, []);

  const selectedRoom = rooms.find((r) => String(r.id) === String(form.room));
  const currentPrice =
    form.stayType === 'night' ? selectedRoom?.nightPrice : selectedRoom?.dayNightPrice;

  // ===================== GSAP START =====================
  useLayoutEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const titleEl = titleRef.current;
      if (!titleEl) return;

      const text = titleEl.textContent;
      titleEl.textContent = '';
      const chars = text.split('').map((ch) => {
        const span = document.createElement('span');
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.display = 'inline-block';
        span.style.opacity = reduceMotion ? '1' : '0';
        span.style.willChange = 'transform, opacity, filter';
        titleEl.appendChild(span);
        return span;
      });

      if (reduceMotion) {
        gsap.set('.rb-subtitle, .rb-hero-cta', { opacity: 1 });
      } else {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.to(chars, {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: { each: 0.035, from: 'start' },
          color: '#FF7A45',
        })
          .to(
            chars,
            {
              color: '#F4EFE6',
              duration: 0.6,
              stagger: { each: 0.02, from: 'start' },
            },
            '-=0.3'
          )
          .fromTo(
            '.rb-subtitle',
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.7 },
            '-=0.5'
          )
          .fromTo(
            '.rb-hero-cta',
            { opacity: 0, scale: 0.92 },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' },
            '-=0.35'
          );
      }

      const field = particlesRef.current;
      if (field && !reduceMotion) {
        const count = 18;
        for (let i = 0; i < count; i++) {
          const dot = document.createElement('span');
          dot.style.position = 'absolute';
          dot.style.bottom = '0';
          dot.style.borderRadius = '50%';
          dot.style.background =
            'radial-gradient(circle, #FF7A45, transparent 70%)';
          const size = gsap.utils.random(2, 5);
          dot.style.width = `${size}px`;
          dot.style.height = `${size}px`;
          dot.style.left = `${gsap.utils.random(0, 100)}%`;
          field.appendChild(dot);

          gsap.set(dot, { y: gsap.utils.random(20, 80) + 'vh', opacity: 0 });
          gsap.to(dot, {
            y: '-10vh',
            opacity: gsap.utils.random(0.15, 0.55),
            duration: gsap.utils.random(6, 12),
            delay: gsap.utils.random(0, 6),
            repeat: -1,
            ease: 'none',
            onRepeat: () => {
              gsap.set(dot, { x: 0, left: `${gsap.utils.random(0, 100)}%` });
            },
          });
          gsap.to(dot, {
            x: gsap.utils.random(-30, 30),
            duration: gsap.utils.random(2, 4),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);
  // ===================== GSAP END =====================

  // ===================== GSAP START =====================
  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;
        const fromLeft = i % 2 === 0;
        const image = panel.querySelector('.rb-panel-image');
        const copy = panel.querySelectorAll('.rb-panel-copy > *');

        if (reduceMotion) {
          gsap.set(image, { clipPath: 'inset(0 0% 0 0)' });
          gsap.set(copy, { opacity: 1, x: 0 });
          return;
        }

        gsap.set(image, {
          clipPath: fromLeft ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)',
        });
        gsap.set(copy, { opacity: 0, x: fromLeft ? -24 : 24 });

        const trigger = {
          trigger: panel,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        };

        gsap
          .timeline({ scrollTrigger: trigger })
          .to(image, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1,
            ease: 'power4.inOut',
          })
          .to(
            copy,
            { opacity: 1, x: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' },
            '-=0.55'
          );

        gsap.to(image, {
          backgroundPosition: '50% 30%',
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);
  // ===================== GSAP END =====================

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
      const checkIn = `${form.date} ${form.time}`;
      const checkOutDate = new Date(`${form.date}T${form.time}`);
      if (form.stayType === 'night') checkOutDate.setDate(checkOutDate.getDate() + 1);
      const checkOut = `${checkOutDate.getFullYear()}-${String(checkOutDate.getMonth() + 1).padStart(2, '0')}-${String(checkOutDate.getDate()).padStart(2, '0')} ${form.time}`;

      const response = await authFetch('/room-bookings', {
        method: 'POST',
        body: JSON.stringify({
          user_email: user.email,
          room_id: Number(selectedRoom.id),
          check_in: checkIn,
          check_out: checkOut,
          guests: Number(form.guests),
          total_amount: Number(currentPrice),
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
        guests: form.guests,
        roomName: selectedRoom.name,
        roomPrice: `₹${currentPrice}`,
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
    <div
      ref={rootRef}
      className="bg-[#17110D] text-[#F4EFE6] font-[Inter,system-ui,sans-serif] overflow-x-hidden"
    >
      {/* ---------- Hero ---------- */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center text-center px-6 py-3 border-b border-white/10">
        <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none" />
        <div className="relative z-10 text-[#B08D57] text-sm tracking-wide mb-4">
          Fork &amp; Flame · Room Booking
        </div>
        <h1
          ref={titleRef}
          className="relative z-10 font-[Fraunces,serif] font-medium text-[clamp(2.4rem,7vw,5rem)] leading-[1.05] max-w-[16ch]"
        >
          Book Your Room
        </h1>
        <p className="rb-subtitle relative z-10 mt-6 max-w-[42ch] text-[#F4EFE6]/75 text-[1.05rem] leading-relaxed">
          Comfortable rooms at simple, honest pricing. Night stay at ₹1500,
          or Day &amp; Night stay at ₹2000.
        </p>
        <div className="rb-hero-cta relative z-10 mt-9">
          <button
            className="inline-flex items-center gap-2 bg-[#C1440E] hover:bg-[#FF7A45] text-[#F4EFE6] px-7 py-3.5 rounded-[3px] text-[0.95rem] font-medium transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF7A45] focus-visible:outline-offset-2"
            onClick={() =>
              document.getElementById('rb-ticket')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Check availability
          </button>
        </div>
      </section>

      {/* ---------- Room panels ---------- */}
      <section className="py-16">
        {rooms.map((room, i) => (
          <div
            key={room.id}
            ref={(el) => (panelRefs.current[i] = el)}
            className="grid grid-cols-1 md:grid-cols-2 min-h-[60vh] border-b border-white/10"
          >
            <div
              className={`rb-panel-image relative min-h-[340px] bg-cover bg-center after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/40 after:to-transparent after:pointer-events-none ${
                i % 2 === 1 ? 'md:order-2' : ''
              }`}
              style={{ backgroundImage: `url(${room.image})` }}
            />
            <div
              className={`rb-panel-copy flex flex-col justify-center gap-3.5 px-6 py-12 md:px-14 ${
                i % 2 === 1 ? 'md:order-1' : ''
              }`}
            >
              <div className="font-[Fraunces,serif] font-medium text-[clamp(1.6rem,3vw,2.3rem)]">
                {room.name}
              </div>
              <div className="text-[#B08D57] text-sm">{room.capacity}</div>

              <div className="flex gap-4 text-sm">
                <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-[3px]">
                  Night: <strong className="text-[#FF7A45]">₹{room.nightPrice}</strong>
                </span>
                <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-[3px]">
                  Day &amp; Night: <strong className="text-[#FF7A45]">₹{room.dayNightPrice}</strong>
                </span>
              </div>

              <p className="text-[#F4EFE6]/80 leading-relaxed max-w-[46ch]">
                {room.description}
              </p>
              <button
                className="mt-2 self-start bg-transparent border border-[#B08D57] hover:bg-[#C1440E] hover:border-[#C1440E] text-[#F4EFE6] px-7 py-3.5 rounded-[3px] text-sm font-medium transition-colors duration-300"
                onClick={() => {
                  setForm((f) => ({ ...f, room: room.id }));
                  document.getElementById('rb-ticket')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Reserve this room
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ---------- Booking form ---------- */}
      <section className="flex justify-center px-6 py-24" id="rb-ticket">
        <form
          ref={ticketRef}
          onSubmit={handleSubmit}
          className="w-full max-w-[480px] bg-[#1F1712] border border-white/10 rounded-md p-9 relative"
        >
          <div className="flex justify-between items-baseline mb-6">
            <h3 className="font-[Fraunces,serif] text-2xl font-medium">Reserve a room</h3>
            <span className="text-[#B08D57] text-sm">No card required</span>
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
              className="bg-[#17110D] border border-white/10 text-[#F4EFE6] px-3 py-2.5 rounded-[3px] text-[0.95rem] focus:outline-none focus:border-[#FF7A45]"
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
              className="bg-[#17110D] border border-white/10 text-[#F4EFE6] px-3 py-2.5 rounded-[3px] text-[0.95rem] focus:outline-none focus:border-[#FF7A45]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5 mb-4">
              <label htmlFor="rb-date" className="text-xs text-[#F4EFE6]/65">
                Date
              </label>
              <input
                id="rb-date"
                type="date"
                required
                value={form.date}
                onChange={handleChange('date')}
                className="bg-[#17110D] border border-white/10 text-[#F4EFE6] px-3 py-2.5 rounded-[3px] text-[0.95rem] focus:outline-none focus:border-[#FF7A45]"
              />
            </div>
            <div className="flex flex-col gap-1.5 mb-4">
              <label htmlFor="rb-time" className="text-xs text-[#F4EFE6]/65">
                Time
              </label>
              <input
                id="rb-time"
                type="time"
                required
                value={form.time}
                onChange={handleChange('time')}
                className="bg-[#17110D] border border-white/10 text-[#F4EFE6] px-3 py-2.5 rounded-[3px] text-[0.95rem] focus:outline-none focus:border-[#FF7A45]"
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
                className="bg-[#17110D] border border-white/10 text-[#F4EFE6] px-3 py-2.5 rounded-[3px] text-[0.95rem] focus:outline-none focus:border-[#FF7A45]"
              />
            </div>
            <div className="flex flex-col gap-1.5 mb-4">
              <label htmlFor="rb-room" className="text-xs text-[#F4EFE6]/65">
                Room
              </label>
              <select
                id="rb-room"
                value={form.room}
                onChange={handleChange('room')}
                className="bg-[#17110D] border border-white/10 text-[#F4EFE6] px-3 py-2.5 rounded-[3px] text-[0.95rem] focus:outline-none focus:border-[#FF7A45]"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
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
              className="bg-[#17110D] border border-white/10 text-[#F4EFE6] px-3 py-2.5 rounded-[3px] text-[0.95rem] focus:outline-none focus:border-[#FF7A45]"
            >
              <option value="night">Night only - ₹1500</option>
              <option value="daynight">Day & Night - ₹2000</option>
            </select>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[3px] px-4 py-3 mb-4 flex justify-between items-center">
            <span className="text-sm text-[#F4EFE6]/70">Total amount</span>
            <span className="text-lg font-semibold text-[#FF7A45]">₹{currentPrice}</span>
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
              disabled={status !== 'idle'}
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
              Your request for {selectedRoom?.name} on {form.date} at{' '}
              {form.time} (₹{currentPrice}) has been received and is pending
              confirmation. We'll email {form.email} once it's confirmed.
            </div>
          )}
        </form>
      </section>
    </div>
  );
}