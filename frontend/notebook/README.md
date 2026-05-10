# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


# 📓 Notebook — Application de gestion de notes

Application web complète de gestion de notes personnelles.  
**Stack** : Laravel 11 + Sanctum (API) · React JS (CRA) · MySQL · Tailwind CSS

---

## 🗂️ Structure du projet

```
Notebook-mini-application/
├── backend/                  ← Laravel 11 API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── Api/
│   │   │   |   ├── AuthController.php
│   │   │   |   ├── NoteController.php
│   │   │   └──Controller.php
│   │   └── Models/
│   │       ├── Note.php
│   │       ├── Tag.php
│   │       └── User.php
│   ├── bootstrap/
│   │   ├── cache/
│   │   │   ├── packages.php
│   │   │   └── services.php
│   │   ├── app.php
│   │   └── providers.php
│   ├── config/
│   │   ├── app.php
│   │   ├── auth.php
│   │   ├── broadcasting.php
│   │   ├── cache.php
│   │   ├── concurrency.php
│   │   ├── cors.php
│   │   ├── database.php
│   │   ├── filesystems.php
│   │   ├── hashing.php
│   │   ├── logging.php
│   │   ├── mail.php
│   │   ├── queue.php
│   │   ├── sanctum.php
│   │   ├── services.php
│   │   ├── session.php
│   │   └── view.php
│   ├── database/
│   │   ├── factories/
│   │   |   └──UserFactory.php
│   │   ├── migrations/
│   │   |   ├── create_users_table.php
│   │   |   ├── create_cache_table.php
│   │   |   ├── create_jobs_table.php
│   │   |   ├── create_notes_table.php
│   │   |   ├── create_tags_table.php
│   │   |   └── create_personal_access_tokens_table.php
│   │   └── seeders/DatabaseSeeder.php
│   ├── public/
│   │   └── index.php
│   ├── resources/
│   │   ├── css/App.css
│   │   ├── js/
|   |   |   ├── App.js
|   |   |   └── bootstrap.js
│   │   └── views.php
|   |       └── welcome.blade.php
│   ├── routes/
│   |    ├── api.php
│   |    ├── console.php
│   |        └── web.php
│   ├── storage/...
|   ├──tests/...
|   └──vendors
└── notebook/                 ← React JS (CRA)
    └── src/
        ├── App.js            ← Router + Providers
        ├── index.css
        ├── api/
        │   └── axios.js      ← Instance Axios + fonctions API
        ├── context/
        │   ├── AuthContext.js
        │   └── ThemeContext.js
        ├── pages/
        │   ├── Login.js
        │   ├── Register.js
        │   └── NotesDashboard.js
        └── components/
            ├── Navbar.js
            ├── NoteCard.js
            ├── NoteList.js
            ├── NoteForm.js
            ├── SearchBar.js
            ├── SortDropdown.js
            ├── ThemeToggle.js
            └── ConfirmModal.js
```

---

## 🚀 Installation

### Prérequis
- PHP 8.2+
- Composer
- Node.js 18+ + npm
- MySQL 8+

---

### 1️⃣ Backend Laravel

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances PHP
composer install

# Copier et configurer l'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Installer Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

**Configurer `.env`** :
```env
DB_DATABASE=notebook_db
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
```

```bash
# Créer la base de données MySQL
ouvrir mysql workbench et créer la database db_notebook;
CREATE DATABASE notebook_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Lancer les migrations + seeders
php artisan migrate --seed

# Démarrer le serveur
php artisan serve
# → http://localhost:8000
```

---

### 2️⃣ Frontend React

```bash
# Aller dans le dossier frontend
cd notebook

# Installer les dépendances
npm install

# Créer le fichier .env
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env

# Démarrer l'application
npm start
# → http://localhost:3000
```

---


## 📡 Endpoints API

| Méthode | Route             | Auth | Description                  |
|---------|-------------------|------|------------------------------|
| POST    | /api/register     | ❌   | Inscription                  |
| POST    | /api/login        | ❌   | Connexion                    |
| POST    | /api/logout       | ✅   | Déconnexion                  |
| GET     | /api/user         | ✅   | Utilisateur connecté         |
| GET     | /api/notes        | ✅   | Liste des notes + stats      |
| POST    | /api/notes        | ✅   | Créer une note               |
| GET     | /api/notes/{id}   | ✅   | Afficher une note            |
| PUT     | /api/notes/{id}   | ✅   | Mettre à jour une note       |
| DELETE  | /api/notes/{id}   | ✅   | Supprimer une note           |

---

## ✨ Fonctionnalités

- ✅ Authentification complète (register / login / logout) avec Sanctum
- ✅ CRUD complet des notes (titre, contenu, priorité)
- ✅ Recherche instantanée
- ✅ Tri (A→Z, Z→A, date, priorité)
- ✅ Dark mode / Light mode avec sauvegarde localStorage
- ✅ Statistiques (total, haute, moyenne, basse priorité)
- ✅ Badges colorés selon la priorité
- ✅ Skeleton loading
- ✅ Toasts de confirmation
- ✅ Modal de confirmation de suppression
- ✅ Protection des routes privées
- ✅ Responsive mobile / tablette / desktop
