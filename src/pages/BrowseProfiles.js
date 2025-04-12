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
  CardMedia,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Divider,
  IconButton
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  FilterList as FilterIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const BrowseProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    ageMin: 18,
    ageMax: 70,
    location: '',
    interests: []
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        // Build query string from filters
        let queryParams = '';
        if (filters.gender) queryParams += `gender=${filters.gender}&`;
        if (filters.ageMin) queryParams += `ageMin=${filters.ageMin}&`;
        if (filters.ageMax) queryParams += `ageMax=${filters.ageMax}&`;
        if (filters.location) queryParams += `location=${filters.location}&`;

        const response = await axios.get(`${config.API_URL}/profiles?${queryParams}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProfiles(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profiles. Please try again later.');
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleAgeRangeChange = (event, newValue) => {
    setFilters({
      ...filters,
      ageMin: newValue[0],
      ageMax: newValue[1]
    });
  };

  const handleLike = async (profileId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(`${config.API_URL}/matches/request/${profileId}`, 
        { message: 'I think our children would be a great match!' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the profile in the list to show it's been liked
      setProfiles(profiles.map(profile => 
        profile._id === profileId 
          ? { ...profile, hasLiked: true } 
          : profile
      ));
    } catch (err) {
      setError('Failed to like profile. Please try again.');
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Browse Profiles
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={toggleFilters}
        >
          Filters
        </Button>
      </Box>

      {/* Filters */}
      {showFilters && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={toggleFilters}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={filters.gender}
                  onChange={handleFilterChange}
                  label="Gender"
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="non-binary">Non-binary</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="City or State"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography id="age-range-slider" gutterBottom>
                Age Range: {filters.ageMin} - {filters.ageMax}
              </Typography>
              <Slider
                value={[filters.ageMin, filters.ageMax]}
                onChange={handleAgeRangeChange}
                valueLabelDisplay="auto"
                min={18}
                max={80}
                aria-labelledby="age-range-slider"
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {profiles.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>No profiles found</Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your filters or check back later for new profiles.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {profiles.map((profile) => (
            <Grid item xs={12} sm={6} md={4} key={profile._id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}>
                <CardMedia
                  component="img"
                  height="240"
                  image={profile.photos && profile.photos.length > 0 
                    ? profile.photos[0] 
                    : 'https://via.placeholder.com/300x240?text=No+Photo'}
                  alt={profile.childName}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h5" component="h2">
                      {profile.childName}, {profile.childAge}
                    </Typography>
                    <IconButton 
                      color={profile.hasLiked ? "primary" : "default"}
                      onClick={() => !profile.hasLiked && handleLike(profile._id)}
                      disabled={profile.hasLiked}
                    >
                      {profile.hasLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Box>
                  
                  {profile.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {profile.location}
                      </Typography>
                    </Box>
                  )}
                  
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    height: '4.5em'
                  }}>
                    {profile.bio || 'No bio provided.'}
                  </Typography>
                  
                  {profile.childInterests && profile.childInterests.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Interests:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {profile.childInterests.slice(0, 3).map((interest) => (
                          <Chip key={interest} label={interest} size="small" />
                        ))}
                        {profile.childInterests.length > 3 && (
                          <Chip label={`+${profile.childInterests.length - 3} more`} size="small" variant="outlined" />
                        )}
                      </Box>
                    </Box>
                  )}
                  
                  <Button
                    variant="contained"
                    fullWidth
                    component={Link}
                    to={`/profile/${profile._id}`}
                    startIcon={<PersonIcon />}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default BrowseProfiles;
