import ApiService from './api-service';
import onCardLib from './card_library';
import { saveInfo, getInfo, removeInfo } from './storage_api';
import { fetchFromGallery } from './fetch-render_modal';
import { renderModal, backdrop } from './renderModal';
const apiService = new ApiService();

let arrayToRender = [];
function makeArrayToRender(arg) {
  arrayToRender = getInfo(arg);
  console.log(arrayToRender);
  addArticleImage(arrayToRender);
  saveInfo('page', arrayToRender);
  const cardGallery = document.querySelector('.library');
  cardGallery.addEventListener('click', clickHandler);
  function clickHandler(e) {
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
  console.log(cardGallery);
}

function cleanView() {
  refs.libraryEl.innerHTML = ``;
}

function addArticleImage(arrayToRender) {
  const card = arrayToRender
    .map(arrayToRender => onCardLib(arrayToRender))
    .join('');
  if (arrayToRender.length > 0) {
    refs.contentEl.classList.add('no_display');
  } else if (arrayToRender.length === 0) {
    refs.contentEl.classList.remove('no_display');
  }

  refs.libraryEl.insertAdjacentHTML('beforeend', card);
}

const refs = {
  queueBtn: document.querySelector('#queue-lib'),
  watchedBtn: document.querySelector('#watched-lib'),
  libraryEl: document.querySelector('.library'),
  contentEl: document.querySelector('.content'),
};

const onClickWatched = () => {
  refs.queueBtn.classList.remove('btn_is-active');
  refs.watchedBtn.classList.add('btn_is-active');
  refs.contentEl.classList.add('no_display');
  cleanView();
  makeArrayToRender('watched');
};

const onClickQueue = () => {
  refs.queueBtn.classList.add('btn_is-active');
  refs.watchedBtn.classList.remove('btn_is-active');
  refs.contentEl.classList.add('no_display');
  cleanView();
  makeArrayToRender('queue');
};

if (refs.queueBtn) {
  refs.queueBtn.addEventListener('click', onClickQueue);
  refs.watchedBtn.addEventListener('click', onClickWatched);
}

let queueData = [];
let watchedData = [];
queueData = getInfo('queue');
watchedData = getInfo('watched');

if (refs.queueBtn) {
  if (!queueData && !watchedData) {
    return;
  } else if (!watchedData) {
    return;
  } else if (watchedData.length > 0) {
    onClickWatched();
  } else if (queueData.length > 0) {
    onClickQueue();
  } else {
    return;
  }
}

export { onClickQueue, onClickWatched };
