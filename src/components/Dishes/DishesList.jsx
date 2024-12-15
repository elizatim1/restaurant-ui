import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import DishForm from './DishForm';
import UniversalModal from '../UniversalModal';

const DishesList = () => {
  const [dishes, setDishes] = useState([]);
  const [restaurants, setRestaurants] = useState([]); 
  const [editingDish, setEditingDish] = useState(null);
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);

  useEffect(() => {
    fetchDishes();
    fetchRestaurants();
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await axiosInstance.get('/dishes');
      setDishes(response.data);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axiosInstance.get('/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleEditClick = (dish) => {
    setEditingDish(dish);
    setFormData(dish);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingDish(null);
    setFormData({
      dish_Name: '',
      description: '',
      price: '',
      category: '',
      restaurant_Id: '', 
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (dish) => {
    setDishToDelete(dish);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingDish(null);
    setFormData({});
    setIsModalOpen(false);
    fetchDishes();
  };

  const handleCloseDeleteModal = () => {
    setDishToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (editingDish) {
        await axiosInstance.put(`/dishes/${formData.dish_Id}`, formData);
      } else {
        await axiosInstance.post('/dishes', formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving dish:', error);
    }
  };

  const handleDelete = async () => {
    if (!dishToDelete) return;
    try {
      await axiosInstance.delete(`/dishes/${dishToDelete.dish_Id}`);
      handleCloseDeleteModal();
      fetchDishes();
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleCreateClick} sx={{ marginBottom: 2 }}>
        Create Dish
      </Button>
      <Grid container spacing={3} sx={{ padding: 3 }}>
        {dishes.map((dish) => (
          <Grid item xs={12} md={6} lg={4} key={dish.dish_Id}>
            <Card className="card">
              <CardContent className="card-content">
                <Typography variant="h6" component="h2">{dish.dish_Name}</Typography>
                <Typography>Price: ${dish.price.toFixed(2)}</Typography>
                <Typography>{dish.description}</Typography>
                <Typography>Category: {dish.category}</Typography>
                <Typography>
                  Restaurant: {restaurants.find((r) => r.restaurant_Id === dish.restaurant_Id)?.restaurant_Name || 'N/A'}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button onClick={() => handleEditClick(dish)}>Edit</Button>
                  <Button color="error" onClick={() => handleDeleteClick(dish)}>
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
        title={editingDish ? 'Edit Dish' : 'Create Dish'}
        submitText={editingDish ? 'Update' : 'Create'}
        cancelText="Cancel"
      >
        <DishForm
          initialData={formData}
          isEditing={!!editingDish}
          restaurants={restaurants} 
          onChange={setFormData}
        />
      </UniversalModal>

      <UniversalModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onSubmit={handleDelete}
        title="Delete Confirmation"
        submitText="Delete"
        cancelText="Cancel"
      >
        <Typography>Are you sure you want to delete this dish?</Typography>
      </UniversalModal>
    </>
  );
};

export default DishesList;
