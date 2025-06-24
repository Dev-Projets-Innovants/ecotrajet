
# 🚀 Setup Local - Service ML EcoTrajet

Guide complet pour installer et lancer le service de Machine Learning en local.

## 📋 Prérequis

- Python 3.9+
- pip ou conda
- Accès à la base de données Supabase (credentials configurés)

## 🔧 Installation

### 1. Navigation et installation des dépendances
```bash
cd ml_service
pip install -r requirements.txt
```

### 2. Configuration de l'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env avec vos credentials Supabase
# SUPABASE_URL=https://knebskomwvvvoaclrwjv.supabase.co
# SUPABASE_KEY=your_anon_key_here
```

## 🎯 Ordre d'exécution OBLIGATOIRE

### Étape 1 : Entraînement des modèles (PREMIÈRE FOIS)
```bash
python scripts/train_models.py
```
**⚠️ IMPORTANT :** Cette étape est **OBLIGATOIRE** avant de lancer l'API car les modèles n'existent pas encore !

**Ce script va :**
- Charger les données historiques depuis Supabase
- Entraîner le modèle LSTM pour les prédictions Vélib'
- Entraîner le modèle Prophet pour l'analyse des tendances
- Entraîner le modèle Random Forest pour les calculs carbone
- Sauvegarder tous les modèles dans `/models/`

### Étape 2 : Évaluation des modèles (OPTIONNEL)
```bash
python scripts/evaluate_models.py
```
Génère des rapports de performance et des métriques.

### Étape 3 : Lancement de l'API
```bash
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

**API disponible sur :** http://localhost:8000

## 🧪 Test de l'API

### Endpoints disponibles :
- **Health check :** `GET http://localhost:8000/health`
- **Prédictions Vélib' :** `POST http://localhost:8000/api/v1/predict/velib-availability`
- **Analyse tendances :** `POST http://localhost:8000/api/v1/analyze/trends`
- **Calcul carbone :** `POST http://localhost:8000/api/v1/calculate/carbon-footprint`

### Test rapide :
```bash
curl http://localhost:8000/health
```

## 📊 Développement avec Jupyter

### Lancer Jupyter pour analyser les données :
```bash
jupyter notebook --ip=0.0.0.0 --port=8888 --no-browser
```

**Notebooks disponibles :**
- `notebooks/data_exploration.ipynb` - Exploration des données
- `notebooks/velib_analysis.ipynb` - Analyse spécifique Vélib'
- `notebooks/carbon_modeling.ipynb` - Modélisation carbone

## 🐳 Alternative : Docker

Si vous préférez utiliser Docker :

```bash
# Lancer tout avec Docker Compose
docker-compose up --build

# Ou séparément :
# API ML sur port 8000
docker-compose up ml-api

# Jupyter sur port 8888  
docker-compose up jupyter
```

## 🔄 Workflow de développement

### Première installation :
1. `pip install -r requirements.txt`
2. Configurer `.env`
3. **`python scripts/train_models.py`** (OBLIGATOIRE)
4. `uvicorn api.main:app --reload`

### Développement quotidien :
1. `uvicorn api.main:app --reload` (si les modèles existent déjà)
2. Modifier le code
3. Tester l'API

### Re-entraînement (si nouvelles données) :
1. `python scripts/train_models.py`
2. `python scripts/evaluate_models.py` (optionnel)
3. Redémarrer l'API

## 📁 Structure des fichiers générés

Après l'entraînement, vous aurez :
```
models/
├── velib_lstm_model.h5           # Modèle LSTM Vélib'
├── velib_scaler_x.pkl            # Scaler features
├── velib_scaler_y.pkl            # Scaler targets  
├── trends_prophet_model.pkl      # Modèle Prophet
├── carbon_rf_model.pkl           # Modèle Random Forest
└── training_report_*.json        # Rapports d'entraînement
```

## ⚠️ Troubleshooting

### Erreur "Modèle non trouvé" :
→ Vous devez d'abord exécuter `python scripts/train_models.py`

### Erreur de connexion Supabase :
→ Vérifiez votre fichier `.env` avec les bons credentials

### Erreur de dépendances :
→ `pip install -r requirements.txt --upgrade`

### L'API ne démarre pas :
→ Vérifiez que le port 8000 est libre : `lsof -i :8000`

---

**🎉 Une fois l'API lancée, elle sera prête à recevoir les requêtes depuis l'application principale EcoTrajet !**
