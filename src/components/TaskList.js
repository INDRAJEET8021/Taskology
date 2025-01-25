import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd"; // Updated import
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { Button, Divider, Typography } from "@mui/material";
import axios from "axios";
import { useAuth } from "./AuthContext/AuthContext";
import AuthPage from "./Auth/AuthPage";
import AddTaskIcon from "@mui/icons-material/AddTask";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null); // Manage the task being edited
  const [isFormOpen, setIsFormOpen] = useState(false); // Open state for task form modal
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const { isLoggedIn, logout } = useAuth();

  // Fatching task
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:5000/task/user-task",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setTasks(response.data.tasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    };

    if (isLoggedIn) {
      fetchTasks();
    }
    if (logout) {
      setTasks([]);
    }
  }, [isLoggedIn]);

  // Adding Task
  const handleAddTask = async (newTask) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/task/add",
        { ...newTask, status: "Pending" }, // Send task details to backend
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token
          },
        }
      );

      const savedTask = response.data.task; // Assuming the backend responds with the saved task

      // Update the state with the new task
      setTasks([...tasks, savedTask]);

      alert("Task added successfully!");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again.");
    } finally {
      setIsFormOpen(false); // Close form after adding the task
    }
  };

  // Delete Task
  const handleDeleteTask = async (_id) => {
    // console.log("task id", _id);
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:5000/task/${_id}/delete`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTasks(tasks.filter((task) => task._id !== _id)); // Use _id if that's the field name
        alert("Task deleted successfully");
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task. Please try again.");
      }
    }
  };
  //  Edit Task
  const handleEditTask = (task) => {
    setTaskToEdit(task); // Set the task to edit
    setIsFormOpen(true); // Open the modal for editing
  };
  // Update Task
  const handleUpdateTask = async (updatedTask) => {
    const _id = updatedTask._id;

    try {
      const response = await axios.put(
        `http://localhost:5000/task/${_id}/detail-update`,
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token if needed
          },
        }
      );

      const updatedTaskFromAPI = response.data.task;

      setTasks(
        tasks.map((task) =>
          task._id === updatedTaskFromAPI._id ? updatedTaskFromAPI : task
        )
      );

      alert("Task updated successfully");

      setTaskToEdit(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update. Please try again.");
    }
  };
  // Close Form
  const handleCloseForm = () => {
    setIsFormOpen(false); // Close the form modal
    setTaskToEdit(null); // Reset task to edit
  };

  // Handle the drag and drop logic
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    const taskId = draggableId; // Get task ID from draggable
    const newStatus = destination.droppableId; // New status from droppable ID

    try {
      // Optimistic update for UI
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );

      // Update status in backend
      const response = await axios.put(
        `http://localhost:5000/task/${taskId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to update task on the server.");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status. Please try again.");

      // Revert task status in case of error:
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: source.droppableId } : task
        )
      );
    }
  };
  return (
    <div className="p-4">
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          isLoggedIn ? setIsFormOpen(true) : setShowAuthPopup(true)
        }
      >
        <AddTaskIcon className="mr-1" />
        Add Task
      </Button>

      {/* TaskForm Modal */}
      <TaskForm
        open={isFormOpen} 
        onAddTask={handleAddTask}
        taskToEdit={taskToEdit}
        onUpdateTask={handleUpdateTask}
        onClose={handleCloseForm} 
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {["Pending", "Completed", "Done"].map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <h2 className="text-lg font-bold mb-4 text-center">
                    {status}
                  </h2>
                  <Divider className="mt-0" />
                  {tasks.length > 0 ? (
                    tasks
                      .filter((task) => task.status === status)
                      .map((task, index) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          index={index}
                          onDelete={handleDeleteTask}
                          onEdit={() => handleEditTask(task)} // Trigger edit modal
                        />
                      ))
                  ) : (
                    <Typography className="text-center text-gray-500">
                      No tasks found, please add some...
                    </Typography>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {showAuthPopup && (
        <div>
          <AuthPage onClose={() => setShowAuthPopup(false)} />
        </div>
      )}
    </div>
  );
};

export default TaskList;
