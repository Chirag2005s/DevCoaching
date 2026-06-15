const { Teacher } = require("../models/teacher.models.js");

// Get method
const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json({ teachers });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Post method
const createTeacher = async (req, res) => {
    try {
        const { Logo, Name, Title, Discprition, Exprience, Rating, Status, ID, Qualification, JoinDate, Gender, PhoneNo, Email } = req.body;

        if (!Logo || !Name || !Title || !Discprition || !Exprience || Rating === undefined || !ID || !Qualification || !PhoneNo || !Email) {
            return res.status(400).json({ message: `All required fields must be provided` });
        }

        const teacher = await Teacher.findOne({ Name });

        if (teacher) {
            return res.status(200).json({
                message: `Teacher Already Exits ${Name}`
            })
        }


        const newTeacher = new Teacher({
            Logo: req.body.Logo,
            Name: req.body.Name,
            Title: req.body.Title,
            Discprition: req.body.Discprition,
            Exprience: req.body.Exprience,
            Rating: req.body.Rating,
            Status: req.body.Status,
            ID: req.body.ID,
            Qualification: req.body.Qualification,
            JoinDate: req.body.JoinDate,
            Gender: req.body.Gender,
            PhoneNo: req.body.PhoneNo,
            Email: req.body.Email,
        });


        await newTeacher.save();


        res.status(201).json({ message: req.body });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Delete Method
const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: `All required fields must be provided` });
        }

        const teacher = await Teacher.findOne({ id });

        if (!teacher) {
            return res.status(400).json({ message: `Teacher not found` });
        }

        await Teacher.deleteOne({ id });

        res.status(200).json({ message: `Teacher deleted successfully` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// Patch mthod
const UpdateTeacher = async (req, res) => {
    const UpdateTeacher = await Teacher.findById(req.params.id);

    Object.assign(UpdateTeacher, req.body);
    await UpdateTeacher.save();

    res.status(200).json({
        message: `Updated Teacher ${req.params.id}`
    });
};


module.exports = { createTeacher, getTeachers, deleteTeacher, UpdateTeacher };