
# ÉcoTrajet Database Architecture

Ce document décrit l'architecture de base de données pour la plateforme ÉcoTrajet, une application de mobilité durable axée sur le suivi des stations Vélib', la gestion des alertes utilisateur et le système de forum communautaire.

## Vue d'ensemble

L'architecture de base de données est conçue pour supporter les fonctionnalités principales suivantes :
- Suivi en temps réel des stations Vélib' de Paris
- Système d'alertes personnalisées pour les utilisateurs
- Historique des disponibilités des vélos et emplacements
- Gestion des stations favorites des utilisateurs
- Notifications par email pour les alertes
- **Forum communautaire avec posts, commentaires et système de likes**
- **Partage d'expériences utilisateur avec modération**

## Tables de la Base de Données

### 1. velib_stations

**Objectif** : Stockage des données statiques des stations Vélib' de Paris.

**Colonnes** :
- `id` : uuid PRIMARY KEY - Identifiant unique de la station
- `stationcode` : text UNIQUE NOT NULL - Code officiel de la station Vélib'
- `name` : text NOT NULL - Nom de la station
- `coordonnees_geo_lat` : numeric NOT NULL - Latitude de la station
- `coordonnees_geo_lon` : numeric NOT NULL - Longitude de la station
- `capacity` : integer NOT NULL - Capacité totale de la station
- `nom_arrondissement_communes` : text - Arrondissement ou commune
- `code_insee_commune` : text - Code INSEE de la commune
- `station_opening_hours` : text - Horaires d'ouverture de la station
- `created_at` : timestamp with time zone DEFAULT now() - Date de création
- `updated_at` : timestamp with time zone DEFAULT now() - Dernière mise à jour

**Rôle** : Cette table sert de référentiel principal pour toutes les stations Vélib' et leurs informations géographiques et techniques.

### 2. velib_availability_history

**Objectif** : Historique des disponibilités en temps réel des stations Vélib'.

**Colonnes** :
- `id` : uuid PRIMARY KEY - Identifiant unique de l'enregistrement
- `stationcode` : text NOT NULL - Référence vers la station (FK vers velib_stations)
- `timestamp` : timestamp with time zone DEFAULT now() - Horodatage de la mesure
- `numbikesavailable` : integer NOT NULL - Nombre de vélos disponibles
- `numdocksavailable` : integer NOT NULL - Nombre d'emplacements libres
- `mechanical` : integer NOT NULL DEFAULT 0 - Nombre de vélos mécaniques
- `ebike` : integer NOT NULL DEFAULT 0 - Nombre de vélos électriques
- `is_renting` : boolean DEFAULT true - Station en service pour la location
- `is_returning` : boolean DEFAULT true - Station en service pour le retour
- `is_installed` : boolean DEFAULT true - Station installée et opérationnelle

**Rôle** : Permet le suivi historique des disponibilités et l'analyse des tendances d'utilisation des stations Vélib'.

### 3. user_alerts

**Objectif** : Gestion des alertes personnalisées des utilisateurs pour les stations Vélib'.

**Colonnes** :
- `id` : uuid PRIMARY KEY - Identifiant unique de l'alerte
- `user_id` : uuid - Référence vers l'utilisateur (nullable pour compatibilité)
- `user_identifier` : text - Identifiant utilisateur alternatif
- `user_email` : text - Email pour les notifications
- `stationcode` : text NOT NULL - Station surveillée (FK vers velib_stations)
- `alert_type` : text NOT NULL - Type d'alerte ('bikes_available', 'docks_available', 'ebikes_available', 'mechanical_bikes')
- `threshold` : integer NOT NULL DEFAULT 1 - Seuil déclencheur de l'alerte
- `is_active` : boolean DEFAULT true - Statut actif de l'alerte
- `notification_frequency` : text DEFAULT 'immediate' - Fréquence des notifications ('immediate', 'hourly', 'daily')
- `last_notification_sent` : timestamp with time zone - Dernière notification envoyée
- `created_at` : timestamp with time zone DEFAULT now() - Date de création

