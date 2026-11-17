
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// User Registration
router.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    if (
        typeof name !== "string" || !name.trim() ||
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        typeof password !== "string" || password.length < 6
    ) {
        return res.status(400).json({
            message: "Provide a valid name, email and password (minimum 6 characters)."
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        const existingUser = db.prepare(
            "SELECT id FROM users WHERE email = ?"
        ).get(normalizedEmail);

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered."
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const result = db.prepare(`
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `).run(name.trim(), normalizedEmail, hashedPassword);

        return res.status(201).json({
            message: "Registration successful.",
            user: {
                id: result.lastInsertRowid,
                name: name.trim(),
                email: normalizedEmail
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Registration failed."
        });
    }
});

// User Login
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        typeof password !== "string" ||
        !password
    ) {
        return res.status(400).json({
            message: "Valid email and password are required."
        });
    }

    try {
        const user = db.prepare(
            "SELECT * FROM users WHERE email = ?"
        ).get(email.trim().toLowerCase());

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Login failed."
        });
    }
});

// Get logged-in user
router.get("/me", authenticateToken, (req, res) => {
    const user = db.prepare(
        "SELECT id, name, email, created_at FROM users WHERE id = ?"
    ).get(req.user.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found."
        });
    }

    res.status(200).json({ user });
});

module.exports = router;
