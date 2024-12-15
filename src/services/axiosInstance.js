// src/services/axiosInstance.js
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const axiosInstance = axios.create({
  baseURL: 'http://10.0.0.61:5179/api',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    enqueueSnackbar('Request failed. Please try again.', { variant: 'error' });
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400: 
          break;

        case 401: 
          enqueueSnackbar(data?.message || 'Unauthorized. Please login again.', {
            variant: 'error',
          });

          break;

        case 403: 
          enqueueSnackbar(data?.message || 'You do not have permission to perform this action.', {
            variant: 'error',
          });
          break;

        case 404:
          enqueueSnackbar(data?.message || 'Requested resource not found.', {
            variant: 'warning',
          });
          break;

        case 429: 
          enqueueSnackbar(data?.message || 'You are making requests too frequently. Please wait.', {
            variant: 'warning',
          });
          break;

        case 500: 
          enqueueSnackbar(data?.message || 'Internal server error. Please try again later.', {
            variant: 'error',
          });
          break;

        case 503: 
          enqueueSnackbar(
            data?.message || 'Service is temporarily unavailable. Please try again later.',
            { variant: 'error' }
          );
          break;

        default: 
          enqueueSnackbar(
            data?.message || `Unexpected error occurred (Status code: ${status}).`,
            { variant: 'error' }
          );
      }
    } else if (error.request) {
      enqueueSnackbar('Server is not responding. Please check your network connection.', {
        variant: 'error',
      });
    } else {
      enqueueSnackbar('An unexpected error occurred. Please try again.', { variant: 'error' });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
