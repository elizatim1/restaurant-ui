import React from 'react';
import { Container, Typography } from '@mui/material';
import OrdersList from '../components/Orders/OrdersList';

const OrdersPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Orders
      </Typography>
      <OrdersList />
    </Container>
  );
};

export default OrdersPage;