**Contraintes** :
- `UNIQUE(user_id, stationcode, alert_type)` - Évite les doublons d'alertes
- `CHECK (alert_type IN ('bikes_available', 'docks_available', 'ebikes_available', 'mechanical_bikes'))`
- `CHECK (notification_frequency IN ('immediate', 'hourly', 'daily'))`

**Rôle** : Système d'alertes permettant aux utilisateurs d'être notifiés quand certaines conditions sont remplies sur leurs stations préférées.

### 4. user_favorite_stations

**Objectif** : Gestion des stations favorites des utilisateurs.

**Colonnes** :
- `id` : uuid PRIMARY KEY - Identifiant unique
- `user_id` : uuid - Référence vers l'utilisateur
- `stationcode` : text NOT NULL - Station favorite (FK vers velib_stations)
- `created_at` : timestamp with time zone DEFAULT now() - Date d'ajout aux favoris

**Contraintes** :
- `UNIQUE(user_id, stationcode)` - Un utilisateur ne peut pas avoir la même station en favori plusieurs fois

**Rôle** : Permet aux utilisateurs de marquer leurs stations préférées pour un accès rapide.

### 5. alert_notifications_history

**Objectif** : Historique des notifications d'alertes envoyées.

**Colonnes** :
- `id` : uuid PRIMARY KEY - Identifiant unique
- `alert_id` : uuid - Référence vers l'alerte (FK vers user_alerts)
- `sent_at` : timestamp with time zone DEFAULT now() - Date d'envoi
- `email` : text NOT NULL - Email destinataire
- `station_name` : text - Nom de la station concernée
- `alert_type` : text - Type d'alerte déclenchée
- `threshold` : integer - Seuil configuré
- `current_value` : integer - Valeur actuelle ayant déclenché l'alerte
- `email_status` : text DEFAULT 'sent' - Statut de l'envoi ('sent', 'failed', 'pending')

**Rôle** : Traçabilité complète des notifications envoyées pour audit et débogage.

### 6. user_experiences

**Objectif** : Stockage des témoignages et expériences partagées par les utilisateurs.

**Colonnes** :
- `id` : uuid PRIMARY KEY - Identifiant unique
- `user_id` : uuid - Référence vers l'utilisateur (nullable)
- `name` : text - Nom de l'utilisateur (optionnel)
- `experience_text` : text NOT NULL - Contenu du témoignage
- `rating` : integer NOT NULL - Note attribuée (1-5)
- `category` : text - Catégorie de l'expérience
- `is_approved` : boolean DEFAULT false - Statut de modération
- `created_at` : timestamp with time zone DEFAULT now() - Date de création
- `updated_at` : timestamp with time zone DEFAULT now() - Dernière modification

**Rôle** : Collecte et modération des retours d'expérience utilisateur pour améliorer l'application.

## Nouvelles Tables du Forum (Système Communautaire)

### 7. forum_categories

**Objectif** : Catégorisation des discussions du forum.

**Colonnes** :
- `id` : uuid PRIMARY KEY - Identifiant unique
- `name` : text UNIQUE NOT NULL - Nom de la catégorie
- `description` : text - Description de la catégorie
- `color` : text DEFAULT '#10B981' - Couleur d'affichage
- `icon` : text DEFAULT 'MessageSquare' - Icône de la catégorie
- `is_active` : boolean DEFAULT true - Statut actif
- `created_at` : timestamp with time zone DEFAULT now() - Date de création
- `updated_at` : timestamp with time zone DEFAULT now() - Dernière modification

**Rôle** : Organisation thématique des discussions (Vélo, Covoiturage, Transport Public, etc.).

### 8. forum_posts

**Objectif** : Posts principaux du forum communautaire.

