import './Instructors.css';
import { FiUsers, FiMessageSquare, FiCalendar } from 'react-icons/fi';

function Instructors() {
    return (
        <div style={{ paddingTop: "80px" }} className='Instructors_Body'>
            <section className='Instructors_Main_Section'>
                <div className='container'>
                    <div className='row instructor'>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <h2 style={{ fontSize: 15, fontWeight: 'bold' }} className='Lable_instructor'>INSTRUCTORS</h2>
                        </div>
                        <h1 style={{ color: "white", marginTop: 50, marginLeft: 40, textAlign: 'center' }}>Hello instructors</h1>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Instructors;