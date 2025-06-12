
# Guide de Dépannage

## 🔧 Troubleshooting des Problèmes Courants

### Problème : Container qui ne démarre pas
```bash
# Diagnostic
docker-compose logs ecotrajet
docker-compose ps

# Solutions courantes
docker-compose down -v  # Supprimer les volumes
docker-compose build --no-cache  # Reconstruction sans cache
docker system prune  # Nettoyage général
```

### Problème : Application lente
```bash
# Métriques
docker stats
docker-compose exec ecotrajet node --inspect
npm run build:analyze  # Analyse du bundle

# Optimisations
docker-compose restart ecotrajet
# Vérifier les logs pour les requêtes lentes
```

### Problème : Erreurs Base de Données
```sql
-- Vérifier les connexions
SELECT state, count(*) 
FROM pg_stat_activity 
GROUP BY state;

-- Identifier les requêtes bloquantes
SELECT blocked_locks.pid AS blocked_pid,
       blocking_locks.pid AS blocking_pid,
       blocked_activity.query AS blocked_statement
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity 
  ON blocked_activity.pid = blocked_locks.pid;
```

### Problème : Variables d'environnement manquantes
```bash
# Vérifier la configuration
docker-compose config

# Afficher les variables dans le conteneur
docker-compose exec ecotrajet env | grep VITE

# Recharger la configuration
docker-compose down
docker-compose up -d
```

### Problème : Port déjà utilisé
```bash
# Identifier le processus utilisant le port
lsof -i :8080

# Modifier le port dans docker-compose.yml
ports:
  - "3000:8080"  # Port local:port conteneur
```

### Problème : Permissions fichiers (Linux/Mac)
```bash
# Ajuster les permissions
sudo chown -R $USER:$USER .

# Vérifier les permissions Docker
sudo usermod -aG docker $USER
```

## 📞 Support et Escalade

### Contacts et Support
- **Support L1** : support@ecotrajet.com
- **Équipe DevOps** : devops@ecotrajet.com
- **Urgences** : +33 1 XX XX XX XX

### Outils et Dashboards
- **Monitoring** : https://monitoring.ecotrajet.app
- **Logs** : https://logs.ecotrajet.app
- **Status Page** : https://status.ecotrajet.app

### Documentation Technique
- [Guide Docker](../docker-setup.md)
- [Guide CI/CD](../ci-cd-guide.md)
- [Guide Tests](../testing-guide.md)
