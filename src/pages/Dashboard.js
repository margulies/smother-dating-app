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
  ListItemIcon
} from '@mui/material';
import {
  Person as PersonIcon,
  Message as MessageIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    matches: 0,
    views: 0,
    pendingRequests: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch user profile
        const profileResponse = await axios.get(`${config.API_URL}/profiles/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProfile(profileResponse.data);

        // Fetch stats
        const statsResponse = await axios.get(`${config.API_URL}/matches/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStats(statsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        if (err.response && err.response.status === 404) {
          // Profile not found, user needs to create one
          setProfile(null);
          setLoading(false);
        } else {
          setError('Failed to load dashboard data. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // If no profile exists yet
  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>Welcome to Smother!</Typography>
          <Typography variant="body1" paragraph>
            You haven't created a profile for your child yet. Create a profile to start finding matches!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/create-profile"
            startIcon={<EditIcon />}
          >
            Create Profile
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {profile.childName}'s Profile
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Box
                  component="img"
                  src={profile.photos && profile.photos.length > 0 
                    ? profile.photos[0] 
                    : 'https://via.placeholder.com/150'}
                  alt={profile.childName}
                  sx={{
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    mb: 2
                  }}
                />
                <Typography variant="h5">{profile.childName}, {profile.childAge}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile.location}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                to={`/profile/${profile._id}`}
                startIcon={<PersonIcon />}
                sx={{ mb: 1 }}
              >
                View Profile
              </Button>
              <Button
                variant="contained"
                fullWidth
                component={Link}
                to="/create-profile"
                startIcon={<EditIcon />}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Activity
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <FavoriteIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${stats.matches} Matches`}
                    secondary="People who matched with your profile"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${stats.views} Profile Views`}
                    secondary="People who viewed your profile"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MessageIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${stats.pendingRequests} Pending Requests`}
                    secondary="Match requests waiting for your response"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Button
                variant="contained"
                fullWidth
                component={Link}
                to="/browse"
                startIcon={<SearchIcon />}
                sx={{ mb: 2 }}
              >
                Browse Profiles
              </Button>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                to="/matches"
                startIcon={<FavoriteIcon />}
                sx={{ mb: 2 }}
              >
                View Matches
              </Button>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                to="/messages"
                startIcon={<MessageIcon />}
              >
                Messages
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
