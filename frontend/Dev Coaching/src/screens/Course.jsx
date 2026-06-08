import './Course.css'
import { CiSearch } from "react-icons/ci";
import Location from "react-router-dom";

function Course() {

    // const [Subject, setSubject] = useState([]);

    // useEffect(() => {
    //     axios.get("http://localhost:9000/api/Course")
    //         .then((res) => {
    //             setSubject(res.data?.course || []);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
    // }, [])


    return (
        <>
            <div className='Course_Body_Section'>



                {/* <section className='container'>
                    <h1 style={{ color: 'white' }}>All Courses</h1>
                    <p style={{ fontSize: 20, color: '#727272ff' }}>Choose from our expert-led developer courses</p>

                    <div style={{ gap: 20, display: 'flex', color: 'white' }}>
                        <button className='btn btn-dark btn-md'>ALL</button>
                        <button className='btn btn-dark btn-md'>PYTHON</button>
                        <button className='btn btn-dark btn-md'>BACKEND</button>
                    </div>
                </section> */}

            </div>


        </>
    );
}

export default Course