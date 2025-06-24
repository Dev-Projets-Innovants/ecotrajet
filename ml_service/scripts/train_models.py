
"""
Scripts d'entraînement des modèles ML
"""

import asyncio
import pandas as pd
import numpy as np
from datetime import datetime
import joblib
import os
from pathlib import Path

# Imports pour les modèles ML
try:
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
    import tensorflow as tf
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import LSTM, Dense, Dropout
    from prophet import Prophet
except ImportError as e:
    print(f"Erreur d'import: {e}")
    print("Installer les dépendances avec: pip install -r requirements.txt")
    exit(1)

# Imports locaux
import sys
from pathlib import Path

# Ajouter le répertoire racine au path
root_dir = Path(__file__).parent.parent
sys.path.append(str(root_dir))

from src.utils.data_loader import data_loader, load_historical_velib_data
from src.utils.preprocessing import (
    preprocess_velib_data, 
    create_lstm_sequences, 
    preprocess_trends_data
)

# Configuration
MODELS_DIR = root_dir / "models"
MODELS_DIR.mkdir(exist_ok=True)

class ModelTrainer:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.metrics = {}
    
    async def train_velib_lstm(self, days_back=60):
        """Entraîner le modèle LSTM pour prédiction Vélib'"""
        print("=== ENTRAÎNEMENT MODÈLE LSTM VÉLIB' ===")
        
        # Charger les données historiques
        print("Chargement des données...")
        historical_data = await load_historical_velib_data(days_back=days_back)
        
        if historical_data.empty:
            print("Pas de données historiques disponibles")
            return False
        
        # Préprocessing
        print("Préprocessing des données...")
        X, y = preprocess_velib_data(historical_data)
        
        if len(X) == 0:
            print("Pas de données après préprocessing")
            return False
        
        # Normalisation
        scaler_X = StandardScaler()
        scaler_y = StandardScaler()
        
        X_scaled = scaler_X.fit_transform(X)
        y_scaled = scaler_y.fit_transform(y.reshape(-1, 1)).flatten()
        
        # Création des séquences LSTM
        sequence_length = 24  # 24 heures
        X_seq, y_seq = create_lstm_sequences(X_scaled, y_scaled, sequence_length)
        
        if len(X_seq) == 0:
            print("Pas assez de données pour créer des séquences")
            return False
        
        # Division train/test
        X_train, X_test, y_train, y_test = train_test_split(
            X_seq, y_seq, test_size=0.2, random_state=42
        )
        
        print(f"Données d'entraînement: {X_train.shape}")
        print(f"Données de test: {X_test.shape}")
        
        # Construction du modèle LSTM
        model = Sequential([
            LSTM(50, return_sequences=True, input_shape=(sequence_length, X.shape[1])),
            Dropout(0.2),
            LSTM(50, return_sequences=False),
            Dropout(0.2),
            Dense(25),
            Dense(1)
        ])
        
        model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        
        # Entraînement
        print("Entraînement en cours...")
        history = model.fit(
            X_train, y_train,
            batch_size=32,
            epochs=50,
            validation_data=(X_test, y_test),
            verbose=1
        )
        
        # Évaluation
        y_pred = model.predict(X_test)
        y_pred_original = scaler_y.inverse_transform(y_pred.reshape(-1, 1)).flatten()
        y_test_original = scaler_y.inverse_transform(y_test.reshape(-1, 1)).flatten()
        
        mae = mean_absolute_error(y_test_original, y_pred_original)
        rmse = np.sqrt(mean_squared_error(y_test_original, y_pred_original))
        r2 = r2_score(y_test_original, y_pred_original)
        
        print(f"MAE: {mae:.2f}")
        print(f"RMSE: {rmse:.2f}")
        print(f"R²: {r2:.3f}")
        
        # Sauvegarde
        model_path = MODELS_DIR / "velib_lstm_model.h5"
        scaler_x_path = MODELS_DIR / "velib_scaler_x.pkl"
        scaler_y_path = MODELS_DIR / "velib_scaler_y.pkl"
        
        model.save(model_path)
        joblib.dump(scaler_X, scaler_x_path)
        joblib.dump(scaler_y, scaler_y_path)
        
        self.models['velib_lstm'] = model
        self.scalers['velib_scaler_x'] = scaler_X
        self.scalers['velib_scaler_y'] = scaler_y
        self.metrics['velib_lstm'] = {'mae': mae, 'rmse': rmse, 'r2': r2}
        
        print(f"Modèle sauvegardé: {model_path}")
        return True
    
    async def train_trends_prophet(self, days_back=90):
        """Entraîner le modèle Prophet pour analyse des tendances"""
        print("=== ENTRAÎNEMENT MODÈLE PROPHET TENDANCES ===")
        
        # Charger les données
        historical_data = await load_historical_velib_data(days_back=days_back)
        
        if historical_data.empty:
            print("Pas de données disponibles")
            return False
        
        # Préprocessing pour Prophet
        prophet_data = preprocess_trends_data(historical_data)
        
        if prophet_data.empty:
            print("Pas de données après préprocessing")
            return False
        
        print(f"Données Prophet: {len(prophet_data)} jours")
        
        # Entraînement Prophet
        model = Prophet(
            daily_seasonality=True,
            weekly_seasonality=True,
            yearly_seasonality=True,
            changepoint_prior_scale=0.05
        )
        
        print("Entraînement Prophet...")
        model.fit(prophet_data)
        
        # Prédictions de test
        future = model.make_future_dataframe(periods=7)  # 7 jours dans le futur
        forecast = model.predict(future)
        
        # Évaluation sur les données existantes
        y_true = prophet_data['y'].values
        y_pred = forecast['yhat'][:len(y_true)].values
        
        mae = mean_absolute_error(y_true, y_pred)
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        r2 = r2_score(y_true, y_pred)
        
        print(f"MAE: {mae:.3f}")
        print(f"RMSE: {rmse:.3f}")
        print(f"R²: {r2:.3f}")
        
        # Sauvegarde
        model_path = MODELS_DIR / "trends_prophet_model.pkl"
        joblib.dump(model, model_path)
        
        self.models['trends_prophet'] = model
        self.metrics['trends_prophet'] = {'mae': mae, 'rmse': rmse, 'r2': r2}
        
        print(f"Modèle sauvegardé: {model_path}")
        return True
    
    async def train_carbon_rf(self):
        """Entraîner le modèle Random Forest pour calculs carbone"""
        print("=== ENTRAÎNEMENT MODÈLE RANDOM FOREST CARBONE ===")
        
        # Charger les données de trajets
        trips_data = await data_loader.load_user_trips(limit=10000)
        
        if trips_data.empty:
            print("Pas de données de trajets disponibles")
            return False
        
        # Création des features
        features = ['distance_km']
        if 'calories_burned' in trips_data.columns:
            features.append('calories_burned')
        
        # Ajouter des features dérivées
        trips_data['distance_squared'] = trips_data['distance_km'] ** 2
        trips_data['distance_log'] = np.log1p(trips_data['distance_km'])
        features.extend(['distance_squared', 'distance_log'])
        
        X = trips_data[features].fillna(0)
        y = trips_data['co2_saved_kg'].fillna(0)
        
        # Division train/test
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        print(f"Features: {features}")
        print(f"Données d'entraînement: {X_train.shape}")
        
        # Entraînement Random Forest
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        
        print("Entraînement Random Forest...")
        model.fit(X_train, y_train)
        
        # Évaluation
        y_pred = model.predict(X_test)
        
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        
        print(f"MAE: {mae:.4f}")
        print(f"RMSE: {rmse:.4f}")
        print(f"R²: {r2:.3f}")
        
        # Importance des features
        feature_importance = dict(zip(features, model.feature_importances_))
        print("Importance des features:")
        for feature, importance in sorted(feature_importance.items(), key=lambda x: x[1], reverse=True):
            print(f"  {feature}: {importance:.3f}")
        
        # Sauvegarde
        model_path = MODELS_DIR / "carbon_rf_model.pkl"
        joblib.dump(model, model_path)
        
        self.models['carbon_rf'] = model
        self.metrics['carbon_rf'] = {'mae': mae, 'rmse': rmse, 'r2': r2}
        
        print(f"Modèle sauvegardé: {model_path}")
        return True
    
    def save_training_report(self):
        """Sauvegarder un rapport d'entraînement"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'models_trained': list(self.models.keys()),
            'metrics': self.metrics
        }
        
        report_path = MODELS_DIR / f"training_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        import json
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"Rapport sauvegardé: {report_path}")

async def main():
    """Fonction principale d'entraînement"""
    trainer = ModelTrainer()
    
    print("DÉMARRAGE DE L'ENTRAÎNEMENT DES MODÈLES ML")
    print("=" * 50)
    
    # Entraîner tous les modèles
    success_count = 0
    
    # 1. LSTM Vélib'
    if await trainer.train_velib_lstm():
        success_count += 1
    
    print("\n" + "=" * 50 + "\n")
    
    # 2. Prophet Tendances
    if await trainer.train_trends_prophet():
        success_count += 1
    
    print("\n" + "=" * 50 + "\n")
    
    # 3. Random Forest Carbone
    if await trainer.train_carbon_rf():
        success_count += 1
    
    # Rapport final
    print("\n" + "=" * 50)
    print("RÉSUMÉ DE L'ENTRAÎNEMENT")
    print("=" * 50)
    print(f"Modèles entraînés avec succès: {success_count}/3")
    
    if success_count > 0:
        trainer.save_training_report()
        print("\nTous les modèles sont prêts pour la production!")
    else:
        print("\nAucun modèle n'a pu être entraîné. Vérifier les données.")

if __name__ == "__main__":
    asyncio.run(main())
