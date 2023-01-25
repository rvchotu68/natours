import '@babel/polyfill';

import { login, logout } from './login';
import { displayMap } from './mapBox';
import { updateUserSettings } from './user';

console.log('index.js');

const formElement = document.querySelector('.form--login');
const mapElement = document.getElementById('map');
const logoutElement = document.getElementById('logout');
const userDataForm = document.querySelector('.form-user-data');
const userSettingForm = document.querySelector('.form-user-settings');

if (mapElement) {
  const locations = JSON.parse(mapElement.dataset.locations);
  displayMap(locations);
}

if (formElement) {
  formElement.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // console.log(email, password);
    login(email, password);
  });
}

if (logoutElement) logoutElement.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateUserSettings({ name, email }, 'data');
  });

if (userSettingForm)
  userSettingForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const saveBtn = document.querySelector('.btn--save');
    saveBtn.textContent = 'UPDATING...';
    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const confirmNewPassword =
      document.getElementById('password-confirm').value;
    await updateUserSettings(
      { currentPassword, newPassword, confirmNewPassword },
      'password'
    );

    saveBtn.textContent = 'SAVE PASSWORD';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
