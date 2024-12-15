import React from 'react';
import { Container, Typography } from '@mui/material';
import UsersList from '../components/Users/UsersList';

const UsersPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Users
      </Typography>
      <UsersList />
    </Container>
  );
};

export default UsersPage;
