import ApiService from './api-service';
import addArticleImage from './fetchImages';
import { saveInfo, getInfo, removeInfo } from './storage_api';
import { createPagination, createPaginationForSearch } from './pagination';
import { fetchFromGallery } from './fetch-render_modal';
import { backdrop } from './renderModal';

const FUND_NAME = 'genre_card';
let previousSearch = '';

const searchFormRef = document.querySelector('#form-search');
const errorMessage = document.querySelector('.error-notification');
const input = document.querySelector(`.form-group__input`);

const apiService = new ApiService();

if (searchFormRef) {
  searchFormRef.addEventListener('submit', onFormSubmit);
}

function onFormSubmit(e) {
  e.preventDefault();
  const searchRequest = e.currentTarget.searchQuery.value.trim();

  if (searchRequest !== '') {
    apiService.query = e.currentTarget.elements.searchQuery.value;

    apiService.fetchFundFilms().then(data => {
      const galContainer = document.querySelector('.gallery');

      if (data.results.length === 0) {
        document
          .querySelector('.error-notification')
          .insertAdjacentHTML(
            'beforeend',
            'Search result not successful. Enter the correct movie name.'
          );

        apiService.fetchGenres().then(data => {
          genres = data.genres;
          localStorage.setItem(GENRE_NAME, JSON.stringify(genres));
          apiService.fetchImage().then(data => {
            createPagination(data.total_results);

            addArticleImage(data);
            saveInfo(data.page, data.results);
          });
        });

        apiService.fetchImage().then(data => {
          setTimeout(() => {
            if (document.querySelector(`.error-notification`)) {
              document.querySelector('.error-notification').innerHTML = '';
              input.value = '';
              saveInfo(data.page, data.results);
              apiService.fetchImage().then(data => {
                createPagination(data.total_results);

                saveInfo(data.page, data.results);
              });
              input.value = '';
              const GENRE_NAME = 'genre_card';
              let genres = [];

              const genreName = localStorage.getItem(GENRE_NAME);
              genres = JSON.parse(genreName);
              console.log(genres);
              document.querySelector(`.gallery`).innerHTML = '';
              addArticleImage(data);
            }
          }, 2000);
        });

        return;
      } else {
        saveInfo('page', data.results);

        galContainer.addEventListener('click', showCard);
      }

      cleanView();
      addArticleImage(data);

      createPaginationForSearch(data.total_results);
    });
  }
}

function cleanView() {
  document.querySelector(`.gallery`).innerHTML = ``;
}

function showCard(e) {
  e.preventDefault();

  if (e.target.nodeName === 'DIV') {
    return;
  }

  backdrop.classList.remove('is-hidden');
  fetchFromGallery(
    '/' +
      e.target.src.substring(
        e.target.src.lastIndexOf('/') + 1,
        e.target.src.length
      ),
    'page'
  );
}
