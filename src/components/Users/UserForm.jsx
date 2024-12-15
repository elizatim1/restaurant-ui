import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, InputLabel, FormControl, Box, FormHelperText } from '@mui/material';

const UserForm = ({ initialData = {}, isEditing, roles = [], onChange, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_Name: '',
    last_Name: '',
    username: '',
    user_Address: '',
    user_Phone: '',
    email: '',
    role_Id: '',
  });

  const [errors, setErrors] = useState({});
  const currentUserRole = localStorage.getItem('userRole');

  const usernameFieldDisabled = currentUserRole !== 'Admin';
  const roleFieldDisabled = currentUserRole !== 'Admin';

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData, isEditing]);

  const validate = (field, value) => {
    const trimmedValue = String(value || '').trim();
    let error = '';

    if (!trimmedValue && ['first_Name', 'last_Name', 'username', 'email', 'role_Id'].includes(field)) {
      error = `${field.replace('_', ' ')} is required.`;
    } else if (field === 'email' && !/\S+@\S+\.\S+/.test(trimmedValue)) {
      error = 'Invalid email format.';
    } else if (field === 'user_Phone' && !/^\d{10,15}$/.test(trimmedValue)) {
      error = 'Phone number must be 10-15 digits.';
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
      id="user-form"
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      onSubmit={handleSubmit}
    >
      <TextField
        label="First Name"
        name="first_Name"
        value={formData.first_Name}
        onChange={handleChange}
        fullWidth
        required
        error={!!errors.first_Name}
        helperText={errors.first_Name}
      />
      <TextField
        label="Last Name"
        name="last_Name"
        value={formData.last_Name}
        onChange={handleChange}
        fullWidth
        required
        error={!!errors.last_Name}
        helperText={errors.last_Name}
      />
      <TextField
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        fullWidth
        required
        error={!!errors.username}
        helperText={errors.username}
        disabled={usernameFieldDisabled}
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        required
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        label="Phone"
        name="user_Phone"
        value={formData.user_Phone}
        onChange={handleChange}
        fullWidth
        error={!!errors.user_Phone}
        helperText={errors.user_Phone}
      />
      <TextField
        label="Address"
        name="user_Address"
        value={formData.user_Address}
        onChange={handleChange}
        fullWidth
      />
      {currentUserRole === 'Admin' && (
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          error={!!errors.password}
          helperText={errors.password}
        />
      )}
      <FormControl fullWidth margin="normal" error={!!errors.role_Id} disabled={roleFieldDisabled}>
        <InputLabel id="role-select-label">Role</InputLabel>
        <Select
          label="Role"
          labelId="role-select-label"
          name="role_Id"
          value={formData.role_Id}
          onChange={handleChange}
          required
        >
          {roles.map((role) => (
            <MenuItem key={role.role_Id} value={role.role_Id}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
        {errors.role_Id && <FormHelperText>{errors.role_Id}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default UserForm;
