
# ML Service - EcoTrajet Predictions

Ce service fournit des prédictions ML pour l'application EcoTrajet via FastAPI.

## 🏗️ Architecture du Service

```
┌─────────────────────────────────────────────────────────────────────┐
│                           ML SERVICE ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   EcoTrajet     │    │   Jupyter       │    │   Scripts       │
│   Frontend      │    │   Notebooks     │    │   Training      │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ React App   │ │    │ │ Data        │ │    │ │ train_      │ │
│ │             │ │    │ │ Exploration │ │    │ │ models.py   │ │
│ │ HTTP Calls  │ │    │ │             │ │    │ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────┬───────┘    └─────────────────┘    └─────────┬───────┘
          │                                            │
          │ POST /api/v1/predict/*                     │ python scripts/
          │                                            │
┌─────────▼─────────────────────────────────────────────▼───────┐
│                    FASTAPI ML SERVICE                        │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   api/      │  │   src/      │  │      models/        │   │
│  │             │  │             │  │                     │   │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────────────┐ │   │
│  │ │ main.py │ │  │ │predict_ │ │  │ │ velib_lstm_     │ │   │
│  │ │         │ │  │ │availability│  │ │ model.h5        │ │   │
│  │ │routes/  │ │  │ │.py      │ │  │ │                 │ │   │
│  │ │- health │ │  │ │         │ │  │ │ trends_prophet_ │ │   │
│  │ │- predict│ │  │ │analyze_ │ │  │ │ model.pkl       │ │   │
│  │ │         │ │  │ │trends.py│ │  │ │                 │ │   │
│  │ │models/  │ │  │ │         │ │  │ │ carbon_rf_      │ │   │
│  │ │- schemas│ │  │ │calculate│ │  │ │ model.pkl       │ │   │
│  │ └─────────┘ │  │ │_carbon  │ │  │ │                 │ │   │
│  └─────────────┘  │ │.py      │ │  │ │ scalers/        │ │   │
│                   │ │         │ │  │ │ - velib_        │ │   │
│                   │ │utils/   │ │  │ │   scaler_x.pkl  │ │   │
│                   │ │- data_  │ │  │ │ - velib_        │ │   │
│                   │ │  loader │ │  │ │   scaler_y.pkl  │ │   │
│                   │ │- preproc│ │  │ └─────────────────┘ │   │
│                   │ │  essing │ │  └─────────────────────┘   │
│                   │ └─────────┘ │                           │
│                   └─────────────┘                           │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ HTTP Queries
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                     SUPABASE                               │
│                                                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ velib_      │  │ user_trips  │  │ transport_modes     │ │
│  │ stations    │  │             │  │                     │ │
│  │             │  │ ┌─────────┐ │  │ ┌─────────────────┐ │ │
│  │ velib_      │  │ │distance │ │  │ │ name            │ │ │
│  │ availability│  │ │co2_saved│ │  │ │ co2_factor      │ │ │
│  │ _history    │  │ │calories │ │  │ │ per_km          │ │ │
│  │             │  │ │transport│ │  │ └─────────────────┘ │ │
│  │ ┌─────────┐ │  │ │_mode_id │ │  └─────────────────────┘ │
│  │ │timestamp│ │  │ └─────────┘ │                         │
│  │ │station  │ │  └─────────────┘                         │
│  │ │_id      │ │                                          │
│  │ │bikes    │ │                                          │
│  │ │docks    │ │                                          │
│  │ └─────────┘ │                                          │
│  └─────────────┘                                          │
└────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    FLUX DE DONNÉES                         │
└─────────────────────────────────────────────────────────────┘

1. ENTRAÎNEMENT (scripts/train_models.py)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │  Supabase   │───▶│ Preprocessing│───▶│   Models    │
   │  Raw Data   │    │   & Feature   │    │  Training   │
   └─────────────┘    │  Engineering  │    └─────────────┘
                      └─────────────┘

2. PRÉDICTION (api/routes/predictions.py)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │ HTTP        │───▶│ Load Saved  │───▶│ Generate    │
   │ Request     │    │   Models    │    │ Predictions │
   └─────────────┘    └─────────────┘    └─────────────┘

3. MODÈLES ML
   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
   │ LSTM Vélib'     │  │ Prophet Trends  │  │ Random Forest   │
   │                 │  │                 │  │ Carbone         │
   │ • Prédiction    │  │ • Analyse       │  │ • Calcul        │
   │   disponibilité │  │   tendances     │  │   empreinte     │
   │   24h           │  │   7 jours       │  │   carbone       │
   │                 │  │                 │  │                 │
   │ Features:       │  │ Features:       │  │ Features:       │
   │ - Heure         │  │ - Taux          │  │ - Distance      │
   │ - Jour semaine  │  │   occupation    │  │ - Mode transport│
   │ - Historique    │  │ - Saisonnalité  │  │ - Historique    │
   └─────────────────┘  └─────────────────┘  └─────────────────┘
```

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
