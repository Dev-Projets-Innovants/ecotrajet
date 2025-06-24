
"""
Scripts d'évaluation et de test des modèles ML
"""

import asyncio
import pandas as pd
import numpy as np
import joblib
import json
from datetime import datetime, timedelta
from pathlib import Path
import matplotlib.pyplot as plt

# Imports ML
try:
    import tensorflow as tf
    from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
    from prophet import Prophet
except ImportError as e:
    print(f"Erreur d'import: {e}")
    exit(1)

# Imports locaux
import sys
sys.path.append('../')
from src.utils.data_loader import data_loader, load_historical_velib_data
from src.utils.preprocessing import preprocess_velib_data, create_lstm_sequences

MODELS_DIR = Path("../models")

class ModelEvaluator:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.evaluation_results = {}
    
    def load_models(self):
        """Charger tous les modèles sauvegardés"""
        try:
            # LSTM Vélib'
            lstm_path = MODELS_DIR / "velib_lstm_model.h5"
            if lstm_path.exists():
                self.models['velib_lstm'] = tf.keras.models.load_model(lstm_path)
                self.scalers['velib_scaler_x'] = joblib.load(MODELS_DIR / "velib_scaler_x.pkl")
                self.scalers['velib_scaler_y'] = joblib.load(MODELS_DIR / "velib_scaler_y.pkl")
                print("✓ Modèle LSTM Vélib' chargé")
            
            # Prophet Tendances
            prophet_path = MODELS_DIR / "trends_prophet_model.pkl"
            if prophet_path.exists():
                self.models['trends_prophet'] = joblib.load(prophet_path)
                print("✓ Modèle Prophet Tendances chargé")
            
            # Random Forest Carbone
            rf_path = MODELS_DIR / "carbon_rf_model.pkl"
            if rf_path.exists():
                self.models['carbon_rf'] = joblib.load(rf_path)
                print("✓ Modèle Random Forest Carbone chargé")
            
            return len(self.models) > 0
        except Exception as e:
            print(f"Erreur lors du chargement des modèles: {e}")
            return False
    
    async def evaluate_velib_lstm(self, test_days=7):
        """Évaluer le modèle LSTM sur données récentes"""
        if 'velib_lstm' not in self.models:
            print("Modèle LSTM non disponible")
            return
        
        print("=== ÉVALUATION MODÈLE LSTM VÉLIB' ===")
        
        # Charger données récentes
        historical_data = await load_historical_velib_data(days_back=test_days + 30)
        
        if historical_data.empty:
            print("Pas de données de test")
            return
        
        # Préprocessing
        X, y = preprocess_velib_data(historical_data)
        
        if len(X) == 0:
            return
        
        # Normalisation avec les scalers d'entraînement
        X_scaled = self.scalers['velib_scaler_x'].transform(X)
        y_scaled = self.scalers['velib_scaler_y'].transform(y.reshape(-1, 1)).flatten()
        
        # Séquences
        X_seq, y_seq = create_lstm_sequences(X_scaled, y_scaled, sequence_length=24)
        
        if len(X_seq) == 0:
            return
        
        # Prédictions
        y_pred_scaled = self.models['velib_lstm'].predict(X_seq)
        y_pred = self.scalers['velib_scaler_y'].inverse_transform(y_pred_scaled.reshape(-1, 1)).flatten()
        y_true = self.scalers['velib_scaler_y'].inverse_transform(y_seq.reshape(-1, 1)).flatten()
        
        # Métriques
        mae = mean_absolute_error(y_true, y_pred)
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        r2 = r2_score(y_true, y_pred)
        mape = np.mean(np.abs((y_true - y_pred) / np.maximum(y_true, 1))) * 100
        
        self.evaluation_results['velib_lstm'] = {
            'mae': float(mae),
            'rmse': float(rmse),
            'r2': float(r2),
            'mape': float(mape),
            'test_samples': len(y_true)
        }
        
        print(f"MAE: {mae:.2f} vélos")
        print(f"RMSE: {rmse:.2f} vélos")
        print(f"R²: {r2:.3f}")
        print(f"MAPE: {mape:.1f}%")
        print(f"Échantillons de test: {len(y_true)}")
        
        # Graphique de prédiction vs réalité
        plt.figure(figsize=(12, 6))
        sample_size = min(100, len(y_true))
        indices = np.random.choice(len(y_true), sample_size, replace=False)
        
        plt.scatter(y_true[indices], y_pred[indices], alpha=0.6)
        plt.plot([y_true.min(), y_true.max()], [y_true.min(), y_true.max()], 'r--', lw=2)
        plt.xlabel('Vélos disponibles (réel)')
        plt.ylabel('Vélos disponibles (prédit)')
        plt.title('LSTM Vélib\' - Prédictions vs Réalité')
        plt.grid(True)
        
        # Sauvegarder le graphique
        plot_path = MODELS_DIR / f"lstm_evaluation_{datetime.now().strftime('%Y%m%d')}.png"
        plt.savefig(plot_path, dpi=300, bbox_inches='tight')
        plt.show()
        
        print(f"Graphique sauvegardé: {plot_path}")
    
    async def evaluate_trends_prophet(self):
        """Évaluer le modèle Prophet"""
        if 'trends_prophet' not in self.models:
            print("Modèle Prophet non disponible")
            return
        
        print("=== ÉVALUATION MODÈLE PROPHET TENDANCES ===")
        
        # Charger données récentes
        historical_data = await load_historical_velib_data(days_back=14)
        
        # Test de prédiction future
        future = self.models['trends_prophet'].make_future_dataframe(periods=7)
        forecast = self.models['trends_prophet'].predict(future)
        
        # Métriques sur les derniers jours disponibles
        if not historical_data.empty:
            # Agrégation quotidienne simplifiée pour comparaison
            daily_stats = historical_data.groupby(historical_data['timestamp'].dt.date).agg({
                'numbikesavailable': 'mean'
            }).reset_index()
            
            if len(daily_stats) > 0:
                recent_forecast = forecast.tail(len(daily_stats))
                y_true = daily_stats['numbikesavailable'].values
                y_pred = recent_forecast['yhat'].values[-len(y_true):]
                
                mae = mean_absolute_error(y_true, y_pred)
                rmse = np.sqrt(mean_squared_error(y_true, y_pred))
                
                self.evaluation_results['trends_prophet'] = {
                    'mae': float(mae),
                    'rmse': float(rmse),
                    'forecast_days': 7,
                    'test_samples': len(y_true)
                }
                
                print(f"MAE: {mae:.3f}")
                print(f"RMSE: {rmse:.3f}")
                print(f"Prévisions générées: 7 jours")
        
        # Graphique des prédictions
        fig, ax = plt.subplots(figsize=(12, 6))
        self.models['trends_prophet'].plot(forecast, ax=ax)
        plt.title('Prophet - Prédictions des tendances Vélib\'')
        plt.xlabel('Date')
        plt.ylabel('Taux d\'occupation moyen')
        
        plot_path = MODELS_DIR / f"prophet_evaluation_{datetime.now().strftime('%Y%m%d')}.png"
        plt.savefig(plot_path, dpi=300, bbox_inches='tight')
        plt.show()
        
        print(f"Graphique sauvegardé: {plot_path}")
    
    async def evaluate_carbon_rf(self):
        """Évaluer le modèle Random Forest"""
        if 'carbon_rf' not in self.models:
            print("Modèle Random Forest non disponible")
            return
        
        print("=== ÉVALUATION MODÈLE RANDOM FOREST CARBONE ===")
        
        # Charger données de test
        trips_data = await data_loader.load_user_trips(limit=1000)
        
        if trips_data.empty:
            print("Pas de données de trajets pour l'évaluation")
            return
        
        # Features utilisées lors de l'entraînement
        features = ['distance_km', 'distance_squared', 'distance_log']
        
        # Préparer les données
        trips_data['distance_squared'] = trips_data['distance_km'] ** 2
        trips_data['distance_log'] = np.log1p(trips_data['distance_km'])
        
        X = trips_data[features].fillna(0)
        y = trips_data['co2_saved_kg'].fillna(0)
        
        # Prédictions
        y_pred = self.models['carbon_rf'].predict(X)
        
        # Métriques
        mae = mean_absolute_error(y, y_pred)
        rmse = np.sqrt(mean_squared_error(y, y_pred))
        r2 = r2_score(y, y_pred)
        
        self.evaluation_results['carbon_rf'] = {
            'mae': float(mae),
            'rmse': float(rmse),
            'r2': float(r2),
            'test_samples': len(y)
        }
        
        print(f"MAE: {mae:.4f} kg CO2")
        print(f"RMSE: {rmse:.4f} kg CO2")
        print(f"R²: {r2:.3f}")
        print(f"Échantillons de test: {len(y)}")
        
        # Graphique
        plt.figure(figsize=(10, 6))
        plt.scatter(y, y_pred, alpha=0.6)
        plt.plot([y.min(), y.max()], [y.min(), y.max()], 'r--', lw=2)
        plt.xlabel('CO2 économisé réel (kg)')
        plt.ylabel('CO2 économisé prédit (kg)')
        plt.title('Random Forest - Prédictions CO2')
        plt.grid(True)
        
        plot_path = MODELS_DIR / f"rf_evaluation_{datetime.now().strftime('%Y%m%d')}.png"
        plt.savefig(plot_path, dpi=300, bbox_inches='tight')
        plt.show()
        
        print(f"Graphique sauvegardé: {plot_path}")
    
    def generate_evaluation_report(self):
        """Générer un rapport d'évaluation complet"""
        report = {
            'evaluation_date': datetime.now().isoformat(),
            'models_evaluated': list(self.evaluation_results.keys()),
            'results': self.evaluation_results,
            'summary': {
                'total_models': len(self.models),
                'evaluated_models': len(self.evaluation_results)
            }
        }
        
        report_path = MODELS_DIR / f"evaluation_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\nRapport d'évaluation sauvegardé: {report_path}")
        
        # Affichage résumé
        print("\n" + "=" * 50)
        print("RÉSUMÉ DE L'ÉVALUATION")
        print("=" * 50)
        
        for model_name, results in self.evaluation_results.items():
            print(f"\n{model_name.upper()}:")
            for metric, value in results.items():
                print(f"  {metric}: {value}")

async def main():
    """Fonction principale d'évaluation"""
    evaluator = ModelEvaluator()
    
    print("ÉVALUATION DES MODÈLES ML")
    print("=" * 50)
    
    # Charger les modèles
    if not evaluator.load_models():
        print("Aucun modèle trouvé. Exécuter d'abord train_models.py")
        return
    
    print(f"\nModèles chargés: {len(evaluator.models)}")
    print("=" * 50)
    
    # Évaluer chaque modèle
    if 'velib_lstm' in evaluator.models:
        await evaluator.evaluate_velib_lstm()
        print("\n" + "=" * 50 + "\n")
    
    if 'trends_prophet' in evaluator.models:
        await evaluator.evaluate_trends_prophet()
        print("\n" + "=" * 50 + "\n")
    
    if 'carbon_rf' in evaluator.models:
        await evaluator.evaluate_carbon_rf()
        print("\n" + "=" * 50 + "\n")
    
    # Rapport final
    evaluator.generate_evaluation_report()

if __name__ == "__main__":
    asyncio.run(main())
