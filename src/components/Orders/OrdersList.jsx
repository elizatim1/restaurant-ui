import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../services/axiosInstance';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UniversalModal from '../UniversalModal';
import OrderForm from './OrderForm';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/orders');
      const ordersWithPrices = response.data.map((order) => {
        const totalPrice = order.orderDetails.reduce((sum, detail) => {
          const dish = dishes.find((d) => d.dish_Id === detail.dish_Id);
          return sum + (dish ? dish.price * detail.quantity : 0);
        }, 0);
        return { ...order, totalPrice };
      });
      setOrders(ordersWithPrices);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [dishes]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  const fetchRestaurants = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  }, []);
  const fetchDishes = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/dishes');
      setDishes(response.data);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchUsers();
    fetchRestaurants();
    fetchDishes();
  }, [fetchOrders, fetchUsers, fetchRestaurants, fetchDishes]);

  const handleEditClick = (order) => {
    setEditingOrder(order);
    setFormData(order);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingOrder(null);
    setFormData({
      user_Id: '',
      restaurant_Id: '',
      order_Date: new Date().toISOString().split('T')[0],
      delivery_Address: '',
      orderDetails: [],
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingOrder(null);
    setFormData({});
    setIsModalOpen(false);
    fetchOrders();
  };

  const handleCloseDeleteModal = () => {
    setOrderToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (editingOrder) {
        await axiosInstance.put(`/orders/${formData.order_Id}`, formData);
      } else {
        await axiosInstance.post('/orders', formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleDelete = async () => {
    if (!orderToDelete) return;
    try {
      await axiosInstance.delete(`/orders/${orderToDelete.order_Id}`);
      handleCloseDeleteModal();
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Order ID',
      'Status',
      'User',
      'Restaurant',
      'Date',
      'Address',
      'Total Price',
      'Details',
    ];

    const rows = orders.map((order) => {
      const user = users.find((u) => u.user_Id === order.user_Id)?.first_Name || 'N/A';
      const restaurant = restaurants.find((r) => r.restaurant_Id === order.restaurant_Id)?.restaurant_Name || 'N/A';
      const details = order.orderDetails
        .map((detail) => {
          const dish = dishes.find((d) => d.dish_Id === detail.dish_Id);
          const dishName = dish?.dish_Name || 'N/A';
          const dishPrice = dish ? `$${dish.price.toFixed(2)}` : 'N/A';
          return `${dishName} (${dishPrice}) x ${detail.quantity}`;
        })
        .join('; ');

      return [
        order.order_Id,
        order.status || 'N/A',
        user,
        restaurant,
        new Date(order.order_Date).toLocaleString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        order.delivery_Address,
        `$${order.totalPrice.toFixed(2)}`,
        details,
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <Button variant="contained" color="primary" onClick={handleCreateClick}>
          Create Order
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleExportCSV}
          sx={{
            backgroundColor: '#f5f5f5',
            color: '#333',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          Export CSV
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Restaurant</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.order_Id}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                  },
                }}
              >
                <TableCell>{order.order_Id}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  {users.find((u) => u.user_Id === order.user_Id)?.first_Name || 'N/A'}
                </TableCell>
                <TableCell>
                  {restaurants.find((r) => r.restaurant_Id === order.restaurant_Id)?.restaurant_Name || 'N/A'}
                </TableCell>
                <TableCell>
                  {new Date(order.order_Date).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </TableCell>

                <TableCell>{order.delivery_Address}</TableCell>
                <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  {order.orderDetails.map((detail, index) => (
                    <Typography key={index}>
                      {dishes.find((d) => d.dish_Id === detail.dish_Id)?.dish_Name || 'N/A'} x{' '}
                      {detail.quantity}
                    </Typography>
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(order)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(order)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <UniversalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title={editingOrder ? 'Edit Order' : 'Create Order'}
        submitText={editingOrder ? 'Update' : 'Create'}
        cancelText="Cancel"
      >
        <OrderForm
          initialData={formData}
          isEditing={!!editingOrder}
          users={users}
          restaurants={restaurants}
          dishes={dishes}
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
        <Typography>Are you sure you want to delete this order?</Typography>
      </UniversalModal>
    </>
  );
};

export default OrdersList;
