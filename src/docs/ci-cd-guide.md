
# Guide CI/CD - EcoTrajet

## Vue d'ensemble

Le projet EcoTrajet utilise **GitHub Actions** pour automatiser les processus de test, build et déploiement. Le pipeline CI/CD est configuré pour garantir la qualité du code et automatiser les déploiements.

## Architecture du Pipeline

### Fichier de Configuration
Le pipeline est défini dans `.github/workflows/ci.yml` et comprend trois jobs principaux :

1. **Test** : Tests automatisés sur multiple versions de Node.js
2. **Deploy Preview** : Déploiement de prévisualisation pour les PR
3. **Deploy Production** : Déploiement en production depuis `main`

## Déclencheurs du Pipeline

### Événements Automatiques
```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
```

- **Push** sur `main` ou `develop`
- **Pull Request** vers `main` ou `develop`

## Job de Test

### Configuration Matrix
```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x]
```

Tests exécutés sur Node.js 18 et 20 pour assurer la compatibilité.

### Étapes du Job Test

1. **Checkout du Code**
   ```yaml
   - uses: actions/checkout@v4
   ```

2. **Configuration Node.js**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       node-version: ${{ matrix.node-version }}
       cache: 'npm'
   ```

3. **Installation des Dépendances**
   ```bash
   npm ci
   ```

4. **Vérifications de Qualité**
   ```bash
   npm run lint          # ESLint
   npm run type-check    # TypeScript
   npm run test:coverage # Tests avec couverture
   npm run build        # Build de production
   ```

5. **Upload de Couverture**
   ```yaml
   - uses: codecov/codecov-action@v3
     if: matrix.node-version == '20.x'
   ```

## Déploiement de Prévisualisation

### Déclenchement
- Activé uniquement sur les **Pull Requests**
- Dépend du succès du job `test`

### Processus
1. Installation des dépendances
2. Build de l'application
3. Déploiement sur l'environnement de prévisualisation

```yaml
deploy-preview:
  runs-on: ubuntu-latest
  needs: test
  if: github.event_name == 'pull_request'
```

## Déploiement Production

### Déclenchement
- Activé uniquement sur les **push vers main**
- Dépend du succès du job `test`

### Processus
1. Installation des dépendances
2. Build de production
3. Déploiement en production

```yaml
deploy-production:
  runs-on: ubuntu-latest
  needs: test
  if: github.ref == 'refs/heads/main'
```

## Scripts NPM Utilisés

### Qualité de Code
```json
{
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "lint:fix": "eslint . --ext ts,tsx --fix",
  "type-check": "tsc --noEmit"
}
```

### Tests
```json
{
  "test": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:run": "vitest run"
}
```

## Configuration ESLint

### Règles Appliquées
- Détection des directives `disable` inutilisées
- Maximum de 0 warnings autorisés
- Extensions TypeScript (.ts, .tsx)

### Auto-fix
```bash
npm run lint:fix
```

## Couverture de Code

### Intégration Codecov
- Upload automatique sur Node.js 20.x uniquement
- Fichier de couverture : `./coverage/coverage-final.json`
- Flags : `unittests`

### Seuils de Couverture
Configurés dans `vitest.config.ts` :
- Rapports : text, json, html
- Exclusions : node_modules, tests, fichiers de config

## Variables d'Environnement

### Environnement de Build
```yaml
env:
  NODE_ENV: production
```

### Secrets GitHub
Pour les déploiements, configurez les secrets nécessaires :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- Autres clés API selon les besoins

## Monitoring et Debugging

### Logs du Pipeline
- Accès via l'onglet "Actions" de GitHub
- Logs détaillés pour chaque étape
- Historique des exécutions conservé

### Échecs Courants et Solutions

#### Tests qui Échouent
```bash
# Vérifier localement
npm run test:run
npm run lint
npm run type-check
```

#### Build qui Échoue
```bash
# Tester le build localement
npm run build
```

#### Problèmes de Dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

## Optimisations de Performance

### Cache NPM
```yaml
cache: 'npm'
```
Accélère l'installation des dépendances.

### Installation avec CI
```bash
npm ci
```
Plus rapide et déterministe que `npm install`.

### Builds Parallèles
Les jobs de test s'exécutent en parallèle sur les différentes versions de Node.js.

## Sécurité

### Permissions Minimales
Les jobs utilisent uniquement les permissions nécessaires.

### Isolation des Environnements
- Prévisualisation isolée de la production
- Variables d'environnement séparées

## Maintenance

### Mise à Jour des Actions
Vérifiez régulièrement les versions des actions GitHub :
- `actions/checkout@v4`
- `actions/setup-node@v4`
- `codecov/codecov-action@v3`

### Surveillance des Performances
- Temps d'exécution des jobs
- Taux de succès/échec
- Couverture de code

## Bonnes Pratiques

### 1. Commits et Messages
- Messages de commit clairs
- Commits atomiques
- Respect de la convention de nommage

### 2. Pull Requests
- Tests locaux avant création de PR
- Description claire des changements
- Validation des déploiements de prévisualisation

### 3. Gestion des Branches
- `main` : Code de production stable
- `develop` : Code de développement
- Feature branches : Nouvelles fonctionnalités

### 4. Rollback
En cas de problème en production :
1. Revert du commit problématique
2. Push sur `main` pour redéclenchement automatique
3. Investigation post-mortem

## Métriques et Reporting

### Dashboard GitHub Actions
- Temps d'exécution moyen
- Taux de succès
- Consommation des minutes CI/CD

### Codecov Dashboard
- Évolution de la couverture
- Couverture par fichier/dossier
- Rapports de PR automatiques

## Extensions Futures

### Déploiements Multi-Environnements
- Staging
- UAT (User Acceptance Testing)
- Production

### Tests d'Intégration
- Tests E2E avec Playwright
- Tests de performance

### Notifications
- Slack/Discord pour les échecs
- Emails pour les déploiements production
