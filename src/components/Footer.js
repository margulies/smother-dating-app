import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, IconButton, Divider } from '@mui/material';
import { 
  Facebook as FacebookIcon, 
  Twitter as TwitterIcon, 
  Instagram as InstagramIcon,
  Favorite as HeartIcon
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'primary.dark', 
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <HeartIcon sx={{ mr: 1 }} />
              SMOTHER
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Where mothers find the perfect match for their children.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Typography variant="body2" component={Link} to="/" sx={{ display: 'block', mb: 1, color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Home
            </Typography>
            <Typography variant="body2" component={Link} to="/browse" sx={{ display: 'block', mb: 1, color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Browse Profiles
            </Typography>
            <Typography variant="body2" component={Link} to="/login" sx={{ display: 'block', mb: 1, color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Login
            </Typography>
            <Typography variant="body2" component={Link} to="/register" sx={{ display: 'block', mb: 1, color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Register
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: info@smother.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Phone: (123) 456-7890
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Address: 123 Love Street, Matchville, CA 94123
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 3 }} />
        
        <Typography variant="body2" align="center" sx={{ pt: 2 }}>
          © {currentYear} Smother. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
