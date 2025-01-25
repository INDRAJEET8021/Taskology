import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, formLabelClasses } from "@mui/material";
import GlobalLoader from "../Loader/GlobalLoader";

const ResetPasswordPage = ({ onClose }) => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const modalRef = useRef(null);

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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/passwordConfig/forgot-password",
        {
          email,
        }
      );

      if (response.data.success) {
        setOtpSuccess(true);
        setLoading(false);
        setSuccess("OTP Sent successfully!");
      } else {
        throw new Error(response.data.message || "Unable to send OTP");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/passwordConfig/reset-password",
        {
          email,
          otp,
          newPassword: password, 
        }
      );

      if (response.data.message) {
        setSuccess(response.data.message); 
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    }
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
        >
          ✖
        </button>

        {/* Form Header */}
        <h1 className="text-2xl mb-4 text-center text-black">
          Reset Your Password
        </h1>

        <>
          {/* Step 1: Email Input */}
          <div className="flex items-center border border-gray-300 rounded-lg mb-4 px-3 py-2 focus-within:ring focus-within:ring-blue-600">
            <i className="fas fa-envelope text-gray-400 mr-2"></i>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow focus:outline-none  text-black"
              required
              disabled={otpSuccess}
            />
            {!otpSuccess ? (
              <button
                onClick={handleSendOtp}
                className="text-blue-600 hover:text-blue-800 ml-2"
              >
                Send OTP
              </button>
            ) : (
              <div>
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              </div>
            )}
          </div>
        </>

        {/* Password Reset Form */}
        <form
          className={`flex flex-col mt-4 ${otpSuccess ? "" : "opacity-50"}`}
          onSubmit={handlePasswordReset}
        >
          {/* OTP Input section */}
          <div className="flex items-center border border-gray-300 rounded-lg mb-4 px-3 py-2 focus-within:ring focus-within:ring-blue-600">
            <i className="fas fa-lock text-gray-400 mr-2"></i>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Only allows numeric input
              className="flex-grow focus:outline-none text-black  "
              required
              disabled={!otpSuccess} // Disabled until OTP is verified
            />
          </div>

          {/* New Password Input section*/}
          <div className="flex items-center border border-gray-300 rounded-lg mb-4 px-3 py-2 focus-within:ring focus-within:ring-blue-600">
            <i className="fas fa-lock text-gray-400 mr-2"></i>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-grow focus:outline-none text-black"
              required
              disabled={!otpSuccess} // Disabled until OTP is verified
            />
            <i
              className={`fas ${
                showPassword ? "fa-eye-slash" : "fa-eye"
              } text-gray-400 cursor-pointer`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          {/* Confirm Password Input section */}
          <div className="flex items-center border border-gray-300 rounded-lg mb-4 px-3 py-2 focus-within:ring focus-within:ring-blue-600">
            <i className="fas fa-lock text-gray-400 mr-2"></i>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-grow focus:outline-none text-black"
              required
              disabled={!otpSuccess} // Disabled until OTP is verified
            />
            <i
              className={`fas ${
                showConfirmPassword ? "fa-eye-slash" : "fa-eye"
              } text-gray-400 cursor-pointer`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            ></i>
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            className={`px-4 py-2 rounded mt-2 ${
              otpSuccess
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!otpSuccess} // Disable the submit  until OTP is verified
          >
            Reset Password
          </button>
        </form>

        
        {error && <p className="text-red-500 mt-2 font-medium">⚠️ {error}</p>}
        {success && (
          <p className="text-green-500 mt-2 font-medium">✅ {success}</p>
        )}

        <p className="mt-4 text-center text-black">
          Back to login?{" "}
          <button
            onClick={onClose}
            className="text-blue-600 hover:underline focus:outline-none "
          >
            Sign In
          </button>
        </p>
      </div>
      <GlobalLoader open={loading} />
    </div>
  );
};

export default ResetPasswordPage;
