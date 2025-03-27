
# ÉcoTrajet - Application de mobilité durable

## Présentation du projet

ÉcoTrajet est une application web dédiée à la promotion de la mobilité durable, spécialement conçue pour les utilisateurs des systèmes de transport en commun et de vélos partagés à Paris. Cette application permet aux utilisateurs de:

- Visualiser les stations Vélib disponibles sur une carte interactive
- Planifier des itinéraires écologiques pour leurs déplacements quotidiens
- Calculer et suivre leur empreinte carbone
- Participer à des défis écologiques et gagner des récompenses
- Consulter des tutoriels et guides sur la mobilité durable
- Rejoindre une communauté d'utilisateurs partageant les mêmes valeurs

## Technologies utilisées

Ce projet est construit avec un ensemble de technologies modernes:

- **Vite**: Outil de build rapide pour le développement JavaScript/TypeScript
- **TypeScript**: Superset typé de JavaScript pour améliorer la qualité du code
- **React**: Bibliothèque JavaScript pour construire des interfaces utilisateur
- **shadcn-ui**: Composants d'interface utilisateur réutilisables et accessibles
- **Tailwind CSS**: Framework CSS utilitaire pour un design responsive
- **React Router**: Navigation et routage dans l'application
- **React Query**: Gestion des requêtes API, mise en cache et synchronisation des états
- **Leaflet**: Bibliothèque JavaScript pour les cartes interactives

## Comment modifier ce code?

Pour modifier l'application, suivez ces étapes:

```sh
# Étape 1: Clonez le dépôt en utilisant l'URL Git du projet.
git clone <YOUR_GIT_URL>

# Étape 2: Naviguez vers le répertoire du projet.
cd <YOUR_PROJECT_NAME>

# Étape 3: Installez les dépendances nécessaires.
npm i

# Étape 4: Démarrez le serveur de développement avec rechargement automatique.
npm run dev
```

**Modifier un fichier directement dans GitHub**

- Naviguez vers le(s) fichier(s) souhaité(s).
- Cliquez sur le bouton "Éditer" (icône de crayon) en haut à droite de la vue du fichier.
- Apportez vos modifications et validez les changements.

**Utiliser GitHub Codespaces**

- Accédez à la page principale de votre dépôt.
- Cliquez sur le bouton "Code" (bouton vert) près du coin supérieur droit.
- Sélectionnez l'onglet "Codespaces".
- Cliquez sur "Nouveau codespace" pour lancer un nouvel environnement Codespace.
- Modifiez les fichiers directement dans le Codespace et validez et poussez vos modifications une fois terminé.

## Architecture de l'application

L'application est organisée selon la structure suivante:

- **src/pages**: Contient toutes les pages de l'application
- **src/components**: Composants réutilisables organisés par fonction
- **src/hooks**: Hooks personnalisés pour la gestion de l'état et la logique
- **src/services**: Services pour l'interaction avec les API externes
- **src/lib**: Fonctions utilitaires et configurations
- **src/styles**: Styles globaux et configurations de Tailwind CSS

## Fonctionnalités principales

1. **Carte interactive**: Affiche les stations Vélib disponibles avec leurs détails
2. **Planificateur de trajets**: Permet de planifier des itinéraires écologiques
3. **Calculateur d'empreinte carbone**: Évalue l'impact environnemental des déplacements
4. **Défis écologiques**: Challenges pour encourager la mobilité durable
5. **Statistiques personnelles**: Suivi de l'impact environnemental des utilisateurs
6. **Guide et tutoriels**: Ressources pédagogiques sur la mobilité durable
7. **Panneau d'administration**: Gestion des utilisateurs, contenus et statistiques
