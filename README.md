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

## 📋 Table des Matières

- [🌟 Présentation du Projet](#-présentation-du-projet)
- [✨ Fonctionnalités Principales](#-fonctionnalités-principales)
- [🚀 Démarrage Rapide](#-démarrage-rapide)
- [🛠️ Technologies Utilisées](#️-technologies-utilisées)
- [⚙️ Options d'Installation](#️-options-dinstallation)
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

### 📋 Autres Options d'Installation
- **[Installation locale](##️-options-dinstallation)** (développeurs avancés)
- **GitHub Codespaces** (développement cloud recommandée pour les membres de l'équipe)

---

## 🛠️ Technologies Utilisées

### Frontend
- ** Vite** - Build tool ultra-rapide
- ** TypeScript** - JavaScript typé et sécurisé
- ** React** - Interface utilisateur moderne
- ** Tailwind CSS** - Framework CSS utilitaire
- ** shadcn/ui** - Composants réutilisables

### Backend & Infrastructure
- ** Supabase** - Base de données et authentification
- ** Leaflet** - Cartes interactives
- ** React Query** - Gestion d'état et cache
- ** Docker** - Containerisation
- ** Vitest** - Tests unitaires

### Architecture
- **Draw.io** - Pour désigner l'architecture

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

## 📊 Architecture de l'Application

```
src/
├── 📄 pages/              # Pages de l'application
├── 🧩 components/         # Composants réutilisables
│   ├── admin/            # Interface d'administration
│   ├── velib/            # Gestion des stations Vélib'
│   └── ui/               # Composants de base (shadcn/ui)
├── 🎣 hooks/             # Hooks personnalisés React
├── 🔧 services/          # Services API et logique métier
├── 📚 lib/               # Utilitaires et configurations
├── 🧪 tests/             # Tests unitaires
└── 📖 docs/              # Documentation technique
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

---

## 🚀 Déploiement

### Commandes de Déploiement
```bash
# Développement avec Docker
docker-compose --profile dev up ecotrajet-dev

# Production
docker-compose up -d --build

# Serveur (mise à jour)
git pull origin main && docker-compose up -d --build
```

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

---

## Support

### Ressources
-  **[Documentation complète](src/docs/)** - Guides techniques détaillés
-  **[Guide Docker](docker-setup.md)** - Configuration environnement
-  **[Guide des tests](src/docs/testing-guide.md)** - Assurance qualité

---

<div align="center">
  
  **🌱 Rejoignez la révolution de la mobilité durable avec ÉcoTrajet !**
  
  Made with 💚 for a sustainable future
  
</div>
