
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
- **Supabase**: Base de données et authentification backend
- **Vitest**: Framework de test unitaire moderne et rapide
- **GitHub Actions**: CI/CD automatisé pour les tests et déploiements

## Installation et démarrage

### Option 1: Installation locale

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

### Option 2: Docker (Recommandé pour les équipes)

**Démarrage rapide avec Docker:**

```bash
# 1. Cloner le projet
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Créer le fichier .env
cp .env.example .env
# Éditer .env avec vos variables Supabase

# 3. Lancer avec Docker
docker-compose up --build
```

L'application sera accessible sur http://localhost:8080

**Mode développement avec hot-reload:**
```bash
docker-compose --profile dev up --build ecotrajet-dev
```

**Avantages Docker:**
- ✅ **Pas d'installation Node.js** : Docker gère tout
- ✅ **Environnement identique** : Même version Node, mêmes dépendances
- ✅ **Démarrage rapide** : 3 commandes maximum
- ✅ **Isolation** : Pas de conflit avec d'autres projets

📋 **Pour plus de détails sur Docker, consultez [docs/docker-setup.md](docs/docker-setup.md)**

### Option 3: GitHub Codespaces

- Accédez à la page principale de votre dépôt.
- Cliquez sur le bouton "Code" (bouton vert) près du coin supérieur droit.
- Sélectionnez l'onglet "Codespaces".
- Cliquez sur "Nouveau codespace" pour lancer un nouvel environnement Codespace.

### Modification directe sur GitHub

- Naviguez vers le(s) fichier(s) souhaité(s).
- Cliquez sur le bouton "Éditer" (icône de crayon) en haut à droite de la vue du fichier.
- Apportez vos modifications et validez les changements.

## Scripts disponibles

```sh
# Démarrer l'application en mode développement
npm run dev

# Construire l'application pour la production
npm run build

# Prévisualiser la version de production
npm run preview

# Lancer les tests unitaires
npm run test

# Lancer les tests en mode watch
npm run test:watch

# Générer un rapport de couverture des tests
npm run test:coverage

# Vérifier la syntaxe avec ESLint
npm run lint

# Vérifier les types TypeScript
npm run type-check
```

## Architecture de l'application

L'application est organisée selon la structure suivante:

- **src/pages**: Contient toutes les pages de l'application
- **src/components**: Composants réutilisables organisés par fonction
  - **admin**: Composants spécifiques à l'interface d'administration
  - **velib**: Composants pour la gestion des stations Vélib'
  - **ui**: Composants d'interface utilisateur de base (shadcn/ui)
- **src/hooks**: Hooks personnalisés pour la gestion de l'état et la logique
- **src/services**: Services pour l'interaction avec les API externes
- **src/lib**: Fonctions utilitaires et configurations
- **src/styles**: Styles globaux et configurations de Tailwind CSS
- **src/tests**: Tests unitaires et utilitaires de test
- **docs**: Documentation technique et guides

## Fonctionnalités principales

### Interface utilisateur
1. **Carte interactive**: Affiche les stations Vélib disponibles avec leurs détails
2. **Planificateur de trajets**: Permet de planifier des itinéraires écologiques
3. **Calculateur d'empreinte carbone**: Évalue l'impact environnemental des déplacements
4. **Défis écologiques**: Challenges pour encourager la mobilité durable
5. **Statistiques personnelles**: Suivi de l'impact environnemental des utilisateurs
6. **Guide et tutoriels**: Ressources pédagogiques sur la mobilité durable

### Panneau d'administration
7. **Dashboard en temps réel**: Tableau de bord avec statistiques Vélib' actualisées
8. **Gestion des utilisateurs**: Administration des comptes utilisateurs
9. **Gestion du contenu**: Édition des guides et tutoriels
10. **Système d'alertes**: Notifications automatiques par email
11. **Analytics avancés**: Graphiques et métriques détaillées

## Tests unitaires

Le projet utilise **Vitest** pour les tests unitaires avec une couverture complète des composants critiques:

### Composants testés
- `OptimizedStatsCard`: Affichage des statistiques avec états de chargement
- `DashboardFilters`: Filtres et contrôles du tableau de bord
- Hook `useOptimizedVelibData`: Gestion des données Vélib' optimisée
- Service `adminVelibService`: Récupération des données admin

### Configuration des tests
- **Framework**: Vitest avec environnement jsdom
- **Mocking**: @testing-library/react pour les composants
- **Couverture**: Rapports détaillés avec seuils de qualité
- **CI/CD**: Intégration dans GitHub Actions

Pour plus d'informations sur les tests, consultez `docs/testing-guide.md`.

## CI/CD avec GitHub Actions

Le projet dispose d'un pipeline automatisé qui s'exécute à chaque commit:

### Étapes du workflow
1. **Linting**: Vérification de la qualité du code avec ESLint
2. **Type checking**: Validation des types TypeScript
3. **Tests unitaires**: Exécution de la suite de tests complète
4. **Build**: Construction de l'application pour la production

### Déclencheurs
- Push sur toutes les branches
- Pull requests vers la branche principale
- Workflow manuel depuis l'interface GitHub

Le workflow est configuré dans `.github/workflows/test.yml` et utilise Node.js 18+ avec mise en cache des dépendances pour des performances optimales.

## Configuration de l'environnement

### Variables d'environnement requises
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Base de données Supabase
- Tables pour les stations Vélib', alertes utilisateurs, et données analytics
- Edge Functions pour la synchronisation des données en temps réel
- Authentification et gestion des sessions utilisateurs

## Documentation

- 📋 [Configuration Docker](docs/docker-setup.md) - Guide complet pour Docker
- 🧪 [Guide des tests](docs/testing-guide.md) - Documentation des tests
- 🏗️ [Architecture de la base de données](docs/database-architecture.md) - Structure des données
- 🚀 [Guide CI/CD](docs/ci-cd-guide.md) - Intégration et déploiement continu

## Contribution

1. Fork le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Assurez-vous que tous les tests passent (`npm run test`)
5. Push vers la branche (`git push origin feature/AmazingFeature`)
6. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Support

Pour toute question ou support technique, consultez la documentation dans le dossier `docs/` ou créez une issue GitHub.
