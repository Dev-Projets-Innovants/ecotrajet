
"""
Module de préprocessing des données pour les modèles ML
"""

import pandas as pd
import numpy as np
from typing import Tuple, Optional
from sklearn.preprocessing import StandardScaler
import math

def calculate_distance_haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculer la distance entre deux points GPS en utilisant la formule de Haversine
    """
    R = 6371  # Rayon de la Terre en km
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = (math.sin(delta_lat / 2) ** 2 + 
         math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def preprocess_velib_data(df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
    """
    Préprocesser les données Vélib' pour l'entraînement LSTM
    """
    if df.empty:
        return np.array([]), np.array([])
    
    # Créer des features temporelles
    df = df.copy()
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    df['month'] = df['timestamp'].dt.month
    
    # Features cycliques pour capturer la périodicité
    df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
    df['dow_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
    df['dow_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7)
    
    # Sélectionner les features
    feature_columns = [
        'hour_sin', 'hour_cos', 'dow_sin', 'dow_cos',
        'mechanical', 'ebike', 'numdocksavailable'
    ]
    
    # Vérifier que toutes les colonnes existent
    available_columns = [col for col in feature_columns if col in df.columns]
    if not available_columns:
        return np.array([]), np.array([])
    
    X = df[available_columns].fillna(0).values
    y = df['numbikesavailable'].fillna(0).values
    
    return X, y

def create_lstm_sequences(X: np.ndarray, y: np.ndarray, sequence_length: int = 24) -> Tuple[np.ndarray, np.ndarray]:
    """
    Créer des séquences pour l'entraînement LSTM
    """
    if len(X) < sequence_length:
        return np.array([]), np.array([])
    
    X_seq, y_seq = [], []
    
    for i in range(len(X) - sequence_length):
        X_seq.append(X[i:(i + sequence_length)])
        y_seq.append(y[i + sequence_length])
    
    return np.array(X_seq), np.array(y_seq)

def preprocess_trends_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Préprocesser les données pour Prophet (analyse des tendances)
    """
    if df.empty:
        return pd.DataFrame()
    
    # Agrégation quotidienne
    daily_data = df.groupby(df['timestamp'].dt.date).agg({
        'numbikesavailable': 'mean',
        'numdocksavailable': 'mean'
    }).reset_index()
    
    # Calculer le taux d'occupation
    daily_data['occupation_rate'] = (
        daily_data['numbikesavailable'] / 
        (daily_data['numbikesavailable'] + daily_data['numdocksavailable'])
    )
    
    # Format Prophet (ds = date, y = valeur à prédire)
    prophet_data = pd.DataFrame({
        'ds': pd.to_datetime(daily_data['timestamp']),
        'y': daily_data['occupation_rate'].fillna(0.5)
    })
    
    return prophet_data

def preprocess_carbon_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Préprocesser les données pour les calculs carbone
    """
    if df.empty:
        return pd.DataFrame()
    
    # Nettoyer les données
    df = df.copy()
    df = df.dropna(subset=['distance_km', 'co2_saved_kg'])
    
    # Supprimer les valeurs aberrantes
    df = df[df['distance_km'] > 0]
    df = df[df['distance_km'] < 100]  # Trajets < 100km
    
    return df
