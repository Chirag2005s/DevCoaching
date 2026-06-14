const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    Logo: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true,
        unique: true
    },
    Title: {
        type: String,
        required: true
    },
    Discprition: {
        type: String,
        required: true
    },
    Exprience: {
        type: String,
        required: true
    },
    Rating: {
        type: Number,
        required: true
    },
    Status: {
        type: String,
        required: true,
        enum: ["active", "inactive"],
        default: "active"
    },
    ID: {
        type: String,
        required: true
    },
    Qualification: {
        type: String,
        required: true,
        enum: ["BCA", "MCA", "B.Tech CSE"]
    },
    JoinDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    Gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
        default: "Male"
    },
    PhoneNo: {
        type: Number,
        required: true
    },
    Email: {
        type: String,
        required: true
    },


}, { timestamps: true })

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = { Teacher };