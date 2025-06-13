
# Configuration Docker pour ÉcoTrajet

## Présentation

Docker permet à vos collègues de lancer le projet ÉcoTrajet sans installer Node.js ou gérer les dépendances localement. Cette configuration garantit un environnement de développement identique pour toute l'équipe.

## Prérequis

- **Docker Desktop** installé sur votre machine
  - [Télécharger Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Docker Compose** (inclus avec Docker Desktop)
- **Git** pour cloner le repository
- **Accès aux credentials Supabase** de l'équipe OU compte Supabase personnel

## 🗃️ Configuration Supabase - ÉTAPE OBLIGATOIRE

> **⚠️ IMPORTANT :** Les tables de base de données ne se créent PAS automatiquement avec Docker ! Docker lance uniquement l'interface frontend. Vous DEVEZ configurer Supabase avant le premier lancement.

### 📁 Fichiers de configuration

- **`Dockerfile`** : Image de production optimisée
- **`Dockerfile.dev`** : Image de développement avec hot-reload
- **`docker-compose.yml`** : Orchestration des services
- **`.dockerignore`** : Exclusion des fichiers inutiles
- **`.env.example`** : Template des variables d'environnement

### 🚀 Services disponibles

1. **`ecotrajet`** (Production)
   - Build optimisé pour la production
   - Serveur de prévisualisation Vite
   - Port 8080

2. **`ecotrajet-dev`** (Développement)
   - Hot-reload activé
   - Volumes montés pour le développement
   - Port 8080

## Installation et démarrage

### 1. Première installation

```bash
# Cloner le repository
git clone https://github.com/Dev-Projets-Innovants/ecotrajet.git
cd ecotrajet

# Créer le fichier d'environnement
cp .env.example .env
```

### 2. Configuration des variables d'environnement - ÉTAPE CRUCIALE

> **🔑 Cette étape est OBLIGATOIRE !** Sans cette configuration, l'application ne fonctionnera pas.

Vous avez **deux options** pour configurer Supabase :

#### **Option A : Utiliser le Projet Supabase de l'Équipe (Recommandé)**

**Pourquoi choisir cette option :**
- ✅ **Démarrage immédiat** : Tables déjà créées et configurées
- ✅ **Données partagées** : Collaboration en temps réel avec l'équipe
- ✅ **Support simplifié** : Environnement identique pour tous
- ✅ **Comptes de test** : Utilisateurs et admins pré-configurés

**Configuration :**
```bash
# Éditer le fichier .env avec ces valeurs exactes
nano .env
# OU
code .env
```

```env
# Configuration Supabase de l'équipe
VITE_SUPABASE_URL=https://knebskomwvvvoaclrwjv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZWJza29td3Z2dm9hY2xyd2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MzkzMDMsImV4cCI6MjA2NTIxNTMwM30.45ggA2kNYAVa9_bRqL2ihaan1oqx55HyYlYLv_zxsa8

# Environnement
NODE_ENV=production
```

**Comptes de test disponibles :**
- **Admin** : `admin@ecotrajet.com` / `password123`
- **Utilisateur standard** : `user1@gmail.com` / `password123`

#### **Option B : Créer Votre Propre Projet Supabase**

**Pourquoi choisir cette option :**
- ✅ **Environnement isolé** : Vos tests n'impactent pas l'équipe
- ✅ **Contrôle total** : Liberté complète sur les données
- ✅ **Apprentissage** : Comprendre la configuration Supabase

**Étapes détaillées :**

1. **Créer un compte Supabase**
   - Aller sur [supabase.com](https://supabase.com)
   - Créer un compte gratuit
   - Vérifier votre email

2. **Créer un nouveau projet**
   ```
   - Cliquer sur "New Project"
   - Nom : "ecotrajet-dev-[votre-nom]"
   - Mot de passe BDD : Générer automatiquement
   - Région : Europe West (Ireland)
   - Plan : Free
   ```

3. **Récupérer vos credentials**
   ```
   - Aller dans "Settings" > "API"
   - Copier "Project URL"
   - Copier "anon public" key
   ```

4. **Configurer le fichier .env**
   ```env
   # Vos credentials personnels
   VITE_SUPABASE_URL=https://votre-projet-id.supabase.co
   VITE_SUPABASE_ANON_KEY=votre_clé_anonyme_supabase
   
   # Environnement
   NODE_ENV=production
   ```

5. **Exécuter les migrations** (OBLIGATOIRE)
   ```bash
   # Les tables doivent être créées manuellement
   # Voir la documentation technique pour les scripts SQL
   # Ou demander à l'équipe les fichiers de migration
   ```

### 3. Lancement du projet

Une fois le fichier `.env` configuré avec l'une des deux options :

#### Mode Production
```bash
# Construire et lancer l'application
docker-compose up --build

# En arrière-plan (détaché)
docker-compose up -d --build
```

#### Mode Développement (avec hot-reload)
```bash
# Lancer en mode développement
docker-compose --profile dev up --build ecotrajet-dev

# En arrière-plan
docker-compose --profile dev up -d --build ecotrajet-dev
```

### 4. Accès à l'application

Une fois lancé, l'application sera accessible sur :
- **URL locale** : http://localhost:8080
- **URL réseau** : http://[votre-ip]:8080

**🎉 Premier test :**
- Option A : Connectez-vous avec `admin@ecotrajet.com` / `password123`
- Option B : Créez votre premier compte via l'interface d'inscription

## Guide pour les nouveaux développeurs

### 🚀 Onboarding Express (Option A - Recommandée)

Partagez ces instructions avec vos nouveaux collègues :

```bash
# 1. Cloner le projet
git clone https://github.com/Dev-Projets-Innovants/ecotrajet.git
cd ecotrajet

# 2. Configurer l'environnement (demander les credentials à l'équipe)
cp .env.example .env
# Éditer .env avec les valeurs de l'équipe

# 3. Lancer le projet
docker-compose --profile dev up --build ecotrajet-dev
```

**✅ Temps total : 5 minutes**

### 🛠️ Onboarding Développement Avancé (Option B)

Pour les développeurs qui veulent leur propre environnement :

```bash
# 1. Cloner le projet
git clone https://github.com/Dev-Projets-Innovants/ecotrajet.git
cd ecotrajet

# 2. Créer un projet Supabase personnel
# (Suivre les étapes détaillées de l'Option B)

# 3. Configurer l'environnement
cp .env.example .env
# Éditer .env avec VOS credentials

# 4. Exécuter les migrations
# (Demander les scripts SQL à l'équipe)

# 5. Lancer le projet
docker-compose --profile dev up --build ecotrajet-dev
```

**⏱️ Temps total : 15-20 minutes**

### Workflow de développement

1. **Développement local**
   ```bash
   # Lancer en mode dev avec hot-reload
   docker-compose --profile dev up ecotrajet-dev
   ```

2. **Tests**
   ```bash
   # Exécuter les tests dans le conteneur
   docker-compose exec ecotrajet-dev npm run test
   ```

3. **Build de production**
   ```bash
   # Tester le build de production
   docker-compose up --build ecotrajet
   ```

## Troubleshooting - Problèmes Courants

### ❌ Erreur : "Failed to connect to Supabase"

**Cause :** Variables d'environnement Supabase incorrectes ou manquantes

**Solution :**
```bash
# Vérifier le contenu du fichier .env
cat .env

# Vérifier que les variables sont bien chargées
docker-compose exec ecotrajet env | grep VITE_SUPABASE
```

### ❌ Erreur : "Tables do not exist"

**Cause :** Base de données vide (Option B non configurée)

**Solution :**
- Option A : Utiliser les credentials de l'équipe
- Option B : Exécuter les migrations SQL

### ❌ Erreur : "Authentication failed"

**Cause :** Clé Supabase incorrecte ou expirée

**Solution :**
```bash
# Re-vérifier les credentials dans Supabase Dashboard
# Settings > API > Project URL et anon key
```

### ❌ Port déjà utilisé
```bash
# Changer le port dans docker-compose.yml
ports:
  - "3000:8080"  # Port local:port conteneur
```

### ❌ Problème de permissions
```bash
# Linux/Mac - Ajuster les permissions
sudo chown -R $USER:$USER .
```

### ❌ Cache npm corrompu
```bash
# Reconstruire complètement
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

## Avantages pour l'équipe

### ✅ Simplicité
- **Option A** : 3 commandes, 5 minutes de setup
- **Option B** : Setup personnalisé en 20 minutes
- **Documentation claire** : Guide étape par étape

### ✅ Consistance
- **Même environnement** : Node.js 20, dépendances identiques
- **Isolation** : Pas de conflit avec d'autres projets
- **Reproductibilité** : Builds identiques partout

### ✅ Flexibilité
- **Collaboration** : Option A pour le travail d'équipe
- **Développement isolé** : Option B pour les tests avancés
- **CI/CD ready** : Même environnement qu'en production

## Support et ressources

### 📚 Documentation Docker
- [Documentation officielle Docker](https://docs.docker.com/)
- [Docker Compose CLI](https://docs.docker.com/compose/cli/)

### 🆘 Support équipe
- **Credentials Supabase** : Demander à un membre de l'équipe
- **Problèmes techniques** : Créer une issue GitHub
- **Documentation** : Consulter `/docs` pour plus de détails

---

**🎉 Félicitations !** Votre équipe peut maintenant développer ÉcoTrajet avec la configuration Supabase de leur choix !
