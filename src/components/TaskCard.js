import { Draggable } from "@hello-pangea/dnd"; // Updated import
import { IconButton, Card, CardContent, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const TaskCard = ({ task, index, onDelete, onEdit }) => {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card
            className="bg-white shadow-lg rounded-lg mb-4 mt-2 group relative" 
            sx={{
              padding: 2,
              boxShadow: 4,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                {/* Task Name */}
                <Typography variant="h6" className="font-bold text-lg">
                  {task.name}
                </Typography>

                {/* Buttons for Edit and Delete */}
                <div className="flex sm:flex-col sm:space-y-2 absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEdit(task)} // Pass the whole task object
                    className="transition-colors duration-200 hover:text-blue-600"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(task._id)}
                    className="transition-colors duration-200 hover:text-red-600"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>

              {/* Task Description */}
              <Typography variant="body2" className="text-gray-600 mt-2">
                {task.description}
              </Typography>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
