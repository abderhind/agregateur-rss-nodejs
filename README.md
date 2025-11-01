# Aggrégateur de Nouvelles RSS

Cet projet est une application web "full-stack" simple qui sert d'agrégateur de nouvelles à partir de divers flux RSS. Le backend est construit avec Node.js et Express, tandis que le frontend est en JavaScript "vanilla" (pur) et stylisé avec Tailwind CSS.

L'application permet aux utilisateurs de sélectionner une catégorie (Technologie, Politique, etc.) et d'afficher les derniers articles provenant de plusieurs sources, triés par date de publication.

![Aperçu de l'application](https://i.imgur.com/vO0yZ2e.png)

## ✨ Fonctionnalités

- **Agrégation par catégorie** : Regroupe les articles de plusieurs flux RSS en catégories prédéfinies.
- **Tri chronologique** : Affiche les articles les plus récents en premier.
- **Interface utilisateur réactive** : Permet de choisir une catégorie et le nombre d'articles à afficher.
- **Design moderne** : Interface épurée et responsive grâce à Tailwind CSS.
- **Backend simple** : Un seul point d'API (`/rss`) pour récupérer les données.
- **Gestion des erreurs** : Affiche des messages clairs en cas d'échec de chargement d'un flux ou de l'API.

---

## 🛠️ Tech Stack

- **Backend**:
  - Node.js
  - Express.js
  - rss-parser : Pour analyser les flux RSS.
  - cors : Pour gérer les autorisations Cross-Origin.

- **Frontend**:
  - HTML5
  - JavaScript "Vanilla" (ES6+)
  - Tailwind CSS (utilisé via CDN)

---

## 🚀 Installation et Lancement

Pour faire fonctionner ce projet en local, suivez ces étapes.

### Prérequis

Assurez-vous d'avoir Node.js (version 12 ou supérieure) installé sur votre machine.

### 1. Cloner le dépôt (si applicable)

```bash
git clone https://github.com/votre-utilisateur/agregateur-rss-nodejs.git
cd agregateur-rss-nodejs
```

### 2. Installer les dépendances

Exécutez la commande suivante à la racine du projet pour installer les dépendances du serveur Node.js :

```bash
npm install
```

### 3. Démarrer le serveur

Une fois les dépendances installées, lancez le serveur avec :

```bash
npm start
```

Le terminal devrait afficher :
```
Le serveur écoute sur le port 3000
Accédez à l'application sur http://localhost:3000
```

### 4. Accéder à l'application

Ouvrez votre navigateur et rendez-vous à l'adresse http://localhost:3000.

---

## 🔧 Personnalisation

### Ajouter ou Modifier des Flux RSS

Pour changer les sources d'information, il suffit de modifier l'objet `RSS_FEEDS` dans le fichier `server.js`.

Vous pouvez ajouter une nouvelle catégorie ou ajouter/supprimer des flux dans une catégorie existante. Chaque flux est un objet avec un `name` (nom de la source) et une `url` (lien vers le flux RSS).

**Exemple : Ajout d'un flux à la catégorie `Technologie`**

```javascript
// Dans server.js
const RSS_FEEDS = {
  Technologie: [
    { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
    // ... autres flux
    { name: "Nouveau Site Tech", url: "https://nouveausite.com/rss" } // Ajout ici
  ],
  // ... autres catégories
};
```

N'oubliez pas de redémarrer le serveur (`Ctrl+C` puis `npm start`) pour que les changements soient pris en compte.