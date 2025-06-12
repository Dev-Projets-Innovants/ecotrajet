
# Guide des Environnements de Production - ÉcoTrajet

## Table des Matières

1. [Vue d'Ensemble des Environnements](#1-vue-densemble-des-environnements)
2. [Architecture Technique Supabase](#2-architecture-technique-supabase)
3. [Processus de Mise à Jour du Code](#3-processus-de-mise-à-jour-du-code)
4. [Docker Compose - Fonctionnement Complet](#4-docker-compose---fonctionnement-complet)
5. [Processus Opérationnels](#5-processus-opérationnels)
6. [Guides Pratiques](#6-guides-pratiques)

---

## 1. Vue d'Ensemble des Environnements

### 🎯 Public Cible
- **Équipe technique** : Développeurs, DevOps, administrateurs système
- **Équipe non-technique** : Product managers, chefs de projet, parties prenantes business
- **Nouveaux arrivants** : Onboarding des nouveaux membres d'équipe

### 📊 Schéma des Environnements

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DÉVELOPPEMENT │    │     STAGING     │    │   PRODUCTION    │
│                 │    │                 │    │                 │
│ • Tests locaux  │───▶│ • Tests finaux  │───▶│ • Utilisateurs  │
│ • Expérimentation│    │ • Validation    │    │ • Données réelles│
│ • Code instable │    │ • Demo clients  │    │ • Performance   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        ↑                       ↑                       ↑
    Développeurs           Product Team              Utilisateurs
```

### 🎯 Rôle et Objectif de Chaque Environnement

#### Environnement de Développement
- **Objectif** : Expérimentation et développement rapide
- **Utilisateurs** : Équipe de développement
- **Données** : Données de test, souvent réinitialisées
- **Stabilité** : Variable, code en cours de développement

#### Environnement de Staging (Pré-production)
- **Objectif** : Validation finale avant production
- **Utilisateurs** : Équipe produit, testeurs, clients beta
- **Données** : Copie anonymisée de la production ou données de test réalistes
- **Stabilité** : Stable, miroir de la production

#### Environnement de Production
- **Objectif** : Service aux utilisateurs finaux
- **Utilisateurs** : Clients et utilisateurs finaux
- **Données** : Données réelles et critiques
- **Stabilité** : Maximum, haute disponibilité requise

### 🔄 Flux Général de Déploiement

1. **Développement Local** → Code et tests sur machine développeur
2. **Push Git** → Code envoyé vers le repository
3. **CI/CD Pipeline** → Tests automatiques et validation
4. **Déploiement Staging** → Validation par l'équipe produit
5. **Déploiement Production** → Mise en ligne pour les utilisateurs

### 👥 Responsabilités par Environnement

| Environnement | Responsable Principal | Accès | Maintenance |
|---------------|----------------------|-------|-------------|
| Développement | Développeurs | Équipe tech | Continue |
| Staging | Lead technique + Product | Équipe élargie | Hebdomadaire |
| Production | DevOps + Admin système | Restreint | 24/7 |

---

## 2. Architecture Technique Supabase

### 🔐 2.1 Gestion des Credentials Supabase

#### Question Critique : Credentials Utilisateur vs Partagés

**Scénario A : Credentials Utilisateur Personnels**
```
Utilisateur → Ses propres credentials Supabase → Son instance privée
```
- ✅ **Avantages** : Isolation complète, contrôle total
- ⚠️ **Inconvénients** : Maintenance complexe, support difficile

**Scénario B : Credentials Partagés (Recommandé)**
```
Équipe → Credentials partagés → Instance commune Supabase
```
- ✅ **Avantages** : Maintenance centralisée, collaboration simplifiée
- ⚠️ **Inconvénients** : Nécessite gouvernance des accès

#### Processus d'Initialisation

**Initialisation Automatique (Nouveau Client)**
1. **Détection** : Système détecte l'absence de configuration
2. **Setup** : Création automatique des tables via migrations
3. **Validation** : Vérification de l'intégrité des données
4. **Notification** : Confirmation à l'utilisateur

**Initialisation Manuelle (Migration Existante)**
1. **Audit** : Analyse de l'environnement existant
2. **Planning** : Stratégie de migration des données
3. **Exécution** : Migration contrôlée avec validation
4. **Rollback** : Plan de retour en arrière si nécessaire

#### Isolation des Données

```sql
-- Exemple de politique RLS (Row Level Security)
CREATE POLICY "Isolation utilisateur" 
ON public.user_alerts 
FOR ALL 
USING (user_identifier = current_setting('app.user_id'));
```

#### Sécurité et Bonnes Pratiques

- **Principe du moindre privilège** : Accès minimal nécessaire
- **Rotation des clés** : Changement périodique des credentials
- **Audit logging** : Traçabilité de tous les accès
- **Chiffrement** : Données sensibles chiffrées au repos

### 🗄️ 2.2 Base de Données et Migrations

#### Stratégie de Migration Automatique

```typescript
// Exemple de vérification de migration
const checkMigrationStatus = async () => {
  const { data, error } = await supabase
    .from('schema_versions')
    .select('version')
    .order('applied_at', { ascending: false })
    .limit(1);
    
  return data?.[0]?.version || '0.0.0';
};
```

#### Gestion des Schémas

**Structure de Migration**
```
supabase/
├── migrations/
│   ├── 20250101000001_initial_schema.sql
│   ├── 20250102000001_add_user_alerts.sql
│   └── 20250103000001_update_stations.sql
└── seed.sql
```

**Process de Migration**
1. **Validation** : Tests sur environnement de développement
2. **Staging** : Application sur environnement de test
3. **Production** : Déploiement avec fenêtre de maintenance

#### Sauvegarde et Récupération

**Stratégie de Sauvegarde**
- **Fréquence** : Quotidienne pour la production
- **Rétention** : 30 jours pour les sauvegardes complètes
- **Test** : Vérification mensuelle de récupération

**Procédure de Récupération**
1. **Évaluation** : Analyse de l'incident
2. **Isolation** : Arrêt du service si nécessaire
3. **Restauration** : Récupération depuis la dernière sauvegarde valide
4. **Validation** : Vérification de l'intégrité
5. **Remise en service** : Redémarrage progressif

---

## 3. Processus de Mise à Jour du Code

### 📋 3.1 Pour l'Équipe Non-Technique

#### Comment les Modifications sont Intégrées

**Étapes du Processus**
1. **Développement** : L'équipe technique code les nouvelles fonctionnalités
2. **Revue** : Validation du code par les pairs
3. **Tests** : Vérification automatique et manuelle
4. **Staging** : Mise à disposition pour validation métier
5. **Validation** : Équipe produit teste et valide
6. **Production** : Déploiement pour les utilisateurs finaux

#### Timeline Typique de Déploiement

```
Lundi    : Développement et tests
Mardi    : Revue de code et corrections
Mercredi : Déploiement en staging
Jeudi    : Validation par l'équipe produit
Vendredi : Déploiement en production (si validé)
```

#### Impact sur les Utilisateurs Finaux

**Mises à Jour Mineures** (Corrections, améliorations)
- **Durée** : 0-5 minutes d'interruption
- **Notification** : Optionnelle
- **Impact** : Minimal ou inexistant

**Mises à Jour Majeures** (Nouvelles fonctionnalités)
- **Durée** : 15-30 minutes de maintenance
- **Notification** : 48h à l'avance
- **Impact** : Possibles nouvelles fonctionnalités visibles

### ⚙️ 3.2 Pour l'Équipe Technique

#### Git Workflow et Branches

```
main (production)
├── develop (staging)
│   ├── feature/velib-alerts
│   ├── feature/user-dashboard
│   └── hotfix/emergency-fix
└── release/v2.1.0
```

**Règles de Branchage**
- `main` : Code de production, toujours stable
- `develop` : Intégration des nouvelles fonctionnalités
- `feature/*` : Développement de fonctionnalités spécifiques
- `hotfix/*` : Corrections urgentes pour la production
- `release/*` : Préparation des versions

#### CI/CD Pipeline Détaillé

```yaml
# .github/workflows/ci.yml
Pipeline:
  1. Trigger (Push/PR) → 
  2. Install Dependencies → 
  3. Lint & Type Check → 
  4. Unit Tests → 
  5. Build Application → 
  6. Integration Tests → 
  7. Deploy to Staging → 
  8. E2E Tests → 
  9. Deploy to Production
```

**Tests Automatisés**
- **Unit Tests** : Tests de composants isolés
- **Integration Tests** : Tests de flux complets
- **E2E Tests** : Tests utilisateur automatisés

**Gestion d'Erreurs et Rollback**
```bash
# Rollback automatique en cas d'échec
if [[ $HEALTH_CHECK_FAILED ]]; then
  echo "Rollback en cours..."
  docker-compose down
  git revert HEAD
  docker-compose up -d
fi
```

#### Monitoring Post-Déploiement

**Métriques Surveillées**
- **Performance** : Temps de réponse, throughput
- **Erreurs** : Taux d'erreur, logs d'exception
- **Utilisation** : CPU, mémoire, base de données
- **Utilisateurs** : Connexions actives, actions réalisées

---

## 4. Docker Compose - Fonctionnement Complet

### 🐳 4.1 Concepts Fondamentaux (Non-Technique)

#### Qu'est-ce que Docker et Docker Compose ?

**Analogie Simple**
Imaginez Docker comme des "boîtes" (containers) qui contiennent tout ce qui est nécessaire pour faire fonctionner une application :
- Le code de l'application
- Les outils nécessaires (Node.js, npm)
- Les configurations
- Les dépendances

**Docker Compose** est comme un "chef d'orchestre" qui :
- Démarre plusieurs "boîtes" en même temps
- S'assure qu'elles communiquent entre elles
- Gère leur configuration

#### Avantages de la Containerisation

**Pour l'Équipe Business**
- ✅ **Consistance** : L'application fonctionne de façon identique partout
- ✅ **Rapidité** : Déploiement en quelques minutes
- ✅ **Fiabilité** : Moins de bugs liés à l'environnement
- ✅ **Scalabilité** : Facile d'ajouter de la capacité

**Pour les Utilisateurs**
- ✅ **Performance** : Optimisation des ressources
- ✅ **Disponibilité** : Moins d'interruptions de service
- ✅ **Nouvelles fonctionnalités** : Déploiement plus fréquent

### 🏗️ 4.2 Architecture Technique Détaillée

#### Structure du docker-compose.yml

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

#### Services et leurs Interactions

**Service Production (ecotrajet)**
- **Rôle** : Servir l'application optimisée
- **Build** : Version compilée et minifiée
- **Accès** : Port 8080 exposé

**Service Développement (ecotrajet-dev)**
- **Rôle** : Développement avec hot-reload
- **Build** : Version non-minifiée avec outils de debug
- **Accès** : Port 8080 (profil dev uniquement)

#### Gestion des Volumes et Réseaux

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

#### Variables d'Environnement

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

### 🛠️ 4.3 Gestion Opérationnelle

#### Commandes Essentielles Docker Compose

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

#### Mise à Jour des Containers

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

#### Monitoring et Santé des Services

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

---

## 5. Processus Opérationnels

### 👤 5.1 Scénarios Utilisateurs

#### Nouveau Client avec Credentials Supabase

**Processus d'Onboarding**
1. **Accueil** : Formulaire de configuration initiale
2. **Validation** : Vérification des credentials fournis
3. **Initialisation** : Création automatique du schéma de base
4. **Configuration** : Paramétrage des préférences utilisateur
5. **Formation** : Guide d'utilisation et tutoriels

**Checklist Technique**
- [ ] Credentials Supabase valides
- [ ] Tables créées avec succès
- [ ] Politiques RLS appliquées
- [ ] Données de test insérées
- [ ] Accès utilisateur configuré

#### Migration d'un Environnement Existant

**Phase de Préparation**
1. **Audit** : Analyse de l'environnement source
2. **Planification** : Stratégie de migration
3. **Sauvegarde** : Backup complet des données
4. **Tests** : Validation sur environnement de test

**Phase d'Exécution**
1. **Fenêtre de maintenance** : Communication aux utilisateurs
2. **Export** : Extraction des données existantes
3. **Transformation** : Adaptation au nouveau schéma
4. **Import** : Chargement dans le nouvel environnement
5. **Validation** : Vérification de l'intégrité

#### Gestion des Pannes et Incidents

**Classification des Incidents**
- **P1 (Critique)** : Service indisponible → Résolution < 1h
- **P2 (Majeur)** : Fonctionnalité dégradée → Résolution < 4h
- **P3 (Mineur)** : Bug non-bloquant → Résolution < 24h

**Processus d'Escalade**
```
Détection → Équipe Support → Lead Technique → DevOps → Management
    (0h)         (15min)          (30min)       (1h)        (2h)
```

### 🔧 5.2 Maintenance et Support

#### Procédures de Sauvegarde

**Sauvegarde Automatique**
```bash
#!/bin/bash
# backup-script.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_${DATE}.sql
aws s3 cp backup_${DATE}.sql s3://ecotrajet-backups/
```

**Planning de Sauvegarde**
- **Quotidienne** : 02:00 AM (production)
- **Hebdomadaire** : Sauvegarde complète (dimanche)
- **Mensuelle** : Archive long terme

#### Gestion des Mises à Jour de Sécurité

**Surveillance des Vulnérabilités**
```bash
# Audit de sécurité automatique
npm audit
docker scan ecotrajet:latest
```

**Processus de Patch**
1. **Détection** : Alerte de sécurité reçue
2. **Évaluation** : Impact et criticité
3. **Test** : Application sur environnement de test
4. **Déploiement** : Mise en production urgente si critique

#### Support Utilisateur et Debugging

**Niveaux de Support**
- **L1** : FAQ et documentation
- **L2** : Support technique standard
- **L3** : Expertise approfondie et développement

**Outils de Debugging**
```bash
# Logs applicatifs
docker-compose logs -f ecotrajet

# Logs Supabase
supabase logs

# Métriques système
docker stats
htop
```

---

## 6. Guides Pratiques

### 👨‍💼 6.1 Pour les Non-Techniques

#### Comment Vérifier l'État d'un Déploiement

**Interface Web de Monitoring**
1. Accédez au dashboard : `https://monitoring.ecotrajet.app`
2. Vérifiez les indicateurs :
   - 🟢 **Vert** : Service opérationnel
   - 🟡 **Jaune** : Dégradation mineure
   - 🔴 **Rouge** : Service indisponible

**Vérifications Manuelles**
1. **Test de base** : Ouvrir `https://app.ecotrajet.com`
2. **Test de fonctionnalité** : Rechercher une station Vélib'
3. **Test de performance** : Vérifier les temps de chargement

#### Comprendre les Alertes et Notifications

**Types d'Alertes**
- 📧 **Email** : Incidents majeurs et maintenances
- 💬 **Slack** : Alertes techniques temps réel
- 📱 **SMS** : Urgences critiques uniquement

**Interprétation des Messages**
```
[PROD] [CRITICAL] Database connection lost
└─ Environnement: Production
└─ Criticité: Critique (action immédiate requise)
└─ Problème: Perte de connexion base de données
```

#### Quand et Comment Demander de l'Aide Technique

**Escalade Recommandée**
1. **Consultez la FAQ** : Documentation en ligne
2. **Vérifiez le status** : Page de statut du service
3. **Contactez le support** : Si problème persistant
4. **Escalade urgente** : Uniquement pour les incidents P1

**Informations à Fournir**
- **Quoi** : Description précise du problème
- **Quand** : Heure et date de l'incident
- **Qui** : Utilisateurs affectés
- **Où** : URL ou page concernée

### 🛠️ 6.2 Pour les Techniques

#### Commandes Essentielles pour le Debugging

**Diagnostic Docker**
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

**Diagnostic Application**
```bash
# Variables d'environnement
docker-compose exec ecotrajet env | grep VITE

# Espace disque
docker-compose exec ecotrajet df -h

# Processus
docker-compose exec ecotrajet ps aux
```

**Diagnostic Base de Données**
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

#### Procédures de Déploiement d'Urgence

**Hotfix en Production**
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

#### Gestion des Configurations Environnementales

**Configuration par Environnement**
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

**Validation des Configurations**
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

#### Troubleshooting des Problèmes Courants

**Problème : Container qui ne démarre pas**
```bash
# Diagnostic
docker-compose logs ecotrajet
docker-compose ps

# Solutions courantes
docker-compose down -v  # Supprimer les volumes
docker-compose build --no-cache  # Reconstruction sans cache
docker system prune  # Nettoyage général
```

**Problème : Application lente**
```bash
# Métriques
docker stats
docker-compose exec ecotrajet node --inspect
npm run build:analyze  # Analyse du bundle

# Optimisations
docker-compose restart ecotrajet
# Vérifier les logs pour les requêtes lentes
```

**Problème : Erreurs Base de Données**
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

---

## 📚 Ressources Supplémentaires

### Documentation Technique
- [Guide Docker](docker-setup.md) - Configuration Docker détaillée
- [Guide CI/CD](ci-cd-guide.md) - Pipeline d'intégration continue
- [Guide Tests](testing-guide.md) - Stratégie de tests

### Contacts et Support
- **Support L1** : support@ecotrajet.com
- **Équipe DevOps** : devops@ecotrajet.com
- **Urgences** : +33 1 XX XX XX XX

### Outils et Dashboards
- **Monitoring** : https://monitoring.ecotrajet.app
- **Logs** : https://logs.ecotrajet.app
- **Status Page** : https://status.ecotrajet.app

---

*Document mis à jour le : 12 juin 2025*
*Version : 1.0.0*
*Prochaine révision : 12 septembre 2025*
