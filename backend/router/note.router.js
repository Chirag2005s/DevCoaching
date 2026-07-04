const express = require("express");
const { getNotes, createNote, uploadPdf, updateNote, likeNote, viewNote, deleteNote } = require('../controller/note.controller.js');
const router = express.Router();

router.use(express.json());

router.get("/notes", getNotes);
router.post("/notes", createNote);
router.post("/notes/upload-pdf", uploadPdf);
router.put("/notes/:id", updateNote);
router.patch("/notes/:id/like", likeNote);
router.patch("/notes/:id/view", viewNote);
router.delete("/notes/:id", deleteNote);

module.exports = router;
