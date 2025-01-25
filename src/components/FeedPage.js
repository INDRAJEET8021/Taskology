import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Modal,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Avatar,
  Divider,
  Box,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "./AuthContext/AuthContext";
import AuthPage from "./Auth/AuthPage";
import GlobalLoader from "./Loader/GlobalLoader";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const { isLoggedIn, username, logout } = useAuth();
  const [newCaption, setNewCaption] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // Showing Post
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://taskology-5brp.onrender.com/feed/all");
        setPosts(response.data.feeds);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle file selection for the new post
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));
    setNewPhotoUrl(file);
  };

  // Add Post
  const handleAddPost = async () => {
    const formData = new FormData();
    formData.append("image", newPhotoUrl);
    formData.append("caption", newCaption);

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        "https://taskology-5brp.onrender.com/feed/add-feed",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newPost = response.data.feed;

      // Update posts state with the new post
      setPosts([response.data.feed, ...posts]);
      // Reset modal and form fields
      setNewCaption("");
      setNewPhotoUrl("");
      setImagePreview("");
      setOpenModal(false);
    } catch (error) {
      console.error("Error posting feed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Typography variant="h4" gutterBottom>
          Feeds
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            isLoggedIn ? setOpenModal(true) : setShowAuthPopup(true)
          }
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            padding: "10px 16px",
            borderRadius: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "#0052cc",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <DynamicFeedIcon className="mr-2" />
          Post
        </Button>
      </div>
      {showAuthPopup && (
        <div>
          <AuthPage onClose={() => setShowAuthPopup(false)} />
        </div>
      )}

      {/* Modal for Adding a Post */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        className="flex items-center justify-center"
      >
        <div
          className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg"
          style={{
            position: "relative",
            zIndex: 1300,
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            className="font-semibold text-xl"
          >
            Create a Post
          </Typography>

          {/* File Input for Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4 p-2 border border-gray-300 rounded w-full"
          />

          {/* Image Preview */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mb-4 max-h-48 w-full object-cover rounded-md shadow-md"
            />
          )}

          {/* Caption Text Field */}
          <TextField
            label="Caption"
            fullWidth
            value={newCaption}
            onChange={(e) => setNewCaption(e.target.value)}
            className="mb-6"
          />

          {/* Post Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPost}
            disabled={!newCaption || !newPhotoUrl}
            className="w-full mt-4"
          >
            Post
          </Button>
        </div>
      </Modal>
      <GlobalLoader open={loading} />

      {/* Display posts */}
      <div className="space-y-6">
        <GlobalLoader open={loading} />

        {posts.map((post) => (
          <Card
            key={post._id}
            className="bg-white shadow-lg rounded-lg p-4 max-w-full mx-auto"
          >
            <div className="flex items-center space-x-2 mb-2">
              {post.user ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1, // Small gap between avatar and text
                    padding: "5px", // Reduced padding
                    borderRadius: "8px",
                    backgroundColor: "#abafb3", // Blue background
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)", // Light shadow
                  }}
                >
                  {/* Avatar with border */}
                  <Avatar
                    sx={{
                      width: 30, // Smaller avatar size
                      height: 30,
                      bgcolor: "#c71a48", // Tomato color
                      border: "0.5px solid #0c0d0d", // White border
                    }}
                    alt={post.user.username}
                    src={post.user.avatar || "/default-avatar.jpg"}
                  />

                  {/* Username */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: "#55585c", // White text for contrast
                      fontSize: "0.875rem", // Smaller font size
                    }}
                  >
                    {post.user.username}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Unknown User
                </Typography>
              )}
            </div>

            <CardMedia
              component="img"
              alt="Post image"
              image={post.imageUrl}
              title="Post image"
              className="mb-4"
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <Divider className="my-4" />
            <CardContent>
              <Typography variant="body1">{post.caption}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
