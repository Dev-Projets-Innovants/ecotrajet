
# Architecture Technique Supabase - ÉcoTrajet

## 🔐 Gestion des Credentials Supabase

### Question Critique : Credentials Utilisateur vs Partagés

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

### 🚀 Guide Pratique pour Nouveaux Développeurs

#### **Option Recommandée : Projet Supabase d'Équipe**

**Credentials du projet ÉcoTrajet :**
```env
VITE_SUPABASE_URL=https://knebskomwvvvoaclrwjv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZWJza29td3Z2dm9hY2xyd2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MzkzMDMsImV4cCI6MjA2NTIxNTMwM30.45ggA2kNYAVa9_bRqL2ihaan1oqx55HyYlYLv_zxsa8
```

**Avantages pour l'équipe :**
- ✅ **Tables pré-configurées** : Toutes les migrations déjà appliquées
- ✅ **Données de test** : Stations Vélib', utilisateurs, alertes
- ✅ **Comptes d'administration** : Accès direct aux fonctionnalités
- ✅ **Support simplifié** : Environnement identique pour tous

#### **Option Alternative : Projet Supabase Personnel**

**Quand l'utiliser :**
- Développement de fonctionnalités expérimentales
- Tests qui ne doivent pas impacter l'équipe
- Apprentissage de la configuration Supabase

**Configuration requise :**
1. **Créer un projet** sur [supabase.com](https://supabase.com)
2. **Exécuter les migrations** (voir fichiers dans `/supabase/migrations/`)
3. **Configurer l'authentification** 
4. **Activer les fonctions Edge** pour les alertes Vélib'

### Processus d'Initialisation

#### **Initialisation Automatique (Projet d'Équipe)**
1. **Configuration** : Copier les credentials dans `.env`
2. **Lancement** : `docker-compose up --build`
3. **Vérification** : Se connecter avec `admin@ecotrajet.com`
4. **Test** : Consulter les stations Vélib' sur la carte

#### **Initialisation Manuelle (Projet Personnel)**
1. **Audit** : Analyser les fichiers de migration
2. **Exécution** : Appliquer les scripts SQL dans l'ordre
3. **Validation** : Vérifier la création des tables
4. **Seeding** : Insérer des données de test si nécessaire

### Structure des Tables Principales

**Tables utilisateurs :**
- `profiles` : Informations utilisateur étendues
- `user_alerts` : Alertes de disponibilité Vélib'
- `user_favorite_stations` : Stations favorites par utilisateur

**Tables Vélib' :**
- `velib_stations` : Informations statiques des stations
- `velib_availability_history` : Historique de disponibilité temps réel
- `alert_notifications_history` : Historique des notifications envoyées

### Isolation des Données

```sql
-- Exemple de politique RLS (Row Level Security)
CREATE POLICY "Isolation utilisateur" 
ON public.user_alerts 
FOR ALL 
USING (user_identifier = current_setting('app.user_id'));
```

### Sécurité et Bonnes Pratiques

- **Principe du moindre privilège** : Accès minimal nécessaire
- **Rotation des clés** : Changement périodique des credentials
- **Audit logging** : Traçabilité de tous les accès
- **Chiffrement** : Données sensibles chiffrées au repos

### 🔧 Troubleshooting Supabase

#### ❌ "Failed to connect to Supabase"
**Solutions :**
1. Vérifier les credentials dans `.env`
2. Tester la connexion depuis le navigateur
3. Vérifier la configuration du proxy/firewall

#### ❌ "Tables do not exist"
**Solutions :**
1. **Projet d'équipe** : Vérifier les credentials
2. **Projet personnel** : Exécuter les migrations manquantes
3. Consulter l'onglet "Table Editor" dans Supabase

#### ❌ "RLS policy violation"
**Solutions :**
1. Se connecter avec un compte utilisateur valide
2. Vérifier les politiques de sécurité RLS
3. Consulter les logs d'authentification

---

**Voir aussi :**
- [Base de données et migrations](./database.md)
- [Sécurité et credentials](./security.md)
- [Guide pratique pour équipes](../../guides/README.md)
