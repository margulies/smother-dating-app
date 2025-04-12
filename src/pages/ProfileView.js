import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../utils/config';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Message as MessageIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const ProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [matchStatus, setMatchStatus] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch profile data
        const profileResponse = await axios.get(`${config.API_URL}/profiles/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProfile(profileResponse.data);
        
        // Check if this is the user's own profile
        const myProfileResponse = await axios.get(`${config.API_URL}/profiles/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setIsOwnProfile(myProfileResponse.data._id === id);
        
        // If not own profile, check match status
        if (myProfileResponse.data._id !== id) {
          try {
            const matchResponse = await axios.get(`${config.API_URL}/matches/status/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setMatchStatus(matchResponse.data.status);
          } catch (err) {
            // No match exists yet
            setMatchStatus('none');
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again later.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, navigate]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(`${config.API_URL}/matches/request/${id}`, 
        { message: 'I think our children would be a great match!' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMatchStatus('requested');
    } catch (err) {
      setError('Failed to send match request. Please try again.');
    }
  };

  const handleMessage = () => {
    setOpenDialog(true);
  };

  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(`${config.API_URL}/matches/request/${id}`, 
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMatchStatus('requested');
      setOpenDialog(false);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">Profile not found.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Profile Header */}
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              src={profile.photos && profile.photos.length > 0 ? profile.photos[0] : ''}
              alt={profile.childName}
              sx={{
                width: { xs: 150, md: 200 },
                height: { xs: 150, md: 200 },
                mx: 'auto',
                mb: 2,
                boxShadow: 3
              }}
            />
            <Typography variant="h4" gutterBottom>
              {profile.childName}, {profile.childAge}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <LocationIcon color="primary" sx={{ mr: 0.5 }} />
              <Typography variant="body1">{profile.location || 'Location not specified'}</Typography>
            </Box>

            {!isOwnProfile && (
              <Box sx={{ mt: 3 }}>
                {matchStatus === 'matched' ? (
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<MessageIcon />}
                    onClick={() => navigate(`/conversation/${id}`)}
                    sx={{ mb: 2 }}
                  >
                    Message
                  </Button>
                ) : matchStatus === 'requested' ? (
                  <Button
                    variant="contained"
                    fullWidth
                    disabled
                    startIcon={<FavoriteIcon />}
                    sx={{ mb: 2 }}
                  >
                    Request Sent
                  </Button>
                ) : matchStatus === 'pending' ? (
                  <Button
                    variant="contained"
                    fullWidth
                    color="secondary"
                    startIcon={<FavoriteIcon />}
                    onClick={handleLike}
                    sx={{ mb: 2 }}
                  >
                    Accept Match
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<FavoriteBorderIcon />}
                      onClick={handleLike}
                      sx={{ mb: 2 }}
                    >
                      Like Profile
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<MessageIcon />}
                      onClick={handleMessage}
                    >
                      Send Message
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>About {profile.childName}</Typography>
            <Typography variant="body1" paragraph>
              {profile.bio || 'No bio provided.'}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2}>
              {profile.childOccupation && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WorkIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Occupation</Typography>
                      <Typography variant="body1">{profile.childOccupation}</Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {profile.childEducation && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SchoolIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Education</Typography>
                      <Typography variant="body1">{profile.childEducation}</Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Interests</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profile.childInterests && profile.childInterests.length > 0 ? (
                  profile.childInterests.map((interest) => (
                    <Chip key={interest} label={interest} />
                  ))
                ) : (
                  <Typography variant="body2">No interests specified</Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="h6" gutterBottom>Looking For</Typography>
              <Typography variant="body1" paragraph>
                {profile.lookingFor || 'Not specified'}
              </Typography>

              <Grid container spacing={2}>
                {profile.preferredGender && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon color="primary" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Preferred Gender</Typography>
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                          {profile.preferredGender === 'no-preference' ? 'No Preference' : profile.preferredGender}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Age Range</Typography>
                      <Typography variant="body1">
                        {profile.preferredAgeMin || '18'} - {profile.preferredAgeMax || '99'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {isOwnProfile && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/create-profile')}
            startIcon={<PersonIcon />}
          >
            Edit Profile
          </Button>
        </Box>
      )}

      {/* Message Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Send a Message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Write a message to introduce yourself and explain why you think your children would be a good match.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Message"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSendMessage} variant="contained" disabled={!message.trim()}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfileView;
