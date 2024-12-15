import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import axiosInstance from '../../services/axiosInstance';
import RestaurantForm from './RestaurantForm';
import UniversalModal from '../UniversalModal';

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axiosInstance.get('/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleEditClick = (restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData(restaurant);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingRestaurant(null);
    setFormData({
      restaurant_Name: '',
      restaurant_Address: '',
      restaurant_Phone: '',
      rating: '',
      category: '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (restaurant) => {
    setRestaurantToDelete(restaurant);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingRestaurant(null);
    setFormData({});
    setIsModalOpen(false);
    fetchRestaurants();
  };

  const handleCloseDeleteModal = () => {
    setRestaurantToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (editingRestaurant) {
        await axiosInstance.put(`/restaurants/${formData.restaurant_Id}`, formData);
      } else {
        await axiosInstance.post('/restaurants', formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving restaurant:', error);
    }
  };

  const handleDelete = async () => {
    if (!restaurantToDelete) return;
    try {
      await axiosInstance.delete(`/restaurants/${restaurantToDelete.restaurant_Id}`);
      handleCloseDeleteModal();
      fetchRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleCreateClick} sx={{ marginBottom: 2 }}>
        Create Restaurant
      </Button>
      <Grid container spacing={3} sx={{ padding: 3 }}>
        {restaurants.map((restaurant) => (
          <Grid item xs={12} md={6} lg={4} key={restaurant.restaurant_Id}>
            <Card className="card">
              <CardContent className="card-content">
                <Typography variant="h6">{restaurant.restaurant_Name}</Typography>
                <Typography>Address: {restaurant.restaurant_Address}</Typography>
                <Typography>Phone: {restaurant.restaurant_Phone}</Typography>
                <Typography>Rating: {restaurant.rating}</Typography>
                <Typography>Category: {restaurant.category}</Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button onClick={() => handleEditClick(restaurant)}>Edit</Button>
                  <Button color="error" onClick={() => handleDeleteClick(restaurant)}>
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <UniversalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title={editingRestaurant ? 'Edit Restaurant' : 'Create Restaurant'}
        submitText={editingRestaurant ? 'Update' : 'Create'}
        cancelText="Cancel"
      >
        <RestaurantForm initialData={formData} isEditing={!!editingRestaurant} onChange={setFormData} />
      </UniversalModal>

      <UniversalModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onSubmit={handleDelete}
        title="Delete Confirmation"
        submitText="Delete"
        cancelText="Cancel"
      >
        <Typography>Are you sure you want to delete this restaurant?</Typography>
      </UniversalModal>
    </>
  );
};

export default RestaurantsList;
