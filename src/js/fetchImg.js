import axios from 'axios';

const API_KEY = '33190219-0860edc2b5cf578f738ea4f26';

function fetchImg(key, value) {
  return axios
    .get('https://pixabay.com/api/', {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        key: `${API_KEY}`,
        q: `${value}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    })
    .then(response => response.data.hits);
}

export { API_KEY, fetchImg };
