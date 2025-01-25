import React, { useEffect } from 'react';
import { CircularProgress } from '@mui/material';

const GlobalLoader = ({ open }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none'; 
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.pointerEvents = 'auto';
    }

    return () => {
      // Clean up styles when loader is unmounted
      document.body.style.overflow = 'auto';
      document.body.style.pointerEvents = 'auto';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1301,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
      }}
    >
      <CircularProgress
        color="secondary"
        size={80}
        thickness={5}
        sx={{
          color: 'blue',
        }}
      />
    </div>
  );
};

export default GlobalLoader;
