import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../utils/config';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  Checkbox,
  FormControlLabel,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert
} from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const interests = [
  'Reading', 'Cooking', 'Travel', 'Music', 'Art', 'Sports', 'Fitness',
  'Movies', 'Theater', 'Photography', 'Dancing', 'Hiking', 'Gaming',
  'Technology', 'Fashion', 'Food', 'Writing', 'Yoga', 'Meditation',
  'Volunteering', 'Animals', 'Nature', 'Science', 'History'
];

const ProfileCreate = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existingProfile, setExistingProfile] = useState(null);
  const [formData, setFormData] = useState({
    childName: '',
    childAge: '',
    childGender: '',
    childOccupation: '',
    childEducation: '',
    childInterests: [],
    location: '',
    bio: '',
    lookingFor: '',
    preferredAgeMin: 18,
    preferredAgeMax: 40,
    preferredGender: '',
    photos: []
  });

  // Check if user already has a profile
  useEffect(() => {
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

        if (response.data) {
          setExistingProfile(response.data);
          setFormData(response.data);
        }
      } catch (err) {
        // If 404, user doesn't have a profile yet, which is fine
        if (err.response && err.response.status !== 404) {
          setError('Failed to check for existing profile. Please try again.');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleInterestsChange = (event) => {
    const {
      target: { value },
    } = event;
    
    setFormData({
      ...formData,
      childInterests: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

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

      const method = existingProfile ? 'put' : 'post';
      const url = existingProfile 
        ? `${config.API_URL}/profiles/${existingProfile._id}`
        : `${config.API_URL}/profiles`;

      const response = await axios({
        method,
        url,
        data: formData,
        headers: { Authorization: `Bearer ${token}` }
      });

      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to save profile. Please try again.');
    }
  };

  const steps = ['Basic Information', 'Personal Details', 'Preferences'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Child's Name"
                  name="childName"
                  value={formData.childName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Child's Age"
                  name="childAge"
                  type="number"
                  value={formData.childAge}
                  onChange={handleChange}
                  inputProps={{ min: 18 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Child's Gender</InputLabel>
                  <Select
                    name="childGender"
                    value={formData.childGender}
                    onChange={handleChange}
                    label="Child's Gender"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="non-binary">Non-binary</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  placeholder="Tell us about your child..."
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Occupation"
                  name="childOccupation"
                  value={formData.childOccupation}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Education"
                  name="childEducation"
                  value={formData.childEducation}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Interests</InputLabel>
                  <Select
                    multiple
                    name="childInterests"
                    value={formData.childInterests}
                    onChange={handleInterestsChange}
                    input={<OutlinedInput label="Interests" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {interests.map((interest) => (
                      <MenuItem key={interest} value={interest}>
                        <Checkbox checked={formData.childInterests.indexOf(interest) > -1} />
                        {interest}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Photo URL"
                  name="photoUrl"
                  placeholder="Enter a URL to your child's photo"
                  helperText="We'll add photo upload functionality in the future. For now, please provide a URL to an existing image."
                  onChange={(e) => setFormData({...formData, photos: [e.target.value]})}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Looking For"
                  name="lookingFor"
                  value={formData.lookingFor}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="What kind of person would be a good match for your child?"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Preferred Gender</InputLabel>
                  <Select
                    name="preferredGender"
                    value={formData.preferredGender}
                    onChange={handleChange}
                    label="Preferred Gender"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="non-binary">Non-binary</MenuItem>
                    <MenuItem value="no-preference">No Preference</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Preferred Age Range
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Min Age"
                      name="preferredAgeMin"
                      type="number"
                      value={formData.preferredAgeMin}
                      onChange={handleChange}
                      inputProps={{ min: 18 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Max Age"
                      name="preferredAgeMax"
                      type="number"
                      value={formData.preferredAgeMax}
                      onChange={handleChange}
                      inputProps={{ min: formData.preferredAgeMin }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          {existingProfile ? 'Edit Profile' : 'Create Profile'}
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          Tell us about your child to help them find the perfect match
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{ ml: 1 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Profile'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ ml: 1 }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ProfileCreate;
