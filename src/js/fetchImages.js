import ApiService from './api-service';
import onCard from './card';
import { createPagination } from './pagination';

import { saveInfo, getInfo, removeInfo } from './storage_api';

const apiService = new ApiService();

const GENRE_NAME = 'genre_card';

let genres = [];
apiService.fetchGenres().then(data => {
  genres = data.genres;
  localStorage.setItem(GENRE_NAME, JSON.stringify(genres));
  apiService.fetchImage().then(data => {
    addArticleImage(data);

    createPagination(data.total_results);

    saveInfo(data.page, data.results);
  });
});

localStorage.setItem(GENRE_NAME, JSON.stringify(genres));
const genreName = localStorage.getItem(GENRE_NAME);
genres = JSON.parse(genreName);

export default function addArticleImage(data) {
  const cart = data.results
    .flat(1)
    .map(result => {
      let genresArr = [];

      result.genre_ids.forEach(genreID => {
        genres.forEach(genOBJ => {
          if (genreID === genOBJ.id) {
            genresArr.push(` ${genOBJ.name}`);
          }
        });
      });

      if (genresArr.length > 3) {
        genresArr = genresArr.slice(0, 2);
        genresArr.push(' Other...');
      }
      if (genresArr.length === 0) {
        genresArr.push('No genres');
      }
      result.genre_ids = genresArr;
      if (result.gender) {
      }

      return result;
    })
    .map(result => onCard(result))
    .join('');
  if (document.querySelector(`.gallery`)) {
    document.querySelector(`.gallery`).insertAdjacentHTML('beforeend', cart);
  }
}
