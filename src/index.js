import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import cards from './templates/cards.hbs';
import { API_KEY, fetchImg, page } from './js/fetchImg';

const refs = {
  input: document.querySelector('.input'),
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
  spinner: document.querySelector('.preloader'),
  scrollBtn: document.querySelector('#scroll-top'),
};

let pageNumber = 1;
let perPage = 40;
let lightbox = new SimpleLightbox('.gallery a');

if (refs.input.value === '') {
  spinnerOff();
}

refs.gallery.addEventListener('click', e => {
  e.preventDefault();
});
refs.form.addEventListener('submit', onSubmit);
refs.loadBtn.addEventListener('click', loadMore);

async function onSubmit(e) {
  e.preventDefault();
  pageNumber = 1;
  refs.gallery.innerHTML = '';
  const value = refs.input.value;
  if (!value) {
    return Notify.failure('Please enter any word!');
  }
  onHideLoadBtn();
  spinnerOn();
  const data = await fetchImg(value, pageNumber, perPage);
  const { hits, totalHits } = data;

  spinnerOff();
  onShowLoadBtn();
  if (!totalHits) {
    onHideLoadBtn();
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notify.success(`Hooray! We found ${totalHits} images.`);
    const items = createItemGallety(hits);
    refs.gallery.insertAdjacentHTML('beforeend', items);
  }

  if (totalHits > perPage) {
    onShowLoadBtn();
  }
  if (hits.length < perPage) {
    onHideLoadBtn();
  }
  lightbox.refresh();
}

async function loadMore(e) {
  const value = refs.input.value;
  pageNumber += 1;
  onHideLoadBtn();
  spinnerOn();

  const data = await fetchImg(value, pageNumber, perPage);
  spinnerOff();
  onShowLoadBtn();
  const { hits, totalHits } = data;
  const items = createItemGallety(hits);
  refs.gallery.insertAdjacentHTML('beforeend', items);
  scroll();
  if (hits.length < perPage) {
    onHideLoadBtn();
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  lightbox.refresh();
}

function createItemGallety(items) {
  return items.map(cards).join('');
}

function onShowLoadBtn() {
  refs.loadBtn.classList.remove('is-hidden');
}

function onHideLoadBtn() {
  refs.loadBtn.classList.add('is-hidden');
}

function spinnerOn() {
  refs.spinner.classList.remove('is-hidden');
}

function spinnerOff() {
  refs.spinner.classList.add('is-hidden');
}

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function showBtn() {
  window.onscroll = () => {
    if (window.scrollY > 700) {
      refs.scrollBtn.classList.remove('is-show_off');
    } else if (window.scrollY < 700) {
      refs.scrollBtn.classList.add('is-show_off');
    }
  };
}
showBtn();
refs.scrollBtn.addEventListener('click', () => {
  window.scrollTo(0, 0);
});
