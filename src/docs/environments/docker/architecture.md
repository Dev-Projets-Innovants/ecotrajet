
# Architecture Technique Docker

## 🏗️ Structure du docker-compose.yml

```yaml
# Structure simplifiée du docker-compose.yml
version: '3.8'

services:
  # Service de production
  ecotrajet:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
    volumes:
      - ./src:/app/src
      - ./public:/app/public
    restart: unless-stopped

  # Service de développement
  ecotrajet-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=development
    volumes:
      - ./src:/app/src
      - ./public:/app/public
      - /app/node_modules
    profiles:
      - dev
```

## Services et leurs Interactions

**Service Production (ecotrajet)**
- **Rôle** : Servir l'application optimisée
- **Build** : Version compilée et minifiée
- **Accès** : Port 8080 exposé

**Service Développement (ecotrajet-dev)**
- **Rôle** : Développement avec hot-reload
- **Build** : Version non-minifiée avec outils de debug
- **Accès** : Port 8080 (profil dev uniquement)

## Gestion des Volumes et Réseaux

**Volumes Configurés**
```yaml
volumes:
  - ./src:/app/src          # Code source synchronisé
  - ./public:/app/public    # Assets publics
  - /app/node_modules       # Dependencies isolées
```

**Avantages des Volumes**
- **Hot-reload** : Modifications instantanées visibles
- **Isolation** : node_modules restent dans le container
- **Performance** : Pas de synchronisation inutile

## Variables d'Environnement

```bash
# .env file
VITE_SUPABASE_URL=https://knebskomwvvvoaclrwjv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=production
```

**Sécurité des Variables**
- Variables sensibles dans .env (non versionnées)
- Variables publiques directement dans docker-compose.yml
- Validation au démarrage du container
