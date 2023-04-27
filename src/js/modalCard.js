import ApiService from './api-service';
import { renderModal, backdrop } from './renderModal';

const cardGallery = document.querySelector('.container-open-modal');

import { getInfo, saveInfo } from './storage_api';

const refs = {
  renderModal: document.querySelector('.gallery'),
};

const apiService = new ApiService();
if (refs.renderModal) {
  refs.renderModal.addEventListener('click', showCard);
}

window.addEventListener('keydown', closeModalHandler);

function closeModalHandler(e) {
  if (e.code === 'Escape') {
    backdrop.classList.add('is-hidden');
  }
}

function showCard(e) {
  e.preventDefault();

  if (e.target.nodeName === 'DIV') {
    return;
  }

  backdrop.classList.remove('is-hidden');

  fetchGallery(
    '/' +
      e.target.src.substring(
        e.target.src.lastIndexOf('/') + 1,
        e.target.src.length
      )
  );
}

function fetchGallery(params) {
  apiService
    .fetchImage()
    .then(data => {
      return data.results;
    })
    .then(result => {
      result.forEach(element => {
        let genres = getInfo('genre_card') || replacementGenres;
        let newArr = [];
        if (element.poster_path == params) {
          element.genre_ids.forEach(id => {
            genres.find(el => {
              if (el.id == id) {
                newArr.push(` ${el.name}`);
              }
            });
          });
          element.genre_ids = newArr;
          renderModal(element);
          let closeModal = document.querySelector('[data-modal-close]');
          closeModal.addEventListener('click', onCloseBtn);

          function onCloseBtn() {
            backdrop.classList.add('is-hidden');
          }

          let isWatched = getInfo('watched') || [];
          let alreadyWatched = isWatched.find(movie => movie.id === element.id);
          let watched = document.querySelector('#watched');
          if (alreadyWatched) {
            watched.textContent = 'Remove from watched';
          }

          let isQueued = getInfo('queue') || [];
          let alreadyQueued = isQueued.find(movie => movie.id === element.id);
          let queued = document.querySelector('#queue');
          if (alreadyQueued) {
            queued.textContent = 'Remove from queued';
          }
          watched.addEventListener('click', () => {
            let watchedMovies = getInfo('watched') || [];

            const isAlreadyThere = watchedMovies.find(
              movie => movie.id === element.id
            );
            if (isAlreadyThere) {
              watched.textContent = 'Add to watched';
              watchedMovies = watchedMovies.filter(
                movie => movie.id !== element.id
              );
              watched.textContent = 'Add to Watched';
            } else {
              watched.textContent = 'Remove from watched';
              watchedMovies.push(element);
              watched.textContent = 'Remove from Watched';
            }
            saveInfo('watched', watchedMovies);
          });

          let watchedMovies = getInfo('watched') || [];

          const isAlreadyThere = watchedMovies.find(
            movie => movie.id === element.id
          );

          if (isAlreadyThere) {
            watched.textContent = 'Remove from Watched';
          } else {
            watched.textContent = 'Add to Watched';
          }

          queued.addEventListener('click', () => {
            let queuedMovies = getInfo('queue') || [];
            const isAlreadyQueued = queuedMovies.find(
              movie => movie.id === element.id
            );
            if (isAlreadyQueued) {
              queued.textContent = 'Add to queue';
              queuedMovies = queuedMovies.filter(
                movie => movie.id !== element.id
              );
              queued.textContent = 'Add to Queue';
            } else {
              queued.textContent = 'Remove to queue';
              queuedMovies.push(element);
              queued.textContent = 'Remove from Queue';
            }
            saveInfo('queue', queuedMovies);
          });

          let queuedMovies = getInfo('queue') || [];

          const isAlreadyQueued = queuedMovies.find(
            movie => movie.id === element.id
          );

          if (isAlreadyQueued) {
            queued.textContent = 'Remove from Queue';
          } else {
            queued.textContent = 'Add to Queue';
          }
        }
      });
    });
}
