const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authenticate = require("../middleware/authenticate");

// Add a task
router.post("/add", authenticate, async (req, res) => {
  if (!req.body.name || !req.body.description) {
    return res
      .status(400)
      .json({ message: "Name and description are required" });
  }

  const { name, description } = req.body;

  try {
    const task = new Task({
      name,
      description,
      user: req.user.id, // Replace with authenticated user ID
    });
    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get tasks for the user
router.get("/user-task", authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update task status
router.put("/:id/status", authenticate, async (req, res) => {
  const { status } = req.body;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a task
router.delete("/:id/delete", authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update task  Detais
router.put("/:id/detail-update", authenticate, async (req, res) => {
  const { name, description } = req.body;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, description },

      { new: true }
    );
    if (!task) return res.status(404).json({ Message: "Task Not Found" });
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
