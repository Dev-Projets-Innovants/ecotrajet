
"""
Module de chargement des données depuis Supabase
"""

import os
import pandas as pd
import asyncio
from datetime import datetime, timedelta
from typing import Optional, List
import httpx
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

class DataLoader:
    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_KEY')
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("SUPABASE_URL et SUPABASE_KEY doivent être définis dans .env")
        
        self.headers = {
            'apikey': self.supabase_key,
            'Authorization': f'Bearer {self.supabase_key}',
            'Content-Type': 'application/json'
        }
    
    async def load_velib_stations(self) -> pd.DataFrame:
        """Charger les stations Vélib' depuis Supabase"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.supabase_url}/rest/v1/velib_stations",
                    headers=self.headers
                )
                response.raise_for_status()
                data = response.json()
                return pd.DataFrame(data)
        except Exception as e:
            print(f"Erreur lors du chargement des stations: {e}")
            return pd.DataFrame()
    
    async def load_velib_availability_history(self, days_back: int = 30) -> pd.DataFrame:
        """Charger l'historique de disponibilité Vélib'"""
        try:
            cutoff_date = (datetime.now() - timedelta(days=days_back)).isoformat()
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.supabase_url}/rest/v1/velib_availability_history",
                    params={
                        'timestamp': f'gte.{cutoff_date}',
                        'order': 'timestamp.asc'
                    },
                    headers=self.headers
                )
                response.raise_for_status()
                data = response.json()
                
                df = pd.DataFrame(data)
                if not df.empty:
                    df['timestamp'] = pd.to_datetime(df['timestamp'])
                
                return df
        except Exception as e:
            print(f"Erreur lors du chargement de l'historique: {e}")
            return pd.DataFrame()
    
    async def load_transport_modes(self) -> pd.DataFrame:
        """Charger les modes de transport"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.supabase_url}/rest/v1/transport_modes",
                    headers=self.headers
                )
                response.raise_for_status()
                data = response.json()
                return pd.DataFrame(data)
        except Exception as e:
            print(f"Erreur lors du chargement des modes de transport: {e}")
            return pd.DataFrame()
    
    async def load_user_trips(self, limit: int = 1000) -> pd.DataFrame:
        """Charger les trajets utilisateurs"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.supabase_url}/rest/v1/user_trips",
                    params={
                        'limit': limit,
                        'order': 'created_at.desc'
                    },
                    headers=self.headers
                )
                response.raise_for_status()
                data = response.json()
                
                df = pd.DataFrame(data)
                if not df.empty:
                    df['created_at'] = pd.to_datetime(df['created_at'])
                    df['trip_date'] = pd.to_datetime(df['trip_date'])
                
                return df
        except Exception as e:
            print(f"Erreur lors du chargement des trajets: {e}")
            return pd.DataFrame()

# Instance globale
data_loader = DataLoader()

async def load_historical_velib_data(days_back: int = 60) -> pd.DataFrame:
    """Fonction utilitaire pour charger les données historiques Vélib'"""
    return await data_loader.load_velib_availability_history(days_back)
