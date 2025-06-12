
# Configuration Docker pour ÉcoTrajet

## Vue d'ensemble

Docker permet à votre équipe de lancer le projet ÉcoTrajet sans installer Node.js ou gérer les dépendances localement. Cette configuration garantit un environnement de développement identique pour tous.

## Prérequis
- **Docker Desktop** installé sur votre machine
  - [Télécharger Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Docker Compose** (inclus avec Docker Desktop)
- **Git** pour cloner le repository

## Démarrage rapide

### 1. Installation initiale
```bash
# Cloner le repository
git clone <votre-repo-url>
cd ecotrajet

# Créer le fichier d'environnement
cp .env.example .env
# Éditer .env avec vos vraies valeurs Supabase
```

### 2. Configuration des variables d'environnement

Éditez le fichier `.env` avec vos valeurs :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anonyme_supabase
NODE_ENV=production
```

### 3. Lancement du projet

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

## Gestion automatique des dépendances

### Fonctionnement intelligent
Les Dockerfiles sont configurés pour gérer automatiquement :
- ✅ **Avec package-lock.json** : Utilise `npm ci` (plus rapide et déterministe)
- ✅ **Sans package-lock.json** : Utilise `npm install` (génère le lock file)
- ✅ **Récupération automatique** : Pas de crash si le lock file est manquant

### Générer package-lock.json localement (optionnel)
```bash
# Si vous souhaitez générer le fichier localement
npm install

# Puis lancer Docker normalement
docker-compose up --build
```

## Commandes utiles

### Gestion des conteneurs
```bash
# Voir l'état des conteneurs
docker-compose ps

# Arrêter tous les conteneurs
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v

# Reconstruire sans cache
docker-compose build --no-cache
```

### Logs et débogage
```bash
# Voir tous les logs
docker-compose logs

# Suivre les logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs ecotrajet
docker-compose logs ecotrajet-dev
```

### Accès au conteneur
```bash
# Ouvrir un shell dans le conteneur
docker-compose exec ecotrajet sh

# Exécuter des commandes npm
docker-compose exec ecotrajet npm run test
docker-compose exec ecotrajet npm run build
```

## Résolution des problèmes

### Erreurs courantes et solutions

#### Port déjà utilisé
```bash
# Modifier le port dans docker-compose.yml
ports:
  - "3000:8080"  # Port local:port conteneur
```

#### Problème de cache npm
```bash
# Reconstruire complètement
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

#### Variables d'environnement manquantes
```bash
# Vérifier la configuration
docker-compose config

# Vérifier les variables dans le conteneur
docker-compose exec ecotrajet env | grep VITE
```

#### Build qui échoue
```bash
# Logs détaillés du build
docker-compose build --progress=plain

# Nettoyer et reconstruire
docker system prune
docker-compose build --no-cache
```

## Guide pour les nouveaux développeurs

### Onboarding en 3 étapes
```bash
# 1. Cloner le projet
git clone <votre-repo-url>
cd ecotrajet

# 2. Configurer l'environnement
cp .env.example .env
# Demander les vraies valeurs Supabase à l'équipe

# 3. Lancer le projet
docker-compose up --build
```

### Workflow de développement quotidien
```bash
# Développement avec hot-reload
docker-compose --profile dev up ecotrajet-dev

# Tests dans le conteneur
docker-compose exec ecotrajet-dev npm run test

# Build de production pour vérification
docker-compose up --build ecotrajet
```

## Déploiement sur serveur

### Production
```bash
# Sur le serveur
git pull origin main
docker-compose up -d --build

# Vérifier le statut
docker-compose ps
docker-compose logs -f
```

### Variables d'environnement serveur
Créez un fichier `.env` sur le serveur avec les valeurs de production.

## Avantages pour l'équipe

### ✅ Simplicité
- **Pas d'installation Node.js** : Docker gère tout
- **Démarrage rapide** : 3 commandes maximum
- **Gestion automatique** : Fonctionne avec ou sans package-lock.json

### ✅ Consistance
- **Environnement identique** : Même version Node, mêmes dépendances
- **Isolation** : Pas de conflit avec d'autres projets
- **Reproductibilité** : Builds identiques partout

### ✅ Productivité
- **Hot-reload** : Modifications en temps réel en mode dev
- **Tests intégrés** : npm run test dans le conteneur
- **CI/CD ready** : Même environnement qu'en production

## Architecture technique

### Services Docker
- **ecotrajet** : Service de production avec build optimisé
- **ecotrajet-dev** : Service de développement avec hot-reload

### Volumes configurés
- `./src:/app/src` : Code source synchronisé
- `./public:/app/public` : Assets publics synchronisés
- `/app/node_modules` : Dependencies isolées dans le conteneur

### Optimisations
- Build multi-stage pour réduire la taille des images
- Cache npm pour des builds plus rapides
- Gestion intelligente des lock files

## Support

### Ressources
- 📋 [Documentation Docker officielle](https://docs.docker.com/)
- 🚀 [Docker Compose CLI](https://docs.docker.com/compose/cli/)
- 📖 [Documentation projet complète](src/docs/)

### En cas de problème
1. Consulter cette documentation
2. Vérifier les logs : `docker-compose logs`
3. Créer une issue GitHub
4. Contacter l'équipe de développement

---

**🎉 Félicitations !** Votre équipe peut maintenant développer ÉcoTrajet sans souci d'environnement !
