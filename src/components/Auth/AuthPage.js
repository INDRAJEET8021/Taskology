import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";
import RegisterPage from "./RegisterPage";
import { Typography } from "@mui/material";
import ResetPasswordPage from "./ResetPasswordPage";
import GoogleAuthModal from "./Dashboard";


const AuthPage = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const modalRef = useRef(null);

  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      // http://localhost:5000
      const response = await axios.post("https://taskology-5brp.onrender.com/auth/login", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);

      login(token); // This is for global state management (optional)
      setSuccess("Login successful!");

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error("Login Error:", err);

      const errorMessage =
        err.response?.data?.message || 
        err.message ||
        "Something went wrong, please try again.";

      setError(errorMessage);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://taskology-5brp.onrender.com/auth/google';
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✖
        </button>

        {/* Login Form */}
        <h1 className="text-3xl font-semibold mb-6 text-center text-black">
          Sign In
        </h1>
        <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 font-medium">⚠️ {error}</p>}
        {success && (
          <p className="text-green-500 mt-4 font-medium">✅ {success}</p>
        )}

        {/* Divider */}
        <div className="flex items-center my-3">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Auth Button */}
        <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/36px-Google_%22G%22_logo.svg.png"
            alt="Google Logo"
            className="w-5 h-5 mr-2"
          />
          <span className="text-gray-600 font-medium">
            Continue with Google
          </span>
        </button>
        {showModal && <GoogleAuthModal onClose={() => setShowModal(false)} />}


        {/* Forgot Password */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Forgot Password?{" "}
            <button
              onClick={() => setShowResetPopup(true)}
              className="text-blue-600 hover:underline "
            >
              Reset it
            </button>
          </p>
          {showResetPopup && (
            <ResetPasswordPage onClose={() => setShowResetPopup(false)} />
          )}
        </div>

        {/* Error and Success Messages */}

        {/* Register Section */}
        <p className="mt-3 text-center text-black">
          Don't have an account?{" "}
          <button
            onClick={() => setShowRegisterPopup(true)}
            className="text-blue-600 hover:underline focus:outline-none "
          >
            Sign Up
          </button>
        </p>
        {showRegisterPopup && (
          <RegisterPage onClose={() => setShowRegisterPopup(false)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
