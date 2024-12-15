import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import UserForm from './UserForm';
import UniversalModal from '../UniversalModal';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get('/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData(user);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingUser(null);
    setFormData({
      first_Name: '',
      last_Name: '',
      username: '',
      email: '',
      user_Address: '',
      user_Phone: '',
      password: '',
      role_Id: '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingUser(null);
    setFormData({});
    setIsModalOpen(false);
    fetchUsers();
  };

  const handleCloseDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await axiosInstance.put(`/users/${formData.user_Id}`, formData);
      } else {
        await axiosInstance.post('/users', formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await axiosInstance.delete(`/users/${userToDelete.user_Id}`);
      handleCloseDeleteModal();
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleCreateClick} sx={{ marginBottom: 2 }}>
        Create User
      </Button>
      <Grid container spacing={3} sx={{ padding: 3 }}>
        {users.map((user) => (
          <Grid item xs={12} md={6} lg={4} key={user.user_Id}>
            <Card className="card">
            <CardContent className="card-content">
                <Typography variant="h6">
                  {user.first_Name} {user.last_Name}
                </Typography>
                <Typography>Email: {user.email}</Typography>
                <Typography>Phone: {user.user_Phone}</Typography>
                <Typography>Address: {user.user_Address}</Typography>
                <Typography>
                  Role: {roles.find((role) => role.role_Id === user.role_Id)?.name || 'N/A'}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button onClick={() => handleEditClick(user)}>Edit</Button>
                  <Button color="error" onClick={() => handleDeleteClick(user)}>
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
        title={editingUser ? 'Edit User' : 'Create User'}
        submitText={editingUser ? 'Update' : 'Create'}
        cancelText="Cancel"
      >
        <UserForm initialData={formData} isEditing={!!editingUser} roles={roles} onChange={setFormData} />
      </UniversalModal>

      <UniversalModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onSubmit={handleDelete}
        title="Delete Confirmation"
        submitText="Delete"
        cancelText="Cancel"
      >
        <Typography>Are you sure you want to delete this user?</Typography>
      </UniversalModal>
    </>
  );
};

export default UsersList;
