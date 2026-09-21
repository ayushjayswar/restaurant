import React from 'react'
import { Routes , Route } from "react-router-dom";
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
  return (
    <div>
      <ScrollToTop />
      <Navbar/>
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
      <Footer />
    </div>
  )
}

export default App