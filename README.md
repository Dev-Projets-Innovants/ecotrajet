

<div align="center">
  <img src="public/logo.svg" alt="ÉcoTrajet Logo" width="120" height="120">
  
  # ÉcoTrajet
  
  **Application de mobilité durable pour Paris**
  
  *Révolutionnez vos déplacements urbains avec une approche écologique*
  
  [![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com)
  [![Docker](https://img.shields.io/badge/docker-ready-blue)](docker-setup.md)
  [![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/typescript-ready-blue)](https://www.typescriptlang.org/)
</div>

---

## 🏗️ Architecture de la Plateforme

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        🌍 ÉCOTRAJET PLATFORM ARCHITECTURE                                    │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                          📱 FRONTEND LAYER                                                   │
│                                                                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
│  │  🏠 Dashboard   │  │  🗺️ Carte      │  │  📊 Analytics   │  │  👥 Community  │  │  ⚙️ Admin      │   │
│  │                 │  │  Interactive    │  │  Carbone        │  │  Forum          │  │  Panel          │   │
│  │ • Métriques     │  │                 │  │                 │  │                 │  │                 │   │
│  │ • Défis         │  │ • Stations      │  │ • Calculateur   │  │ • Posts         │  │ • Gestion       │   │
│  │ • Récompenses   │  │   Vélib'        │  │ • Statistiques  │  │ • Commentaires  │  │   Utilisateurs  │   │
│  │ • Alertes       │  │ • Itinéraires   │  │ • Tendances     │  │ • Expériences   │  │ • Modération    │   │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘   │
│                                                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │                                   🎨 UI/UX COMPONENTS                                                │   │
│  │                                                                                                     │   │
│  │  React 18 + TypeScript  │  Tailwind CSS + shadcn/ui  │  Framer Motion  │  Leaflet Maps             │   │
│  │  • Composants modulaires │  • Design system cohérent  │  • Animations   │  • Cartes interactives   │   │
│  │  • Hooks personnalisés   │  • Responsive design       │  • Transitions  │  • Markers dynamiques    │   │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                    │
                                                    │ HTTPS API Calls
                                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                         🔗 API GATEWAY LAYER                                                 │
│                                                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │                                    ⚡ SUPABASE BACKEND                                               │   │
│  │                                                                                                     │   │
│  │  🔐 Authentication    │  📊 Database      │  🔄 Real-time     │  📁 Storage       │  🚀 Edge Functions │   │
│  │  • JWT Tokens        │  • PostgreSQL     │  • WebSockets     │  • Images         │  • Serverless     │   │
│  │  • RLS Policies      │  • Row Level      │  • Live Updates   │  • Documents      │  • Custom Logic   │   │
│  │  • OAuth providers   │    Security       │  • Subscriptions  │  • File uploads   │  • API endpoints  │   │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                    │                                                         │
│                                    ┌───────────────┼───────────────┐                                       │
│                                    │               │               │                                       │
│                                    ▼               ▼               ▼                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                       │
│  │  🤖 ML Service  │  │  📡 Vélib' API  │  │  📧 Email       │  │  🔔 Push        │                       │
│  │  FastAPI        │  │  External       │  │  Service        │  │  Notifications  │                       │
│  │                 │  │                 │  │                 │  │                 │                       │
│  │ • LSTM Models   │  │ • Real-time     │  │ • SMTP Gmail    │  │ • Browser       │                       │
│  │ • Prophet       │  │   data sync     │  │ • Templates     │  │ • Service       │                       │
│  │ • Random Forest │  │ • Cron jobs     │  │ • Alerts        │  │   Workers       │                       │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                    │
                                                    │ Database Queries & ML Predictions
                                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                          💾 DATA LAYER                                                      │
│                                                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │                                    🗄️ SUPABASE DATABASE                                              │   │
│  │                                                                                                     │   │
│  │  👤 Users & Profiles  │  🚲 Vélib' Data    │  🌍 Geographic   │  📊 Analytics     │  🎯 Gamification │   │
│  │  • Authentication    │  • Stations         │  • Paris zones   │  • User metrics   │  • Challenges    │   │
│  │  • User preferences  │  • Availability     │  • Routes        │  • Carbon data    │  • Rewards       │   │
│  │  • Profile settings  │  • Historical data  │  • Addresses     │  • Usage stats    │  • Leaderboard   │   │
│  │                      │                     │                  │                   │                  │   │
│  │  🔔 Notifications    │  💬 Community       │  📝 Content      │  🛡️ Security      │  ⚙️ System      │   │
│  │  • User alerts       │  • Forum posts     │  • Guides        │  • Audit logs     │  • Configuration │   │
│  │  • Email queue       │  • Comments        │  • Experiences   │  • RLS policies   │  • Feature flags │   │
│  │  • Push messages     │  • Likes/Reports   │  • Moderation    │  • API keys       │  • Maintenance   │   │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                    │
                                                    │ External Data Sources
                                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        🌐 EXTERNAL SERVICES                                                 │
│                                                                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
│  │  🚲 Vélib'      │  │  🗺️ OpenStreet │  │  ☁️ Weather     │  │  📧 Gmail       │  │  📱 Browser     │   │
│  │  Métropole      │  │  Map            │  │  APIs           │  │  SMTP           │  │  APIs           │   │
│  │                 │  │                 │  │                 │  │                 │  │                 │   │
│  │ • Station data  │  │ • Map tiles     │  │ • Conditions    │  │ • Transactional │  │ • Geolocation   │   │
│  │ • Availability  │  │ • Routing       │  │ • Forecasts     │  │   emails        │  │ • Notifications │   │
│  │ • Real-time     │  │ • Geocoding     │  │ • Air quality   │  │ • Alerts        │  │ • Local storage │   │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        🔄 DATA FLOW ARCHITECTURE                                            │
│                                                                                                               │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐                   │
│  │  1. USER        │───▶│  2. FRONTEND    │───▶│  3. SUPABASE    │───▶│  4. ML SERVICE  │                   │
│  │  INTERACTION    │    │  PROCESSING     │    │  API            │    │  PREDICTIONS    │                   │
│  │                 │    │                 │    │                 │    │                 │                   │
│  │ • Click/Touch   │    │ • React Query   │    │ • Authentication│    │ • LSTM Models   │                   │
│  │ • Form submit   │    │ • State mgmt    │    │ • Database ops  │    │ • Prophet       │                   │
│  │ • Map interact  │    │ • UI updates    │    │ • Real-time     │    │ • Random Forest │                   │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘                   │
│           ▲                       ▲                       ▲                       │                         │
│           │                       │                       │                       ▼                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐                   │
│  │  8. UI UPDATE   │    │  7. CACHE       │    │  6. WEBHOOKS    │    │  5. EXTERNAL    │                   │
│  │  & FEEDBACK     │    │  & STATE        │    │  & TRIGGERS     │    │  DATA SYNC      │                   │
│  │                 │    │                 │    │                 │    │                 │                   │
│  │ • Live updates  │    │ • React Query   │    │ • Edge functions│    │ • Vélib' API    │                   │
│  │ • Notifications │    │ • Local storage │    │ • Email alerts  │    │ • Weather data  │                   │
│  │ • Toast messages│    │ • Optimistic UI │    │ • Push notifs   │    │ • Map services  │                   │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                      🛡️ SECURITY & PERFORMANCE                                              │
│                                                                                                               │
│  🔐 SÉCURITÉ                           │  ⚡ PERFORMANCE                      │  📊 MONITORING              │
│                                        │                                      │                              │
│  • Row Level Security (RLS)           │  • React Query Cache                 │  • Supabase Analytics       │
│  • JWT Authentication                 │  • Optimistic Updates                │  • Real-time Metrics        │
│  • API Rate Limiting                  │  • Lazy Loading                      │  • Error Tracking           │
│  • CORS Configuration                 │  • Code Splitting                    │  • Performance Monitoring   │
│  • Environment Variables              │  • Image Optimization                │  • User Behavior Analysis   │
│  • HTTPS Encryption                   │  • Database Indexing                 │  • API Response Times       │
│  • Input Validation                   │  • CDN Distribution                  │  • Uptime Monitoring        │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Table des Matières

- [🌟 Présentation du Projet](#-présentation-du-projet)
- [✨ Fonctionnalités Principales](#-fonctionnalités-principales)
- [🚀 Démarrage Rapide](#-démarrage-rapide)
- [🛠️ Technologies Utilisées](#️-technologies-utilisées)
- [⚙️ Options d'Installation](#️-options-dinstallation)
- [🤖 Service ML](#-service-ml)
- [📊 Architecture de l'Application](#-architecture-de-lapplication)
- [🧪 Tests et Qualité](#-tests-et-qualité)
- [📚 Documentation Technique](#-documentation-technique)
- [🚀 Déploiement](#-déploiement)
- [🤝 Contribution](#-contribution)
- [📞 Support](#-support)

---

## 🌟 Présentation du Projet

ÉcoTrajet est une **application web de mobilité durable** spécialement conçue pour les utilisateurs des systèmes de transport en commun et de vélos partagés à Paris. Notre mission est de promouvoir des déplacements écologiques tout en offrant une expérience utilisateur optimale.

### 🎯 Objectifs
- **Réduire l'empreinte carbone** des déplacements urbains
- **Faciliter l'accès** aux transports durables
- **Sensibiliser** à la mobilité écologique
- **Créer une communauté** d'utilisateurs engagés

---

## ✨ Fonctionnalités Principales

### 🗺️ Interface Utilisateur
- **Carte interactive** avec stations Vélib' en temps réel
- **Planificateur de trajets** écologiques optimisés
- **Calculateur d'empreinte carbone** personnalisé
- **Défis écologiques** avec système de récompenses
- **Statistiques personnelles** de suivi d'impact
- **Guides et tutoriels** sur la mobilité durable

### 👨‍💼 Panneau d'Administration
- **Dashboard temps réel** avec métriques Vélib'
- **Gestion utilisateurs** complète
- **Gestion de contenu** pour guides et ressources
- **Système d'alertes** automatisées
- **Analytics avancés** avec visualisations

### 🤖 Intelligence Artificielle
- **Prédictions Vélib'** - Modèle LSTM pour prédire la disponibilité
- **Analyse des tendances** - Prophet pour l'évolution sur 7 jours
- **Calcul carbone optimisé** - Random Forest pour les recommandations

---

## 🚀 Démarrage Rapide

> **⚠️ IMPORTANT :** Votre projet nécessite un fichier `package-lock.json`. Exécutez `npm install` dans le répertoire racine avant de continuer.

### 🐳 Option 1: Docker (Recommandé)

```bash
# 1. Cloner le projet
git clone https://github.com/Dev-Projets-Innovants/ecotrajet.git
cd ecotrajet

# 2. Configurer l'environnement
cp .env.example .env
```

**🗃️ ÉTAPE CRUCIALE : Configuration Supabase**

> **⚠️ Les tables de base de données ne se créent PAS automatiquement !** Vous devez choisir une des deux options ci-dessous :

#### **Option A : Utiliser le Projet Supabase de l'Équipe (Recommandé pour débuter)**

```bash
# Éditer le fichier .env avec les credentials de l'équipe
# Demandez à un membre de l'équipe les valeurs suivantes :
VITE_SUPABASE_URL=https://knebskomwvvvoaclrwjv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**✅ Avantages :**
- **Données partagées** avec l'équipe
- **Tables déjà créées** et configurées
- **Démarrage immédiat** sans configuration

#### **Option B : Créer Votre Propre Projet Supabase**

1. **Créer un compte** sur [supabase.com](https://supabase.com)
2. **Créer un nouveau projet** 
3. **Copier vos credentials** dans le fichier `.env`
4. **Exécuter les migrations** (voir documentation technique)

**✅ Avantages :**
- **Environnement isolé** pour vos tests
- **Contrôle total** sur les données
- **Pas d'impact** sur l'équipe

```bash
# 3. Lancer l'application
docker-compose up --build
```

**Application accessible sur :** http://localhost:8080

**Comptes de test disponibles** (Option A uniquement) :
- **Admin** : `admin@ecotrajet.com` / `pa****12`
- **Utilisateur** : `user1@gmail.com` / `pa****12`
- Demandez à un membre de l'équipe les mots de passe

---

## 🛠️ Technologies Utilisées

### Frontend
- **Vite** - Build tool ultra-rapide
- **TypeScript** - JavaScript typé et sécurisé
- **React** - Interface utilisateur moderne
- **Tailwind CSS** - Framework CSS utilitaire
- **shadcn/ui** - Composants réutilisables

### Backend & Infrastructure
- **Supabase** - Base de données et authentification
- **Leaflet** - Cartes interactives
- **React Query** - Gestion d'état et cache
- **Docker** - Containerisation
- **Vitest** - Tests unitaires

### Machine Learning
- **FastAPI** - API REST pour les prédictions ML
- **TensorFlow** - Modèles LSTM pour prédictions Vélib'
- **Prophet** - Analyse des tendances temporelles
- **Scikit-learn** - Modèles de classification et régression

---

## ⚙️ Options d'Installation

### Option 2: Installation Locale

**Prérequis :** Node.js 18+ et npm

```bash
# Cloner et installer
git clone https://github.com/Dev-Projets-Innovants/ecotrajet.git
cd ecotrajet
npm install

# Configuration
cp .env.example .env
# Éditer .env avec vos credentials Supabase

# Démarrage
npm run dev
```

### Option 3: GitHub Codespaces

1. Accédez à votre repository GitHub
2. Cliquez sur **"Code"** → **"Codespaces"**
3. Créez un nouveau Codespace
4. L'environnement se configure automatiquement

---

## 🤖 Service ML

Le service de Machine Learning fournit des prédictions avancées pour optimiser l'expérience utilisateur.

### 🚀 Démarrage du Service ML

```bash
# Navigation vers le service ML
cd ml_service

# Configuration (OBLIGATOIRE)
cp .env.example .env
# Éditer .env avec vos credentials Supabase

# Installation des dépendances
pip install -r requirements.txt

# Entraînement des modèles (PREMIÈRE FOIS - OBLIGATOIRE)
python scripts/train_models.py

# Lancement de l'API
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

### 🧠 Modèles Disponibles

1. **LSTM Vélib'** - Prédiction de disponibilité des vélos (24h)
2. **Prophet Tendances** - Analyse des tendances sur 7 jours
3. **Random Forest Carbone** - Calculs d'empreinte carbone optimisés

### 📊 Endpoints API

- **Health** : `GET /health`
- **Prédictions Vélib'** : `POST /api/v1/predict/velib-availability`
- **Tendances** : `POST /api/v1/analyze/trends`
- **Carbone** : `POST /api/v1/calculate/carbon-footprint`

> **⚠️ Important :** L'entraînement des modèles est **OBLIGATOIRE** avant le premier lancement de l'API !

---

## 📊 Architecture de l'Application

```
├── src/                   # Application principale React
│   ├── pages/            # Pages de l'application
│   ├── components/       # Composants réutilisables
│   ├── hooks/           # Hooks personnalisés React
│   ├── services/        # Services API et logique métier
│   └── lib/             # Utilitaires et configurations
├── ml_service/           # Service Machine Learning
│   ├── api/             # API FastAPI
│   ├── src/             # Code source ML
│   ├── scripts/         # Scripts d'entraînement
│   ├── models/          # Modèles ML sauvegardés
│   └── notebooks/       # Jupyter notebooks
└── supabase/            # Configuration base de données
    ├── migrations/      # Migrations SQL
    └── functions/       # Edge functions
```

---

## 🧪 Tests et Qualité

### Framework de Test
- **Vitest** avec environnement jsdom
- **@testing-library/react** pour les composants
- **Couverture de code** complète avec rapports

### Scripts Disponibles
```bash
# Développement
npm run dev              # Serveur de développement
npm run build           # Build de production
npm run preview         # Prévisualisation

# Tests et qualité
npm run test            # Tests unitaires
npm run test:watch     # Tests en mode watch
npm run test:coverage  # Rapport de couverture
npm run lint           # Vérification ESLint
npm run type-check     # Vérification TypeScript
```

---

## 📚 Documentation Technique

### 📋 Guides Complets
- 🐳 **[Configuration Docker](docker-setup.md)** - Setup et déploiement complet
- 🤖 **[Service ML](ml_service/SETUP_LOCAL.md)** - Installation et configuration ML
- 🏗️ **[Environnements de Production](src/docs/environments/README.md)** - Architecture et processus
- 🧪 **[Guide des Tests](src/docs/testing-guide.md)** - Tests et qualité
- 🗃️ **[Architecture BDD](src/docs/database-architecture.md)** - Structure des données
- 🚀 **[Guide CI/CD](src/docs/ci-cd-guide.md)** - Intégration continue

### 📖 Documentation par Thème
- **[Vue d'ensemble](src/docs/environments/overview.md)** - Architecture générale
- **[Supabase](src/docs/environments/supabase/README.md)** - Base de données
- **[Docker](src/docs/environments/docker/README.md)** - Containerisation
- **[Déploiement](src/docs/environments/deployment/README.md)** - Processus de mise à jour
- **[Opérations](src/docs/operations/README.md)** - Maintenance et support
- **[Guides pratiques](src/docs/guides/README.md)** - Procédures détaillées

### 🆘 Guide pour Nouveaux Développeurs
- **[Configuration base de données](src/docs/guides/README.md#premiers-pas-pour-nouveaux-développeurs)** - Options Supabase détaillées
- **[Résolution de problèmes](src/docs/guides/troubleshooting.md)** - Solutions aux erreurs courantes
- **[Setup ML Service](ml_service/SETUP_LOCAL.md)** - Configuration complète du service ML

---

## 🚀 Déploiement

### Commandes de Déploiement
```bash
# Développement avec Docker
docker-compose --profile dev up ecotrajet-dev

# Production (avec ML Service)
docker-compose up -d --build

# Serveur (mise à jour)
git pull origin main && docker-compose up -d --build
```

### Architecture de Production
- **Frontend** : Application React (port 8080)
- **ML Service** : API FastAPI (port 8000)
- **Base de données** : Supabase (cloud)
- **Stockage** : Supabase Storage

---

## 🤝 Contribution

### Processus de Contribution
1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Développer** avec tests (`npm run test`)
4. **Valider** la qualité (`npm run lint && npm run type-check`)
5. **Commit** (`git commit -m 'Add AmazingFeature'`)
6. **Push** (`git push origin feature/AmazingFeature`)
7. **Ouvrir** une Pull Request

### Standards de Qualité
- ✅ **Tests unitaires** requis pour nouvelles fonctionnalités
- ✅ **Couverture de code** maintenue > 80%
- ✅ **Pas d'erreurs** ESLint ou TypeScript
- ✅ **Documentation** mise à jour
- ✅ **Modèles ML** testés si modification du service ML

---

## Support

### Ressources
- 📚 **[Documentation complète](src/docs/)** - Guides techniques détaillés
- 🐳 **[Guide Docker](docker-setup.md)** - Configuration environnement
- 🤖 **[Setup ML](ml_service/SETUP_LOCAL.md)** - Service Machine Learning
- 🧪 **[Guide des tests](src/docs/testing-guide.md)** - Assurance qualité

---

<div align="center">
  
  **🌱 Rejoignez la révolution de la mobilité durable avec ÉcoTrajet !**
  
  Made with 💚 for a sustainable future
  
</div>

