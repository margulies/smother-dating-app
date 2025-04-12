import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Avatar,
  Stack,
  Divider
} from '@mui/material';
import { 
  Favorite as HeartIcon,
  Security as SecurityIcon,
  Psychology as PsychologyIcon,
  Handshake as HandshakeIcon
} from '@mui/icons-material';

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #e91e63 0%, #9c27b0 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Mother Knows Best
          </Typography>
          <Typography 
            variant="h5" 
            component="h2"
            sx={{ 
              mb: 4,
              fontWeight: 400,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            The dating app where mothers find the perfect match for their children
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
          >
            <Button 
              variant="contained" 
              size="large"
              component={Link}
              to="/register"
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              Join Now
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              component={Link}
              to="/login"
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center"
          sx={{ mb: 6, fontWeight: 600 }}
        >
          How It Works
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'primary.light',
                  mb: 3
                }}
              >
                <Typography variant="h4">1</Typography>
              </Avatar>
              <Typography variant="h5" component="h3" gutterBottom>
                Create a Profile
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Mothers create detailed profiles highlighting their child's personality, interests, and what they're looking for in a partner.
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'primary.main',
                  mb: 3
                }}
              >
                <Typography variant="h4">2</Typography>
              </Avatar>
              <Typography variant="h5" component="h3" gutterBottom>
                Browse & Match
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Browse through potential matches and connect with other mothers who have compatible children.
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'primary.dark',
                  mb: 3
                }}
              >
                <Typography variant="h4">3</Typography>
              </Avatar>
              <Typography variant="h5" component="h3" gutterBottom>
                Arrange Meetings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Once there's mutual interest, mothers can chat and arrange meetings for their children.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center"
            sx={{ mb: 6, fontWeight: 600 }}
          >
            Why Choose Smother?
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
                  <SecurityIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h5" component="h3">
                    Safety First
                  </Typography>
                </Box>
                <Divider />
                <CardContent>
                  <Typography variant="body1">
                    Mothers pre-screen potential matches, adding an extra layer of security and ensuring compatibility beyond surface-level interests.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
                  <PsychologyIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h5" component="h3">
                    Mother's Intuition
                  </Typography>
                </Box>
                <Divider />
                <CardContent>
                  <Typography variant="body1">
                    Nobody knows their children better than mothers. Their intuition and deep understanding lead to more meaningful connections.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
                  <HandshakeIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h5" component="h3">
                    Family Approval
                  </Typography>
                </Box>
                <Divider />
                <CardContent>
                  <Typography variant="body1">
                    When mothers approve, relationships start with family support already in place, creating stronger foundations for lasting connections.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center"
          sx={{ mb: 6, fontWeight: 600 }}
        >
          Success Stories
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://source.unsplash.com/random/300x200/?family"
                alt="Happy couple"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sarah & Michael
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  "I was skeptical at first, but my mom found Michael for me, and we've been together for 2 years now. Thanks, Mom, and thanks Smother!"
                </Typography>
                <Typography variant="body2" color="primary" fontWeight={500}>
                  - Sarah, 28
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://source.unsplash.com/random/300x200/?wedding"
                alt="Wedding couple"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  David & Emma
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  "Our mothers connected on Smother and introduced us. A year later, we're married! Mother really does know best."
                </Typography>
                <Typography variant="body2" color="primary" fontWeight={500}>
                  - David, 32
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://source.unsplash.com/random/300x200/?couple"
                alt="Happy couple"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Jennifer & Robert
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  "I was too busy with my career to date. My mom took matters into her own hands with Smother, and now I'm happily engaged!"
                </Typography>
                <Typography variant="body2" color="primary" fontWeight={500}>
                  - Jennifer, 30
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <HeartIcon sx={{ fontSize: 60, mb: 3 }} />
          <Typography 
            variant="h3" 
            component="h2"
            sx={{ mb: 3, fontWeight: 600 }}
          >
            Ready to Find the Perfect Match?
          </Typography>
          <Typography 
            variant="h6"
            sx={{ mb: 4, fontWeight: 400, opacity: 0.9 }}
          >
            Join thousands of mothers who have successfully matched their children
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            component={Link}
            to="/register"
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              px: 4,
              py: 1.5,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              }
            }}
          >
            Get Started Today
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
