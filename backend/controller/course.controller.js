const { Course } = require('../models/course.models.js');



let seeded = false;
const seedDefaultTopics = async () => {
    if (seeded) return;
    try {
        const courses = await Course.find();
        for (let course of courses) {
            if (!course.Topics || course.Topics.length === 0) {
                const lang = course.Language?.toUpperCase() || '';
                let topics = [];
                if (lang.includes('PYTHON') || lang.includes('DATA')) {
                    topics = [
                        "Python fundamentals & OOP concepts",
                        "Web development with Flask & Django APIs",
                        "Data analysis using Pandas & NumPy",
                        "File handling, Web Scraping & Automation",
                        "Real-world projects & exam preparation"
                    ];
                } else if (lang.includes('FRONTEND') || lang.includes('REACT')) {
                    topics = [
                        "JavaScript ES6+ fundamentals & DOM manipulation",
                        "Frontend component architecture with React",
                        "Vite, React Router, Hooks & Context API",
                        "Responsive CSS Layout systems & UI design",
                        "Full application deployment & portfolio creation"
                    ];
                } else if (lang.includes('BACKEND') || lang.includes('NODE') || lang.includes('MERN')) {
                    topics = [
                        "Server-side development with Node.js & Express",
                        "RESTful API design and route parameters",
                        "Database integration and schemas with MongoDB",
                        "JWT authentication & route protection",
                        "API deployment & testing with Postman"
                    ];
                } else if (lang.includes('UI/UX') || lang.includes('FIGMA') || lang.includes('DESIGN')) {
                    topics = [
                        "User research, UX workflows & wireframes",
                        "High-fidelity prototyping & design systems in Figma",
                        "Figma components, Auto-layout & variables",
                        "Mobile layout design (iOS & Android)",
                        "Developer handoff & design specification guides"
                    ];
                } else {
                    topics = [
                        "Core programming concepts & structures",
                        "Real-world application implementation",
                        "Testing, debugging & quality standards",
                        "Deployment best practices & DevOps",
                        "Direct code reviews & 1:1 mentor sync sessions"
                    ];
                }
                course.Topics = topics;
                await course.save();
            }
        }
        seeded = true;
    } catch (err) {
        console.error("Error seeding default topics:", err);
    }
};

// Get Data
const getCourse = async (req, res) => {
    await seedDefaultTopics();
    const course = await Course.find();
    res.status(200).json({ course });
};



// Post data
const createCourse = async (req, res) => {
    try {
        const { Language, Disp, Price, courseName, CourseStatus, Topics } = req.body;

        if (!courseName || !Language || !Disp || !Price || !CourseStatus) {
            return res.status(400).json({ message: `All fields is Required` });
        }

        const course = await Course.findOne({ courseName });

        if (course) {
            return res.status(200).json({
                message: `Course Already Exits ${courseName}`
            })
        }


        const newCourse = new Course({
            courseName: req.body.courseName,
            Language: req.body.Language,
            Disp: req.body.Disp,
            Price: req.body.Price,
            CourseStatus: req.body.CourseStatus,
            Topics: req.body.Topics || []
        });


        await newCourse.save();


        res.status(201).json({ message: req.body });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Delete method
const deleteCourse = async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);

        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get course by ID
const getCourseById = async (req, res) => {
    try {
        await seedDefaultTopics();
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ course });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createCourse, getCourse, deleteCourse, getCourseById
};
