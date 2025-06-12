
# Guide Technique - Debugging et Maintenance

## 🛠️ Commandes Essentielles pour le Debugging

### Diagnostic Docker
```bash
# État général
docker-compose ps
docker-compose logs --tail=100 ecotrajet

# Performance
docker stats --no-stream
docker-compose exec ecotrajet top

# Réseau
docker network ls
docker-compose exec ecotrajet netstat -tlnp
```

### Diagnostic Application
```bash
# Variables d'environnement
docker-compose exec ecotrajet env | grep VITE

# Espace disque
docker-compose exec ecotrajet df -h

# Processus
docker-compose exec ecotrajet ps aux
```

### Diagnostic Base de Données
```sql
-- Connexions actives
SELECT count(*) FROM pg_stat_activity;

-- Requêtes lentes
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;

-- Taille des tables
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Procédures de Déploiement d'Urgence

### Hotfix en Production
```bash
# 1. Créer une branche hotfix
git checkout main
git checkout -b hotfix/urgent-fix

# 2. Appliquer le correctif
# ... modifications de code ...

# 3. Tests rapides
npm run test:critical
npm run build

# 4. Déploiement direct
git add .
git commit -m "hotfix: correction critique"
git push origin hotfix/urgent-fix

# 5. Déploiement
docker-compose down
docker-compose up -d --build

# 6. Vérification
curl -f http://localhost:8080/health
docker-compose logs -f --tail=50
```

## Gestion des Configurations Environnementales

### Configuration par Environnement
```bash
# Développement
export NODE_ENV=development
export VITE_SUPABASE_URL=https://dev.supabase.co

# Staging
export NODE_ENV=staging
export VITE_SUPABASE_URL=https://staging.supabase.co

# Production
export NODE_ENV=production
export VITE_SUPABASE_URL=https://prod.supabase.co
```

### Validation des Configurations
```bash
# Script de validation
#!/bin/bash
validate_config() {
  echo "Validation de la configuration..."
  
  # Vérifier les variables obligatoires
  if [ -z "$VITE_SUPABASE_URL" ]; then
    echo "❌ VITE_SUPABASE_URL manquante"
    exit 1
  fi
  
  # Tester la connectivité
  curl -f "$VITE_SUPABASE_URL/rest/v1/" || {
    echo "❌ Impossible de joindre Supabase"
    exit 1
  }
  
  echo "✅ Configuration valide"
}
```
