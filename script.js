// Get references to DOM elements
const searchForm = document.getElementById('search-form');
const movieResults = document.getElementById('movie-results');
const movieSearchInput = document.getElementById('movie-search');
const watchlistDiv = document.getElementById('watchlist');

// Your OMDb API key (use 'demo' for testing, but replace with your own for real use)
const apiKey = 'd2791e52';

// This array will store the movies in the watchlist
let watchlist = [];

// Listen for the search form submission
searchForm.addEventListener('submit', async function(event) {
  // Prevent the page from reloading
  event.preventDefault();

  // Get the search term from the input box
  const searchTerm = movieSearchInput.value.trim();

  // If the search box is empty, do nothing
  if (!searchTerm) {
    movieResults.innerHTML = '';
    return;
  }

  // Build the OMDb API URL with the search term
  const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchTerm)}`;

  // Fetch data from the OMDb API
  const response = await fetch(apiUrl);
  const data = await response.json();

  // Check if the API returned movies
  if (data.Response === "True") {
    // Create HTML for each movie
    let moviesHtml = '';
    for (const movie of data.Search) {
      // Use a placeholder image if poster is not available
      const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150x220?text=No+Image";
      // Each movie card has an Add to Watchlist button with a data-id attribute
      moviesHtml += `
        <div class="movie-card">
          <img src="${poster}" alt="Poster for ${movie.Title}">
          <h3>${movie.Title}</h3>
          <p>${movie.Year}</p>
          <button class="add-watchlist-btn" data-id="${movie.imdbID}" data-title="${movie.Title}" data-year="${movie.Year}" data-poster="${poster}">
            Add to Watchlist
          </button>
        </div>
      `;
    }
    // Show the movies in the results grid
    movieResults.innerHTML = moviesHtml;
  } else {
    // If no movies found, show a message
    movieResults.innerHTML = `<p>No movies found. Try another search!</p>`;
  }
});

// Listen for clicks on the movie results grid
movieResults.addEventListener('click', function(event) {
  // Check if the clicked element is an Add to Watchlist button
  if (event.target.classList.contains('add-watchlist-btn')) {
    // Get movie info from data attributes
    const imdbID = event.target.getAttribute('data-id');
    const title = event.target.getAttribute('data-title');
    const year = event.target.getAttribute('data-year');
    const poster = event.target.getAttribute('data-poster');

    // Check if the movie is already in the watchlist
    const alreadyInWatchlist = watchlist.some(function(movie) {
      return movie.imdbID === imdbID;
    });

    // If not in watchlist, add it
    if (!alreadyInWatchlist) {
      // Create a movie object and add to the watchlist array
      const movieObj = {
        imdbID: imdbID,
        Title: title,
        Year: year,
        Poster: poster
      };
      watchlist.push(movieObj);
      // Update the watchlist display
      renderWatchlist();
    }
  }
});

// Function to display the watchlist movies
function renderWatchlist() {
  // If watchlist is empty, show a message
  if (watchlist.length === 0) {
    watchlistDiv.innerHTML = 'Your watchlist is empty. Search for movies to add!';
    return;
  }

  // Create HTML for each movie in the watchlist
  let watchlistHtml = '';
  for (const movie of watchlist) {
    watchlistHtml += `
      <div class="movie-card">
        <img src="${movie.Poster}" alt="Poster for ${movie.Title}">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>
    `;
  }
  watchlistDiv.innerHTML = watchlistHtml;
}
