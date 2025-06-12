
# Guides Pratiques - ÉcoTrajet

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
