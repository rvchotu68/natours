const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (text, type) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${text}</div>`;
  const element = document.querySelector('body');
  element.insertAdjacentHTML('afterbegin', markup);
  setTimeout(() => hideAlert(), 2000);
};
