const express = require("express");

const { sendMessage } = require('../controller/contact.controller.js');
const { getContact } = require('../controller/contact.controller.js');
const router = express.Router();

router.use(express.json());

router.post("/Contact", sendMessage);
router.get("/Contact", getContact);

module.exports = router;