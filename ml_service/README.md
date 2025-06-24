
# ML Service - EcoTrajet Predictions

Ce service fournit des prédictions ML pour l'application EcoTrajet via FastAPI.

## Structure du projet

```
ml_service/
├── notebooks/               # Jupyter notebooks pour le développement et l'analyse
│   ├── velib_analysis.ipynb
│   ├── carbon_modeling.ipynb
│   └── data_exploration.ipynb
├── api/                     # API FastAPI
│   ├── main.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── predictions.py
│   │   └── health.py
│   └── models/
│       ├── __init__.py
│       └── schemas.py
├── src/                     # Code source des prédictions
│   ├── __init__.py
│   ├── predict_availability.py
│   ├── analyze_trends.py
│   ├── calculate_carbon.py
│   └── utils/
│       ├── __init__.py
│       ├── data_loader.py
│       └── preprocessing.py
├── models/                  # Modèles ML sauvegardés
│   ├── velib_lstm_model.pkl
│   ├── trends_prophet_model.pkl
│   └── carbon_rf_model.pkl
├── data/                    # Données temporaires et cache
│   ├── raw/
│   ├── processed/
│   └── cache/
├── requirements.txt
└── docker-compose.yml
```

## Installation

```bash
cd ml_service
pip install -r requirements.txt
```

## Démarrage de l'API

```bash
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

## Fonctionnalités

1. **Prédiction disponibilité Vélib'** - LSTM pour prédire les vélos disponibles par heure
2. **Analyse des tendances** - Prophet pour l'évolution sur 7 jours
3. **Calcul empreinte carbone** - Random Forest pour les suggestions de trajets
