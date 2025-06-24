
from fastapi import APIRouter, HTTPException
from api.models.schemas import (
    VelibAvailabilityRequest, VelibAvailabilityResponse,
    TrendsAnalysisRequest, TrendsAnalysisResponse,
    CarbonCalculationRequest, CarbonCalculationResponse
)
from src.predict_availability import predict_velib_availability
from src.analyze_trends import analyze_velib_trends
from src.calculate_carbon import calculate_carbon_footprint

router = APIRouter()

@router.post("/predict/velib-availability", response_model=VelibAvailabilityResponse)
async def predict_availability(request: VelibAvailabilityRequest):
    """
    Prédiction de la disponibilité des vélos Vélib' par heure
    """
    try:
        result = await predict_velib_availability(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur de prédiction: {str(e)}")

@router.post("/analyze/trends", response_model=TrendsAnalysisResponse)
async def analyze_trends(request: TrendsAnalysisRequest):
    """
    Analyse des tendances d'utilisation Vélib' sur 7 jours
    """
    try:
        result = await analyze_velib_trends(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur d'analyse: {str(e)}")

@router.post("/calculate/carbon-footprint", response_model=CarbonCalculationResponse)
async def calculate_carbon(request: CarbonCalculationRequest):
    """
    Calcul de l'empreinte carbone et suggestions de trajets
    """
    try:
        result = await calculate_carbon_footprint(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur de calcul: {str(e)}")
