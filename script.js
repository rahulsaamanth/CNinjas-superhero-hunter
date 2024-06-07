const FAVORITES_KEY = "favorites"
const publicKey = "e1fd194fbc11a598b4937483e7062007"
const privateKey = "3686b9ae9dc5c4e5bf6cd6a559131795e74a15f3"
const ts = new Date().getTime()
const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString()
const apiBaseUrl = "https://gateway.marvel.com:443/v1/public/characters"

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("index.html")) {
    const searchBar = document.getElementById("search-bar")
    searchBar.addEventListener("input", () => {
      const query = searchBar.value.trim()
      if (query) {
        fetchSuperheroes(query)
      } else {
        document.getElementById("superhero-list").innerHTML = ""
      }
    })
  } else if (window.location.pathname.includes("superhero.html")) {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("id")
    if (id) {
      fetchSuperheroDetails(id)
    }
  } else if (window.location.pathname.includes("favorite.html")) {
    displayFavoriteSuperheroes()
  }
})

function fetchSuperheroes(query) {
  const url = `${apiBaseUrl}?nameStartsWith=${query}&ts=${ts}&apikey=${publicKey}&hash=${hash}`
  fetch(url)
    .then((response) => response.json())
    .then((data) => displaySuperheroes(data.data.results))
    .catch((error) => console.error("Error fetching data:", error))
}

function displaySuperheroes(superheroes) {
  const superheroList = document.getElementById("superhero-list")
  superheroList.innerHTML = ""
  superheroes.forEach((hero) => {
    const heroDiv = document.createElement("div")
    heroDiv.classList.add("superhero")
    heroDiv.innerHTML = `
            <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}">
            <h3>${hero.name}</h3>
            <button onclick="addToFavorites(${hero.id})">Add to Favorites</button>
            <button onclick="viewDetails(${hero.id})">View Details</button>
        `
    superheroList.appendChild(heroDiv)
  })
}

function fetchSuperheroDetails(id) {
  const url = `${apiBaseUrl}/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
  fetch(url)
    .then((response) => response.json())
    .then((data) => displaySuperheroDetails(data.data.results[0]))
    .catch((error) => console.error("Error fetching data:", error))
}

function displaySuperheroDetails(hero) {
  const detailsDiv = document.getElementById("superhero-details")
  detailsDiv.innerHTML = `
        <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${
    hero.name
  }">
        <h2>${hero.name}</h2>
        <p>${hero.description || "No description available."}</p>
        <h3>Comics:</h3>
        <ul>${hero.comics.items
          .map((item) => `<li>${item.name}</li>`)
          .join("")}</ul>
        <h3>Events:</h3>
        <ul>${hero.events.items
          .map((item) => `<li>${item.name}</li>`)
          .join("")}</ul>
        <h3>Series:</h3>
        <ul>${hero.series.items
          .map((item) => `<li>${item.name}</li>`)
          .join("")}</ul>
        <h3>Stories:</h3>
        <ul>${hero.stories.items
          .map((item) => `<li>${item.name}</li>`)
          .join("")}</ul>
    `
}

function displayFavoriteSuperheroes() {
  const favoriteList = document.getElementById("favorite-list")
  favoriteList.innerHTML = "" // Clear existing content
  const favorites = getFavorites()

  if (favorites.length === 0) {
    favoriteList.innerHTML = "<p>No favorite superheroes found</p>"
  } else {
    favorites.forEach((id) => fetchFavoriteSuperhero(id))
  }
}

function fetchFavoriteSuperhero(id) {
  const url = `${apiBaseUrl}/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
  fetch(url)
    .then((response) => response.json())
    .then((data) => displayFavoriteSuperhero(data.data.results[0]))
    .catch((error) => console.error("Error fetching data:", error))
}

function displayFavoriteSuperhero(hero) {
  const favoriteList = document.getElementById("favorite-list")
  const heroDiv = document.createElement("div")
  heroDiv.classList.add("superhero")
  heroDiv.innerHTML = `
        <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}">
        <h3>${hero.name}</h3>
        <button onclick="removeFromFavorites(${hero.id})">Remove from Favorites</button>
        <button onclick="viewDetails(${hero.id})">View Details</button>
    `
  favoriteList.appendChild(heroDiv)
}

function addToFavorites(id) {
  if (!isFavorite(id)) {
    addFavorite(id)
    alert("Superhero added to favorites")
  } else {
    alert("Superhero already in favorites")
  }
}

function displayFavoriteSuperheroes() {
  const favoriteList = document.getElementById("favorite-list")
  favoriteList.innerHTML = ""
  const favorites = getFavorites()

  if (favorites.length === 0) {
    favoriteList.innerHTML = "<p>No favorite superheroes found</p>"
  } else {
    favorites.forEach((id) => fetchFavoriteSuperhero(id))
  }
}

function fetchFavoriteSuperhero(id) {
  const url = `${apiBaseUrl}/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
  fetch(url)
    .then((response) => response.json())
    .then((data) => displayFavoriteSuperhero(data.data.results[0]))
    .catch((error) => console.error("Error fetching data:", error))
}

function displayFavoriteSuperhero(hero) {
  const favoriteList = document.getElementById("favorite-list")
  const heroDiv = document.createElement("div")
  heroDiv.classList.add("superhero")
  heroDiv.innerHTML = `
        <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}">
        <h3>${hero.name}</h3>
        <button onclick="removeFromFavorites(${hero.id})">Remove from Favorites</button>
        <button onclick="viewDetails(${hero.id})">View Details</button>
    `
  favoriteList.appendChild(heroDiv)
}

function removeFromFavorites(id) {
  removeFavorite(id)
  displayFavoriteSuperheroes()
}

function viewDetails(id) {
  window.location.href = `superhero.html?id=${id}`
}

function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []
}

function setFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

function addFavorite(id) {
  const favorites = getFavorites()
  if (!favorites.includes(id)) {
    favorites.push(id)
    setFavorites(favorites)
  }
}

function removeFavorite(id) {
  let favorites = getFavorites()
  favorites = favorites.filter((fav) => fav !== id)
  setFavorites(favorites)
}

function isFavorite(id) {
  const favorites = getFavorites()
  return favorites.includes(id)
}
