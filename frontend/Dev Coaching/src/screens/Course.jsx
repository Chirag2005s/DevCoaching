import './Course.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LiaRupeeSignSolid } from "react-icons/lia";
import { IoSearchOutline } from "react-icons/io5";

function isFreeCourse(course) {
    const status = course.CourseStatus?.toLowerCase?.();
    if (status === 'free') return true;
    if (status === 'paid') return false;
    return Number(course.Price) === 0;
}

function Course() {
    const [Subject, setSubject] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

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
            sub.Language?.toLowerCase() === selectedCategory.toLowerCase();

        const matchSearch =
            sub.courseName?.toLowerCase().includes(search.toLowerCase()) ||
            sub.Language?.toLowerCase().includes(search.toLowerCase());

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
                            className={`btn btn-md ${selectedCategory === 'FRONTEND' ? 'btn-info' : 'btn-dark'}`}
                            onClick={() => setSelectedCategory('FRONTEND')}
                        >
                            FRONTEND
                        </button>

                        <button
                            className={`btn btn-md ${selectedCategory === 'BACKEND' ? 'btn-info' : 'btn-dark'}`}
                            onClick={() => setSelectedCategory('BACKEND')}
                        >
                            BACKEND
                        </button>

                        <button
                            className={`btn btn-md ${selectedCategory === 'UI/UX' ? 'btn-info' : 'btn-dark'}`}
                            onClick={() => setSelectedCategory('UI/UX')}
                        >
                            UI/UX DESIGNER
                        </button>
                    </div>

                    <div className='course-search'>
                        <IoSearchOutline className='course-search__icon' />
                        <input
                            type="text"
                            className='course-search__input'
                            placeholder='Search courses by name or category...'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </section>

                <section>
                    <div className='container'>
                        <div className='row'>
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((sub) => {
                                    const free = isFreeCourse(sub);
                                    return (
                                        <div className="col-md-4 course-card-col" key={sub._id}>
                                            <div className="course-card">
                                                <div className="course-card__header">
                                                    <span className="course-card__tag">{sub.Language}</span>
                                                    <span className={`course-card__status${free ? ' course-card__status--free' : ' course-card__status--paid'}`}>
                                                        {free ? 'Free' : 'Paid'}
                                                    </span>
                                                </div>

                                                <h4 className="course-card__title">{sub.courseName}</h4>
                                                <p className="course-card__desc">{sub.Disp}</p>

                                                <div className="course-card__footer">
                                                    {free ? (
                                                        <h6 className="course-card__price course-card__price--free">Free</h6>
                                                    ) : (
                                                        <h6 className="course-card__price">
                                                            <LiaRupeeSignSolid />
                                                            {sub.Price}
                                                        </h6>
                                                    )}
                                                </div>

                                                <button
                                                    className={`course-card__enroll${free ? ' course-card__enroll--trial' : ' course-card__enroll--buy'}`}
                                                    onClick={() => navigate(`/course/${sub._id}`)}
                                                >
                                                    {free ? 'Free Trial' : 'Buy Now'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
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