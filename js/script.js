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
        topMoviesContainer.innerHTML = "";

        data.results.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.className = "carte-film";

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
        categoryContainer.innerHTML = "";

        // Parcourir les films récupérés et les afficher dans la section
        data.results.forEach(movie => {
            // Créer la carte de film
            const movieCard = document.createElement("div");
            movieCard.className = "carte-film";

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

            // Met à jour l'URL pour la page suivante
            url = data.next;
        }

        console.log("Toutes les catégories récupérées :", allCategories);

        // Remplir la liste déroulante avec les catégories
        const categorySelect = document.querySelector("#category-select");
        categorySelect.innerHTML = "";

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

async function fetchMovieDetailsAndFillModal(movieId) {
    try {
        // Effectuer une requête pour récupérer les détails du film via l'API
        const response = await fetch(`${API_BASE_URL}/titles/${movieId}`);
        const movie = await response.json();

        // Remplir le contenu de la modale avec les informations du film
        const modal = document.getElementById("myModal");
        // Titre
        modal.querySelector("#titre-modal").innerHTML = `${movie.title || "Non disponible"}`;

        // Image
        const modalImage = modal.querySelector(".image_modale");
        modalImage.src = movie.image_url || "";
        modalImage.alt = movie.title || "Image du film";

        // Ligne 1 : Date de sortie et Genre
        const firstLine = modal.querySelector(".modal-first-line");
        firstLine.querySelector("p:nth-of-type(1)").innerHTML = `${movie.year || "Non disponible"} -&nbsp`;
        firstLine.querySelector("p:nth-of-type(2)").innerHTML = `${movie.genres?.join(", ") || "Non disponible"}`;

        // Ligne 2 : Classification, Durée et Pays d'origine
        const secondLine = modal.querySelector(".modal-second-line");
        secondLine.querySelector("p:nth-of-type(1)").innerHTML = `PG-${movie.rated || "Non disponible"} -&nbsp`;
        secondLine.querySelector("p:nth-of-type(2)").innerHTML = `${movie.duration ? `${movie.duration} minutes` : "Non disponible"}&nbsp`;
        secondLine.querySelector("p:nth-of-type(3)").innerHTML = `(${movie.countries?.join(" / ") || "Non disponible"})`;

        // Ligne 3 : Score IMDB et Recette box-office
        const thirdLine = modal.querySelector(".modal-third-line");
        thirdLine.querySelector("p:nth-of-type(1)").innerHTML = `IMDB score: ${movie.imdb_score || "Non disponible"}/10`;
        
        const contentText = modal.querySelector(".modal-content-text");
        contentText.querySelector("p:nth-of-type(1)").innerHTML = `<strong>Recette box-office :</strong> ${movie.worldwide_gross_income ? `${movie.worldwide_gross_income} $` : "Non disponible"}`;
        // Réalisateur
        contentText.querySelector("p:nth-of-type(2)").innerHTML = `<strong>Réalisé par :</strong> ${movie.directors?.join(", ") || "Non disponible"}`;

        // Description
        contentText.querySelector("p:nth-of-type(3)").innerHTML = `${movie.description || "Non disponible"}`;

        // Acteurs
        contentText.querySelector("p:nth-of-type(4)").innerHTML = `<strong>Avec :</strong> ${movie.actors?.join(", ") || "Non disponible"}`;


    } catch (error) {
        console.error(`Erreur lors de la récupération des détails pour le film ID ${movieId}:`, error);
    }
}

async function openModal(movie) {
    fetchMovieDetailsAndFillModal(movie)
    modal.style.display = 'block';
}

// Gestion du bouton "Voir plus" pour afficher les films supplémentaires en mode tablette
document.addEventListener("DOMContentLoaded", () => {
    const categories = document.querySelectorAll("section");

    categories.forEach(category => {
        const grille = category.querySelector(".grille-films");

        if (!grille) return;

        // Créer et ajouter le bouton "Voir plus" à chaque catégorie
        const voirPlusButton = document.createElement("button");
        voirPlusButton.className = "bouton-voir-plus";
        voirPlusButton.textContent = "Voir plus";
        category.appendChild(voirPlusButton);

        // Créer et ajouter le bouton "Voir moins" à chaque catégorie
        const voirMoinsButton = document.createElement("button");
        voirMoinsButton.className = "bouton-voir-moins";
        voirMoinsButton.textContent = "Voir moins";
        category.appendChild(voirMoinsButton);

        // Gestion du clic sur le bouton "Voir plus"
        voirPlusButton.addEventListener("click", () => {
            const hiddenFilms = grille.querySelectorAll(".carte-film:nth-of-type(n+3)"); // Cacher au-delà du 2ème film
            hiddenFilms.forEach(film => (film.style.display = "block"));
            voirPlusButton.style.display = "none"; // Masquer le bouton "Voir plus"
            voirMoinsButton.style.display = "block"; // Afficher le bouton "Voir moins"
        });

        // Gestion du clic sur le bouton "Voir moins"
        voirMoinsButton.addEventListener("click", () => {
            const allFilms = grille.querySelectorAll(".carte-film");
            allFilms.forEach((film, index) => {
                if (index >= 2) {
                    film.style.display = "none"; // Cacher les films au-delà du 2ème
                }
            });
            voirPlusButton.style.display = "block"; // Réafficher le bouton "Voir plus"
            voirMoinsButton.style.display = "none"; // Masquer le bouton "Voir moins"
        });
    });

    // Fonction de redimensionnement pour gérer le responsive
    function handleResize() {
        const isMobile = window.innerWidth <= 600;
        const isTablet = window.innerWidth > 600 && window.innerWidth <= 1024;
    
        categories.forEach(category => {
            const voirPlusButton = category.querySelector(".bouton-voir-plus");
            const voirMoinsButton = category.querySelector(".bouton-voir-moins");
            const films = category.querySelectorAll(".carte-film");
    
            if (isMobile) {
                // Logique pour les mobiles
                films.forEach((film, index) => {
                    film.style.display = index < 2 ? "block" : "none"; // Afficher les 2 premiers films
                });
                if (voirPlusButton) voirPlusButton.style.display = "block"; // Afficher le bouton "Voir plus"
                if (voirMoinsButton) voirMoinsButton.style.display = "none"; // Cacher le bouton "Voir moins"
            } else if (isTablet) {
                // Logique pour les tablettes
                films.forEach((film, index) => {
                    film.style.display = index < 4 ? "block" : "none"; // Afficher les 4 premiers films
                });
                if (voirPlusButton) voirPlusButton.style.display = "block"; // Afficher le bouton "Voir plus"
                if (voirMoinsButton) voirMoinsButton.style.display = "none"; // Cacher le bouton "Voir moins"
            } else {
                // Logique pour les écrans plus larges (PC)
                films.forEach(film => (film.style.display = "block")); // Afficher tous les films
                if (voirPlusButton) voirPlusButton.style.display = "none"; // Cacher le bouton
                if (voirMoinsButton) voirMoinsButton.style.display = "none"; // Cacher le bouton
            }
        });
    }

    // Ajouter un écouteur pour les changements de taille d'écran
    window.addEventListener("resize", handleResize);
    handleResize(); // Appeler une fois au chargement
});

// Initialisation des données au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    fetchBestMovie();
    fetchTopMovies();
    fetchMoviesByCategory("fantasy", "categorie-1");
    fetchMoviesByCategory("sci-fi", "categorie-2");
    fetchCategories();
});