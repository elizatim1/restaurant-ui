import React, { useState, useEffect } from 'react';
import { TextField, Box } from '@mui/material';

const RestaurantForm = ({ initialData = {}, isEditing, onChange, onSubmit }) => {
  const [formData, setFormData] = useState({
    restaurant_Name: '',
    restaurant_Address: '',
    restaurant_Phone: '',
    rating: '',
    category: '',
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

    if (!trimmedValue && ['restaurant_Name', 'restaurant_Address', 'restaurant_Phone', 'rating', 'category'].includes(field)) {
      error = `${field.replace('_', ' ')} is required.`;
    } else if (field === 'restaurant_Phone' && !/^[0-9+-]+$/.test(trimmedValue)) {
      error = "Phone number can contain only digits and symbols '+' and '-'.";    
    } else if (field === 'restaurant_Phone' && trimmedValue.length > 15) {
      error = 'Phone number cannot exceed 15 characters.';
    } else if (field === 'rating' && (isNaN(trimmedValue) || trimmedValue < 0 || trimmedValue > 10)) {
      error = 'Rating must be a number between 0 and 10.';
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
      id="restaurant-form"
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      onSubmit={handleSubmit}
    >
      <TextField
        label="Restaurant Name"
        name="restaurant_Name"
        value={formData.restaurant_Name}
        onChange={handleChange}
        fullWidth
        required
        error={!!errors.restaurant_Name}
        helperText={errors.restaurant_Name}
      />
      <TextField
        label="Address"
        name="restaurant_Address"
        value={formData.restaurant_Address}
        onChange={handleChange}
        fullWidth
        required
        error={!!errors.restaurant_Address}
        helperText={errors.restaurant_Address}
      />
      <TextField
        label="Phone"
        name="restaurant_Phone"
        value={formData.restaurant_Phone}
        onChange={handleChange}
        fullWidth
        required
        error={!!errors.restaurant_Phone}
        helperText={errors.restaurant_Phone}
      />
      <TextField
        label="Rating"
        name="rating"
        value={formData.rating}
        onChange={handleChange}
        fullWidth
        required
        error={!!errors.rating}
        helperText={errors.rating}
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
    </Box>
  );
};

export default RestaurantForm;
