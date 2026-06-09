import './Course.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LiaRupeeSignSolid } from "react-icons/lia";


function Course() {
    const [Subject, setSubject] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get("http://localhost:9000/api/Course")
            .then((res) => {
                setSubject(res.data?.course || []);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const filteredCourses = Subject.filter((sub) => {
        const matchCategory =
            selectedCategory === 'ALL' ||
            sub.title?.toLowerCase() === selectedCategory.toLowerCase();

        const matchSearch =
            sub.courseName?.toLowerCase().includes(search.toLowerCase()) ||
            sub.title?.toLowerCase().includes(search.toLowerCase());

        return matchCategory && matchSearch;
    });

    return (
        <>
            <div className='Course_Body_Section'>
                <section className='container'>
                    <h1 style={{ color: 'white' }}>All Courses</h1>
                    <p style={{ fontSize: 20, color: '#727272ff' }}>
                        Choose from our expert-led developer courses
                    </p>

                    <div style={{ gap: 20, display: 'flex', color: 'white' }}>
                        <button
                            className={`btn btn-md ${selectedCategory === 'ALL' ? 'btn-info' : 'btn-dark'}`}
                            onClick={() => setSelectedCategory('ALL')}
                        >
                            ALL
                        </button>

                        <button
                            className={`btn btn-md ${selectedCategory === 'PYTHON' ? 'btn-info' : 'btn-dark'}`}
                            onClick={() => setSelectedCategory('PYTHON')}
                        >
                            PYTHON
                        </button>

                        <button
                            className={`btn btn-md ${selectedCategory === 'BACKEND' ? 'btn-info' : 'btn-dark'}`}
                            onClick={() => setSelectedCategory('BACKEND')}
                        >
                            BACKEND
                        </button>

                        <button
                            className={`btn btn-md ${selectedCategory === 'MERN STACK' ? 'btn-info' : 'btn-dark'}`}
                            onClick={() => setSelectedCategory('MERN STACK')}
                        >
                            MERN STACK
                        </button>
                    </div>

                    <div className='search_course'>
                        <input
                            type="text"
                            className='course'
                            placeholder='Search'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </section>

                <section>
                    <div className='container'>
                        <div className='row'>
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((sub) => (
                                    <div className="col-md-4" key={sub._id}>
                                        <div className="Course_section">
                                            <div>
                                                <p className="course_tag">{sub.title}</p>
                                            </div>

                                            <h4 className="CourseName">{sub.courseName}</h4>

                                            <p style={{ color: "#919191ff" }}>{sub.Disp}</p>

                                            <div style={{ display: 'flex' }}>
                                                <h6 style={{ color: "white", fontSize: 20 }}>
                                                    <LiaRupeeSignSolid />
                                                    {sub.Price}
                                                </h6>

                                                <p style={{
                                                    marginLeft: 250,
                                                    fontSize: 20,
                                                    fontWeight: 'bold',
                                                    color: 'white'
                                                }}>
                                                    {sub.CourseStatus}
                                                </p>
                                            </div>

                                            <button className="enroll_btn">Buy Now</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className='Course_Noties'>
                                    <h2 style={{ color: '#afafafff', fontSize: 40, textAlign: 'center' }}>Course Not Found ... !</h2>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Course;