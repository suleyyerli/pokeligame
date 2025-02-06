# Plan de Développement - Application de Gestion de Collection Pokémon

## Description

Application de gestion de collection Pokémon permettant aux utilisateurs de gérer leur collection de cartes, boosters et displays, tout en suivant l'évolution de la valeur totale de leur collection.

## Phases de Développement

### Phase 1 - Structure de Base de Données

- Amélioration du schéma de la base de données
  - Table `cards` (existante, à enrichir)
  - Table `boosters`
  - Table `displays`
  - Table `price_history` pour le suivi des prix
  - Table `users` pour la gestion des comptes

### Phase 2 - Backend (API)

- Développement des endpoints REST
  - Gestion des cartes (CRUD complet)
  - Gestion des boosters
  - Gestion des displays
  - Système d'authentification
  - API pour le suivi des prix
  - Endpoint pour les statistiques de collection

### Phase 3 - Frontend (Fonctionnalités de Base)

- Développement des écrans principaux
  - Dashboard avec résumé de la collection
  - Vue détaillée de la collection (cartes/boosters/displays)
  - Système d'ajout d'items
  - Système de recherche et filtres
  - Interface de mise à jour des prix

### Phase 4 - Fonctionnalités de Prix

- Implémentation du système de suivi des prix
  - Interface de mise à jour manuelle des prix
  - Graphiques d'évolution des prix
  - Calcul de la valeur totale de la collection
  - Système d'alertes de prix

### Phase 5 - Fonctionnalités Avancées

- Ajout de fonctionnalités enrichies
  - Scanner de cartes via appareil photo
  - Import/Export de collection
  - Système de wishlist
  - Statistiques avancées
  - Suggestions d'achat/vente

### Phase 6 - Optimisation et Améliorations

- Optimisations techniques
  - Mise en cache des données
  - Optimisation des performances
  - Amélioration de l'UX
  - Tests unitaires et d'intégration
  - Documentation utilisateur

### Phase 7 - Fonctionnalités Sociales (Optionnel)

- Fonctionnalités communautaires
  - Partage de collection
  - Système de trading
  - Forum ou chat communautaire
  - Système de notation des états des cartes

## Recommandations de Développement

1. **Approche Itérative**

   - Développer une fonctionnalité à la fois
   - Tests et validation à chaque étape

2. **Priorités**

   - Commencer par les fonctionnalités core (CRUD collection)
   - Implémenter tôt le système de suivi des prix
   - Mettre en place les tests au fur et à mesure

3. **Documentation**
   - Documenter le code
   - Documenter les API
   - Maintenir ce plan à jour

## Notes Techniques

- Backend: Flask (Python)
- Frontend: React Native avec Expo
- Base de données: MySQL
- API: REST

## Procédure d'Implémentation de la Gestion des Utilisateurs

### 1. Modification de la Base de Données

```sql
-- Création de la table users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table collections
CREATE TABLE collections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Création de la table collection_items
CREATE TABLE collection_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    collection_id INT NOT NULL,
    item_type ENUM('card', 'booster', 'display') NOT NULL,
    item_id INT NOT NULL,
    quantity INT DEFAULT 1,
    date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collection_id) REFERENCES collections(id)
);
```

### 2. Modifications du Backend

#### 2.1 Installation des Dépendances

```bash
pip install flask-jwt-extended bcrypt
```

#### 2.2 Structure des Endpoints

```python
# Authentification
POST /api/auth/register    # Inscription
POST /api/auth/login      # Connexion
POST /api/auth/logout     # Déconnexion

# Collections
GET    /api/collections           # Liste des collections de l'utilisateur
POST   /api/collections           # Créer une collection
GET    /api/collections/{id}      # Détails d'une collection
PUT    /api/collections/{id}      # Modifier une collection
DELETE /api/collections/{id}      # Supprimer une collection

# Items de Collection
GET    /api/collections/{id}/items        # Liste des items
POST   /api/collections/{id}/items        # Ajouter un item
PUT    /api/collections/{id}/items/{id}   # Modifier un item
DELETE /api/collections/{id}/items/{id}   # Supprimer un item
```

### 3. Modifications du Frontend

#### 3.1 Nouvelles Pages à Créer

- Page de connexion
- Page d'inscription
- Page de liste des collections
- Page de détail d'une collection
- Modal d'ajout/modification de collection
- Modal d'ajout/modification d'item

#### 3.2 Gestion de l'État

```typescript
// Types
interface User {
  id: number;
  username: string;
  email: string;
}

interface Collection {
  id: number;
  name: string;
  description: string;
  items: CollectionItem[];
}

interface CollectionItem {
  id: number;
  item_type: "card" | "booster" | "display";
  item_id: number;
  quantity: number;
}
```

### 4. Étapes d'Implémentation

1. **Préparation (1-2 jours)**

   - Mise à jour du schéma de base de données
   - Installation des nouvelles dépendances
   - Configuration de JWT

2. **Backend (3-4 jours)**

   - Implémentation de l'authentification
   - Création des nouveaux endpoints
   - Tests des routes

3. **Frontend (4-5 jours)**

   - Création des nouvelles pages
   - Implémentation du système d'authentification
   - Gestion du state management
   - Tests d'intégration

4. **Tests et Débogage (2-3 jours)**
   - Tests utilisateur
   - Correction des bugs
   - Optimisation des performances

### 5. Points de Sécurité Importants

- Hashage des mots de passe avec bcrypt
- Validation des tokens JWT à chaque requête
- Protection contre les injections SQL
- Validation des données côté serveur
- Gestion des erreurs appropriée
- Rate limiting sur les routes sensibles

### 6. Bonnes Pratiques

- Utiliser des middlewares pour vérifier l'authentification
- Implémenter une gestion de session sécurisée
- Mettre en place des logs pour le debugging
- Documenter les nouveaux endpoints
- Créer des tests unitaires pour chaque nouvelle fonctionnalité
