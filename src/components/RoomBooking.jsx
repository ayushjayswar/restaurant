import React, { useRef, useLayoutEffect, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ROOMS = [
    {
        id: 'hearth',
        name: 'The Hearth Room',
        capacity: 'Seats 8–12',
        price: '$180/hr',
        description:
            "Our smallest room, built around a working wood-fired hearth. Guests can watch the fire while they eat — it's the room we give people celebrating something.",
        tone: 'linear-gradient(135deg, #3A2116 0%, #1F1712 60%)',
    },
    {
        id: 'ember',
        name: 'The Ember Suite',
        capacity: 'Seats 16–24',
        price: '$320/hr',
        description:
            'A longer room with its own bar and a pass-through to the kitchen, so the chef can walk courses out personally. Good for rehearsal dinners and team dinners alike.',
        tone: 'linear-gradient(135deg, #4A2412 0%, #1F1712 60%)',
    },
    {
        id: 'copper',
        name: 'The Copper Room',
        capacity: 'Seats 30–40',
        price: '$540/hr',
        description:
            'The whole back of the house, under the copper-hood exhibition kitchen. We only book one party a night here — the room is yours, start to finish.',
        tone: 'linear-gradient(135deg, #5A2C10 0%, #1F1712 60%)',
    },
]

const RoomBooking = () => {

    const rootRef = useRef(null)
    const titleRef = useRef(null)
    const particlesRef = useRef(null)
    const panelRefs = useRef([])
    const stampRef = useRef(null)
    const confirmRef = useRef(null)

    const [form, setForm] = useState({ name: '', date: '', time: '', guests: '', room: ROOMS[0].id })
    const [status, setStatus] = useState('idle') // idle | sending | reserved

    /* ======================================================
       ================  GSAP ANIMATION SECTION  ============
       (Sirf animation logic yahan hai, JSX ke saath mix nahi hai)
       ====================================================== */

    // Page load hote hi hero title ignite hota hai (letter by letter)
    // aur background me halke ember particles float karte rehte hain
    useLayoutEffect(() => {

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const ctx = gsap.context(() => {

            const titleEl = titleRef.current
            const text = titleEl.textContent
            titleEl.textContent = ''

            // Title ko character-wise spans me tod rahe hain taaki har letter alag se animate ho
            const chars = text.split('').map((ch) => {
                const span = document.createElement('span')
                span.textContent = ch === ' ' ? '\u00A0' : ch
                span.style.display = 'inline-block'
                span.style.opacity = reduceMotion ? '1' : '0'
                titleEl.appendChild(span)
                return span
            })

            if (reduceMotion) {
                gsap.set('.rb-subtitle, .rb-hero-cta', { opacity: 1 })
                return
            }

            // Title flicker-in timeline (blur/ember-glow se cream color tak settle hota hai)
            gsap.timeline({ defaults: { ease: 'power3.out' } })
                .to(chars, {
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 0.9,
                    stagger: { each: 0.035, from: 'start' },
                    color: '#FF7A45',
                })
                .to(chars, {
                    color: '#F4EFE6',
                    duration: 0.6,
                    stagger: { each: 0.02, from: 'start' },
                }, '-=0.3')
                .fromTo('.rb-subtitle',
                    { opacity: 0, y: 14 },
                    { opacity: 1, y: 0, duration: 0.7 },
                    '-=0.5'
                )
                .fromTo('.rb-hero-cta',
                    { opacity: 0, scale: 0.92 },
                    { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' },
                    '-=0.35'
                )

            // Ember particles — hero ke background me upar drift karte hain, loop me
            const field = particlesRef.current
            if (field) {
                const count = 18
                for (let i = 0; i < count; i++) {
                    const dot = document.createElement('span')
                    dot.style.position = 'absolute'
                    dot.style.bottom = '0'
                    dot.style.borderRadius = '50%'
                    dot.style.background = 'radial-gradient(circle, #FF7A45, transparent 70%)'
                    const size = gsap.utils.random(2, 5)
                    dot.style.width = `${size}px`
                    dot.style.height = `${size}px`
                    dot.style.left = `${gsap.utils.random(0, 100)}%`
                    field.appendChild(dot)

                    gsap.set(dot, { y: gsap.utils.random(20, 80) + 'vh', opacity: 0 })
                    gsap.to(dot, {
                        y: '-10vh',
                        opacity: gsap.utils.random(0.15, 0.55),
                        duration: gsap.utils.random(6, 12),
                        delay: gsap.utils.random(0, 6),
                        repeat: -1,
                        ease: 'none',
                        onRepeat: () => gsap.set(dot, { x: 0, left: `${gsap.utils.random(0, 100)}%` }),
                    })
                    gsap.to(dot, {
                        x: gsap.utils.random(-30, 30),
                        duration: gsap.utils.random(2, 4),
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                    })
                }
            }

        }, rootRef)

        return () => ctx.revert()
    }, [])

    // Har room panel scroll me jab visible hota hai to uski image
    // clip-path se wipe-open hoti hai (alternate panels alag direction se khulte hain)
    useEffect(() => {

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const ctx = gsap.context(() => {

            panelRefs.current.forEach((panel, i) => {
                if (!panel) return

                const fromLeft = i % 2 === 0
                const image = panel.querySelector('.rb-panel-image')
                const copy = panel.querySelectorAll('.rb-panel-copy > *')

                if (reduceMotion) {
                    gsap.set(image, { clipPath: 'inset(0 0% 0 0)' })
                    gsap.set(copy, { opacity: 1, x: 0 })
                    return
                }

                gsap.set(image, { clipPath: fromLeft ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' })
                gsap.set(copy, { opacity: 0, x: fromLeft ? -24 : 24 })

                gsap.timeline({
                    scrollTrigger: {
                        trigger: panel,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse',
                    }
                })
                    .to(image, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power4.inOut' })
                    .to(copy, { opacity: 1, x: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, '-=0.55')

                // panel scroll karte waqt image par halka parallax
                gsap.to(image, {
                    backgroundPosition: '50% 30%',
                    ease: 'none',
                    scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true },
                })
            })

        }, rootRef)

        return () => ctx.revert()
    }, [])

    // Reservation form submit hote hi button "stamp" hota hai aur
    // confirmation slip side se slide-in hoti hai
    const playReserveAnimation = () => {
        return new Promise((resolve) => {
            gsap.timeline({ onComplete: resolve })
                .to(stampRef.current, { scale: 0.94, duration: 0.12, ease: 'power1.in' })
                .to(stampRef.current, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' })
                .fromTo(confirmRef.current,
                    { opacity: 0, x: 20, rotate: -3 },
                    { opacity: 1, x: 0, rotate: -2, duration: 0.5, ease: 'power3.out' },
                    '-=0.25'
                )
        })
    }
    /* ================  GSAP SECTION END  ================== */


    const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

    const selectRoom = (roomId) => {
        setForm((f) => ({ ...f, room: roomId }))
        document.getElementById('rb-ticket')?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (status !== 'idle') return
        setStatus('sending')
        await playReserveAnimation()
        setStatus('reserved')
    }


    return (
        <div ref={rootRef} className='bg-[#17110D] text-[#F4EFE6] overflow-x-hidden'>

            {/* ---------- Hero ---------- */}
            <section className='relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 py-24 border-b border-white/10'>

                {/* empty on purpose — GSAP section isme ember dots daalta hai */}
                <div ref={particlesRef} className='absolute inset-0 overflow-hidden pointer-events-none' />

                <div className='relative z-10 text-[#B08D57] text-sm tracking-wide mb-4'>
                    Fork &amp; Flame · Private dining
                </div>

                {/* GSAP isko letters me tod ke animate karta hai on mount */}
                <h1 ref={titleRef} className='relative z-10 font-semibold text-[clamp(2.4rem,7vw,5rem)] leading-[1.05] max-w-[16ch]'>
                    Rooms Service 
                </h1>

                {/* rb-subtitle / rb-hero-cta — sirf class names hain jo GSAP target karta hai */}
                <p className='rb-subtitle relative z-10 mt-6 max-w-[42ch] text-[#F4EFE6]/75 text-[1.05rem] leading-relaxed'>
                    Three private rooms, each named for what's burning in it. Pick one
                    below, or tell us the size of your party and we'll match you to a room.
                </p>

                <div className='rb-hero-cta relative z-10 mt-9'>
                    <button
                        className='inline-flex items-center gap-2 bg-[#C1440E] hover:bg-[#FF7A45] text-[#F4EFE6] px-7 py-3.5 rounded-[3px] text-[0.95rem] font-medium transition-all duration-300 hover:-translate-y-0.5'
                        onClick={() => document.getElementById('rb-ticket')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Check availability
                    </button>
                </div>
            </section>

            {/* ---------- Room panels ---------- */}
            <section className='py-16'>
                {ROOMS.map((room, i) => (
                    <div
                        key={room.id}
                        ref={(el) => (panelRefs.current[i] = el)}
                        className='grid grid-cols-1 md:grid-cols-2 min-h-[60vh] border-b border-white/10'
                    >
                        {/* rb-panel-image — GSAP isko scroll par wipe-open karta hai */}
                        <div
                            className={`rb-panel-image relative min-h-[340px] bg-cover bg-center after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/25 after:to-transparent after:pointer-events-none ${i % 2 === 1 ? 'md:order-2' : ''}`}
                            style={{ background: room.tone, backgroundSize: '140% 140%' }}
                        />
                        {/* rb-panel-copy — GSAP inke children fade+slide karta hai, staggered */}
                        <div className={`rb-panel-copy flex flex-col justify-center gap-3.5 px-6 py-12 md:px-14 ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                            <div className='font-semibold text-[clamp(1.6rem,3vw,2.3rem)]'>
                                {room.name}
                            </div>
                            <div className='text-[#B08D57] text-sm'>
                                {room.capacity} · {room.price}
                            </div>
                            <p className='text-[#F4EFE6]/80 leading-relaxed max-w-[46ch]'>
                                {room.description}
                            </p>
                            <button
                                className='mt-2 self-start bg-transparent border border-[#B08D57] hover:bg-[#C1440E] hover:border-[#C1440E] text-[#F4EFE6] px-7 py-3.5 rounded-[3px] text-sm font-medium transition-colors duration-300'
                                onClick={() => selectRoom(room.id)}
                            >
                                Reserve this room
                            </button>
                        </div>
                    </div>
                ))}
            </section>

            {/* ---------- Reservation ticket ---------- */}
            <section className='flex justify-center px-6 py-24' id='rb-ticket'>
                <form
                    onSubmit={handleSubmit}
                    className='w-full max-w-[480px] bg-[#1F1712] border border-white/10 rounded-md p-9 relative'
                >
                    <div className='flex justify-between items-baseline mb-6'>
                        <h3 className='text-2xl font-semibold'>Reserve a room</h3>
                        <span className='text-[#B08D57] text-sm'>No card required</span>
                    </div>

                    <div className='flex flex-col gap-1.5 mb-4'>
                        <label htmlFor='rb-name' className='text-xs text-[#F4EFE6]/65'>Name on the reservation</label>
                        <input
                            id='rb-name'
                            required
                            value={form.name}
                            onChange={handleChange('name')}
                            placeholder='Jordan Lee'
                            className='bg-[#17110D] border border-white/10 text-[#F4EFE6] px-3 py-2.5 rounded-[3px] text-[0.95rem] focus:outline-none focus:border-[#FF7A45]'
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-3.5'>
                        <div className='flex flex-col gap-1.5 mb-4'>
                            <label htmlFor='rb-date' className='text-xs text-[#F4EFE6]/65'>Date</label>
                            <input
                                id='rb-date'
                                type='date'
                                required
                                value={form.date}
                                onChange={handleChange('date')}
                                className='bg-[#17110D] border border-white/10 text-[#F4EFE6] px-3 py-2.5 rounded-[3px] text-[0.95rem] focus:outline-none focus:border-[#FF7A45]'
                            />
                        </div>
                        <div className='flex flex-col gap-1.5 mb-4'>
                            <label htmlFor='rb-time' className='text-xs text-[#F4EFE6]/65'>Time</label>
                            <input
                                id='rb-time'
                                type='time'
                                required
                                value={form.time}
                                onChange={handleChange('time')}
                                className='bg-[#17110D] border border-white/10 text-[#F4EFE6] px-3 py-2.5 rounded-[3px] text-[0.95rem] focus:outline-none focus:border-[#FF7A45]'
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-3.5'>
                        <div className='flex flex-col gap-1.5 mb-4'>
                            <label htmlFor='rb-guests' className='text-xs text-[#F4EFE6]/65'>Party size</label>
                            <input
                                id='rb-guests'
                                type='number'
                                min='1'
                                required
                                value={form.guests}
                                onChange={handleChange('guests')}
                                placeholder='12'
                                className='bg-[#17110D] border border-white/10 text-[#F4EFE6] px-3 py-2.5 rounded-[3px] text-[0.95rem] focus:outline-none focus:border-[#FF7A45]'
                            />
                        </div>
                        <div className='flex flex-col gap-1.5 mb-4'>
                            <label htmlFor='rb-room' className='text-xs text-[#F4EFE6]/65'>Room</label>
                            <select
                                id='rb-room'
                                value={form.room}
                                onChange={handleChange('room')}
                                className='bg-[#17110D] border border-white/10 text-[#F4EFE6] px-3 py-2.5 rounded-[3px] text-[0.95rem] focus:outline-none focus:border-[#FF7A45]'
                            >
                                {ROOMS.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <hr className='border-t border-dashed border-white/10 my-6' />

                    {/* stampRef — GSAP submit par isme scale-bounce play karta hai */}
                    <div ref={stampRef}>
                        <button
                            type='submit'
                            disabled={status !== 'idle'}
                            className='w-full justify-center inline-flex items-center gap-2 bg-[#C1440E] hover:bg-[#FF7A45] text-[#F4EFE6] px-7 py-3.5 rounded-[3px] text-[0.95rem] font-medium transition-colors duration-300 disabled:opacity-70 disabled:cursor-default'
                        >
                            {status === 'idle' && 'Reserve room'}
                            {status === 'sending' && 'Reserving…'}
                            {status === 'reserved' && 'Reserved'}
                        </button>
                    </div>

                    {/* confirmRef — GSAP animation resolve hote hi ye slide-in hoti hai */}
                    {status === 'reserved' && (
                        <div ref={confirmRef} className='mt-6 bg-[#C1440E]/10 border border-[#C1440E] px-4 py-3.5 rounded-[3px] text-sm opacity-0'>
                            You're booked into {ROOMS.find((r) => r.id === form.room)?.name} on{' '}
                            {form.date} at {form.time}. We'll email {form.name} a confirmation shortly.
                        </div>
                    )}
                </form>
            </section>

        </div>
    )
}

export default RoomBooking