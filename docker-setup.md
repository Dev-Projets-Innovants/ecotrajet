
# Configuration Docker pour ÉcoTrajet

## Prérequis
- Docker installé sur votre machine
- Docker Compose installé

## Démarrage rapide

### 1. Production
```bash
# Construire et lancer l'application
docker-compose up --build

# En arrière-plan
docker-compose up -d --build
```

L'application sera accessible sur http://localhost:8080

### 2. Développement
```bash
# Lancer en mode développement avec hot-reload
docker-compose --profile dev up --build ecotrajet-dev

# En arrière-plan
docker-compose --profile dev up -d --build ecotrajet-dev
```

### 3. Variables d'environnement

Créez un fichier `.env` à la racine du projet :
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Résolution des problèmes courants

### Fichier package-lock.json manquant
Les Dockerfiles sont configurés pour gérer automatiquement l'absence du fichier `package-lock.json`. Si vous souhaitez générer ce fichier localement :
```bash
# Générer le package-lock.json
npm install

# Puis lancer Docker
docker-compose up --build
```

### Port déjà utilisé
```bash
# Changer le port dans docker-compose.yml
ports:
  - "3000:8080"  # Port local:port conteneur
```

### Problème de cache
```bash
# Reconstruire complètement
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

## Commandes utiles

### Gestion des conteneurs
```bash
# Voir les conteneurs en cours
docker-compose ps

# Arrêter les conteneurs
docker-compose down

# Supprimer les volumes aussi
docker-compose down -v

# Reconstruire les images
docker-compose build --no-cache
```

### Logs et débogage
```bash
# Voir les logs
docker-compose logs

# Suivre les logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs ecotrajet
```

### Accès au conteneur
```bash
# Ouvrir un shell dans le conteneur
docker-compose exec ecotrajet sh

# Exécuter des commandes npm
docker-compose exec ecotrajet npm run test
```

## Pour vos collègues

Vos collègues peuvent maintenant lancer le projet en 3 étapes :

1. **Cloner le repository**
   ```bash
   git clone <votre-repo-url>
   cd ecotrajet
   ```

2. **Créer le fichier .env** (vous leur fournirez les valeurs)
   ```bash
   cp .env.example .env
   # Éditer .env avec les bonnes valeurs
   ```

3. **Lancer avec Docker**
   ```bash
   docker-compose up --build
   ```

## Avantages pour votre équipe

- ✅ **Pas d'installation Node.js** : Docker gère tout
- ✅ **Environnement identique** : Même version Node, mêmes dépendances
- ✅ **Démarrage rapide** : 3 commandes maximum
- ✅ **Gestion automatique** : Fonctionne avec ou sans package-lock.json
- ✅ **Isolation** : Pas de conflit avec d'autres projets
- ✅ **Hot-reload** : Modifications en temps réel en mode dev

## Déploiement sur serveur

Pour déployer sur un serveur :
```bash
# Sur le serveur
git pull origin main
docker-compose up -d --build
```

L'application sera accessible via l'IP du serveur sur le port 8080.

## Notes techniques

- Le build Docker gère automatiquement la présence ou l'absence du fichier package-lock.json
- En production, seuls les fichiers build sont servis
- Le fichier package-lock.json sera automatiquement généré lors du premier build Docker si absent
