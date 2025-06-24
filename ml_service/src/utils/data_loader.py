
"""
Chargement des données depuis Supabase pour l'entraînement des modèles ML
"""

import asyncio
import pandas as pd
from typing import List, Dict, Optional
import httpx
from datetime import datetime, timedelta

# Configuration Supabase
SUPABASE_URL = "https://knebskomwvvvoaclrwjv.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZWJza29td3Z2dm9hY2xyd2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MzkzMDMsImV4cCI6MjA2NTIxNTMwM30.45ggA2kNYAVa9_bRqL2ihaan1oqx55HyYlYLv_zxsa8"

class SupabaseDataLoader:
    def __init__(self):
        self.base_url = f"{SUPABASE_URL}/rest/v1"
        self.headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json"
        }

    async def _make_request(self, endpoint: str, params: Dict = None) -> Dict:
        """Effectue une requête vers l'API Supabase"""
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}/{endpoint}"
            response = await client.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()

    async def load_velib_stations(self) -> pd.DataFrame:
        """Charge toutes les stations Vélib'"""
        try:
            data = await self._make_request("velib_stations", {"select": "*"})
            df = pd.DataFrame(data)
            print(f"Chargé {len(df)} stations Vélib'")
            return df
        except Exception as e:
            print(f"Erreur lors du chargement des stations: {e}")
            return pd.DataFrame()

    async def load_velib_availability_history(self, 
                                            station_codes: Optional[List[str]] = None,
                                            days_back: int = 30) -> pd.DataFrame:
        """
        Charge l'historique de disponibilité Vélib'
        
        Args:
            station_codes: Liste des codes de stations (None = toutes)
            days_back: Nombre de jours d'historique à charger
        """
        try:
            # Calculer la date de début
            start_date = (datetime.now() - timedelta(days=days_back)).isoformat()
            
            params = {
                "select": "*",
                "timestamp": f"gte.{start_date}",
                "order": "timestamp.asc"
            }
            
            # Filtrer par stations si spécifié
            if station_codes:
                station_filter = ",".join(station_codes)
                params["stationcode"] = f"in.({station_filter})"
            
            data = await self._make_request("velib_availability_history", params)
            df = pd.DataFrame(data)
            
            if not df.empty:
                df['timestamp'] = pd.to_datetime(df['timestamp'])
                df = df.sort_values('timestamp')
            
            print(f"Chargé {len(df)} enregistrements d'historique Vélib'")
            return df
        except Exception as e:
            print(f"Erreur lors du chargement de l'historique: {e}")
            return pd.DataFrame()

    async def load_transport_modes(self) -> pd.DataFrame:
        """Charge les modes de transport et leurs facteurs CO2"""
        try:
            data = await self._make_request("transport_modes", {"select": "*"})
            df = pd.DataFrame(data)
            print(f"Chargé {len(df)} modes de transport")
            return df
        except Exception as e:
            print(f"Erreur lors du chargement des modes de transport: {e}")
            return pd.DataFrame()

    async def load_user_trips(self, limit: int = 10000) -> pd.DataFrame:
        """Charge les trajets utilisateurs pour l'analyse des patterns"""
        try:
            params = {
                "select": "*, transport_modes(name, co2_factor_per_km)",
                "limit": limit,
                "order": "created_at.desc"
            }
            
            data = await self._make_request("user_trips", params)
            df = pd.DataFrame(data)
            
            if not df.empty:
                df['trip_date'] = pd.to_datetime(df['trip_date'])
                df['created_at'] = pd.to_datetime(df['created_at'])
            
            print(f"Chargé {len(df)} trajets utilisateurs")
            return df
        except Exception as e:
            print(f"Erreur lors du chargement des trajets: {e}")
            return pd.DataFrame()

# Instance globale du loader
data_loader = SupabaseDataLoader()

# Fonctions utilitaires pour les modèles
async def load_velib_data(station_ids: Optional[List[int]] = None) -> List[Dict]:
    """
    Charge les données Vélib' pour les prédictions
    Retourne une liste de stations avec leurs informations
    """
    try:
        stations_df = await data_loader.load_velib_stations()
        
        if station_ids:
            # Filtrer par les IDs demandés (conversion en stationcode)
            stations_df = stations_df[stations_df['stationcode'].isin([str(sid) for sid in station_ids])]
        
        # Convertir en format attendu par les modèles
        stations_data = []
        for _, station in stations_df.iterrows():
            stations_data.append({
                "station_id": int(station['stationcode']) if station['stationcode'].isdigit() else 0,
                "name": station['name'],
                "capacity": station['capacity'],
                "lat": float(station['coordonnees_geo_lat']),
                "lng": float(station['coordonnees_geo_lon']),
                "arrondissement": station['nom_arrondissement_communes']
            })
        
        return stations_data
    except Exception as e:
        print(f"Erreur load_velib_data: {e}")
        return []

async def load_historical_velib_data(days_back: int = 30) -> pd.DataFrame:
    """
    Charge les données historiques Vélib' pour l'analyse des tendances
    """
    try:
        # Charger l'historique complet
        history_df = await data_loader.load_velib_availability_history(days_back=days_back)
        
        if history_df.empty:
            print("Aucune donnée historique trouvée")
            return pd.DataFrame()
        
        # Joindre avec les informations des stations
        stations_df = await data_loader.load_velib_stations()
        
        # Merge sur stationcode
        merged_df = history_df.merge(
            stations_df[['stationcode', 'name', 'capacity', 'nom_arrondissement_communes']], 
            on='stationcode', 
            how='left'
        )
        
        return merged_df
    except Exception as e:
        print(f"Erreur load_historical_velib_data: {e}")
        return pd.DataFrame()

async def load_carbon_calculation_data() -> Dict:
    """
    Charge les données nécessaires pour les calculs d'empreinte carbone
    """
    try:
        # Charger les modes de transport
        transport_modes_df = await data_loader.load_transport_modes()
        
        # Charger quelques trajets récents pour les statistiques
        recent_trips_df = await data_loader.load_user_trips(limit=1000)
        
        return {
            "transport_modes": transport_modes_df.to_dict('records'),
            "recent_trips_stats": {
                "total_trips": len(recent_trips_df),
                "avg_distance": recent_trips_df['distance_km'].mean() if not recent_trips_df.empty else 0,
                "avg_co2_saved": recent_trips_df['co2_saved_kg'].mean() if not recent_trips_df.empty else 0
            }
        }
    except Exception as e:
        print(f"Erreur load_carbon_calculation_data: {e}")
        return {"transport_modes": [], "recent_trips_stats": {}}
