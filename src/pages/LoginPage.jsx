// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axiosInstance from '../services/axiosInstance';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
} from '@mui/material';

const LoginPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/Auth/login', form);
      localStorage.setItem('token', response.data.token || response.data.Token);
      console.log('data', response.data);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('username', response.data.user.username);
      localStorage.setItem('userId', response.data.user.userId);
      enqueueSnackbar('Login successful!', { variant: 'success' });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
