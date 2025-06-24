
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.routes import predictions, health
import uvicorn

# Création de l'application FastAPI
app = FastAPI(
    title="EcoTrajet ML API",
    description="API de prédictions ML pour EcoTrajet",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier les domaines autorisés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(predictions.router, prefix="/api/v1", tags=["Predictions"])

@app.get("/")
async def root():
    return {
        "message": "EcoTrajet ML API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "predictions": "/api/v1/predictions"
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
