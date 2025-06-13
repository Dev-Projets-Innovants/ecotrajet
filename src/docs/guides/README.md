
# Guides Pratiques - ÉcoTrajet

## 📚 Navigation par Profil

### 👨‍💼 Pour les Non-Techniques
- [Premiers pas pour nouveaux développeurs](#-premiers-pas-pour-nouveaux-développeurs)
- [Comment vérifier l'état d'un déploiement](#comment-vérifier-létat-dun-déploiement)
- [Comprendre les alertes et notifications](#comprendre-les-alertes-et-notifications)
- [Quand et comment demander de l'aide technique](#quand-et-comment-demander-de-laide-technique)

### 🛠️ Pour les Techniques
- [Guide technique](./technical.md)
- [Dépannage](./troubleshooting.md)

---

## 🚀 Premiers Pas pour Nouveaux Développeurs

### Comprendre la Configuration Supabase

**Pourquoi Supabase est-il nécessaire ?**

ÉcoTrajet utilise Supabase comme base de données et système d'authentification. **Contrairement à d'autres projets, les tables de base de données ne se créent PAS automatiquement** quand vous lancez Docker.

**Analogie Simple :**
- **Docker** = La "maison" où vit l'application
- **Supabase** = Le "mobilier" (données, utilisateurs, fonctionnalités)
- **Sans Supabase configuré** = Maison vide qui ne fonctionne pas

### 🎯 Deux Options de Configuration

#### **Option 1 : Projet Supabase de l'Équipe (Recommandé pour débuter)**

**🎯 Choisir cette option si :**
- Vous débutez sur le projet
- Vous voulez voir des données réelles
- Vous travaillez avec l'équipe
- Vous voulez un setup rapide (5 minutes)

**💡 Ce que vous obtenez :**
- Tables déjà créées et remplies
- Comptes de test fonctionnels
- Données partagées avec l'équipe
- Support technique simplifié

**📋 Instructions détaillées :**

1. **Demander les credentials à l'équipe**
   ```
   Demandez à un collègue :
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   ```

2. **Configuration du fichier .env**
   ```bash
   # Après avoir fait : cp .env.example .env
   # Éditer le fichier .env avec un éditeur de texte
   
   # Remplacer les valeurs par celles fournies par l'équipe
   VITE_SUPABASE_URL=https://knebskomwvvvoaclrwjv.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Comptes de test disponibles**
   - **Administrateur** : `admin@ecotrajet.com` / `password123`
   - **Utilisateur standard** : `user1@gmail.com` / `password123`

#### **Option 2 : Votre Propre Projet Supabase**

**🎯 Choisir cette option si :**
- Vous voulez un environnement isolé
- Vous faites des tests qui ne doivent pas impacter l'équipe
- Vous voulez comprendre la configuration Supabase
- Vous développez des fonctionnalités expérimentales

**⚠️ Points d'attention :**
- Setup plus long (15-20 minutes)
- Nécessite de créer les tables manuellement
- Pas de données de test pré-remplies
- Plus de configuration technique

**📋 Instructions détaillées :**

1. **Créer un compte Supabase**
   - Aller sur [supabase.com](https://supabase.com)
   - S'inscrire gratuitement
   - Vérifier l'email de confirmation

2. **Créer un projet**
   - Cliquer "New Project"
   - Nom : `ecotrajet-dev-votrenom`
   - Choisir un mot de passe fort pour la base
   - Région : Europe West (Ireland)
   - Plan : Free (suffisant pour le développement)

3. **Récupérer les credentials**
   - Dans votre projet Supabase, aller dans "Settings" → "API"
   - Copier "Project URL"
   - Copier "anon public" key

4. **Configurer le fichier .env**
   ```env
   VITE_SUPABASE_URL=https://votre-projet-id.supabase.co
   VITE_SUPABASE_ANON_KEY=votre_clé_anonyme
   NODE_ENV=production
   ```

5. **Créer les tables (OBLIGATOIRE)**
   - Demander à l'équipe les fichiers de migration SQL
   - Exécuter les scripts dans l'onglet "SQL Editor" de Supabase
   - Ou utiliser les commandes de migration (voir documentation technique)

### 🔧 Instructions de Lancement Complètes

**Une fois l'option choisie et configurée :**

```bash
# 1. Cloner le projet
git clone https://github.com/Dev-Projets-Innovants/ecotrajet.git
cd ecotrajet

# 2. Configurer l'environnement
cp .env.example .env
# ÉTAPE CRUCIALE : Éditer .env avec l'option choisie

# 3. Lancer avec Docker
docker-compose up --build

# Application accessible sur : http://localhost:8080
```

### 🆘 Résolution de Problèmes Courants

#### ❌ "L'application se lance mais est vide"
**Cause :** Fichier .env pas configuré ou incorrect
**Solution :** Vérifier que le fichier .env contient les bonnes valeurs Supabase

#### ❌ "Erreur de connexion à Supabase"
**Cause :** Credentials incorrects
**Solution :** 
- Option 1 : Re-demander les credentials à l'équipe
- Option 2 : Vérifier les credentials dans votre dashboard Supabase

#### ❌ "Tables not found"
**Cause :** Base de données vide (Option 2 seulement)
**Solution :** Exécuter les migrations SQL ou basculer vers l'Option 1

#### ❌ "Docker ne démarre pas"
**Cause :** Docker Desktop pas lancé ou port occupé
**Solution :** 
- Démarrer Docker Desktop
- Changer le port dans docker-compose.yml si nécessaire

### 📞 Obtenir de l'Aide

**Pour l'Option 1 :**
- Demander les credentials à n'importe quel membre de l'équipe
- Support technique rapide car environnement commun

**Pour l'Option 2 :**
- Consulter la [documentation Supabase](https://supabase.com/docs)
- Demander les scripts de migration à l'équipe
- Utiliser les [guides techniques](./technical.md) pour la configuration avancée

---

## 👨‍💼 Pour les Non-Techniques

### Comment Vérifier l'État d'un Déploiement

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

### Comprendre les Alertes et Notifications

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

### Quand et Comment Demander de l'Aide Technique

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

---

**Voir aussi :**
- [Guide technique](./technical.md)
- [Dépannage](./troubleshooting.md)
- [Configuration Docker complète](../docker-setup.md)
