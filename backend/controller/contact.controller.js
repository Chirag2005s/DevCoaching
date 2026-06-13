const { contact } = require("../models/contact.models.js")



//GET method
const getContact = async (req, res) => {
    const Message = await contact.find();

    res.status(200).json({ message: Message });
}





// POST method
const sendMessage = async (req, res) => {
    const { name, email, subject, message } = req.body;
    const Message = await contact.findOne({ message })
    try {

        if (!name || !email || !subject || !message) {
            res.status(401).json({ message: `All fields required...` });
        }

        if (Message) {
            return res.json({ message: `Message is already sended...` });
        }

        const newContact = new contact({
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message
        })

        await newContact.save();

        res.status(201).json({ message: req.body });

    }
    catch (err) {
        res.status(500).json({ message: `${err.message}` });
    }
}



// Delete mehtod

module.exports = { sendMessage, getContact };