■ Notebook — Application de Gestion de Notes
Application web complète permettant aux utilisateurs de créer, organiser et gérer leurs notes personnelles avec
authentification sécurisée.

 Stack technique :
 
      • Backend : Laravel 11 + Sanctum
      
      • Frontend : React JS (Create React App)
      
      • Base de données : MySQL
      
      • UI : Tailwind CSS
      
      • Authentification API : Laravel Sanctum
      
■ Fonctionnalités

     • Authentification complète (register / login / logout)
     
     • CRUD complet des notes
     
     • Recherche instantanée
     
     • Tri par titre, date et priorité
     
     • Dark mode / Light mode
     
     • Responsive design
     
     • Statistiques des notes
     
     • Toast notifications
     
     • Modal de confirmation
     
     • Protection des routes privées
     
     
■ Installation Backend

      cd backend
      
      composer install
      
      cp .env.example .env
      
      php artisan key:generate
      
      php artisan migrate --seed
      
      php artisan serve
      
      
■ Installation Frontend

      cd notebook
      
      npm install
      
      Créer le fichier .env
      
      npm start
      
      
■ Endpoints API

     Méthode        Endpoint             Description                      Auth
      POST        /api/register         Inscription utilisateur ■       non-auth
      POST        /api/login            Connexion utilisateur ■         non-auth
      POST        /api/logout           Déconnexion utilisateur ■       nécessaire
      GET         /api/user             Utilisateur connecté ■          nécessaire
      GET         /api/notes            Liste des notes ■               nécessaire
      POST        /api/notes            Créer une note ■                nécessaire
      PUT         /api/notes/{id}       Modifier une note ■             nécessaire
      DELETE      /api/notes/{id}       Supprimer une note ■            nécessaire


      
■■ Commandes Utiles

   --> Backend :
   
        php artisan serve
        
        php artisan migrate
        
        php artisan migrate:fresh --seed
        
  --> Frontend :
  
        npm start
        
        npm run build
        
■■■ Auteur

       Projet développé dans le cadre d’un projet full-stack avec Laravel et React JS.
