# Requête http qui fonctionne sur l'ordi mais pas sur le téléphone

1. Comprendre le problème initial :

- Sur le web (PC), l'application fonctionnait car elle utilisait http://127.0.0.1:5000 (localhost)

- Sur iOS, ça ne fonctionnait pas car votre téléphone ne peut pas accéder au localhost de votre PC

2. La solution mise en place :

- Nous avons créé une fonction getApiUrl() qui retourne une URL différente selon la plateforme :

```typescript
const getApiUrl = () => {
  if (Platform.OS === "web") {
    return "http://127.0.0.1:5000"; // URL de l'API sur le web
  }
  return "http://192.168.1.105:5000"; // URL de l'API sur iOS
};
```

- Sur le web : elle continue d'utiliser localhost
- Sur mobile : elle utilise l'adresse IP réelle de votre PC sur le réseau local

3. Configuration du backend :

- Nous avons aussi modifié le serveur Flask pour qu'il écoute sur toutes les interfaces réseau avec host='0.0.0.0'

- Cela permet au serveur d'accepter les connexions venant d'autres appareils sur le réseau

En résumé, au lieu de dire à votre téléphone d'aller sur "localhost" (qui pointe vers lui-même), nous lui donnons l'adresse IP réelle de votre PC sur le réseau. C'est comme si au lieu de dire "va chez moi", on donnait l'adresse exacte de la maison !
