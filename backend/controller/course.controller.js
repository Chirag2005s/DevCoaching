const { Course } = require('../models/course.models.js');



// Get Data
const getCourse = async (req, res) => {
    const course = await Course.find();
    res.status(200).json({ course });
};



// Post data
const createCourse = async (req, res) => {
    try {
        const { Language, Disp, Price, courseName, CourseStatus } = req.body;

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
