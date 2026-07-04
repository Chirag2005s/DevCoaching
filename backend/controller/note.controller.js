const { Note } = require('../models/note.models.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config for PDF uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB max
});

// Get all notes with optional category filter
const getNotes = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category && category.toUpperCase() !== 'ALL') {
            query.category = { $regex: new RegExp('^' + category + '$', 'i') };
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { title: searchRegex },
                { subject: searchRegex },
                { author: searchRegex }
            ];
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
        const { title, subject, content, category, author, noteType, link, pdfUrl } = req.body;

        if (!title || !subject || !category || !author) {
            return res.status(400).json({ message: "Title, subject, category, and author are required" });
        }

        const type = noteType || 'text';

        // Conditional validation based on noteType
        if (type === 'text' && !content) {
            return res.status(400).json({ message: "Content is required for text notes" });
        }
        if (type === 'link' && !link) {
            return res.status(400).json({ message: "Link URL is required for link notes" });
        }
        if (type === 'pdf' && !pdfUrl) {
            return res.status(400).json({ message: "PDF file is required for PDF notes" });
        }

        const newNote = new Note({
            title,
            subject,
            content: content || '',
            category,
            author,
            noteType: type,
            link: link || '',
            pdfUrl: pdfUrl || '',
            likes: 0,
            views: 0
        });

        await newNote.save();
        res.status(201).json({ message: "Note created successfully", note: newNote });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Upload PDF file
const uploadPdf = (req, res) => {
    const uploadSingle = upload.single('pdf');

    uploadSingle(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: "File size exceeds 20MB limit" });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No PDF file uploaded" });
        }

        const pdfUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({ message: "PDF uploaded successfully", pdfUrl, originalName: req.file.originalname });
    });
};

// Update a note by ID
const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subject, content, category, author, noteType, link, pdfUrl } = req.body;

        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        // Update fields if provided
        if (title !== undefined) note.title = title;
        if (subject !== undefined) note.subject = subject;
        if (content !== undefined) note.content = content;
        if (category !== undefined) note.category = category;
        if (author !== undefined) note.author = author;
        if (noteType !== undefined) note.noteType = noteType;
        if (link !== undefined) note.link = link;
        if (pdfUrl !== undefined) note.pdfUrl = pdfUrl;

        await note.save();
        res.status(200).json({ message: "Note updated successfully", note });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Like a note (increment likes)
const likeNote = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findByIdAndUpdate(
            id,
            { $inc: { likes: 1 } },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({ message: "Note liked", likes: note.likes });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// View a note (increment views and return note data)
const viewNote = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({ note });
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

        // If it was a PDF note, delete the file from disk
        if (deletedNote.pdfUrl) {
            const filePath = path.join(__dirname, '..', deletedNote.pdfUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getNotes,
    createNote,
    uploadPdf,
    updateNote,
    likeNote,
    viewNote,
    deleteNote
};
