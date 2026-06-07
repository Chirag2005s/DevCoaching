import './Contact.css';
import { HiOutlineInformationCircle } from "react-icons/hi";
import { FaLocationArrow } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { MdOutlineWatchLater } from "react-icons/md";


function Contact() {
    return (
        <div style={{ backgroundColor: '#090d16', paddingBottom: 100, paddingTop: 100 }}>
            <section>
                <div className='container'>
                    <div className="row Contact_Title">
                        <h2 style={{ color: 'white', fontSize: 40 }}>Get in Touch With Our Developer Education Team</h2>
                        <p style={{ color: '#b9bcc0' }}>Have questions about live classes, notes, exam papers, courses, or teacher details? Reach out and<br /> our team will help you choose the right learning path.</p>
                    </div>
                </div>
            </section>

            <section>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-5'>
                            <div className='Information_section'>
                                <div style={{ display: 'flex', color: 'white' }}>
                                    <HiOutlineInformationCircle style={{ fontSize: 25, marginRight: 10 }} />
                                    <h4>Contact Information</h4>
                                </div>

                                <div className='first_info'>
                                    <div className="info_logo">
                                        <FaLocationArrow />
                                    </div>

                                    <div>
                                        <h5 style={{ color: 'white' }}>Address</h5>
                                        <p style={{ color: 'white' }}>123 Main St, Anytown, USA</p>
                                    </div>
                                </div>

                                <div className='first_info'>
                                    <div className="info_logo">
                                        <FaPhoneAlt />
                                    </div>

                                    <div>
                                        <h5 style={{ color: 'white' }}>Phone</h5>
                                        <p style={{ color: 'white' }}>+91 9876543210</p>
                                    </div>
                                </div>

                                <div className='first_info'>
                                    <div className="info_logo">
                                        <MdEmail />
                                    </div>

                                    <div>
                                        <h5 style={{ color: 'white' }}>Email</h5>
                                        <p style={{ color: 'white' }}>coachingdev072@gmail.com</p>
                                    </div>
                                </div>

                                <div className='first_info'>
                                    <div className="info_logo">
                                        <MdOutlineWatchLater />
                                    </div>

                                    <div>
                                        <h5 style={{ color: 'white' }}>Working Hours</h5>
                                        <p style={{ color: 'white' }}>Mon to Sat: 9:00 AM - 11:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-7'>
                            <div className='Send_information'>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Contact;