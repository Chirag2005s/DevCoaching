const { Note } = require('../models/note.models.js');

// Get all notes with optional category filter
const getNotes = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category && category.toUpperCase() !== 'ALL') {
            query.category = { $regex: new RegExp('^' + category + '$', 'i') };
        }
        const notes = await Note.find(query).sort({ createdAt: -1 });
        res.status(200).json({ notes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new note
const createNote = async (req, res) => {
    try {
        const { title, subject, content, category, author } = req.body;

        if (!title || !subject || !content || !category || !author) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newNote = new Note({
            title,
            subject,
            content,
            category,
            author
        });

        await newNote.save();
        res.status(201).json({ message: "Note created successfully", note: newNote });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a note by ID
const deleteNote = async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getNotes,
    createNote,
    deleteNote
};
