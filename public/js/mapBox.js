export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYXJ2aW5ka3VtYXIxOTk0IiwiYSI6ImNsZDh1azJ4ODAwMnczb211c202Z25tbHQifQ._7rQrIDM-pzo4IYwR3En6Q';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
  });
};
