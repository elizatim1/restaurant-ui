import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    enqueueSnackbar('You have been logged out successfully.', { variant: 'success' });
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2', boxShadow: 3 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Restaurant Management
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {isAuthenticated && (
            <>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/restaurants">
                Restaurants
              </Button>
              <Button color="inherit" component={Link} to="/dishes">
                Dishes
              </Button>
              <Button color="inherit" component={Link} to="/orders">
                Orders
              </Button>
              <Button color="inherit" component={Link} to="/users">
                Users
              </Button>
            </>
          )}
        </Box>

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">Welcome, {username || 'User'}</Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{ fontWeight: 'bold' }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Button
            color="inherit"
            component={Link}
            to="/login"
            sx={{ fontWeight: 'bold' }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
