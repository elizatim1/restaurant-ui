import React, { useState, useEffect } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  FormHelperText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const OrderForm = ({ initialData = {}, isEditing, users = [], restaurants = [], dishes = [], onChange }) => {
  const [formData, setFormData] = useState({
    user_Id: '',
    status: '',
    restaurant_Id: '',
    order_Date: new Date().toISOString(),
    delivery_Address: '',
    orderDetails: [],
  });

  const [errors, setErrors] = useState({});
  const [availableDishes, setAvailableDishes] = useState([]);

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({ ...initialData, order_Date: initialData.order_Date || new Date()
    });
    }
  }, [initialData, isEditing]);

  useEffect(() => {
    if (formData.restaurant_Id) {
      const filteredDishes = dishes.filter((dish) => dish.restaurant_Id === formData.restaurant_Id);
      setAvailableDishes(filteredDishes);
    } else {
      setAvailableDishes([]);
    }
  }, [formData.restaurant_Id, dishes]);

  const validate = (field, value) => {
    const trimmedValue = String(value || '').trim();
    let error = '';

    if (
      !trimmedValue &&
      ['user_Id', 'restaurant_Id', 'order_Date', 'delivery_Address'].includes(field)
    ) {
      error = `${field.replace('_', ' ')} is required.`;
    } else if (field === 'orderDetails') {
      if (value.length === 0) {
        error = 'At least one dish must be added.';
      } else {
        value.forEach((detail, index) => {
          if (!detail.dish_Id) {
            error = `Dish at row ${index + 1} is required.`;
          } else if (!detail.quantity || detail.quantity <= 0) {
            error = `Quantity at row ${index + 1} must be greater than 0.`;
          }
        });
      }
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

    if (name === 'restaurant_Id') {
      setFormData((prevState) => ({
        ...prevState,
        orderDetails: [],
      }));
    }

    if (onChange) {
      onChange({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAddDetail = () => {
    if (formData.orderDetails.length > 20) {
      alert('You cannot add more than 20 dishes.');
      return;
    }
    const updatedOrderDetails = [...formData.orderDetails, { dish_Id: '', quantity: 1 }];

    setFormData((prevState) => ({
      ...prevState,
      orderDetails: updatedOrderDetails,
    }));

    const error = validate('orderDetails', updatedOrderDetails);
    setErrors((prevState) => ({
      ...prevState,
      orderDetails: error,
    }));

    if (onChange) {
      onChange({
        ...formData,
        orderDetails: updatedOrderDetails,
      });
    }
  };

  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...formData.orderDetails];
    updatedDetails[index][field] = field === 'quantity' ? Number(value) : value;

    setFormData((prevState) => ({
      ...prevState,
      orderDetails: updatedDetails,
    }));

    const error = validate('orderDetails', updatedDetails);
    setErrors((prevState) => ({
      ...prevState,
      orderDetails: error,
    }));

    if (onChange) {
      onChange({
        ...formData,
        orderDetails: updatedDetails,
      });
    }
  };

  const handleRemoveDetail = (index) => {
    const updatedDetails = formData.orderDetails.filter((_, i) => i !== index);

    setFormData((prevState) => ({
      ...prevState,
      orderDetails: updatedDetails,
    }));

    const error = validate('orderDetails', updatedDetails);
    setErrors((prevState) => ({
      ...prevState,
      orderDetails: error,
    }));

    if (onChange) {
      onChange({
        ...formData,
        orderDetails: updatedDetails,
      });
    }
  };

  const totalDishQuantity = formData.orderDetails.reduce(
    (sum, detail) => sum + Number(detail.quantity || 0),
    0
  );

  const totalPrice = formData.orderDetails.reduce((sum, detail) => {
    const dish = availableDishes.find((d) => d.dish_Id === detail.dish_Id);
    return sum + (dish ? dish.price * detail.quantity : 0);
  }, 0);

  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth error={!!errors.user_Id}>
        <InputLabel id="user-select-label" required>User</InputLabel>
        <Select
          labelId="user-select-label"
          label="User"
          name="user_Id"
          value={formData.user_Id}
          onChange={handleChange}
          required
        >
          {users.map((user) => (
            <MenuItem key={user.user_Id} value={user.user_Id}>
              {user.first_Name} {user.last_Name}
            </MenuItem>
          ))}
        </Select>
        {errors.user_Id && <FormHelperText>{errors.user_Id}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="status-select-label">Status</InputLabel>
        <Select
          labelId="status-select-label"
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth error={!!errors.restaurant_Id} disabled={isEditing}>
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

      <TextField
        label="Order Date"
        name="order_Date"
        type="datetime"
        value={formData.order_Date}
        fullWidth
        InputLabelProps={{ shrink: true }}
        disabled
        helperText="Order date is automatically set."
      />

      <TextField
        label="Delivery Address"
        name="delivery_Address"
        value={formData.delivery_Address}
        onChange={handleChange}
        fullWidth
        required
        error={!!errors.delivery_Address}
        helperText={errors.delivery_Address}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Dish</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.orderDetails.map((detail, index) => {
              const dish = availableDishes.find((d) => d.dish_Id === detail.dish_Id);

              return (
                <TableRow key={index}>
                  <TableCell>
                    <FormControl fullWidth error={!!errors[`orderDetails_${index}_dish_Id`]}>
                      <Select
                        value={detail.dish_Id || ''}
                        onChange={(e) => handleDetailChange(index, 'dish_Id', e.target.value)}
                        required
                      >
                        {availableDishes.map((dish) => (
                          <MenuItem key={dish.dish_Id} value={dish.dish_Id}>
                            {dish.dish_Name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors[`orderDetails_${index}_dish_Id`] && (
                        <FormHelperText>{errors[`orderDetails_${index}_dish_Id`]}</FormHelperText>
                      )}
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={detail.quantity}
                      onChange={(e) => handleDetailChange(index, 'quantity', e.target.value)}
                      required
                      error={!!errors[`orderDetails_${index}_quantity`]}
                      helperText={errors[`orderDetails_${index}_quantity`]}
                      inputProps={{ min: 1, max: 10 }}
                    />
                  </TableCell>
                  <TableCell>{dish ? `$${(dish.price * detail.quantity).toFixed(2)}` : '-'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleRemoveDetail(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {errors.orderDetails && (
        <FormHelperText error>{errors.orderDetails}</FormHelperText>
      )}

      <Typography variant="body2" color={totalDishQuantity > 20 ? 'error' : 'inherit'}>
        Total Dishes: {totalDishQuantity}/20
      </Typography>
      <Typography variant="h6">Total Price: ${totalPrice.toFixed(2)}</Typography>
      <Button
        onClick={handleAddDetail}
        variant="contained"
        sx={{ mt: 2 }}
        disabled={formData.orderDetails.length > 20 || totalDishQuantity > 20}
      >
        Add Dish
      </Button>
    </Box>
  );
};

export default OrderForm;
