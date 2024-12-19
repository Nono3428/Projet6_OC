// URL de base de l'API
const API_BASE_URL = "http://localhost:8000/api/v1";

// Fonction pour récupérer et afficher le meilleur film
async function fetchBestMovie() {
    try {
        const response = await fetch(`${API_BASE_URL}/titles/?sort_by=-imdb_score&page_size=1`);
        const data = await response.json();
        const bestMovie = data.results[0];

        document.querySelector("#meilleur-film img").src = bestMovie.image_url;
        document.querySelector("#meilleur-film h3").textContent = bestMovie.title;

        const detailedResponse = await fetch(`${API_BASE_URL}/titles/${bestMovie.id}`);
        const detailedData = await detailedResponse.json();
        const detailedMovie = detailedData;
        
        document.querySelector("#meilleur-film p").textContent = detailedMovie.description;
        await fetchMovieDetailsAndFillModal(bestMovie.id)
    } catch (error) {
        console.error("Erreur lors de la récupération du meilleur film:", error);
    }
}

// Fonction pour récupérer les films les mieux notés
async function fetchTopMovies() {
    try {
        const response = await fetch(`${API_BASE_URL}/titles/?sort_by=-imdb_score&page_size=6`);
        const data = await response.json();

        const topMoviesContainer = document.querySelector("#films-mieux-notes .grille-films");
        topMoviesContainer.innerHTML = ""; // Efface les anciens films

        data.results.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.className = "carte-film"; // Utilise votre classe CSS définie

            movieCard.innerHTML = `
                <img src="${movie.image_url}" alt="${movie.title}" class="image-film">
                <div class="corps-carte">
                    <h5 class="titre-film">${movie.title}</h5>
                    <a href="#" class="bouton bouton-details">Détails</a>
                </div>`;
            topMoviesContainer.appendChild(movieCard);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des films les mieux notés:", error);
    }
}

async function fetchMoviesByCategory(category, containerId) {
    try {
        // Récupération des films de l'API
        const response = await fetch(`${API_BASE_URL}/titles/?genre=${category}&sort_by=-imdb_score&page_size=6`);
        const data = await response.json();

        // Récupérer le conteneur de la catégorie
        const categoryContainer = document.querySelector(`#${containerId} .grille-films`);
        categoryContainer.innerHTML = ""; // Efface les anciens films

        // Parcourir les films récupérés et les afficher dans la section
        data.results.forEach(movie => {
            // Créer la carte de film
            const movieCard = document.createElement("div");
            movieCard.className = "carte-film"; // Class correspondant à celle de ton HTML

            // Ajouter le contenu de la carte (image, titre, description, bouton)
            movieCard.innerHTML = `
                <img src="${movie.image_url}" alt="${movie.title}" class="image-film"> 
                <div class="corps-carte">
                    <h5 class="titre-film">${movie.title}</h5>
                    <a href="#" class="bouton bouton-details">Détails</a>
                </div>
            `;

            // Ajouter la carte de film dans le conteneur
            categoryContainer.appendChild(movieCard);
        });
    } catch (error) {
        console.error(`Erreur lors de la récupération des films pour la catégorie ${category}:`, error);
    }
}

// Fonction pour remplir la liste déroulante des catégories libres
async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/genres/`);
        const data = await response.json();

        const categorySelect = document.querySelector("#categories-libres .grille-films");
        categorySelect.innerHTML = ""; // Efface les anciennes options

        data.results.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre.name;
            option.textContent = genre.name;
            categorySelect.appendChild(option);
        });

        // Ajoute un écouteur pour actualiser les films quand une catégorie est sélectionnée
        categorySelect.addEventListener("change", (event) => {
            fetchMoviesByCategory(event.target.value, "categorie-libre");
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
    }
}

//FENETRE MODALE MEILLEUR FILM
// Récupérer les éléments HTML
var modal = document.getElementById('myModal');
var openModalBtn = document.getElementById('openModalBtn');
var closeModalBtn = document.getElementById('closeModalBtn');

// Ouvrir la modale quand l'utilisateur clique sur le bouton
openModalBtn.onclick = function() {
    modal.style.display = 'block';
}

// Fermer la modale quand l'utilisateur clique sur la croix (X)
closeModalBtn.onclick = function() {
    modal.style.display = 'none';
}

// Fermer la modale si l'utilisateur clique en dehors de la modale
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Initialisation des données au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    fetchBestMovie();
    fetchTopMovies();
    fetchMoviesByCategory("fantasy", "categorie-1");
    fetchMoviesByCategory("sci-fi", "categorie-2");
    fetchCategories();
});