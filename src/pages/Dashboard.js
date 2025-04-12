import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../utils/config';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Person as PersonIcon,
  Message as MessageIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  Edit as EditIcon,
  EmojiEmotions as EmojiEmotionsIcon,
  Celebration as CelebrationIcon,
  LocalFireDepartment as LocalFireDepartmentIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    matches: 0,
    messages: 0,
    views: 0,
    likes: 0
  });
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const profileResponse = await axios.get(`${config.API_URL}/profiles/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(profileResponse.data);

      // Mock stats for now
      setStats({
        matches: Math.floor(Math.random() * 10) + 1,
        messages: Math.floor(Math.random() * 50) + 10,
        views: Math.floor(Math.random() * 200) + 50,
        likes: Math.floor(Math.random() * 30) + 10
      });

      setLoading(false);
    } catch (error) {
      setError('Failed to load profile data. Are you sure you have a profile?');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const getProfileImage = () => {
    // Return a random stock image URL
    const images = [
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956',
      'https://images.unsplash.com/photo-1573497014578-4aed9e78cff9',
      'https://images.unsplash.com/photo-1542156822-6924d1a71ace'
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Card */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, bgcolor: 'background.paper', boxShadow: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EmojiEmotionsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4" component="h2">
                Welcome to Smother!
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Where moms create lasting connections for their children
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Ready to help your child find their special someone? Let's start the journey!
            </Typography>
          </Card>
        </Grid>

        {/* Stats Grid */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 2 }}>
                <Typography variant="h6" align="center">
                  <CelebrationIcon sx={{ color: 'success.main', fontSize: 30 }} />
                </Typography>
                <Typography variant="h4" align="center" sx={{ mt: 1 }}>
                  {stats.matches}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  Matches Achieved
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 2 }}>
                <Typography variant="h6" align="center">
                  <MessageIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                </Typography>
                <Typography variant="h4" align="center" sx={{ mt: 1 }}>
                  {stats.messages}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  Messages Sent
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 2 }}>
                <Typography variant="h6" align="center">
                  <LocalFireDepartmentIcon sx={{ color: 'error.main', fontSize: 30 }} />
                </Typography>
                <Typography variant="h4" align="center" sx={{ mt: 1 }}>
                  {stats.likes}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  Hearts Set Aflame
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 2 }}>
                <Typography variant="h6" align="center">
                  <PersonIcon sx={{ color: 'info.main', fontSize: 30 }} />
                </Typography>
                <Typography variant="h4" align="center" sx={{ mt: 1 }}>
                  {stats.views}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  Profile Views
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, bgcolor: 'background.paper', boxShadow: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar 
                src={profile?.photoUrl || getProfileImage()} 
                sx={{ width: 120, height: 120 }}
              />
              <Typography variant="h5" component="h3">
                {profile?.name || 'Your Profile'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile?.bio || 'Tell us about your little darling!'}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<EditIcon />} 
                fullWidth
                component={Link}
                to="/profile/create"
                sx={{ mt: 2 }}
              >
                Update Profile
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, bgcolor: 'background.paper', boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<SearchIcon />} 
                  component={Link}
                  to="/browse"
                >
                  Browse Profiles
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<FavoriteIcon />} 
                  component={Link}
                  to="/matches"
                >
                  View Matches
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<MessageIcon />} 
                  component={Link}
                  to="/messages"
                >
                  Send Message
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<EditIcon />} 
                  component={Link}
                  to="/profile/create"
                >
                  Edit Profile
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
