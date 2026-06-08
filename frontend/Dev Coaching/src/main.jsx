import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
import Home from './screens/Home.jsx'
import Course from './screens/Course.jsx'
import Navbar from './screens/component/Navbar.jsx'
import Footer from './screens/component/Footer.jsx'
import About from './screens/About.jsx'
import Contact from './screens/Contact.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/add-course' element={<Course />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>
)
