import ApiService from './api-service';

import addArticleImage from './fetchImages';
import { saveInfo } from './storage_api';
import { backdrop } from './renderModal';
import { fetchFromGallery } from './fetch-render_modal';

const Pagination = require('tui-pagination');
const apiService = new ApiService();

const input = document.querySelector('.form-group__input');

const gallery = document.querySelector('.gallery');
const library = document.querySelector('.library');

export function createPagination(total_results) {
  const container = document.getElementById('tui-pagination-container');
  const options = {
    totalItems: total_results,
    itemsPerPage: 20,
    visiblePages: 5,
    page: 1,
    centerAlign: true,
    firstItemClassName: 'tui-first-child',
    lastItemClassName: 'tui-last-child',
    template: {
      page: '<a href="#" class="tui-page-btn">{{page}}</a>',
      currentPage:
        '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
      moveButton:
        '<a href="#" class="tui-page-btn tui-{{type}} custom-class-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</a>',
      disabledMoveButton:
        '<span class="tui-page-btn tui-is-disabled tui-{{type}} custom-class-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</span>',
      moreButton:
        '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip custom-class-{{type}}">' +
        '<span class="tui-ico-ellip">...</span>' +
        '</a>',
    },
  };

  const pagination = new Pagination(container, options);

  pagination.on('afterMove', event => {
    gallery.innerHTML = '';

    const currentPage = event.page;

    apiService.pagePl = currentPage;
    apiService.fetchImage().then(data => {
      saveInfo('page', data.results);
      addArticleImage(data);
    });
  });
}

export function createPaginationForSearch(total_results) {
  const container = document.getElementById('tui-pagination-container');
  const options = {
    totalItems: total_results,
    itemsPerPage: 20,
    visiblePages: 5,
    page: 1,
    centerAlign: true,
    firstItemClassName: 'tui-first-child',
    lastItemClassName: 'tui-last-child',
    template: {
      page: '<a href="#" class="tui-page-btn">{{page}}</a>',
      currentPage:
        '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
      moveButton:
        '<a href="#" class="tui-page-btn tui-{{type}} custom-class-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</a>',
      disabledMoveButton:
        '<span class="tui-page-btn tui-is-disabled tui-{{type}} custom-class-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</span>',
      moreButton:
        '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip custom-class-{{type}}">' +
        '<span class="tui-ico-ellip">...</span>' +
        '</a>',
    },
  };

  const pagination = new Pagination(container, options);

  pagination.on('afterMove', event => {
    gallery.innerHTML = '';

    const currentPage = event.page;

    apiService.pagePl = currentPage;
    apiService.query = input.value;

    apiService
      .fetchFundFilms()
      .then(data => {
        console.log('ok-click', data);
        saveInfo('page', data.results);
        addArticleImage(data);
      })
      .catch(error => console.log(error));
  });
}

const galContainer =
  document.querySelector('.gallery') || document.querySelector('.library');
galContainer.addEventListener('click', showCard);

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
