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
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/course' element={<Course />} />
        <Route path='/add-course' element={<Navigate to='/course' replace />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>
)
