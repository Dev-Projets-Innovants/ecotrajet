
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# === VELIB AVAILABILITY PREDICTION ===

class VelibAvailabilityRequest(BaseModel):
    station_ids: Optional[List[int]] = Field(None, description="IDs des stations (si None, toutes les stations)")
    hours_ahead: int = Field(24, description="Nombre d'heures à prédire", ge=1, le=168)
    include_confidence: bool = Field(True, description="Inclure les intervalles de confiance")

class VelibHourlyPrediction(BaseModel):
    hour: int
    predicted_bikes: int
    predicted_docks: int
    confidence_bikes: Optional[float] = None
    confidence_docks: Optional[float] = None
    risk_level: str  # "low", "medium", "high"

class VelibStationPrediction(BaseModel):
    station_id: int
    station_name: str
    predictions: List[VelibHourlyPrediction]
    recommendations: List[str]

class VelibAvailabilityResponse(BaseModel):
    stations: List[VelibStationPrediction]
    global_metrics: Dict[str, Any]
    prediction_accuracy: float
    generated_at: datetime

# === TRENDS ANALYSIS ===

class TrendsAnalysisRequest(BaseModel):
    days_back: int = Field(30, description="Nombre de jours d'historique à analyser", ge=7, le=90)
    include_forecasting: bool = Field(True, description="Inclure les prévisions futures")

class DailyTrend(BaseModel):
    date: str
    occupation_rate: float
    peak_hours: List[int]
    critical_stations: List[int]
    total_trips: int

class TrendsAnalysisResponse(BaseModel):
    daily_trends: List[DailyTrend]
    weekly_patterns: Dict[str, Any]
    seasonal_insights: Dict[str, Any]
    forecasting: Optional[Dict[str, Any]] = None
    generated_at: datetime

# === CARBON FOOTPRINT CALCULATION ===

class CarbonCalculationRequest(BaseModel):
    origin_lat: float = Field(..., description="Latitude du point de départ")
    origin_lng: float = Field(..., description="Longitude du point de départ")
    destination_lat: float = Field(..., description="Latitude de destination")
    destination_lng: float = Field(..., description="Longitude de destination")
    user_preferences: Optional[Dict[str, Any]] = Field(None, description="Préférences utilisateur")

class TransportOption(BaseModel):
    mode: str
    distance_km: float
    duration_minutes: int
    co2_kg: float
    calories_burned: int
    cost_euros: float
    eco_score: int  # 0-100
    route_details: Dict[str, Any]

class CarbonCalculationResponse(BaseModel):
    origin: Dict[str, float]
    destination: Dict[str, float]
    transport_options: List[TransportOption]
    best_eco_option: TransportOption
    carbon_savings: Dict[str, float]
    recommendations: List[str]
    generated_at: datetime
