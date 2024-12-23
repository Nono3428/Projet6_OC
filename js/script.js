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
                    <button class="bouton-details" onclick="openModal('${(movie.id)}')">Détails</button>
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
                    <button class="bouton-details" onclick="openModal('${(movie.id)}')">Détails</button>
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
    let allCategories = [];
    let url = `${API_BASE_URL}/genres/`;

    try {
        // Récupérer toutes les pages
        while (url) {
            const response = await fetch(url);
            const data = await response.json();

            // Ajouter les catégories de la page actuelle
            allCategories.push(...data.results);

            // Met à jour l'URL pour la page suivante (ou null si c'est la dernière page)
            url = data.next;
        }

        console.log("Toutes les catégories récupérées :", allCategories);

        // Remplir la liste déroulante avec les catégories
        const categorySelect = document.querySelector("#category-select");
        categorySelect.innerHTML = ""; // Efface les anciennes options

        // Ajouter une option par défaut
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Sélectionner une catégorie";
        defaultOption.selected = true;
        defaultOption.disabled = true;
        categorySelect.appendChild(defaultOption);

        // Ajouter les catégories dans la liste déroulante
        allCategories.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre.name;
            option.textContent = genre.name;
            categorySelect.appendChild(option);
        });

        // Ajouter un écouteur pour charger les films d'une catégorie sélectionnée
        categorySelect.addEventListener("change", (event) => {
            const selectedCategory = event.target.value;
            fetchMoviesByCategory(selectedCategory, "categorie-libre");
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
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


async function fetchMovieDetailsAndFillModal(movieId) {
    try {
        // Effectuer une requête pour récupérer les détails du film via l'API
        const response = await fetch(`${API_BASE_URL}/titles/${movieId}`);
        const movie = await response.json();

        // Remplir le contenu de la modale avec les informations du film
        const modal = document.getElementById("myModal");
        modal.querySelector("h3").textContent = `Détails du Film : ${movie.title}`;
        modal.querySelector("img").src = movie.image_url || "";
        modal.querySelector("img").alt = movie.title || "Image du film";
        modal.querySelector("p:nth-of-type(1)").innerHTML = `<strong>Titre :</strong> ${movie.title}`;
        modal.querySelector("p:nth-of-type(2)").innerHTML = `<strong>Genre :</strong> ${movie.genres.join(", ")}`;
        modal.querySelector("p:nth-of-type(3)").innerHTML = `<strong>Date de sortie :</strong> ${movie.year}`;
        modal.querySelector("p:nth-of-type(4)").innerHTML = `<strong>Classification :</strong> ${movie.rated || "Non disponible"}`;
        modal.querySelector("p:nth-of-type(5)").innerHTML = `<strong>Score IMDB :</strong> ${movie.imdb_score}`;
        modal.querySelector("p:nth-of-type(6)").innerHTML = `<strong>Réalisateur :</strong> ${movie.directors.join(", ")}`;
        modal.querySelector("p:nth-of-type(7)").innerHTML = `<strong>Acteurs :</strong> ${movie.actors.join(", ")}`;
        modal.querySelector("p:nth-of-type(8)").innerHTML = `<strong>Durée :</strong> ${movie.duration ? `${movie.duration} minutes` : "Non disponible"}`;
        modal.querySelector("p:nth-of-type(9)").innerHTML = `<strong>Pays d'origine :</strong> ${movie.countries.join(", ")}`;
        modal.querySelector("p:nth-of-type(10)").innerHTML = `<strong>Recette box-office :</strong> ${movie.worldwide_gross_income ? `${movie.worldwide_gross_income} $` : "Non disponible"}`;
        modal.querySelector("p:nth-of-type(11)").innerHTML = `<strong>Description :</strong> ${movie.description}`;

    } catch (error) {
        console.error(`Erreur lors de la récupération des détails pour le film ID ${movieId}:`, error);
    }
}

async function openModal(movie) {
    fetchMovieDetailsAndFillModal(movie)
    modal.style.display = 'block';
}