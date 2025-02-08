# Phase 1 - Structure de Base de Données

- Amélioration du schéma de la base de données
- Création de tables

1. Modification table cards :

```sql
ALTER TABLE cards
ADD COLUMN user_id INT,
ADD FOREIGN KEY (user_id) REFERENCES users(id);
```

2. Création table users :

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

3. Création table boosters :

```sql
CREATE TABLE boosters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

4. Création table displays :

```sql
CREATE TABLE displays (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

5. Ajout des clés étrangères à la table cards :

```sql
ALTER TABLE cards
ADD FOREIGN KEY (user_id) REFERENCES users(id);
```

## Requete pour calculer le total via api

```sql
SELECT
    (SELECT COALESCE(SUM(price * quantity), 0) FROM cards WHERE user_id = 1) +
    (SELECT COALESCE(SUM(price * quantity), 0) FROM boosters WHERE user_id = 1) +
    (SELECT COALESCE(SUM(price * quantity), 0) FROM displays WHERE user_id = 1)
AS total_collection;
```
