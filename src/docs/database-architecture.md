
# ÉcoTrajet Database Architecture

Ce document décrit l'architecture de base de données pour la plateforme ÉcoTrajet, une application de mobilité durable axée sur le suivi des stations Vélib' et la gestion des alertes utilisateur.

## Vue d'ensemble

L'architecture de base de données est conçue pour supporter les fonctionnalités principales suivantes :
- Suivi en temps réel des stations Vélib' de Paris
- Système d'alertes personnalisées pour les utilisateurs
- Historique des disponibilités des vélos et emplacements
- Gestion des stations favorites des utilisateurs
- Notifications par email pour les alertes

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

## Relations Clés

1. **Relations Vélib'** :
   - Une station peut avoir plusieurs enregistrements d'historique (1:N)
   - Une station peut être dans plusieurs favoris (1:N)
   - Une station peut avoir plusieurs alertes (1:N)

2. **Relations Utilisateur** :
   - Un utilisateur peut avoir plusieurs alertes (1:N)
   - Un utilisateur peut avoir plusieurs stations favorites (1:N)
   - Une alerte peut générer plusieurs notifications historiques (1:N)

3. **Relations d'Alerte** :
   - Une alerte appartient à un utilisateur et surveille une station (N:1:1)
   - Une alerte peut générer plusieurs notifications (1:N)

## Schéma des Relations

```
velib_stations 1 -- * velib_availability_history
velib_stations 1 -- * user_alerts
velib_stations 1 -- * user_favorite_stations
user_alerts 1 -- * alert_notifications_history
```

## Stratégie d'Indexation

- **Index existants** :
  - `idx_velib_availability_stationcode_timestamp` sur `(stationcode, timestamp DESC)`
  - `idx_velib_stations_geo` sur `(coordonnees_geo_lat, coordonnees_geo_lon)`
  - `idx_user_alerts_active` sur `(user_id, is_active)` WHERE `is_active = true`
  - `idx_user_alerts_user_identifier` sur `(user_identifier)`
  - `idx_alert_notifications_alert_id` sur `(alert_id)`
  - `idx_alert_notifications_sent_at` sur `(sent_at DESC)`

## Sécurité et Accès aux Données

### Row Level Security (RLS)

**Statut actuel** : 
- `user_alerts` : RLS **DÉSACTIVÉE** temporairement pour permettre les opérations avec `user_identifier`
- `user_favorite_stations` : RLS **DÉSACTIVÉE** temporairement
- `velib_stations` : Lecture publique (politique : "Stations are viewable by everyone")
- `velib_availability_history` : Lecture publique (politique : "Availability history is viewable by everyone")

**Note importante** : Les politiques RLS ont été temporairement désactivées pour gérer les utilisateurs non authentifiés via `user_identifier`. Une révision de la sécurité est recommandée.

## Fonctions de Base de Données

### clean_old_availability_data()

```sql
CREATE OR REPLACE FUNCTION clean_old_availability_data()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.velib_availability_history 
  WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$;
```

**Objectif** : Nettoyage automatique des données d'historique anciennes (> 30 jours) pour optimiser les performances.

## Temps Réel et Synchronisation

### Configuration Realtime

Les tables suivantes sont configurées pour les mises à jour en temps réel :
- `velib_availability_history`
- `user_alerts`
- `user_favorite_stations`

**Configuration** :
```sql
ALTER TABLE public.velib_availability_history REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.velib_availability_history;
```

### Synchronisation des Données Vélib'

La synchronisation avec l'API OpenData de Paris se fait via la fonction Edge `sync-velib-data` qui :
1. Récupère les données depuis l'API Paris OpenData
2. Met à jour les stations (upsert)
3. Insère les nouvelles données de disponibilité
4. Vérifie et déclenche les alertes utilisateur

## Optimisations de Performance

1. **Partition par temps** : Considérer le partitioning de `velib_availability_history` par mois
2. **Nettoyage automatique** : Fonction `clean_old_availability_data()` à exécuter quotidiennement
3. **Cache** : Les données de stations changent peu, idéales pour la mise en cache
4. **Index géospatial** : Optimisé pour les requêtes de proximité géographique

## Considérations Futures

1. **Authentification** : Réimplémentation des politiques RLS pour une sécurité robuste
2. **Archivage** : Stratégie d'archivage pour les données historiques anciennes
3. **Analytics** : Tables dédiées pour les métriques et rapports
4. **Scalabilité** : Partition des tables historiques si le volume augmente significativement

## Maintenance et Surveillance

1. **Surveillance** : Monitoring de la taille des tables et performance des requêtes
2. **Sauvegarde** : Stratégie de sauvegarde automatique quotidienne
3. **Nettoyage** : Exécution régulière de la fonction de nettoyage
4. **Monitoring des alertes** : Surveillance du taux de succès des notifications email