**Colonnes** :
- `id` : uuid PRIMARY KEY - Identifiant unique
- `user_id` : uuid - Référence vers l'utilisateur authentifié (nullable)
- `user_identifier` : text - Identifiant pour utilisateurs anonymes
- `user_name` : text - Nom d'affichage (optionnel)
- `user_email` : text - Email de contact (optionnel)
- `category_id` : uuid - Référence vers la catégorie (FK vers forum_categories)
- `title` : text NOT NULL - Titre du post
- `content` : text NOT NULL - Contenu du post
- `image_url` : text - URL d'image associée (optionnel)
- `location` : text - Localisation mentionnée (optionnel)
- `tags` : text[] - Tags du post
- `likes_count` : integer DEFAULT 0 - Compteur de likes (mis à jour automatiquement)
- `comments_count` : integer DEFAULT 0 - Compteur de commentaires (mis à jour automatiquement)
- `shares_count` : integer DEFAULT 0 - Compteur de partages
- `views_count` : integer DEFAULT 0 - Compteur de vues
- `is_pinned` : boolean DEFAULT false - Post épinglé
- `is_approved` : boolean DEFAULT true - Statut de modération
- `is_reported` : boolean DEFAULT false - Signalement
- `reported_count` : integer DEFAULT 0 - Nombre de signalements
- `created_at` : timestamp with time zone DEFAULT now() - Date de création
- `updated_at` : timestamp with time zone DEFAULT now() - Dernière modification

**Rôle** : Contenu principal du forum permettant aux utilisateurs de partager expériences et conseils.

### 9. forum_comments

**Objectif** : Système de commentaires pour les posts du forum.

**Colonnes** :
- `id` : uuid PRIMARY KEY - Identifiant unique
- `post_id` : uuid NOT NULL - Référence vers le post (FK vers forum_posts)
- `parent_comment_id` : uuid - Référence vers le commentaire parent (FK vers forum_comments)
- `user_id` : uuid - Référence vers l'utilisateur authentifié (nullable)
- `user_identifier` : text - Identifiant pour utilisateurs anonymes
- `user_name` : text - Nom d'affichage (optionnel)
- `user_email` : text - Email de contact (optionnel)
- `content` : text NOT NULL - Contenu du commentaire
- `likes_count` : integer DEFAULT 0 - Compteur de likes (mis à jour automatiquement)
- `is_approved` : boolean DEFAULT true - Statut de modération
- `is_reported` : boolean DEFAULT false - Signalement
- `created_at` : timestamp with time zone DEFAULT now() - Date de création
- `updated_at` : timestamp with time zone DEFAULT now() - Dernière modification

**Rôle** : Permet les discussions sous forme de commentaires et réponses sur les posts.

### 10. forum_post_likes

**Objectif** : Gestion des likes sur les posts du forum.

**Colonnes** :
- `id` : uuid PRIMARY KEY - Identifiant unique
- `post_id` : uuid NOT NULL - Référence vers le post (FK vers forum_posts)
- `user_id` : uuid - Référence vers l'utilisateur authentifié (nullable)
- `user_identifier` : text - Identifiant pour utilisateurs anonymes
- `created_at` : timestamp with time zone DEFAULT now() - Date de création

**Contraintes** :
- `UNIQUE(post_id, user_id)` - Un utilisateur authentifié ne peut liker qu'une fois
- `UNIQUE(post_id, user_identifier)` - Un utilisateur anonyme ne peut liker qu'une fois

**Rôle** : Système de likes/votes pour les posts avec protection contre les doublons.

### 11. forum_comment_likes

**Objectif** : Gestion des likes sur les commentaires du forum.

**Colonnes** :
- `id` : uuid PRIMARY KEY - Identifiant unique
- `comment_id` : uuid NOT NULL - Référence vers le commentaire (FK vers forum_comments)
- `user_id` : uuid - Référence vers l'utilisateur authentifié (nullable)
- `user_identifier` : text - Identifiant pour utilisateurs anonymes
- `created_at` : timestamp with time zone DEFAULT now() - Date de création

**Contraintes** :
- `UNIQUE(comment_id, user_id)` - Un utilisateur authentifié ne peut liker qu'une fois
- `UNIQUE(comment_id, user_identifier)` - Un utilisateur anonyme ne peut liker qu'une fois

