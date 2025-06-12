
# Configuration Docker pour ÉcoTrajet

## Présentation

Docker permet à vos collègues de lancer le projet ÉcoTrajet sans installer Node.js ou gérer les dépendances localement. Cette configuration garantit un environnement de développement identique pour toute l'équipe.

## Prérequis

- **Docker Desktop** installé sur votre machine
  - [Télécharger Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Docker Compose** (inclus avec Docker Desktop)
- **Git** pour cloner le repository

## Architecture Docker

Le projet utilise une architecture multi-conteneurs avec :

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
git clone <votre-repo-url>
cd ecotrajet

# Créer le fichier d'environnement
cp .env.example .env
```

### 2. Configuration des variables d'environnement

Éditez le fichier `.env` avec vos vraies valeurs :

```env
# Configuration Supabase
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anonyme_supabase

# Environnement
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
- **URL réseau** : http://[votre-ip]:8080

## Commandes utiles

### Gestion des conteneurs

```bash
# Voir l'état des conteneurs
docker-compose ps

# Arrêter tous les conteneurs
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v

# Redémarrer un service spécifique
docker-compose restart ecotrajet

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

# Logs avec horodatage
docker-compose logs -t
```

### Accès au conteneur

```bash
# Ouvrir un shell dans le conteneur
docker-compose exec ecotrajet sh

# Exécuter des commandes npm
docker-compose exec ecotrajet npm run test
docker-compose exec ecotrajet npm run build

# Accéder aux fichiers
docker-compose exec ecotrajet ls -la /app
```

### Nettoyage

```bash
# Supprimer les conteneurs arrêtés
docker container prune

# Supprimer les images inutilisées
docker image prune

# Nettoyage complet (attention : supprime tout)
docker system prune -a
```

## Guide pour les nouveaux développeurs

### Onboarding en 3 étapes

Partagez ces instructions avec vos nouveaux collègues :

```bash
# 1. Cloner le projet
git clone <votre-repo-url>
cd ecotrajet

# 2. Configurer l'environnement
cp .env.example .env
# Demander les vraies valeurs Supabase à l'équipe

# 3. Lancer le projet
docker-compose --profile dev up --build ecotrajet-dev
```

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

## Volumes et persistance

### Volumes configurés

- **`./src:/app/src`** : Code source synchronisé
- **`./public:/app/public`** : Assets publics synchronisés
- **`/app/node_modules`** : Dependencies isolées dans le conteneur

### Avantages des volumes

- ✅ **Hot-reload** : Modifications instantanées
- ✅ **Isolation** : node_modules dans le conteneur
- ✅ **Performance** : Pas de synchro des dépendances

## Optimisations de performance

### Build multi-stage

Le `Dockerfile` utilise un build multi-stage pour :
- Installer les dépendances
- Builder l'application
- Servir uniquement les fichiers nécessaires

### Cache Docker

```bash
# Utiliser le cache pour des builds plus rapides
docker-compose build

# Forcer la reconstruction sans cache
docker-compose build --no-cache
```

## Déploiement sur serveur

### Serveur de production

```bash
# Sur le serveur
git pull origin main
docker-compose up -d --build

# Vérifier le statut
docker-compose ps
docker-compose logs -f
```

### Variables d'environnement serveur

Créez un fichier `.env` sur le serveur avec :
```env
VITE_SUPABASE_URL=https://prod.supabase.co
VITE_SUPABASE_ANON_KEY=prod_key
NODE_ENV=production
```

## Troubleshooting

### Problèmes courants

#### Port déjà utilisé
```bash
# Changer le port dans docker-compose.yml
ports:
  - "3000:8080"  # Port local:port conteneur
```

#### Problème de permissions
```bash
# Linux/Mac - Ajuster les permissions
sudo chown -R $USER:$USER .
```

#### Cache npm corrompu
```bash
# Reconstruire complètement
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

#### Variables d'environnement manquantes
```bash
# Vérifier les variables
docker-compose config

# Afficher les variables dans le conteneur
docker-compose exec ecotrajet env | grep VITE
```

### Logs de débogage

```bash
# Logs détaillés du build
docker-compose build --progress=plain

# Inspecter une image
docker inspect ecotrajet_ecotrajet

# Vérifier l'utilisation des ressources
docker stats
```

## Avantages pour l'équipe

### ✅ Simplicité
- **Pas d'installation** : Juste Docker
- **Démarrage rapide** : 3 commandes maximum
- **Documentation claire** : Guide étape par étape

### ✅ Consistance
- **Même environnement** : Node.js 20, dépendances identiques
- **Isolation** : Pas de conflit avec d'autres projets
- **Reproductibilité** : Builds identiques partout

### ✅ Productivité
- **Hot-reload** : Modifications en temps réel
- **Tests intégrés** : npm run test dans le conteneur
- **CI/CD ready** : Même environnement qu'en production

## Support et ressources

### Documentation Docker
- [Documentation officielle Docker](https://docs.docker.com/)
- [Docker Compose CLI](https://docs.docker.com/compose/cli/)
- [Best practices Dockerfile](https://docs.docker.com/develop/dev-best-practices/)

### Support équipe
- Créer une issue GitHub pour les problèmes
- Channel Slack #dev-environment
- Documentation projet dans `/docs`

---

**🎉 Félicitations !** Votre équipe peut maintenant développer ÉcoTrajet sans souci d'environnement !
