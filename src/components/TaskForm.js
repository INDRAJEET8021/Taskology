import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";


const TaskForm = ({ open, onAddTask, taskToEdit, onUpdateTask, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Effect to set the values for editing task
  useEffect(() => {
    if (taskToEdit) {
      setName(taskToEdit.name);
      setDescription(taskToEdit.description);
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Task name is required.");

    if (taskToEdit) {
      onUpdateTask({ ...taskToEdit, name, description }); // Update the existing task
    } else {
      onAddTask({ name, description }); // Add a new task
    }

    setName("");
    setDescription("");
    onClose(); // Close modal after adding or updating task
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle align="center">
        {taskToEdit ? "Edit Task" : "Add a New Task"}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Task Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {taskToEdit ? "Update Task" : "Add Task"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
