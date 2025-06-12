
# Guide des Tests - EcoTrajet

## Vue d'ensemble

Ce projet utilise **Vitest** comme framework de test principal avec **@testing-library/react** pour les tests de composants React. Cette configuration offre une expérience de test moderne et performante.

## Configuration des Tests

### Framework de Test
- **Vitest** : Framework de test rapide et moderne
- **jsdom** : Environnement DOM simulé pour les tests de composants
- **@testing-library/react** : Utilitaires pour tester les composants React
- **@testing-library/jest-dom** : Matchers personnalisés pour les assertions DOM

### Structure des Tests
```
src/tests/
├── setup.ts                    # Configuration globale des tests
├── components/                 # Tests des composants React
│   └── VelibCharts.test.tsx   # Tests des graphiques Velib
├── hooks/                      # Tests des hooks personnalisés
│   └── useOptimizedVelibData.test.ts
└── services/                   # Tests des services
    └── admin.test.ts           # Tests des services admin
```

## Scripts de Test Disponibles

```json
{
  "test": "vitest",                    // Mode watch par défaut
  "test:ui": "vitest --ui",           // Interface graphique
  "test:run": "vitest run",           // Exécution unique
  "test:coverage": "vitest run --coverage", // Avec couverture
  "test:watch": "vitest --watch"      // Mode watch explicite
}
```

## Écriture des Tests

### Tests de Composants

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MonComposant from '@/components/MonComposant'

describe('MonComposant', () => {
  it('should render correctly', () => {
    render(<MonComposant />)
    expect(screen.getByText('Texte attendu')).toBeInTheDocument()
  })
})
```

### Tests de Hooks

```typescript
import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useMonHook } from '@/hooks/useMonHook'

describe('useMonHook', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useMonHook())
    expect(result.current.isLoading).toBe(true)
  })
})
```

### Tests de Services

```typescript
import { describe, it, expect, vi } from 'vitest'
import { monService } from '@/services/monService'

describe('monService', () => {
  it('should return data successfully', async () => {
    const data = await monService.getData()
    expect(data).toBeDefined()
  })
})
```

## Mocking et Configuration

### Mocks Globaux (setup.ts)

Le fichier `src/tests/setup.ts` configure automatiquement les mocks pour :
- **react-router-dom** : Navigation et routing
- **@tanstack/react-query** : Gestion des requêtes
- **@/hooks/use-toast** : Notifications toast
- **recharts** : Graphiques et charts

### Mocks Personnalisés

```typescript
// Mock d'un service spécifique
vi.mock('@/services/monService', () => ({
  monService: {
    getData: vi.fn().mockResolvedValue({ data: 'test' })
  }
}))
```

## Couverture de Code

### Configuration
La couverture est configurée pour exclure :
- `node_modules/`
- `src/tests/`
- Fichiers de définition TypeScript (`.d.ts`)
- Fichiers de configuration
- Dossier `dist/`

### Rapports de Couverture
```bash
npm run test:coverage
```

Génère des rapports en formats :
- **Text** : Dans le terminal
- **JSON** : Pour l'intégration CI/CD
- **HTML** : Rapport détaillé navigable

## Bonnes Pratiques

### 1. Nommage des Tests
- Utilisez des descriptions claires et descriptives
- Suivez le pattern "should + action + expected result"
- Groupez les tests par fonctionnalité avec `describe`

### 2. Assertions
- Utilisez les matchers Jest-DOM appropriés
- Préférez `toBeInTheDocument()` à `toBeTruthy()`
- Testez le comportement utilisateur, pas l'implémentation

### 3. Organisation
- Un fichier de test par composant/hook/service
- Placez les tests dans le même dossier que le code testé ou dans `src/tests/`
- Utilisez des données de test cohérentes

### 4. Performance
- Nettoyez les mocks entre les tests avec `vi.clearAllMocks()`
- Utilisez `beforeEach` et `afterEach` pour la configuration/nettoyage
- Évitez les tests trop longs ou complexes

## Débogage des Tests

### Mode Debug
```bash
# Exécuter un test spécifique
npx vitest run monTest.test.ts

# Mode debug avec logs
npx vitest run --reporter=verbose
```

### Interface Graphique
```bash
npm run test:ui
```

Lance une interface web pour visualiser et déboguer les tests.

## Intégration Continue

Les tests sont automatiquement exécutés dans le pipeline CI/CD :
- À chaque push sur `main` et `develop`
- À chaque pull request
- Avec génération automatique de la couverture de code

## Ressources Utiles

- [Documentation Vitest](https://vitest.dev/)
- [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest-DOM Matchers](https://github.com/testing-library/jest-dom)
- [Vitest UI](https://vitest.dev/guide/ui.html)
