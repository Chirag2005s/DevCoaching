import './Footer.css'
import { FaLaptopCode } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";
import { FiFacebook } from "react-icons/fi";
import { Link } from 'react-router-dom';


function Footer() {
    return (
        <>

            <section className="Footer">
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-3'>
                            <div style={{ justifyContent: 'center' }}>
                                <h3 style={{ color: 'white' }}><FaLaptopCode style={{ fontSize: 40, marginRight: 10, color: '#6c9eff' }} />Dev <span style={{ color: '#6c9eff' }}>Coaching</span></h3>
                                <p style={{ color: '#929292ff' }}>Level up your developer career<br /> with senior mentors.</p>

                                <div style={{ display: 'flex', gap: 20 }}>
                                    <div className='Footer_icons'>
                                        <Link to=""><FaInstagram className='Footer_icons_style' /></Link>
                                    </div>
                                    <div className='Footer_icons'>
                                        <Link to=""><FiTwitter className='Footer_icons_style' /></Link>
                                    </div>
                                    <div className='Footer_icons'>
                                        <Link to=""><FiFacebook className='Footer_icons_style' /></Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-3'>
                            <div style={{ textAlign: 'center', }}>
                                <h4 style={{ color: 'white', textAlign: 'center' }}>Quick Links</h4>
                                <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <Link to='/' className='links'>Home</Link>
                                    <Link to='/course' className='links'>Course</Link>
                                    <Link to="" className='links'>Live Classes</Link>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-3'>
                            <div style={{ textAlign: 'center', }}>
                                <h4 style={{ color: 'white', textAlign: 'center' }}>Resuorces</h4>
                                <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <Link to="" className='links'>Exam</Link>
                                    <Link to="" className='links'>Tearcher</Link>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-3'>
                            <div style={{ textAlign: 'center', }}>
                                <h4 style={{ color: 'white', textAlign: 'center' }}>Company</h4>
                                <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <Link to='/about' className='links'>About</Link>
                                    <Link to='/contact' className='links'>Contact</Link>
                                    <Link to="" className='links'>Careers</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr style={{ color: 'white', marginBottom: 30 }} />
                <p style={{ marginLeft: 70, color: '#b6b6b6ff' }}>Copyright © 2024 Dev Coaching | All rights reserved.</p>
            </section>
        </>
    )
}

export default Footer;