**Rôle** : Système de likes/votes pour les commentaires avec protection contre les doublons.

### 12. forum_reports

**Objectif** : Système de signalement pour la modération.

**Colonnes** :
- `id` : uuid PRIMARY KEY - Identifiant unique
- `reporter_user_id` : uuid - Référence vers l'utilisateur signalant (nullable)
- `reporter_identifier` : text - Identifiant anonyme du signaleur
- `post_id` : uuid - Référence vers le post signalé (FK vers forum_posts, nullable)
- `comment_id` : uuid - Référence vers le commentaire signalé (FK vers forum_comments, nullable)
- `reason` : text NOT NULL - Raison du signalement
- `description` : text - Description détaillée (optionnel)
- `status` : text DEFAULT 'pending' - Statut ('pending', 'reviewed', 'resolved', 'dismissed')
- `created_at` : timestamp with time zone DEFAULT now() - Date de signalement
- `reviewed_at` : timestamp with time zone - Date de traitement
- `reviewed_by` : uuid - Modérateur ayant traité le signalement

**Contraintes** :
- `CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed'))`

**Rôle** : Permet aux utilisateurs de signaler du contenu inapproprié pour modération.

## Relations Clés

1. **Relations Vélib'** :
   - Une station peut avoir plusieurs enregistrements d'historique (1:N)
   - Une station peut être dans plusieurs favoris (1:N)
   - Une station peut avoir plusieurs alertes (1:N)

2. **Relations Utilisateur** :
   - Un utilisateur peut avoir plusieurs alertes (1:N)
   - Un utilisateur peut avoir plusieurs stations favorites (1:N)
   - Une alerte peut générer plusieurs notifications historiques (1:N)
   - Un utilisateur peut créer plusieurs posts et commentaires (1:N)
   - Un utilisateur peut liker plusieurs posts et commentaires (1:N)

3. **Relations d'Alerte** :
   - Une alerte appartient à un utilisateur et surveille une station (N:1:1)
   - Une alerte peut générer plusieurs notifications (1:N)

4. **Relations Forum** :
   - Une catégorie peut contenir plusieurs posts (1:N)
   - Un post peut avoir plusieurs commentaires (1:N)
   - Un commentaire peut avoir des réponses (auto-référence 1:N)
   - Un post/commentaire peut avoir plusieurs likes (1:N)
   - Un post/commentaire peut avoir plusieurs signalements (1:N)

## Schéma des Relations

```
velib_stations 1 -- * velib_availability_history
velib_stations 1 -- * user_alerts
velib_stations 1 -- * user_favorite_stations
user_alerts 1 -- * alert_notifications_history

forum_categories 1 -- * forum_posts
forum_posts 1 -- * forum_comments
forum_posts 1 -- * forum_post_likes
forum_posts 1 -- * forum_reports
forum_comments 1 -- * forum_comment_likes
forum_comments 1 -- * forum_reports
forum_comments 1 -- * forum_comments (self-reference)
```

## Stratégie d'Indexation

- **Index existants** :
  - `idx_velib_availability_stationcode_timestamp` sur `(stationcode, timestamp DESC)`
  - `idx_velib_stations_geo` sur `(coordonnees_geo_lat, coordonnees_geo_lon)`
  - `idx_user_alerts_active` sur `(user_id, is_active)` WHERE `is_active = true`
  - `idx_user_alerts_user_identifier` sur `(user_identifier)`
  - `idx_alert_notifications_alert_id` sur `(alert_id)`
  - `idx_alert_notifications_sent_at` sur `(sent_at DESC)`

- **Nouveaux index Forum** :
  - `idx_forum_posts_category_id` sur `(category_id)`
  - `idx_forum_posts_created_at` sur `(created_at DESC)`
  - `idx_forum_posts_user_id` sur `(user_id)`
  - `idx_forum_comments_post_id` sur `(post_id)`
  - `idx_forum_comments_parent_id` sur `(parent_comment_id)`
  - `idx_forum_post_likes_post_id` sur `(post_id)`
  - `idx_forum_comment_likes_comment_id` sur `(comment_id)`

