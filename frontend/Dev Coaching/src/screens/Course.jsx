import './Course.css'
import { CiSearch } from "react-icons/ci";

function Course() {

    const [Subject, setSubject] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:9000/api/Course")
            .then((res) => {
                setSubject(res.data?.course || []);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])


    return (
        <>

            <div className='Body_Section'>

                <h1 style={{ color: 'white', fontSize: 40, marginLeft: 50, paddingTop: 90 }}>All Courses</h1>
                <p style={{ marginLeft: 50, color: '#686868ff' }}>Choose from our expert-led developer courses.</p>

                <div className='search_course'>
                    <CiSearch className='search_icon' />
                    <input type="search" className='course' placeholder="Search Courses..." />
                </div>
            </div>



            <h2>Data Testing</h2>
            {/* <h2>Course:{Subject.length}</h2> */}
            {/* {Subject.map((course) => (
                <div key={course.id}>
                    <p>{course.courseName}</p>
                </div>
            ))} */}
        </>
    );
}

export default Course