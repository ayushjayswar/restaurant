import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "../context/AuthContext";

import { timeOptions } from "../assets/time";
import { partySizeOptions } from "../assets/PartySize";
import { tableRefOptions } from "../assets/TableRef";
import BookingModal from "../components/BookingModal";
import { sendReservationRequest } from "../services/emailService";

gsap.registerPlugin(ScrollTrigger);

const API_URL = "http://127.0.0.1:8000";

// Input / select ki common styling (RoomBooking jaisi dark theme)
const fieldClass =
  "bg-[#17110D] border border-white/10 text-[#F4EFE6] px-3 py-2.5 rounded-[3px] text-[0.95rem] w-full focus:outline-none focus:border-[#FF7A45] placeholder:text-[#F4EFE6]/30";

const labelClass = "text-xs text-[#F4EFE6]/65";

// Options string ho ya { value, label } object, dono chalenge
const normalizeOptions = (options = []) =>
  options.map((option) =>
    typeof option === "object" && option !== null
      ? {
          value: option.value ?? option.label ?? option.name ?? "",
          label: option.label ?? option.name ?? option.value ?? "",
        }
      : { value: option, label: option }
  );

const Reservation = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    fullName: "",
    phone: "",
    email: "",
    feedback: "",
    time: "",
    partySize: "",
    tableRef: "",
  });

  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);

  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const particlesRef = useRef(null);
  const formCardRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];


  // =================================
  // GSAP: HERO (title, particles)
  // =================================

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
        gsap.set(".rs-subtitle, .rs-hero-cta", { opacity: 1 });
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
            ".rs-subtitle",
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.7 },
            "-=0.5"
          )
          .fromTo(
            ".rs-hero-cta",
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


  // =================================
  // GSAP: FORM CARD (scroll par aayega)
  // =================================

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(".rs-field", { opacity: 1, y: 0 });
        return;
      }

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: formCardRef.current,
            start: "top 80%",
            once: true,
          },
        })
        .fromTo(
          formCardRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 }
        )
        .fromTo(
          ".rs-field",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);


  // =================================
  // INPUT CHANGE
  // =================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // =================================
  // BUTTON ANIMATION
  // =================================

  const animateButtonPress = (el) => {
    if (!el) return;

    gsap
      .timeline()
      .to(el, { scale: 0.96, duration: 0.1, ease: "power1.out" })
      .to(el, { scale: 1, duration: 0.2, ease: "back.out(2)" });
  };


  // =================================
  // RESET FORM
  // =================================

  const resetForm = () => {
    setFormData({
      date: "",
      fullName: "",
      phone: "",
      email: "",
      feedback: "",
      time: "",
      partySize: "",
      tableRef: "",
    });
  };


  // =================================
  // SUBMIT RESERVATION
  // =================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    animateButtonPress(e.nativeEvent.submitter);

    // Login required
    if (!requireAuth(navigate)) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Login token nahi mila. Please login again.");
      }

      // Selected table number nikalna ("2", "T2", "Table 2" sab chalega)
      const tableDigits = String(formData.tableRef ?? "").replace(/[^0-9]/g, "");

      const parsedTableNumber =
        tableDigits === "" ? null : parseInt(tableDigits, 10);

      // Backend payload
      const reservationPayload = {
        user_email: formData.email,
        name: formData.fullName,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        guests: Number(formData.partySize),
        message: formData.feedback,
        table_number: parsedTableNumber,
      };

      const response = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationPayload),
      });

      const result = await response.json();

      // Backend error
      if (!response.ok) {
        console.error("Backend Reservation Error:", result);

        let errorMessage = "Reservation failed. Please try again.";

        if (Array.isArray(result.detail)) {
          errorMessage = result.detail
            .map((error) => error.msg || "Invalid field")
            .join(", ");
        } else if (typeof result.detail === "string") {
          errorMessage = result.detail;
        }

        throw new Error(errorMessage);
      }

      // Naya reservation hamesha "pending" hota hai.
      // Table admin approve karte waqt assign hota hai, aur
      // confirmed / waiting / cancelled / completed ki email
      // admin panel se status badalne par jaati hai.
      const reservation = result.reservation || result;

      const finalBookingData = {
        // Customer information
        date: formData.date,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        feedback: formData.feedback,
        time: formData.time,
        partySize: formData.partySize,

        // Backend information
        id: reservation.id,
        user_email: reservation.user_email,
        name: reservation.name,
        guests: reservation.guests,
        message: reservation.message,
        status: reservation.status || "pending",

        // Table abhi assign nahi hua
        tableNumber: null,
        table_number: null,
        waitingPosition: null,
        waiting_position: null,
        tableRef: "",
      };

      // Customer ko "request received" mail + owner ko Telegram
      // (booking save ho chuki hai, isliye error aaye toh sirf console mein)
      sendReservationRequest(formData).catch((err) =>
        console.error("Reservation notification error:", err)
      );

      setBookingData(finalBookingData);
      setIsModalOpen(true);

      resetForm();
    } catch (error) {
      console.error("Reservation Error:", error);

      alert(error.message || "Reservation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // =================================
  // CLOSE MODAL
  // =================================

  const closeModal = () => {
    setIsModalOpen(false);
  };


  // =================================
  // UI
  // =================================

  return (
    <section
      id="reservation"
      ref={sectionRef}
      className="bg-[#17110D] text-[#F4EFE6] font-[Inter,system-ui,sans-serif] overflow-x-hidden"
    >

      {/* ---------- Hero ---------- */}
      <div
        ref={heroRef}
        className="relative min-h-[50vh] flex flex-col items-center justify-center text-center px-6 py-5   border-b border-white/10"
      >
        <div
          ref={particlesRef}
          className="absolute inset-0 overflow-hidden pointer-events-none"
        />

        <div className="relative z-10 text-[#B08D57] text-sm tracking-wide mb-4">
          Fork &amp; Flame · Table Reservation
        </div>

        <h1
          ref={titleRef}
          className="relative z-10 font-[Fraunces,serif] font-medium text-[clamp(2.4rem,7vw,5rem)] leading-[1.05] max-w-[19ch]"
        >
          Reserve Your Table
        </h1>

        <p className="rs-subtitle relative z-10 mt-6 max-w-[42ch] text-[#F4EFE6]/75 text-[1.05rem] leading-relaxed">
          Book your table in advance to ensure the best dining experience.
        </p>

        <div className="rs-hero-cta relative z-10 mt-9">
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-[#C1440E] hover:bg-[#FF7A45] text-[#F4EFE6] px-7 py-3.5 rounded-[3px] text-[0.95rem] font-medium transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF7A45] focus-visible:outline-offset-2"
            onClick={() =>
              document
                .getElementById("rs-ticket")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Book a table
          </button>
        </div>
      </div>


      {/* ---------- Reservation form ---------- */}
      <div className="flex justify-center px-6 py-20" id="rs-ticket">

        <form
          ref={formCardRef}
          onSubmit={handleSubmit}
          className="w-full max-w-[560px] bg-[#1F1712] border border-white/10 rounded-md p-9 relative"
        >

          <div className="flex justify-between items-baseline mb-6">
            <h3 className="font-[Fraunces,serif] text-2xl font-medium">
              Reserve a table
            </h3>

            <span className="text-[#B08D57] text-sm">
              No card required
            </span>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">

            {/* DATE */}
            <div className="rs-field flex flex-col gap-1.5 mb-4">
              <label htmlFor="rs-date" className={labelClass}>
                Date
              </label>
              <input
                id="rs-date"
                name="date"
                type="date"
                required
                min={today}
                value={formData.date}
                onChange={handleChange}
                className={fieldClass}
              />
            </div>

            {/* TIME */}
            <div className="rs-field flex flex-col gap-1.5 mb-4">
              <label htmlFor="rs-time" className={labelClass}>
                Time
              </label>
              <select
                id="rs-time"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className={fieldClass}
              >
                <option value="" disabled>
                  Select time
                </option>
                {normalizeOptions(timeOptions).map((option, index) => (
                  <option key={`${option.value}-${index}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* PARTY SIZE */}
            <div className="rs-field flex flex-col gap-1.5 mb-4">
              <label htmlFor="rs-party" className={labelClass}>
                Party Size
              </label>
              <select
                id="rs-party"
                name="partySize"
                required
                value={formData.partySize}
                onChange={handleChange}
                className={fieldClass}
              >
                <option value="" disabled>
                  How many persons?
                </option>
                {normalizeOptions(partySizeOptions).map((option, index) => (
                  <option key={`${option.value}-${index}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* TABLE PREFERENCE */}
            <div className="rs-field flex flex-col gap-1.5 mb-4">
              <label htmlFor="rs-table" className={labelClass}>
                Table Preference
              </label>
              <select
                id="rs-table"
                name="tableRef"
                value={formData.tableRef}
                onChange={handleChange}
                className={fieldClass}
              >
                <option value="">Which table do you prefer?</option>
                {normalizeOptions(tableRefOptions).map((option, index) => (
                  <option key={`${option.value}-${index}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* FULL NAME */}
            <div className="rs-field flex flex-col gap-1.5 mb-4">
              <label htmlFor="rs-name" className={labelClass}>
                Full Name
              </label>
              <input
                id="rs-name"
                name="fullName"
                type="text"
                required
                maxLength={50}
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={fieldClass}
              />
            </div>

            {/* PHONE */}
            <div className="rs-field flex flex-col gap-1.5 mb-4">
              <label htmlFor="rs-phone" className={labelClass}>
                Phone Number
              </label>
              <input
                id="rs-phone"
                name="phone"
                type="text"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your mobile no"
                className={fieldClass}
              />
            </div>

            {/* EMAIL */}
            <div className="rs-field flex flex-col gap-1.5 mb-4 md:col-span-2">
              <label htmlFor="rs-email" className={labelClass}>
                Email (booking ki update yahin aayegi)
              </label>
              <input
                id="rs-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={fieldClass}
              />
            </div>

            {/* FEEDBACK */}
            <div className="rs-field flex flex-col gap-1.5 mb-4 md:col-span-2">
              <label htmlFor="rs-feedback" className={labelClass}>
                Feedback / Special request
              </label>
              <textarea
                id="rs-feedback"
                name="feedback"
                rows={3}
                value={formData.feedback}
                onChange={handleChange}
                placeholder="Enter your feedback"
                className={`${fieldClass} resize-none`}
              />
            </div>

          </div>


          <hr className="border-t border-dashed border-white/10 my-6" />


          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full justify-center inline-flex items-center gap-2 bg-[#C1440E] hover:bg-[#FF7A45] text-[#F4EFE6] px-7 py-3.5 rounded-[3px] text-[0.95rem] font-medium transition-colors duration-300 disabled:opacity-70 disabled:cursor-default"
          >
            {loading ? "Sending..." : "Confirm Reservation"}
          </button>

        </form>

        {/* MODAL (form ke bahar, taaki modal ke button form submit na karein) */}
        <BookingModal
          isOpen={isModalOpen}
          onClose={closeModal}
          bookingData={bookingData}
        />

      </div>

    </section>
  );
};

export default Reservation;