## Sécurité et Accès aux Données

### Row Level Security (RLS)

**Statut actuel** : 
- **Tables Vélib'** : RLS désactivée temporairement pour compatibilité `user_identifier`
- **Tables Forum** : RLS activée avec support dual authentifié/anonyme
  - Lecture publique pour le contenu approuvé
  - Écriture contrôlée par `user_id` ou `user_identifier`
  - Modération réservée aux administrateurs

**Politiques Forum** :
- **Lecture** : Contenu approuvé visible par tous
- **Écriture** : Utilisateurs authentifiés OU avec `user_identifier` valide
- **Modération** : Administrateurs uniquement

## Fonctions de Base de Données

### Fonctions Vélib' existantes

- `clean_old_availability_data()` : Nettoyage automatique des données anciennes

### Nouvelles Fonctions Forum

- `update_post_likes_count()` : Mise à jour automatique du compteur de likes des posts
- `update_post_comments_count()` : Mise à jour automatique du compteur de commentaires
- `update_comment_likes_count()` : Mise à jour automatique du compteur de likes des commentaires

**Triggers associés** :
- `trigger_update_post_likes_count` : Déclenché sur INSERT/DELETE dans `forum_post_likes`
- `trigger_update_post_comments_count` : Déclenché sur INSERT/DELETE dans `forum_comments`
- `trigger_update_comment_likes_count` : Déclenché sur INSERT/DELETE dans `forum_comment_likes`
- `handle_updated_at_*` : Mise à jour automatique des timestamps

## Temps Réel et Synchronisation

### Configuration Realtime

Les tables suivantes sont configurées pour les mises à jour en temps réel :
- `velib_availability_history`
- `user_alerts`
- `user_favorite_stations`
- **`forum_posts`** (nouveau)
- **`forum_comments`** (nouveau)
- **`forum_post_likes`** (nouveau)
- **`forum_comment_likes`** (nouveau)

**Configuration** :
```sql
ALTER TABLE public.forum_posts REPLICA IDENTITY FULL;
ALTER TABLE public.forum_comments REPLICA IDENTITY FULL;
ALTER TABLE public.forum_post_likes REPLICA IDENTITY FULL;
ALTER TABLE public.forum_comment_likes REPLICA IDENTITY FULL;
```

### Synchronisation des Données

- **Vélib'** : Synchronisation automatique via Edge Function `sync-velib-data`
- **Forum** : Mises à jour en temps réel pour l'expérience collaborative

## Optimisations de Performance

1. **Partition par temps** : Considérer le partitioning pour l'historique Vélib' et les posts anciens
2. **Nettoyage automatique** : Extension pour archivage automatique des anciens posts
3. **Cache** : Mise en cache des catégories et posts populaires
4. **Index géospatial** : Optimisé pour les requêtes de proximité
5. **Compteurs dénormalisés** : Mise à jour automatique via triggers pour les performances

## Considérations Futures

1. **Authentification complète** : Migration vers authentification robuste avec maintien de la compatibilité anonyme
2. **Modération avancée** : Intelligence artificielle pour pré-filtrage automatique
3. **Analytics Forum** : Métriques d'engagement et statistiques communautaires
4. **Notifications temps réel** : System de notifications push pour les réponses et mentions
5. **Recherche full-text** : Index de recherche avancée dans le contenu du forum
6. **API Forum** : Endpoints REST dédiés pour applications mobiles

## Maintenance et Surveillance

1. **Surveillance** : Monitoring des performances et de l'engagement communautaire
2. **Sauvegarde** : Stratégie étendue incluant le contenu du forum
3. **Nettoyage** : Archivage automatique des anciens posts et commentaires
4. **Modération** : Dashboard administrateur pour la gestion du contenu
5. **Métriques** : Suivi de l'activité communautaire et de la qualité du contenu
