import { useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import useRooms from './Userooms';

gsap.registerPlugin(ScrollTrigger);

export default function Rooms() {
  const navigate = useNavigate();
  const { rooms, loading, error } = useRooms();

  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const particlesRef = useRef(null);
  const panelRefs = useRef([]);

  const goToBooking = (roomId) => {
    navigate(roomId ? `/roombooking?room=${roomId}` : '/roombooking');
  };

  // ===================== GSAP START: hero =====================
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
  // ===================== GSAP END: hero =====================

  // ===================== GSAP START: room panels =====================
  // rooms load hone ke baad (ya badalne par) chalta hai
  useEffect(() => {
    if (rooms.length === 0) return undefined;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      panelRefs.current.slice(0, rooms.length).forEach((panel, i) => {
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

        gsap
          .timeline({
            scrollTrigger: {
              trigger: panel,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          })
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
  }, [rooms]);
  // ===================== GSAP END: room panels =====================

  return (
    <div
      ref={rootRef}
      className="bg-[#17110D] text-[#F4EFE6] font-[Inter,system-ui,sans-serif] overflow-x-hidden"
    >
      {/* ---------- Hero ---------- */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center text-center px-6 border-b border-white/10">
        <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none" />
        <div className="relative z-10 text-[#B08D57] text-sm tracking-wide mb-4">
          Fork &amp; Flame · Rooms
        </div>
        <h1
          ref={titleRef}
          className="relative z-10 font-[Fraunces,serif] font-medium text-[clamp(2.4rem,7vw,5rem)] leading-[1.05] max-w-[16ch]"
        >
          Our Rooms
        </h1>
        <p className="rb-subtitle relative z-10 max-w-[82ch] text-[#F4EFE6]/75 text-[1.05rem] leading-relaxed">
          Comfortable rooms at simple, honest pricing. Choose a night stay,
          a day stay, or a Day &amp; Night stay.
        </p>
        <div className="rb-hero-cta relative z-10 mt-5">
          <button
            className="inline-flex items-center gap-2 bg-[#C1440E] hover:bg-[#FF7A45] text-[#F4EFE6] px-7 py-3.5 rounded-[3px] text-[0.95rem] font-medium transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF7A45] focus-visible:outline-offset-2"
            onClick={() => goToBooking()}
          >
            Book a room
          </button>
        </div>
      </section>

      {/* ---------- Room panels ---------- */}
      <section className="py-16">
        {loading && (
          <p className="text-center text-[#F4EFE6]/60 py-24">Loading rooms…</p>
        )}

        {!loading && error && (
          <p className="text-center text-red-300 py-24 px-6">{error}</p>
        )}

        {!loading && !error && rooms.length === 0 && (
          <p className="text-center text-[#F4EFE6]/60 py-24 px-6">
            No rooms available right now.
          </p>
        )}

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

              <div className="flex flex-wrap gap-2 text-sm">
                {room.facilities.map((f) => (
                  <span
                    key={f}
                    className="border border-[#B08D57]/50 text-[#B08D57] px-3 py-1 rounded-[3px]"
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-[3px]">
                  Night: <strong className="text-[#FF7A45]">₹{room.nightPrice}</strong>
                </span>
                <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-[3px]">
                  Day: <strong className="text-[#FF7A45]">₹{room.dayPrice}</strong>
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
                onClick={() => goToBooking(room.id)}
              >
                Book this room
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}