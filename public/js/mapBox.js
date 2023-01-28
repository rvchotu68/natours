import mapboxgl from 'mapbox-gl';

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYXJ2aW5ka3VtYXIxOTk0IiwiYSI6ImNsZDh1azJ4ODAwMnczb211c202Z25tbHQifQ._7rQrIDM-pzo4IYwR3En6Q';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //create a marker
    const el = document.createElement('div');
    el.className = 'marker';

    //add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
