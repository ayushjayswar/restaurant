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
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const location = useLocation();
  const { toast } = useAuth();

  // Sirf Footer hide karna hai in routes par, Navbar hamesha dikhega
  const hideFooter = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />

      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[999] px-5 py-3 rounded-xl shadow-xl font-semibold text-white ${
            toast.type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>

          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/menu' element={<Menu/>}/>
          <Route path='/reservation' element={<Reservation/>}/>
          <Route path='/roombooking' element={<RoomBooking/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>

        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default App