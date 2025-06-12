
# Gestion Opérationnelle Docker

## 🛠️ Commandes Essentielles Docker Compose

```bash
# Démarrage des services
docker-compose up -d                    # Mode détaché (arrière-plan)
docker-compose --profile dev up         # Mode développement

# Gestion des services
docker-compose ps                       # État des containers
docker-compose logs -f                  # Logs en temps réel
docker-compose restart ecotrajet        # Redémarrage d'un service

# Maintenance
docker-compose down                     # Arrêt de tous les services
docker-compose down -v                 # Arrêt + suppression volumes
docker-compose build --no-cache        # Reconstruction sans cache
```

## Mise à Jour des Containers

**Processus Standard**
```bash
# 1. Récupération du nouveau code
git pull origin main

# 2. Reconstruction des images
docker-compose build --no-cache

# 3. Redémarrage avec nouvelle version
docker-compose up -d

# 4. Vérification du statut
docker-compose ps
docker-compose logs -f ecotrajet
```

## Monitoring et Santé des Services

**Health Checks Automatiques**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080"]
  interval: 30s
  timeout: 10s
  retries: 3
```

**Surveillance des Ressources**
```bash
# Utilisation des ressources
docker stats

# Inspection détaillée
docker-compose exec ecotrajet ps aux
docker-compose exec ecotrajet df -h
```
