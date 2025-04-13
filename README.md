# 📦 T Où

T Où est une application de discussion basée sur une carte. L'objectif est de voir les autres utilisateurs sur la carte et de pouvoir engager la conversation avec eux.

Les objectifs de ce projet sont :

- Apprendre à utiliser MapLibre et les outils de cartographie
- Approfondir certains concepts javascript
- Développer un projet avec une structure modulaire
- Mettre en place une gestion automatisée des tâches (build, tests, déploiement)

---

## 🚀 Fonctionnalités

- ✅ Chatter avec les autres utilisateurs
- ✅ Faire des visios avec les autres utilisateurs
- ✅ Avoir des infos par rapport aux autres utilisateurs (distance à vol d'oiseau, itinéraire pour les rejoindre)

---

## 📁 Structure du projet

```bash
.
├── src/                  # Code source principal
│   ├── components/       # Composants réutilisables (si frontend)
│   └── routes/           # Gestion des routes (si backend)
├── public/               # Fichiers statiques (si applicable)
├── tests/                # Tests unitaires ou d’intégration
├── README.md             # Ce fichier
└── package.json          # Dépendances (si projet JS)
```

## Installation

**Cloner le dépôt**

```
git clone https://github.com/votre-utilisateur/nom-du-projet.git
```

**Installer les dépendances**

```
npm install
```

**Lancer le serveur de tuiles**

```
npm run map
````

**Lancer l'application**

```
npm run dev
```

## Technologies et langages utilisées

- Vite
- Typescript
- MapLibre
- OpenRouteService
- OpenStreetMap
- Bootstrap
