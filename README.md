# Projet de Catalogue de Films

Ce projet est une application web permettant de naviguer à travers un catalogue de films classés par catégories. Les utilisateurs peuvent consulter les meilleurs films, explorer des catégories spécifiques, et accéder aux détails de chaque film via une interface dynamique.

## Installation

### 1. Installation et Configuration de l'API OCMovies

Pour utiliser ce projet, vous devez d'abord configurer l'API qui sert de backend :

1. Clonez ce dépôt de code à l'aide de la commande :  
   ` git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git`  

2. Rendez-vous dans le répertoire de l'API :  
   ` cd OCMovies-API-EN-FR`

3. Créez un environnement virtuel pour le projet :
     ` python -m venv env`

4. Activez l'environnement virtuel :
     ` env\Scripts\activate`

5. Installez les dépendances du projet :
   ` pip install -r requirements.txt`

6. Créez et alimentez la base de données :
   ` python manage.py create_db`

7. Démarrez le serveur de l'API :
   ` python manage.py runserver`

> **Note :**  
> Les étapes 1 à 6 ne sont requises que pour l'installation initiale. Pour les lancements ultérieurs du serveur de l'API, il suffit d'exécuter les étapes 4 et 7 à partir du répertoire de l'API (OCMovies-API-EN-FR).

---

### 2. Installation de l'interface web

1. Clonez ce dépôt.    
   ` git clone https://github.com/Nono3428/Projet6_OC.git`  

2. Ouvrez le fichier `index.html` dans un navigateur pour lancer l'interface utilisateur.  

---

## Utilisation

1. **Naviguer parmi les films :**  
   Parcourez les différentes catégories de films via l'interface web.  

2. **Consulter les détails :**  
   Cliquez sur un film pour afficher une modale contenant ses informations détaillées.  

---