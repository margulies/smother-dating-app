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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  CameraAlt as CameraAltIcon,
  EmojiEmotions as EmojiEmotionsIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';

const ProfileCreate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    bio: '',
    interests: '',
    photoUrl: ''
  });
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${config.API_URL}/profiles/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        age: response.data.age,
        location: response.data.location,
        bio: response.data.bio,
        interests: response.data.interests?.join(', ') || '',
        photoUrl: response.data.photoUrl || ''
      });
    } catch (error) {
      setError('Failed to load profile data. Please try again later.');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios({
        method: profile ? 'put' : 'post',
        url: profile ? `${config.API_URL}/profiles/${profile._id}` : `${config.API_URL}/profiles`,
        data: {
          name: formData.name,
          age: formData.age,
          location: formData.location,
          bio: formData.bio,
          interests: formData.interests.split(',').map(interest => interest.trim()),
          photoUrl: formData.photoUrl || getStockImage()
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/dashboard');
    } catch (error) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStockImage = () => {
    const images = [
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956',
      'https://images.unsplash.com/photo-1573497014578-4aed9e78cff9',
      'https://images.unsplash.com/photo-1542156822-6924d1a71ace'
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Card sx={{ p: 4, bgcolor: 'background.paper', boxShadow: 3, width: '100%', maxWidth: 800 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            <EmojiEmotionsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            {' '}Create Your Child's Profile
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            Share the wonderful qualities of your little darling with the world!
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Child's Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                  helperText="What's the name of your little darling?"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    inputProps: { min: 0, max: 18 }
                  }}
                  helperText="How old is your little one?"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  variant="outlined"
                  helperText="Where do you live?"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="About Your Child"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  variant="outlined"
                  helperText="Tell us about your child's personality and interests"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  variant="outlined"
                  helperText="List your child's interests (separated by commas)"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Profile Picture
                  </Typography>
                  <Avatar 
                    src={formData.photoUrl || getStockImage()} 
                    sx={{ width: 200, height: 200 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<CameraAltIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => setFormData(prev => ({ ...prev, photoUrl: getStockImage() }))}
                  >
                    Change Photo
                  </Button>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                startIcon={<EditIcon />}
                disabled={loading}
              >
                {profile ? 'Update Profile' : 'Create Profile'}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                component={Link}
                to="/dashboard"
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Card>
      </Box>
    </Container>
  );
};

export default ProfileCreate;
