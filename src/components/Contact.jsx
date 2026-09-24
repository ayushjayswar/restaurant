import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "../context/AuthContext";
import { FaLocationArrow, FaPhoneAlt } from "react-icons/fa";
import { MdEmail, MdTimer } from "react-icons/md";
import { sendContactEmail } from "../services/EmailService";

gsap.registerPlugin(ScrollTrigger);

// Input / textarea ki common styling (RoomBooking jaisi dark theme)
const fieldClass =
  "bg-[#17110D] border border-white/10 text-[#F4EFE6] px-3 py-2.5 rounded-[3px] text-[0.95rem] w-full focus:outline-none focus:border-[#FF7A45] placeholder:text-[#F4EFE6]/30";

const labelClass = "text-xs text-[#F4EFE6]/65";

const Contact = () => {

  const navigate = useNavigate();
  const { requireAuth } = useAuth();

  const [FormData, setFormData] = useState({
    fullname: "",
    email: "",
    message: "",
    subject: "",
  });

  const [loading, setLoading] = useState(false);

  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const particlesRef = useRef(null);
  const gridRef = useRef(null);
  const infoCardRef = useRef(null);
  const formCardRef = useRef(null);


  // ==============================
  // GSAP: HERO (title, particles)
  // ==============================

  useLayoutEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const titleEl = titleRef.current;
    const field = particlesRef.current;
    const originalText = titleEl ? titleEl.textContent : "";

    const ctx = gsap.context(() => {
      if (!titleEl) return;

      titleEl.textContent = "";
      const chars = originalText.split("").map((ch) => {
        const span = document.createElement("span");
        span.textContent = ch === " " ? "\u00A0" : ch;
        span.style.display = "inline-block";
        span.style.opacity = reduceMotion ? "1" : "0";
        span.style.willChange = "transform, opacity, filter";
        titleEl.appendChild(span);
        return span;
      });

      if (reduceMotion) {
        gsap.set(".ct-subtitle, .ct-hero-cta", { opacity: 1 });
      } else {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 85%",
            once: true,
          },
        });

        tl.to(chars, {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: { each: 0.035, from: "start" },
          color: "#FF7A45",
        })
          .to(
            chars,
            {
              color: "#F4EFE6",
              duration: 0.6,
              stagger: { each: 0.02, from: "start" },
            },
            "-=0.3"
          )
          .fromTo(
            ".ct-subtitle",
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.7 },
            "-=0.5"
          )
          .fromTo(
            ".ct-hero-cta",
            { opacity: 0, scale: 0.92 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
            "-=0.35"
          );
      }

      if (field && !reduceMotion) {
        const count = 18;

        for (let i = 0; i < count; i++) {
          const dot = document.createElement("span");
          dot.style.position = "absolute";
          dot.style.bottom = "0";
          dot.style.borderRadius = "50%";
          dot.style.background =
            "radial-gradient(circle, #FF7A45, transparent 70%)";

          const size = gsap.utils.random(2, 5);
          dot.style.width = `${size}px`;
          dot.style.height = `${size}px`;
          dot.style.left = `${gsap.utils.random(0, 100)}%`;
          field.appendChild(dot);

          gsap.set(dot, { y: gsap.utils.random(20, 80) + "vh", opacity: 0 });

          gsap.to(dot, {
            y: "-10vh",
            opacity: gsap.utils.random(0.15, 0.55),
            duration: gsap.utils.random(6, 12),
            delay: gsap.utils.random(0, 6),
            repeat: -1,
            ease: "none",
            onRepeat: () => {
              gsap.set(dot, { x: 0, left: `${gsap.utils.random(0, 100)}%` });
            },
          });

          gsap.to(dot, {
            x: gsap.utils.random(-30, 30),
            duration: gsap.utils.random(2, 4),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      // Dobara mount hone par duplicate na bane
      if (titleEl) titleEl.textContent = originalText;
      if (field) field.innerHTML = "";
    };
  }, []);


  // ==============================
  // GSAP: INFO CARD + FORM CARD (scroll par aayenge)
  // ==============================

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(".ct-row", { opacity: 1, y: 0 });
        return;
      }

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            once: true,
          },
        })
        .fromTo(
          infoCardRef.current,
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 0.6 }
        )
        .fromTo(
          formCardRef.current,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 0.6 },
          "<"
        )
        .fromTo(
          ".ct-row",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.1 },
          "-=0.35"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);


  // Small interactive press feedback for the submit button
  const animateButtonPress = (el) => {
    if (!el) return;
    gsap
      .timeline()
      .to(el, { scale: 0.95, duration: 0.1, ease: "power1.out" })
      .to(el, { scale: 1, duration: 0.2, ease: "back.out(2)" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    animateButtonPress(e.nativeEvent.submitter);

    // Login check - agar user login nahi hai to yahi rok denge
    if (!requireAuth(navigate)) return;

    if (
      !FormData.fullname ||
      !FormData.email ||
      !FormData.subject ||
      !FormData.message
    ) {
      alert("Please fill all infomation");
      return;
    }

    setLoading(true);

    sendContactEmail(FormData)
      .then(() => {
        alert("Message sent successfully!");
        setFormData({
          fullname: "",
          email: "",
          message: "",
          subject: "",
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to send. Try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };


  // Info card ke rows (icon + heading + text)
  const infoRows = [
    {
      icon: <FaLocationArrow />,
      title: "Address",
      lines: ["Adarsh Colony"],
    },
    {
      icon: <FaPhoneAlt />,
      title: "Phone",
      lines: ["1234567890"],
    },
    {
      icon: <MdEmail />,
      title: "Email",
      lines: ["Ayush@gmail.com"],
      breakAll: true,
    },
    {
      icon: <MdTimer />,
      title: "Time",
      lines: [
        "Monday - Thursday: 5:00 PM - 10:00 PM",
        "Friday - Saturday: 5:00 PM - 11:00 PM",
        "Sunday: 11:00 AM - 9:00 PM",
      ],
    },
  ];


  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-[#17110D] text-[#F4EFE6] font-[Inter,system-ui,sans-serif] overflow-x-hidden"
    >

      {/* ---------- Hero ---------- */}
      <div
        ref={heroRef}
        className="relative min-h-[50vh] flex flex-col items-center justify-center text-center px-6 py-5 border-b border-white/10"
      >
        <div
          ref={particlesRef}
          className="absolute inset-0 overflow-hidden pointer-events-none"
        />

        <div className="relative z-10 text-[#B08D57] text-sm tracking-wide mb-4">
          Fork &amp; Flame · Contact
        </div>

        <h1
          ref={titleRef}
          className="relative z-10 font-[Fraunces,serif] font-medium text-[clamp(2.4rem,7vw,5rem)] leading-[1.05] max-w-[16ch]"
        >
          Let's Talk
        </h1>

        <p className="ct-subtitle relative z-10 mt-6 max-w-[42ch] text-[#F4EFE6]/75 text-[1.05rem] leading-relaxed">
          We'd love to hear from you. Send us a message and we'll get back to you soon.
        </p>

        <div className="ct-hero-cta relative z-10 mt-9">
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-[#C1440E] hover:bg-[#FF7A45] text-[#F4EFE6] px-7 py-3.5 rounded-[3px] text-[0.95rem] font-medium transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF7A45] focus-visible:outline-offset-2"
            onClick={() =>
              document
                .getElementById("ct-form")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Send a message
          </button>
        </div>
      </div>


      {/* ---------- Info + Form ---------- */}
      <div className="px-6 py-20">

        <div
          ref={gridRef}
          className="container mx-auto max-w-5xl flex flex-col md:flex-row items-stretch gap-6"
        >

          {/* ================= LEFT SIDE: info ================= */}

          <div
            ref={infoCardRef}
            className="w-full md:w-1/2 bg-[#1F1712] border border-white/10 rounded-md p-9"
          >

            <div className="flex justify-between items-baseline mb-8">
              <h3 className="font-[Fraunces,serif] text-2xl font-medium">
                Get in touch
              </h3>

              <span className="text-[#B08D57] text-sm">
                We reply soon
              </span>
            </div>

            <div className="space-y-6">
              {infoRows.map((row) => (
                <div
                  key={row.title}
                  className="ct-row flex items-start gap-5"
                >
                  <div className="w-11 h-11 shrink-0 bg-[#C1440E] text-[#F4EFE6] rounded-full flex items-center justify-center">
                    {row.icon}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-[#B08D57] mb-1">
                      {row.title}
                    </p>

                    {row.lines.map((line) => (
                      <p
                        key={line}
                        className={`text-[0.95rem] text-[#F4EFE6]/90 leading-6 ${
                          row.breakAll ? "break-all" : ""
                        }`}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>


          {/* ================= RIGHT SIDE: form ================= */}

          <div
            ref={formCardRef}
            id="ct-form"
            className="w-full md:w-1/2 bg-[#1F1712] border border-white/10 rounded-md p-9"
          >

            <div className="flex justify-between items-baseline mb-6">
              <h3 className="font-[Fraunces,serif] text-2xl font-medium">
                Send message
              </h3>

              <span className="text-[#B08D57] text-sm">
                No spam, promise
              </span>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Full Name */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="ct-name" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="ct-name"
                  name="fullname"
                  type="text"
                  value={FormData.fullname}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={fieldClass}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="ct-email" className={labelClass}>
                  Email Address
                </label>
                <input
                  id="ct-email"
                  name="email"
                  type="email"
                  value={FormData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={fieldClass}
                />
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="ct-subject" className={labelClass}>
                  Subject
                </label>
                <input
                  id="ct-subject"
                  name="subject"
                  type="text"
                  value={FormData.subject}
                  onChange={handleChange}
                  placeholder="Enter your subject"
                  className={fieldClass}
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="ct-message" className={labelClass}>
                  Message
                </label>
                <textarea
                  id="ct-message"
                  name="message"
                  rows={4}
                  value={FormData.message}
                  onChange={handleChange}
                  placeholder="Enter message"
                  className={`${fieldClass} resize-none`}
                />
              </div>

              <hr className="border-t border-dashed border-white/10 my-6" />

              {/* Send Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full justify-center inline-flex items-center gap-2 bg-[#C1440E] hover:bg-[#FF7A45] text-[#F4EFE6] px-7 py-3.5 rounded-[3px] text-[0.95rem] font-medium transition-colors duration-300 disabled:opacity-70 disabled:cursor-default"
              >
                {loading ? "Sending..." : "Send"}
              </button>

            </form>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Contact;