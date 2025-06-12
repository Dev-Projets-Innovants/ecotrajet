
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

### Processus d'Initialisation

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

---

**Voir aussi :**
- [Base de données et migrations](./database.md)
- [Sécurité et credentials](./security.md)
