import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { Button, Typography, Paper } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [token, setToken] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate(); // Hook to handle navigation

  // Function to extract token from query parameters
  const getTokenFromQuery = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token');
  };

  useEffect(() => {
    // Retrieve token from query parameters
    const token = getTokenFromQuery();
    if (token) {
      setToken(token);
      login(token);
      navigate('/dashboard'); // Redirect to dashboard after login
    }
  }, [login, navigate]);

  if (!token) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 bg-opacity-50">
      <Paper className="p-8 rounded-lg shadow-lg bg-white w-96">
        <div className="flex flex-col items-center space-y-4">
          <img
            src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" // Google Logo
            alt="Google Logo"
            className="w-16 h-16 mb-4"
          />
          <CheckCircleOutline className="text-green-500 text-6xl" />
          <Typography variant="h4" className="text-center font-bold text-gray-900">
            Success! You're Logged In.
          </Typography>
          <Typography className="text-center text-gray-600">
            You have successfully authenticated with Google.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate('/')} // Use navigate for redirection
            className="mt-4"
          >
            Go to Home
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default Dashboard;
