// const mongoose = require("mongoose");
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true, enum: ['Courses', 'Live Classes', 'Enrollment', 'Other'] },
    message: { type: String, required: true }
}, { timestamps: true })

export const contact = mongoose.model("contact", contactSchema);