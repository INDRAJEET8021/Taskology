import React from 'react';
import { Box, Typography, Container, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#001f3f', // A dark blue shade
        color: 'white',
        padding: 4,
        marginTop: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
         Taskology 
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          Software model for mannage the task. Stay connected!
        </Typography>

        {/* Social Media Icons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <IconButton
            href="#"
            sx={{ color: 'white', mx: 1, '&:hover': { color: '#4267B2' } }}
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            href="#"
            sx={{ color: 'white', mx: 1, '&:hover': { color: '#1DA1F2' } }}
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            href="#"
            sx={{ color: 'white', mx: 1, '&:hover': { color: '#0A66C2' } }}
          >
            <LinkedInIcon />
          </IconButton>
          <IconButton
            href="#"
            sx={{ color: 'white', mx: 1, '&:hover': { color: '#E1306C' } }}
          >
            <InstagramIcon />
          </IconButton>
        </Box>

        {/* Footer Links */}
        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
          <a
            href="#"
            style={{ color: 'white', textDecoration: 'none', marginRight: 16 }}
          >
            Privacy Policy
          </a>
          <a
            href="#"
            style={{ color: 'white', textDecoration: 'none', marginRight: 16 }}
          >
            Terms of Service
          </a>
          <a
            href="#"
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Contact Us
          </a>
        </Typography>

        {/* Footer Bottom */}
        <Typography variant="caption" align="center" display="block">
          © {new Date().getFullYear()} Taskology Model. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
