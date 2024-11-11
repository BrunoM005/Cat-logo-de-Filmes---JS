const api_KEY = 'api_key=c4b577d7f5ce4796aed478772abc1103';
const URL = 'https://api.themoviedb.org/3';
const apiURL = URL + '/discover/movie?sort_by=popularity.desc&' + api_KEY;
const imgURL = 'https://image.tmdb.org/t/p/w500';
const searchURL = URL + '/search/movie?' + api_KEY;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsElement = document.getElementById('tags');

const selectedGenre = [];

const genres = [
    {
        "genres":[
           {
              "id":28,
              "name":"Action"
           },
           {
              "id":12,
              "name":"Adventure"
           },
           {
              "id":16,
              "name":"Animation"
           },
           {
              "id":35,
              "name":"Comedy"
           },
           {
              "id":80,
              "name":"Crime"
           },
           {
              "id":99,
              "name":"Documentary"
           },
           {
              "id":18,
              "name":"Drama"
           },
           {
              "id":10751,
              "name":"Family"
           },
           {
              "id":14,
              "name":"Fantasy"
           },
           {
              "id":36,
              "name":"History"
           },
           {
              "id":27,
              "name":"Horror"
           },
           {
              "id":10402,
              "name":"Music"
           },
           {
              "id":9648,
              "name":"Mystery"
           },
           {
              "id":10749,
              "name":"Romance"
           },
           {
              "id":878,
              "name":"Science Fiction"
           },
           {
              "id":10770,
              "name":"TV Movie"
           },
           {
              "id":53,
              "name":"Thriller"
           },
           {
              "id":10752,
              "name":"War"
           },
           {
              "id":37,
              "name":"Western"
           }
        ]
     }
]

setGenre();

function setGenre() {
    tagsElement.innerHTML = '';
    genres[0].genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if (selectedGenre.length == 0) {
                selectedGenre.push(genre.id)
            } else {
                if (selectedGenre.includes(genre.id)) {
                    selectedGenre.forEach((id, index) => {
                        if (id == genre.id) {
                            selectedGenre.splice(index, 1);
                        }
                    })
                } else {
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre);
            getMovies(apiURL + '&with_genres=' + encodeURI(selectedGenre.join(',')));
            seeSelection();
        })

        tagsElement.append(t);
    })
}

function seeSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('see');
    })
    if (selectedGenre.length != 0) {
        selectedGenre.forEach(id => {
            const seeTag = document.getElementById(id);
            seeTag.classList.add('see');
        })
    }
}

getMovies(apiURL);

function getMovies(URL) {
    fetch(URL).then(res => res.json()).then(data => {
        console.log(data);
        if (data.results.length !== 0) {
            showMovies(data.results);
        } else {
            main.innerHTML = `<h1 class="error">Nenhum Resultado encontrado!</h1>`
        }
    })
}

function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview} = movie;
        const movieElements = document.createElement('div');
        movieElements.classList.add('movie');
        movieElements.innerHTML = `
            <img src="${imgURL + poster_path}" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average.toFixed(1)}</span>
            </div>

            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>
        </div>`

        main.appendChild(movieElements);
    });
}

function getColor(vote) {
    if (vote >= 8) {
        return 'green'
    } else if (vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    if (searchTerm) {
        getMovies(searchURL + '&query=' + searchTerm);
    } else {
        getMovies(apiURL)
    }
})