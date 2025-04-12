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
  CardMedia,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Message as MessageIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const Matches = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [matches, setMatches] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch all matches
        const matchesResponse = await axios.get(`${config.API_URL}/matches`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMatches(matchesResponse.data.matches || []);

        // Fetch pending match requests
        const pendingResponse = await axios.get(`${config.API_URL}/matches/pending`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPendingRequests(pendingResponse.data.pendingRequests || []);

        // Fetch sent match requests
        const sentResponse = await axios.get(`${config.API_URL}/matches/sent`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSentRequests(sentResponse.data.sentRequests || []);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to load matches. Please try again later.');
        setLoading(false);
      }
    };

    fetchMatches();
  }, [navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAcceptRequest = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setResponseMessage('');
  };

  const handleSendResponse = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(`${config.API_URL}/matches/accept/${selectedRequest.profile._id}`, 
        { message: responseMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update lists
      setMatches([...matches, {
        profile: selectedRequest.profile,
        messages: [{
          sender: 'me',
          content: responseMessage,
          createdAt: new Date()
        }]
      }]);
      
      setPendingRequests(pendingRequests.filter(
        req => req.profile._id !== selectedRequest.profile._id
      ));
      
      setOpenDialog(false);
      setResponseMessage('');
    } catch (err) {
      setError('Failed to accept match request. Please try again.');
    }
  };

  const handleRejectRequest = async (profileId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(`${config.API_URL}/matches/reject/${profileId}`, 
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update pending requests list
      setPendingRequests(pendingRequests.filter(
        req => req.profile._id !== profileId
      ));
    } catch (err) {
      setError('Failed to reject match request. Please try again.');
    }
  };

  const handleCancelRequest = async (profileId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`${config.API_URL}/matches/request/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update sent requests list
      setSentRequests(sentRequests.filter(
        req => req.profile._id !== profileId
      ));
    } catch (err) {
      setError('Failed to cancel match request. Please try again.');
    }
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
      <Typography variant="h4" component="h1" gutterBottom>
        Your Matches
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FavoriteIcon sx={{ mr: 1 }} />
                <Typography>Matches</Typography>
                {matches.length > 0 && (
                  <Box
                    sx={{
                      ml: 1,
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                    }}
                  >
                    {matches.length}
                  </Box>
                )}
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography>Pending Requests</Typography>
                {pendingRequests.length > 0 && (
                  <Box
                    sx={{
                      ml: 1,
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                    }}
                  >
                    {pendingRequests.length}
                  </Box>
                )}
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MessageIcon sx={{ mr: 1 }} />
                <Typography>Sent Requests</Typography>
                {sentRequests.length > 0 && (
                  <Box
                    sx={{
                      ml: 1,
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                    }}
                  >
                    {sentRequests.length}
                  </Box>
                )}
              </Box>
            } 
          />
        </Tabs>
      </Box>

      {/* Matches Tab */}
      {tabValue === 0 && (
        <>
          {matches.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>No matches yet</Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                When you match with someone, they'll appear here.
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/browse"
                startIcon={<PersonIcon />}
              >
                Browse Profiles
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {matches.map((match) => (
                <Grid item xs={12} sm={6} md={4} key={match.profile._id}>
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
                      height="200"
                      image={match.profile.photos && match.profile.photos.length > 0 
                        ? match.profile.photos[0] 
                        : 'https://via.placeholder.com/300x200?text=No+Photo'}
                      alt={match.profile.childName}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {match.profile.childName}, {match.profile.childAge}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {match.profile.location}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          component={Link}
                          to={`/conversation/${match.profile._id}`}
                          startIcon={<MessageIcon />}
                        >
                          Message
                        </Button>
                        <Button
                          variant="outlined"
                          component={Link}
                          to={`/profile/${match.profile._id}`}
                          startIcon={<PersonIcon />}
                        >
                          Profile
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Pending Requests Tab */}
      {tabValue === 1 && (
        <>
          {pendingRequests.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>No pending requests</Typography>
              <Typography variant="body1" color="text.secondary">
                When someone wants to match with you, they'll appear here.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {pendingRequests.map((request) => (
                <Grid item xs={12} key={request.profile._id}>
                  <Card>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Avatar
                            src={request.profile.photos && request.profile.photos.length > 0 
                              ? request.profile.photos[0] 
                              : ''}
                            alt={request.profile.childName}
                            sx={{ width: 80, height: 80 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={7}>
                          <Typography variant="h6">
                            {request.profile.childName}, {request.profile.childAge}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {request.profile.location}
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 1 }}>
                            "{request.message}"
                          </Typography>
                          <Button
                            variant="text"
                            component={Link}
                            to={`/profile/${request.profile._id}`}
                            sx={{ mt: 1 }}
                          >
                            View Profile
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={3} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<CheckIcon />}
                            onClick={() => handleAcceptRequest(request)}
                            fullWidth
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<CloseIcon />}
                            onClick={() => handleRejectRequest(request.profile._id)}
                            fullWidth
                          >
                            Decline
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Sent Requests Tab */}
      {tabValue === 2 && (
        <>
          {sentRequests.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>No sent requests</Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                When you send match requests, they'll appear here.
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/browse"
                startIcon={<PersonIcon />}
              >
                Browse Profiles
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {sentRequests.map((request) => (
                <Grid item xs={12} key={request.profile._id}>
                  <Card>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Avatar
                            src={request.profile.photos && request.profile.photos.length > 0 
                              ? request.profile.photos[0] 
                              : ''}
                            alt={request.profile.childName}
                            sx={{ width: 80, height: 80 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={7}>
                          <Typography variant="h6">
                            {request.profile.childName}, {request.profile.childAge}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {request.profile.location}
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 1 }}>
                            Your message: "{request.message}"
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Sent on {new Date(request.createdAt).toLocaleDateString()}
                          </Typography>
                          <Button
                            variant="text"
                            component={Link}
                            to={`/profile/${request.profile._id}`}
                            sx={{ mt: 1 }}
                          >
                            View Profile
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={3} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<CloseIcon />}
                            onClick={() => handleCancelRequest(request.profile._id)}
                            fullWidth
                          >
                            Cancel Request
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Accept Match Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Accept Match Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Send a message to {selectedRequest?.profile.childName}'s mother to start the conversation.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Message"
            fullWidth
            multiline
            rows={4}
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSendResponse} variant="contained" disabled={!responseMessage.trim()}>
            Accept & Send
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Matches;
