import React from 'react';
import { Container, Typography } from '@mui/material';
import RestaurantsList from '../components/Restaurants/RestaurantsList';

const RestaurantsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Restaurants
      </Typography>
      <RestaurantsList />
    </Container>
  );
};

export default RestaurantsPage;
