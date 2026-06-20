const express = require("express");
const { getNotes, createNote, deleteNote } = require('../controller/note.controller.js');
const router = express.Router();

router.use(express.json());

router.get("/notes", getNotes);
router.post("/notes", createNote);
router.delete("/notes/:id", deleteNote);

module.exports = router;
