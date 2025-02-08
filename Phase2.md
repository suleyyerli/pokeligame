# Phase 2 - Backend (API)

## Mise en place de l'authentification

1. Installation des dépendences nécessaires

- JWTManager : Pour gérer les tokens d'authentification
- create_access_token : Pour créer un token lors de la connexion
- get_jwt_identity : Pour récupérer l'identité de l'utilisateur à partir du token
- jwt_required : Un décorateur pour protéger les routes
- generate_password_hash et check_password_hash : Pour sécuriser les mots de passe
- Configuration du JWT avec une durée d'expiration d'un jour

Création des routes d'inscription et de connexion

1. Route /register (POST) :

- Reçoit email, password et username
- Vérifie si l'email n'existe pas déjà
- Hash le mot de passe pour la sécurité
- Crée un nouvel utilisateur dans la base de données

2. Route /login (POST) :

- Reçoit email et password
- Vérifie si l'utilisateur existe
- Vérifie si le mot de passe est correct
- Crée et renvoie un token JWT si tout est correct

3. Modification de la route /cards (GET) :

- Ajout de @jwt_required() pour la protéger
- Utilisation de get_jwt_identity() pour récupérer l'ID de l'utilisateur connecté
- Modification de la requête pour ne retourner que les cartes de l'utilisateur connecté

4. Route /logout (POST) :

- Déconnexion de l'utilisateur
- Suppression du token JWT
- Retourne un message de déconnexion réussie

5. Installation de INSOMNIA pour tester les routes

- Création d'un compte test
- Connexion avec le compte test
- Récupération du token
- Utilisation du token pour accéder aux routes protégées

**Test création d'un utilisateur**

img resgisteralice à ajoutez.
img ajout dans la db dbuseralice

**Test connexion avec le compte test**
exemple de test :

- Créez une requête "Login Alice" (POST)
- URL : http://localhost:5000/login
- Body :

```json
{
  "email": "alice@test.com",
  "password": "alice123"
}
```

- Après l'envoi, vous recevrez un token

**Test récupération des cartes de l'utilisateur**

- Créez une requête "Get Alice Cards" (GET)
- URL : http://localhost:5000/cards
- Dans l'onglet Auth, sélectionnez Bearer Token
- Collez le token reçu

img getalicecards à ajoutez.
