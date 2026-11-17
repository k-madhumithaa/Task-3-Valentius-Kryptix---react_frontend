
require("dotenv").config();

const express = require("express");
const db = require("./config/database");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    req.body = req.body || {};
    next();
});

app.get("/", (req, res) => {
    res.json({
        message: "Task REST API is running successfully."
    });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found." });
});

// Handle malformed JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ message: "Invalid JSON request body." });
    }

    console.error(err);
    res.status(500).json({ message: "Internal server error." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// Close database connection gracefully
process.on("SIGINT", () => {
    db.close();
    process.exit(0);
});
