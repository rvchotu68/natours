import axios from 'axios';
import { showAlert } from './alertHandler';

export const login = async (email, password) => {
  try {
    const res = await axios.post('http://127.0.0.1/api/v1/users/login', {
      email,
      password,
    });
    // console.log({ res });
    if (res.data.status === 'success') {
      showAlert('successfully authenticated', 'success');
      setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    console.log(err);
    showAlert(err.response.data.message, 'error');
  }
};

export const logout = async () => {
  console.log('logout');
  try {
    const res = await axios.get('http://127.0.0.1:80/api/v1/users/logout');
    if (res.data.status === 'success') {
      showAlert('Logged out successfully', 'success');
      location.reload();
    }
  } catch (err) {
    showAlert(err.response, 'error');
  }
};
