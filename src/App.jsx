import React from 'react'
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./Pages/Home";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './components/About';
import Menu from './components/Menu';
import Reservation from './components/Reservation';
import Contact from './components/Contact';
import RoomBooking from './components/RoomBooking';
import ScrollToTop from "./components/ScrollToTop";
import InstallPrompt from "./components/InstallPrompt";

import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AdminPanel from "./Pages/AdminPanel";

import { useAuth } from "./context/AuthContext";

const App = () => {
  const location = useLocation();
  const { toast } = useAuth();

  // Special pages
  const isAdminPage = location.pathname === "/admin";

  // Footer hide
  const hideFooter =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <div className="min-h-screen flex flex-col">

      <ScrollToTop />

      {/* Install Prompt */}
      {!isAdminPage && <InstallPrompt />}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[999] px-5 py-3 rounded-xl shadow-xl font-semibold text-white ${
            toast.type === "error"
              ? "bg-red-600"
              : "bg-green-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Website Navbar */}
      {!isAdminPage && <Navbar />}

      <main className="flex-1 flex flex-col">

        <Routes>

          {/* Website */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/roombooking" element={<RoomBooking />} />
          <Route path="/contact" element={<Contact />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminPanel />} />

        </Routes>

      </main>

      {/* Website Footer */}
      {!hideFooter && !isAdminPage && <Footer />}

    </div>
  )
}

export default App;