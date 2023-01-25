import axios from 'axios';
import { showAlert } from './alertHandler';

export const updateUserSettings = async (data, type) => {
  try {
    const url =
      type === 'data'
        ? '/api/v1/users/updateMe'
        : '/api/v1/users/updatePassword';
    const res = await axios.patch(url, data);
    if (res.data.status === 'success') {
      showAlert(`${type.toUpperCase()} successfully updated`, 'success');
    }
  } catch (err) {
    console.dir(err);
    const msg = err.response
      ? err.response.data.message
      : 'Something went wrong';
    showAlert(msg, 'error');
  }
};
