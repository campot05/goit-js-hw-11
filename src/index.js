import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import cards from './templates/cards.hbs';
import { API_KEY, fetchImg } from './js/fetchImg';

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

function createItemGallety(items) {
  return items.map(cards).join('');
}

const lightbox = new SimpleLightbox('.gallery a');
