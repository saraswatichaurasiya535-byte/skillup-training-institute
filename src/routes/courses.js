const express = require("express");

const router = express.Router();

const courses = [
  {
    id: "web-development",
    title: "Web Development",
    category: "DESIGN & DEVELOPMENT",
    description: "Build responsive websites with HTML, CSS and JavaScript.",
    duration: "3 months",
    level: "Beginner",
    icon: "🌐"
  },
  {
    id: "python",
    title: "Python Programming",
    category: "PROGRAMMING",
    description: "Learn Python fundamentals, functions and problem-solving.",
    duration: "2 months",
    level: "Beginner",
    icon: "🐍"
  },
  {
    id: "full-stack",
    title: "Full-Stack Development",
    category: "CAREER TRACK",
    description: "Create complete applications with Node.js, Express and MongoDB.",
    duration: "6 months",
    level: "Beginner to Intermediate",
    icon: "💻"
  }
];

router.get("/", (req, res) => {
  res.json({ courses });
});

module.exports = router;