import axios from 'axios';
import { showAlert } from './alertHandler';

export const login = async (email, password) => {
  try {
    const res = await axios.post('/api/v1/users/login', {
      email,
      password,
    });
    if (res.data.status === 'success') {
      showAlert('successfully authenticated', 'success');
      setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    const error = err.response.data.message || 'Something went wrong.';
    showAlert(error, 'error');
  }
};

export const logout = async () => {
  try {
    const res = await axios.get('/api/v1/users/logout');
    if (res.data.status === 'success') {
      showAlert('Logged out successfully', 'success');
      location.reload();
    }
  } catch (err) {
    const error = err.response.data.message || 'Something went wrong.';
    showAlert(error, 'error');
  }
};
