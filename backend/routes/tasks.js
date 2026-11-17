
const express = require("express");
const db = require("../config/database");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.use(authenticateToken);

function formatTask(task) {
    return {
        ...task,
        completed: Boolean(task.completed)
    };
}

// CREATE TASK
router.post("/", (req, res) => {
    const { title, description = "" } = req.body;

    if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof description !== "string"
    ) {
        return res.status(400).json({
            message: "A valid title and description are required."
        });
    }

    try {
        const result = db.prepare(`
            INSERT INTO tasks (user_id, title, description)
            VALUES (?, ?, ?)
        `).run(req.user.id, title.trim(), description.trim());

        const task = db.prepare(
            "SELECT * FROM tasks WHERE id = ? AND user_id = ?"
        ).get(result.lastInsertRowid, req.user.id);

        return res.status(201).json({
            message: "Task created successfully.",
            task: formatTask(task)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Could not create task." });
    }
});

// READ ALL TASKS
router.get("/", (req, res) => {
    const tasks = db.prepare(`
        SELECT * FROM tasks
        WHERE user_id = ?
        ORDER BY id DESC
    `).all(req.user.id);

    res.status(200).json({
        count: tasks.length,
        tasks: tasks.map(formatTask)
    });
});

// READ SINGLE TASK
router.get("/:id", (req, res) => {
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
        return res.status(400).json({ message: "Invalid task ID." });
    }

    const task = db.prepare(`
        SELECT * FROM tasks
        WHERE id = ? AND user_id = ?
    `).get(taskId, req.user.id);

    if (!task) {
        return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({ task: formatTask(task) });
});

// UPDATE TASK
router.patch("/:id", (req, res) => {
    const taskId = Number(req.params.id);
    const { title, description, completed } = req.body;

    if (!Number.isInteger(taskId) || taskId <= 0) {
        return res.status(400).json({ message: "Invalid task ID." });
    }

    const fields = [];

    if (Object.hasOwn(req.body, "title")) {
        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ message: "Title cannot be empty." });
        }
        fields.push(["title", title.trim()]);
    }

    if (Object.hasOwn(req.body, "description")) {
        if (typeof description !== "string") {
            return res.status(400).json({ message: "Invalid description." });
        }
        fields.push(["description", description.trim()]);
    }

    if (Object.hasOwn(req.body, "completed")) {
        if (typeof completed !== "boolean") {
            return res.status(400).json({ message: "Completed must be true or false." });
        }
        fields.push(["completed", completed ? 1 : 0]);
    }

    if (fields.length === 0) {
        return res.status(400).json({
            message: "Provide at least one field to update."
        });
    }

    try {
        const task = db.prepare(`
            SELECT id FROM tasks WHERE id = ? AND user_id = ?
        `).get(taskId, req.user.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        const setClause = fields.map(([field]) => `${field} = ?`).join(", ");
        const values = fields.map(([, value]) => value);

        db.prepare(`
            UPDATE tasks SET ${setClause}
            WHERE id = ? AND user_id = ?
        `).run(...values, taskId, req.user.id);

        const updatedTask = db.prepare(
            "SELECT * FROM tasks WHERE id = ? AND user_id = ?"
        ).get(taskId, req.user.id);

        res.status(200).json({
            message: "Task updated successfully.",
            task: formatTask(updatedTask)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Could not update task." });
    }
});

// DELETE TASK
router.delete("/:id", (req, res) => {
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
        return res.status(400).json({ message: "Invalid task ID." });
    }

    const result = db.prepare(`
        DELETE FROM tasks WHERE id = ? AND user_id = ?
    `).run(taskId, req.user.id);

    if (result.changes === 0) {
        return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({
        message: "Task deleted successfully."
    });
});

module.exports = router;
