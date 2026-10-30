const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const message = String(req.body.message || "").trim();

    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ message: "Name must be between 2 and 100 characters." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    if (message.length < 5 || message.length > 2000) {
      return res.status(400).json({ message: "Message must be between 5 and 2000 characters." });
    }

    await Contact.create({ name, email, message });
    res.status(201).json({ message: "Thank you! Your enquiry has been saved." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not send your message. Please try again." });
  }
});

module.exports = router;