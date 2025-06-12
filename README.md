
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
- **Docker**: Containerisation pour un environnement de développement cohérent

## Installation et démarrage

### 🚀 Option 1: Docker (Recommandé pour les équipes)

**Démarrage ultra-rapide:**

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
- ✅ **Zéro installation** : Pas besoin de Node.js local
- ✅ **Environnement identique** : Même configuration pour toute l'équipe
- ✅ **Démarrage instantané** : 3 commandes seulement
- ✅ **Gestion automatique** : Fonctionne avec ou sans package-lock.json
- ✅ **Isolation complète** : Aucun conflit avec d'autres projets
- ✅ **Hot-reload intégré** : Modifications visibles immédiatement

📋 **Documentation Docker complète :** [docker-setup.md](docker-setup.md)

### Option 2: Installation locale (développeurs avancés)

**Prérequis :** Node.js 18+ et npm installés localement

```bash
# Étape 1: Cloner le dépôt
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Étape 2: Installer les dépendances
npm install

# Étape 3: Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos variables Supabase

# Étape 4: Démarrer le serveur de développement
npm run dev
```

### Option 3: GitHub Codespaces

- Accédez à la page principale de votre dépôt
- Cliquez sur le bouton "Code" (bouton vert) 
- Sélectionnez l'onglet "Codespaces"
- Cliquez sur "Nouveau codespace"

## Configuration de l'environnement

### Variables d'environnement requises
```env
# Configuration Supabase
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anonyme_supabase

# Environnement
NODE_ENV=production
```

### Base de données Supabase
- Tables pour les stations Vélib', alertes utilisateurs, et données analytics
- Edge Functions pour la synchronisation des données en temps réel
- Authentification et gestion des sessions utilisateurs

## Scripts disponibles

```bash
# Développement
npm run dev              # Démarrer en mode développement
npm run build           # Construire pour la production
npm run preview         # Prévisualiser la version de production

# Tests et qualité
npm run test            # Lancer les tests unitaires
npm run test:watch     # Tests en mode watch
npm run test:coverage  # Rapport de couverture
npm run lint           # Vérifier avec ESLint
npm run type-check     # Vérifier les types TypeScript

# Docker (alternative)
docker-compose up --build                    # Production
docker-compose --profile dev up ecotrajet-dev  # Développement
```

## Architecture de l'application

L'application suit une architecture modulaire et maintenable :

```
src/
├── pages/              # Pages de l'application
├── components/         # Composants réutilisables
│   ├── admin/         # Interface d'administration
│   ├── velib/         # Gestion des stations Vélib'
│   └── ui/            # Composants de base (shadcn/ui)
├── hooks/             # Hooks personnalisés
├── services/          # Services API et logique métier
├── lib/               # Utilitaires et configurations
├── tests/             # Tests unitaires
└── docs/              # Documentation technique
```

## Fonctionnalités principales

### Interface utilisateur
1. **Carte interactive**: Stations Vélib' avec détails en temps réel
2. **Planificateur de trajets**: Itinéraires écologiques optimisés
3. **Calculateur d'empreinte carbone**: Impact environnemental des déplacements
4. **Défis écologiques**: Gamification de la mobilité durable
5. **Statistiques personnelles**: Suivi de l'impact individuel
6. **Guides et tutoriels**: Ressources pédagogiques

### Panneau d'administration
7. **Dashboard temps réel**: Métriques Vélib' actualisées
8. **Gestion utilisateurs**: Administration des comptes
9. **Gestion de contenu**: Édition des guides et ressources
10. **Système d'alertes**: Notifications automatiques
11. **Analytics avancés**: Rapports et visualisations

## Tests et qualité

### Framework de test
- **Vitest** avec environnement jsdom
- **@testing-library/react** pour les composants
- **Couverture de code** complète avec rapports

### Composants testés
- `OptimizedStatsCard`: Affichage des statistiques
- `DashboardFilters`: Contrôles du tableau de bord  
- `useOptimizedVelibData`: Hook de gestion des données
- `adminVelibService`: Services d'administration

### CI/CD automatisé
Pipeline GitHub Actions avec :
- Linting ESLint
- Vérification TypeScript
- Tests unitaires
- Build de production

## Documentation technique

- 🐳 [Configuration Docker](docker-setup.md) - Setup et déploiement
- 🧪 [Guide des tests](src/docs/testing-guide.md) - Tests et qualité
- 🏗️ [Architecture BDD](src/docs/database-architecture.md) - Structure données  
- 🚀 [Guide CI/CD](src/docs/ci-cd-guide.md) - Intégration continue

## Déploiement

### Développement
```bash
# Avec Docker (recommandé)
docker-compose --profile dev up ecotrajet-dev

# Local
npm run dev
```

### Production  
```bash
# Avec Docker
docker-compose up -d --build

# Local
npm run build && npm run preview
```

### Serveur
```bash
git pull origin main
docker-compose up -d --build
```

## Contribution

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Développer** avec tests (`npm run test`)
4. **Valider** la qualité (`npm run lint && npm run type-check`)
5. **Commit** les changements (`git commit -m 'Add AmazingFeature'`)
6. **Push** vers la branche (`git push origin feature/AmazingFeature`)
7. **Ouvrir** une Pull Request

### Standards de qualité
- Tests unitaires requis pour les nouvelles fonctionnalités
- Couverture de code maintenue > 80%
- Pas d'erreurs ESLint ou TypeScript
- Documentation mise à jour

## Support et ressources

### Documentation
- 📚 [Documentation complète](src/docs/) dans le projet
- 🐳 [Guide Docker](docker-setup.md) pour l'environnement
- 🧪 [Guide des tests](src/docs/testing-guide.md) pour la qualité

### Support technique
- 🐛 **Issues GitHub** pour les bugs et demandes
- 💬 **Discussions** pour les questions générales
- 📧 **Contact équipe** pour le support urgent

### Liens utiles
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**🌱 Rejoignez la révolution de la mobilité durable avec ÉcoTrajet !**
