const apiKey = 'ff43edbb-def9-4156-90c9-c7b976e71981';
const apiURL =
  'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const searchURL = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
const descrURL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
const form = document.querySelector('form');
const search = document.querySelector('.search');
const footerDate = document.querySelector('.footer__date');
const movies = document.querySelector('.movies');
const range = document.querySelector('.movie__range');
const xElement = document.querySelector('.x-element');
const headerTitle = document.querySelector('.header__title');

async function getFilms(url) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
  });
  const result = await response.json();
  showFilms(result);
}

function showFilms(data) {
  movies.innerHTML = '';

  data.films.forEach((film) => {
    let rate = film.rating;
    if (rate == 'null') {
      rate = '--';
    } else if (parseFloat(rate).toFixed(1) > 10) {
      rate = (parseFloat(rate).toFixed(1) / 10).toFixed(1);
    }

    const movie = document.createElement('div');
    let genre33;
    let genre22 = `${film.genres.map((genre) => `${genre.genre}`)}`;
    if (genre22.length >= 25) {
      genre33 = genre22.slice(0, 25) + '...';
    } else {
      genre33 = genre22;
    }

    if (!film.nameRu) {
      film.nameRu = film.nameEn;
    }

    movie.classList.add('movie');
    movie.innerHTML = `
    <div class="movie" title="Описание">       
    <div class="movie-poster__wrapper">
      <img class="movie-poster"
        src="${film.posterUrlPreview}"
        alt="${film.nameRu}" />
      <div class="movie-poster__blackout"></div>
    
    <div class="movie-info">
      <div class="movie__title">${film.nameRu}</div>
      <div class="movie__genre">${genre33}</div >
  <div class="movie__range movie__range--${setRange(rate)}">${rate}</div>
      </div >
    </div >     
    <div class="movie-id">${film.filmId}</div>            
  </div> 
  `;

    movies.appendChild(movie);

    movie.addEventListener('click', (event) => {
      let idDesr;
      if (event.target.classList.contains('movie-id')) {
        idDesr = event.target.textContent;
        getDescr(`${descrURL}${idDesr}`);
      }

      async function getDescr(url) {
        const responseDescr = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey,
          },
        });
        const resultDescr = await responseDescr.json();

        let rateImdb = resultDescr.ratingImdb;
        if (rateImdb == null) {
          rateImdb = '--';
        }

        const movieDescription = document.createElement('div');
        movieDescription.classList.add('movie-description');
        movieDescription.innerHTML = `
        <div class="movie-description">
            <div class="movie-description__inner">${resultDescr.year}</div>
            <div class="movie-description__inner">${resultDescr.countries.map(
              (country) => `${country.country}`,
            )}</div>
            <div class="movie-description__name">${film.nameRu}</div>                        
            <div class="movie-description__text">${resultDescr.description}</div>  
            <div class="movie-description__rate"> Рейтинг Imbd: ${rateImdb}</div>    
            <div class="movie-description__rate"> Рейтинг Кинопоиск: ${rate}</div>  
            <div class="movie-description__rate"> Длительность: ${
              film.filmLength
            }</div>                
          </div>
        `;
        movie.appendChild(movieDescription);

        movieDescription.addEventListener('mouseleave', () => {
          setTimeout(closeDescription, 700);

          function closeDescription() {
            movieDescription.classList.remove('movie-description');
            movieDescription.innerHTML = '';
          }
        });
      }
    });
  });
}

function setRange(range) {
  if (range >= 8) {
    return 'green';
  } else if (range >= 6 && range < 8) {
    return 'yellow';
  } else {
    return 'red';
  }
}

getFilms(apiURL);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  let searchRequestURL = `${searchURL}${search.value}`;
  if (search.value) {
    getFilms(searchRequestURL);
  }
});

function clearSearch() {
  search.value = '';
  getFilms(apiURL);
}

xElement.addEventListener('click', clearSearch);
headerTitle.addEventListener('click', clearSearch);
