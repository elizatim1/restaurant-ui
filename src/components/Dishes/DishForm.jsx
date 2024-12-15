import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, InputLabel, FormControl, Box, FormHelperText } from '@mui/material';

const DishForm = ({ initialData = {}, isEditing, restaurants = [], onChange, onSubmit }) => {
  const [formData, setFormData] = useState({
    dish_Name: '',
    description: '',
    price: '',
    category: '',
    restaurant_Id: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData, isEditing]);

  const validate = (field, value) => {
    const trimmedValue = String(value || '').trim();
    let error = '';

    if (!trimmedValue && ['dish_Name', 'description', 'price', 'category', 'restaurant_Id'].includes(field)) {
      error = `${field.replace('_', ' ')} is required.`;
    } else if (field === 'price' && (isNaN(trimmedValue) || trimmedValue < 0)) {
      error = 'Price must be a non-negative number.';
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validate(name, value);

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setErrors((prevState) => ({
      ...prevState,
      [name]: error,
    }));

    if (onChange) {
      onChange({
        ...formData,
        [name]: value,
      });
    }
  };

  const isValidForm = () => {
    const validationErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validate(key, formData[key]);
      if (error) {
        validationErrors[key] = error;
      }
    });
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidForm()) {
      if (onSubmit) {
        onSubmit(formData);
      }
    }
  };

  return (
    <Box
      component="form"
      id="dish-form"
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      onSubmit={handleSubmit}
    >
      <TextField
        label="Dish Name"
        name="dish_Name"
        value={formData.dish_Name}
        onChange={handleChange}
        fullWidth
        required
        error={!!errors.dish_Name}
        helperText={errors.dish_Name}
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        required
        error={!!errors.description}
        helperText={errors.description}
      />
      <TextField
        label="Price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        fullWidth
        required
        error={!!errors.price}
        helperText={errors.price}
      />
      <TextField
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        fullWidth
        required
        error={!!errors.category}
        helperText={errors.category}
      />
      <FormControl fullWidth margin="normal" error={!!errors.restaurant_Id}>
        <InputLabel id="restaurant-select-label">Restaurant</InputLabel>
        <Select
          label="Restaurant"
          labelId="restaurant-select-label"
          name="restaurant_Id"
          value={formData.restaurant_Id}
          onChange={handleChange}
          required
        >
          {restaurants.map((restaurant) => (
            <MenuItem key={restaurant.restaurant_Id} value={restaurant.restaurant_Id}>
              {restaurant.restaurant_Name}
            </MenuItem>
          ))}
        </Select>
        {errors.restaurant_Id && <FormHelperText>{errors.restaurant_Id}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default DishForm;
