import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import config from '../utils/config';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const Conversation = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [match, setMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch match details
        const matchResponse = await axios.get(`${config.API_URL}/matches/${matchId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setMatch(matchResponse.data);
        setMessages(matchResponse.data.messages || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching conversation:', err);
        setError('Failed to load conversation. Please try again later.');
        setLoading(false);
      }
    };

    fetchConversation();
  }, [matchId, navigate]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setSending(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(`${config.API_URL}/matches/message/${matchId}`, 
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add the new message to the list
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
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

  if (!match) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">Conversation not found.</Alert>
      </Container>
    );
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Conversation Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/matches')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Avatar
            src={match.profile.photos && match.profile.photos.length > 0 ? match.profile.photos[0] : ''}
            alt={match.profile.childName}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              {match.profile.childName}, {match.profile.childAge}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {match.profile.location}
            </Typography>
          </Box>
          <Button
            startIcon={<PersonIcon />}
            component={Link}
            to={`/profile/${match.profile._id}`}
          >
            View Profile
          </Button>
        </Toolbar>
      </AppBar>

      {/* Messages Area */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        p: 2,
        backgroundColor: '#f5f5f5'
      }}>
        {Object.keys(groupedMessages).map(date => (
          <Box key={date}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 2, 
              mt: 3 
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.1)', 
                  px: 2, 
                  py: 0.5, 
                  borderRadius: 4,
                  color: 'text.secondary'
                }}
              >
                {formatMessageDate(date)}
              </Typography>
            </Box>
            
            {groupedMessages[date].map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                {message.sender !== 'me' && (
                  <Avatar
                    src={match.profile.photos && match.profile.photos.length > 0 ? match.profile.photos[0] : ''}
                    alt={match.profile.childName}
                    sx={{ width: 36, height: 36, mr: 1 }}
                  />
                )}
                <Box>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      maxWidth: '70%',
                      backgroundColor: message.sender === 'me' ? 'primary.main' : 'white',
                      color: message.sender === 'me' ? 'white' : 'inherit',
                    }}
                  >
                    <Typography variant="body1">{message.content}</Typography>
                  </Paper>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block', 
                      mt: 0.5,
                      ml: message.sender === 'me' ? 0 : 1,
                      mr: message.sender === 'me' ? 1 : 0,
                      textAlign: message.sender === 'me' ? 'right' : 'left',
                      color: 'text.secondary'
                    }}
                  >
                    {formatMessageTime(message.createdAt)}
                  </Typography>
                </Box>
                {message.sender === 'me' && (
                  <Avatar
                    sx={{ width: 36, height: 36, ml: 1 }}
                  />
                )}
              </Box>
            ))}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Paper 
        elevation={3} 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          borderTop: '1px solid rgba(0, 0, 0, 0.12)'
        }}
      >
        <TextField
          fullWidth
          placeholder="Type a message..."
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={sending}
          sx={{ mr: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          type="submit"
          disabled={!newMessage.trim() || sending}
        >
          Send
        </Button>
      </Paper>
    </Box>
  );
};

export default Conversation;
