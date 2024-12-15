import React from 'react';
import { Container, Typography } from '@mui/material';
import DishesList from '../components/Dishes/DishesList';

const DishesPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dishes
      </Typography>
      <DishesList />
    </Container>
  );
};

export default DishesPage;
