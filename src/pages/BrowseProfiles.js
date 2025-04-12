import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Divider,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const BrowseProfiles = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState({
    age: '',
    interests: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const queryParams = new URLSearchParams();
      if (filters.age) {
        queryParams.append('age', filters.age);
      }
      if (filters.interests.length > 0) {
        queryParams.append('interests', filters.interests.join(','));
      }

      const response = await axios.get(`${config.API_URL}/profiles?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfiles(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load profiles. Please try again.');
      setLoading(false);
    }
  };

  const handleLike = async (profileId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${config.API_URL}/matches/request/${profileId}`, {
        message: 'I think our children would be a great match!'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh profiles after liking
      fetchProfiles();
    } catch (error) {
      setError('Failed to send match request. Please try again.');
    }
  };

  const getProfileImage = (profile) => {
    return profile.photoUrl || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61';
  };

  useEffect(() => {
    fetchProfiles();
  }, [filters.age, filters.interests.join(',')]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (e) => {
    const { value } = e.target;
    setFilters(prev => ({
      ...prev,
      interests: value
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
        <Box sx={{ width: '100%', maxWidth: 800 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            {' '}Browse Profiles
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            Find the perfect match for your little darling!
          </Typography>

          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Filters</Typography>
              <IconButton onClick={() => setShowFilters(!showFilters)}>
                <FilterListIcon />
              </IconButton>
            </Box>

            {showFilters && (
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  select
                  label="Age"
                  name="age"
                  value={filters.age}
                  onChange={handleFilterChange}
                  SelectProps={{
                    multiple: true,
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 250,
                          width: 250,
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="0-5">0-5 years</MenuItem>
                  <MenuItem value="6-10">6-10 years</MenuItem>
                  <MenuItem value="11-14">11-14 years</MenuItem>
                  <MenuItem value="15-18">15-18 years</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Interests"
                  name="interests"
                  value={filters.interests}
                  onChange={handleInterestChange}
                  SelectProps={{
                    multiple: true,
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 250,
                          width: 250,
                        },
                      },
                    },
                  }}
                  sx={{ mt: 2 }}
                >
                  <MenuItem value="Sports">Sports</MenuItem>
                  <MenuItem value="Music">Music</MenuItem>
                  <MenuItem value="Reading">Reading</MenuItem>
                  <MenuItem value="Art">Art</MenuItem>
                  <MenuItem value="Dancing">Dancing</MenuItem>
                  <MenuItem value="Science">Science</MenuItem>
                  <MenuItem value="Animals">Animals</MenuItem>
                </TextField>
              </Box>
            )}
          </Paper>

          {profiles.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6">No profiles found</Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or come back later!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {profiles.map((profile) => (
                <Grid item xs={12} sm={6} md={4} key={profile._id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          <Avatar 
                            src={getProfileImage(profile)} 
                            sx={{ width: 120, height: 120 }}
                          />
                        </Box>
                        <Typography variant="h6" component="h2" gutterBottom>
                          {profile.name}, {profile.age}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {profile.location}
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {profile.bio}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                          {profile.interests?.map((interest) => (
                            <Chip
                              key={interest}
                              label={interest}
                              size="small"
                              sx={{ bgcolor: 'primary.light' }}
                            />
                          ))}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FavoriteIcon />}
                            onClick={() => handleLike(profile._id)}
                          >
                            Like
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<MessageIcon />}
                            component={Link}
                            to={`/conversation/${profile._id}`}
                          >
                            Message
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default BrowseProfiles;
