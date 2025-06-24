
"""
Préprocessing des données pour les modèles ML
"""

import pandas as pd
import numpy as np
from typing import Tuple, List, Dict
from sklearn.preprocessing import StandardScaler, LabelEncoder
from datetime import datetime

def preprocess_velib_data(df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
    """
    Préprocessing pour les données Vélib' (LSTM)
    
    Args:
        df: DataFrame avec colonnes timestamp, stationcode, numbikesavailable, etc.
    
    Returns:
        X: Features preprocessées
        y: Target (disponibilité des vélos)
    """
    if df.empty:
        return np.array([]), np.array([])
    
    # Création des features temporelles
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    df['month'] = df['timestamp'].dt.month
    df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
    
    # Features cycliques pour capturer la périodicité
    df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
    df['dow_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
    df['dow_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7)
    
    # Calcul du taux d'occupation
    df['occupation_rate'] = df['numbikesavailable'] / (df['numbikesavailable'] + df['numdocksavailable'])
    df['occupation_rate'] = df['occupation_rate'].fillna(0)
    
    # Features pour les différents types de vélos
    df['ebike_ratio'] = df['ebike'] / df['numbikesavailable'].replace(0, 1)
    df['mechanical_ratio'] = df['mechanical'] / df['numbikesavailable'].replace(0, 1)
    
    # Sélection des features
    feature_columns = [
        'hour_sin', 'hour_cos', 'dow_sin', 'dow_cos',
        'month', 'is_weekend', 'occupation_rate',
        'ebike_ratio', 'mechanical_ratio',
        'capacity'
    ]
    
    # Gestion des valeurs manquantes
    for col in feature_columns:
        if col in df.columns:
            df[col] = df[col].fillna(df[col].median())
    
    X = df[feature_columns].values
    y = df['numbikesavailable'].values
    
    return X, y

def create_lstm_sequences(X: np.ndarray, y: np.ndarray, sequence_length: int = 24) -> Tuple[np.ndarray, np.ndarray]:
    """
    Création de séquences temporelles pour LSTM
    
    Args:
        X: Features
        y: Target
        sequence_length: Longueur des séquences (24h par défaut)
    
    Returns:
        X_seq: Séquences de features
        y_seq: Targets correspondants
    """
    if len(X) < sequence_length:
        return np.array([]), np.array([])
    
    X_seq, y_seq = [], []
    
    for i in range(sequence_length, len(X)):
        X_seq.append(X[i-sequence_length:i])
        y_seq.append(y[i])
    
    return np.array(X_seq), np.array(y_seq)

def preprocess_trends_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Préprocessing pour l'analyse des tendances (Prophet)
    
    Args:
        df: DataFrame avec timestamp et métriques d'occupation
    
    Returns:
        DataFrame formaté pour Prophet (ds, y)
    """
    if df.empty:
        return pd.DataFrame()
    
    # Agrégation quotidienne
    daily_stats = df.groupby(df['timestamp'].dt.date).agg({
        'numbikesavailable': 'mean',
        'numdocksavailable': 'mean',
        'capacity': 'first'
    }).reset_index()
    
    # Calcul du taux d'occupation moyen par jour
    daily_stats['occupation_rate'] = (
        daily_stats['numbikesavailable'] / 
        (daily_stats['numbikesavailable'] + daily_stats['numdocksavailable'])
    )
    
    # Format Prophet
    prophet_df = pd.DataFrame({
        'ds': pd.to_datetime(daily_stats['timestamp']),
        'y': daily_stats['occupation_rate']
    })
    
    return prophet_df

def preprocess_carbon_data(transport_modes: List[Dict]) -> Dict:
    """
    Préprocessing pour les calculs d'empreinte carbone
    
    Args:
        transport_modes: Liste des modes de transport avec facteurs CO2
    
    Returns:
        Dictionnaire avec facteurs CO2 indexés par mode
    """
    co2_factors = {}
    
    for mode in transport_modes:
        mode_name = mode.get('name', '').lower()
        co2_factor = float(mode.get('co2_factor_per_km', 0))
        
        # Mapping des noms de modes
        if 'velo' in mode_name or 'bike' in mode_name:
            co2_factors['bike'] = co2_factor
        elif 'metro' in mode_name or 'subway' in mode_name:
            co2_factors['metro'] = co2_factor
        elif 'bus' in mode_name:
            co2_factors['bus'] = co2_factor
        elif 'voiture' in mode_name or 'car' in mode_name:
            co2_factors['car'] = co2_factor
        elif 'marche' in mode_name or 'walk' in mode_name:
            co2_factors['walk'] = co2_factor
        
        # Ajouter aussi le nom exact
        co2_factors[mode_name] = co2_factor
    
    # Valeurs par défaut si pas trouvées
    default_factors = {
        'walk': 0.0,
        'bike': 0.0,
        'metro': 0.05,
        'bus': 0.08,
        'car': 0.195,
        'ebike': 0.01
    }
    
    for mode, factor in default_factors.items():
        if mode not in co2_factors:
            co2_factors[mode] = factor
    
    return co2_factors

def calculate_distance_haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calcule la distance haversine entre deux points géographiques
    
    Returns:
        Distance en kilomètres
    """
    R = 6371  # Rayon de la Terre en km
    
    dlat = np.radians(lat2 - lat1)
    dlon = np.radians(lon2 - lon1)
    
    a = (np.sin(dlat/2)**2 + 
         np.cos(np.radians(lat1)) * np.cos(np.radians(lat2)) * np.sin(dlon/2)**2)
    
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1-a))
    distance = R * c
    
    return distance
