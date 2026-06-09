const { Course } = require('../models/course.models.js');



// Get Data
const getCourse = async (req, res) => {
    const course = await Course.find();
    res.status(200).json({ course });
};



// Post data
const createCourse = async (req, res) => {
    try {

        const { title, Disp, Price, courseName, CourseStatus } = req.body;
        const course = await Course.findOne({ courseName });


        if (!courseName || !title || !Disp || !Price || !CourseStatus) {
            res.json({ message: `All fields is Required` });
        }

        if (course) {
            return res.status(200).json({
                message: `Course Already Exits ${courseName}`
            })
        }


        const newCourse = new Course({
            courseName: req.body.courseName,
            title: req.body.title,
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
}

module.exports = {
    createCourse, getCourse, deleteCourse
};
