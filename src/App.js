import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfileCreate from './pages/ProfileCreate';
import ProfileView from './pages/ProfileView';
import BrowseProfiles from './pages/BrowseProfiles';
import Matches from './pages/Matches';
import Conversation from './pages/Conversation';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#e91e63', // Pink
      light: '#f48fb1',
      dark: '#c2185b',
    },
    secondary: {
      main: '#9c27b0', // Purple
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: 16,
        },
      },
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is logged in
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };
  
  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!checkAuth()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar isAuthenticated={checkAuth()} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/create-profile" element={
            <ProtectedRoute>
              <ProfileCreate />
            </ProtectedRoute>
          } />
          <Route path="/profile/:id" element={<ProfileView />} />
          <Route path="/browse" element={
            <ProtectedRoute>
              <BrowseProfiles />
            </ProtectedRoute>
          } />
          <Route path="/matches" element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          } />
          <Route path="/conversation/:matchId" element={
            <ProtectedRoute>
              <Conversation />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
