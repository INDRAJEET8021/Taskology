import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import TaskList from "./components/TaskList";
import FeedPage from "./components/FeedPage";
import AboutPage from "./components/AboutPage";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import { Box, CssBaseline } from "@mui/material";
import Footer from "./components/Footer";
import Dashboard from "./components/Auth/Dashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Box sx={{ flex: "1" }}>
            <Routes>
              <Route path="/" element={<TaskList />} />
              <Route path="/feeds" element={<FeedPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App;
