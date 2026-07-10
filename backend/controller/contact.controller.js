const { Contact } = require("../models/contact.models.js");

const getContact = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ messages });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name?.trim() || !email?.trim() || !subject || !message?.trim()) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newContact = new Contact({
            name: name.trim(),
            email: email.trim(),
            subject,
            message: message.trim(),
        });

        await newContact.save();

        res.status(201).json({
            message: "Message sent successfully. We'll get back to you within 24 hours.",
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { sendMessage, getContact };
