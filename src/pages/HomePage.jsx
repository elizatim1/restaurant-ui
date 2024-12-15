import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import axiosInstance from '../services/axiosInstance';

const HomePage = () => {
  const username = localStorage.getItem('username');
  const [stats, setStats] = useState({ totalOrders: 0, completedOrders: 0, pendingOrders: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/orders/stats'); 
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {username || 'Guest'}!
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Here's an overview of your system's activity.
      </Typography>

      {/* Statistics Section */}
      <Box sx={{ display: 'flex', gap: 4, mt: 4 }}>
        <Paper elevation={3} sx={{ padding: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h6">Total Orders</Typography>
          <Typography variant="h4">{stats.totalOrders}</Typography>
        </Paper>
        <Paper elevation={3} sx={{ padding: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h6">Completed Orders</Typography>
          <Typography variant="h4">{stats.completedOrders}</Typography>
        </Paper>
        <Paper elevation={3} sx={{ padding: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h6">Pending Orders</Typography>
          <Typography variant="h4">{stats.pendingOrders}</Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage;
