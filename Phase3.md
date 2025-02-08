### Phase 3 - Frontend (Fonctionnalités de Base)

## Implémentation de l'authentification au front

Ce que j'ai fait :

1. Crée auth-modal.tsx qui contient :

- Un formulaire qui alterne entre connexion et inscription
- Gestion des erreurs
- Appeks API vers le backend
- Redirection vers la page d'accueil

2. Modifié index.tsx pour ajouter :

- Un bouton pour ouvrir le modal d'authentification

3. Mise à jour \_layout.tsx pour ajouter :

- la route de la page auth-modal
- Confifuration de son affichage

### Crée AuthContext.tsx pour gérer l'authentification et la sauvergarde du token et la protection des routes.

Ce que j'ai fait :

- Utiliser le token pour les requêtes API (pour que chaque utilisateur ne voie que ses cartes)
- Protéger la route collection (vérifier si on a un token)
- Sauvegarder le token dans le storage du device

1. Crée AuthContext.tsx pour gérer le token et l'état d'authentification
2. Ajout du provider dans \_layout.tsx

Résume :
**Créé un contexte d'authentification qui :**

- Stocke le token en mémoire
- Fournit un état isAuthenticated
- Permet de définir le token via setToken

**Modifié la modal d'authentification pour :**

- Utiliser setToken lors de la connexion
- Sauvegarder le token reçu

**Protégé la route collection :**

- Vérifie si l'utilisateur est authentifié
- Redirige vers la connexion si non authentifié
- Ajoute le token aux requêtes API
