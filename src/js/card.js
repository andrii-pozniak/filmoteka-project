export default function onCard({
  poster_path,
  name,
  badName,
  title,
  genre_ids,
  release_date,
  vote_average,
  first_air_date,
}) {
  const BASE_IMAGE = `https://image.tmdb.org/t/p/original`;
  return `<div class="card">
    <img src="${BASE_IMAGE}${poster_path}" onerror="this.onerror=null;this.src='https://thefittingsource.com/wp-content/uploads/2017/12/temp-inventory-landing.jpg'" loading="lazy" alt="${
    title || name
  }" class="card_image" width="300"
    >
    <h2 class="card_name">${name || title || badName}</h2>
    <div class="card_text">
      <p class="card_title">${genre_ids || 'Action'}</p>
      <p class="card_year"> | ${(
        release_date ||
        first_air_date ||
        '2021'
      ).slice(0, 4)}</p>      
    </div>
</div>`;
}
