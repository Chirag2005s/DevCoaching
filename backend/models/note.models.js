const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    noteType: {
        type: String,
        enum: ["text", "link", "pdf"],
        default: "text"
    },
    link: {
        type: String,
        default: ""
    },
    pdfUrl: {
        type: String,
        default: ""
    },
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Note = mongoose.model("Note", noteSchema);

module.exports = { Note };
