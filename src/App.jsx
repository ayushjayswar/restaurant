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

const App = () => {
  const location = useLocation();

  // In routes par Navbar/Footer nahi dikhana
  const hideLayout = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div>
      <ScrollToTop />
      {!hideLayout && <Navbar />}
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
      {!hideLayout && <Footer />}
    </div>
  )
}

export default App