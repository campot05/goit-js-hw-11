import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '33190219-0860edc2b5cf578f738ea4f26';

const refs = {
  input: document.querySelector('.input'),
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.gallery.addEventListener('click', e => {
  e.preventDefault();
});
refs.form.addEventListener('submit', e => {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  const value = refs.input.value;

  fetchImg(API_KEY, value)
    .then(res => {
      const items = createItemGallety(res);
      if (items === '') {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notify.success(`Hooray! We found ${items.length} images.`);
      refs.gallery.insertAdjacentHTML('beforeend', items);
      lightbox.refresh();
    })
    .catch(err => console.log(err));
});

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

function createItemGallety(items) {
  return items
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
	<div class="photo-card">
	<a class="photo-card__link" href="${largeImageURL}">
		<img src="${webformatURL}" alt="${tags}" loading="lazy" />
	</a>
	<div class="info">
	  <p class="info-item">
		 <b>Likes</b>
		 ${likes}
	  </p>
	  <p class="info-item">
		 <b>Views</b>
		 ${views}
	  </p>
	  <p class="info-item">
		 <b>Comments</b>
		 ${comments}
	  </p>
	  <p class="info-item">
		 <b>Downloads</b>
		 ${downloads}
	  </p>
	</div>
 </div>
	`;
      }
    )
    .join('');
}

const lightbox = new SimpleLightbox('.gallery a');
