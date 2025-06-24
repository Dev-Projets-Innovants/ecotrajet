
from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/")
async def health_check():
    """Endpoint de vérification de l'état de l'API"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "EcoTrajet ML API"
    }

@router.get("/models")
async def models_status():
    """Vérification de l'état des modèles ML"""
    # TODO: Implémenter la vérification des modèles
    return {
        "velib_availability": "loaded",
        "trends_analysis": "loaded", 
        "carbon_calculation": "loaded"
    }
