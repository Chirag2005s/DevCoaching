import Button from '@mui/material/Button';
import './Navbar.css';
import { FaLaptopCode } from "react-icons/fa6";
import { FiLogIn } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';


function Navbar() {
    const navigate = useNavigate();
    return (
        <>

            <section className='Nav_Section'>
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <div style={{ paddingTop: 10 }}>
                                <h3 style={{ color: 'white' }}><FaLaptopCode style={{ fontSize: 40, marginRight: 10, color: '#6c9eff' }} />Dev <span style={{ color: '#6c9eff' }}>Coaching</span></h3>
                            </div>
                        </div>

                        <div className="col-md-5">
                            <div style={{ justifyContent: 'center', display: 'flex', gap: 10 }}>
                                <Button onClick={() => navigate('/')} className='Nav_btn'>Home</Button>
                                <Button onClick={() => navigate('/add-course')} className='Nav_btn'>Course</Button>
                                <Button className='Nav_btn'>Notes & Exam</Button>
                                <Button className='Nav_btn'>Instructors</Button>
                                <Button onClick={() => navigate('/about')} className='Nav_btn'>About</Button>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div style={{ justifyContent: "end-start", display: 'flex', gap: 15, marginTop: 10 }}>
                                <button className='Nav_Login'><FiLogIn style={{ marginRight: 10 }} />Login</button>
                                <button className='Sgin_up'>Sign up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Navbar;