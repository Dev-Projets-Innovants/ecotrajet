
"""
Calcul de l'empreinte carbone et suggestions de trajets
"""

import asyncio
from typing import Dict, List, Any
from datetime import datetime
import numpy as np

from api.models.schemas import CarbonCalculationRequest, CarbonCalculationResponse, TransportOption
from src.utils.data_loader import load_carbon_calculation_data
from src.utils.preprocessing import preprocess_carbon_data, calculate_distance_haversine

class CarbonFootprintCalculator:
    def __init__(self):
        self.co2_factors = {}
        self.transport_data = {}
        
    async def load_data(self):
        """Charger les données depuis Supabase"""
        try:
            self.transport_data = await load_carbon_calculation_data()
            self.co2_factors = preprocess_carbon_data(self.transport_data.get('transport_modes', []))
            print("Données carbone chargées depuis Supabase")
            return True
        except Exception as e:
            print(f"Erreur chargement données carbone: {e}")
            return False

    async def calculate_route_options(self, origin_lat: float, origin_lng: float,
                                    destination_lat: float, destination_lng: float) -> List[Dict]:
        """Calculer les différentes options de transport"""
        
        # Distance directe
        distance_km = calculate_distance_haversine(origin_lat, origin_lng, destination_lat, destination_lng)
        
        transport_options = []
        
        # Définition des modes de transport avec leurs caractéristiques
        transport_modes = {
            'walk': {
                'name': 'Marche',
                'speed_kmh': 5,
                'calories_per_km': 50,
                'cost_base': 0,
                'comfort_factor': 0.7
            },
            'bike': {
                'name': 'Vélo',
                'speed_kmh': 15,
                'calories_per_km': 40,
                'cost_base': 0,
                'comfort_factor': 0.8
            },
            'ebike': {
                'name': 'Vélo électrique',
                'speed_kmh': 25,
                'calories_per_km': 25,
                'cost_base': 0.1,  # Coût de l'électricité
                'comfort_factor': 0.9
            },
            'metro': {
                'name': 'Métro',
                'speed_kmh': 30,
                'calories_per_km': 5,
                'cost_base': 1.9,  # Prix ticket métro
                'comfort_factor': 0.6
            },
            'bus': {
                'name': 'Bus',
                'speed_kmh': 20,
                'calories_per_km': 5,
                'cost_base': 1.9,
                'comfort_factor': 0.5
            },
            'car': {
                'name': 'Voiture',
                'speed_kmh': 25,  # Vitesse moyenne en ville
                'calories_per_km': 0,
                'cost_base': 0.5,  # Carburant + usure
                'comfort_factor': 0.9
            }
        }
        
        for mode_key, mode_info in transport_modes.items():
            co2_factor = self.co2_factors.get(mode_key, 0)
            
            # Ajustement de la distance selon le mode
            if mode_key in ['metro', 'bus']:
                # Les transports en commun peuvent avoir un trajet moins direct
                actual_distance = distance_km * 1.2
            elif mode_key == 'car':
                # La voiture peut prendre des routes plus longues
                actual_distance = distance_km * 1.1
            else:
                actual_distance = distance_km
            
            duration_minutes = (actual_distance / mode_info['speed_kmh']) * 60
            co2_kg = actual_distance * co2_factor
            calories = int(actual_distance * mode_info['calories_per_km'])
            cost = actual_distance * mode_info['cost_base']
            
            # Calcul de l'éco-score (0-100)
            eco_score = self._calculate_eco_score(co2_kg, calories, cost, mode_info['comfort_factor'])
            
            # Détails de la route
            route_details = {
                'mode': mode_key,
                'actual_distance': round(actual_distance, 2),
                'estimated_time': f"{int(duration_minutes)}min",
                'co2_factor': co2_factor,
                'comfort_level': mode_info['comfort_factor']
            }
            
            transport_options.append({
                'mode': mode_info['name'],
                'distance_km': round(actual_distance, 2),
                'duration_minutes': int(duration_minutes),
                'co2_kg': round(co2_kg, 3),
                'calories_burned': calories,
                'cost_euros': round(cost, 2),
                'eco_score': eco_score,
                'route_details': route_details
            })
        
        # Trier par éco-score décroissant
        transport_options.sort(key=lambda x: x['eco_score'], reverse=True)
        
        return transport_options

    def _calculate_eco_score(self, co2_kg: float, calories: int, cost: float, comfort: float) -> int:
        """Calcule un score écologique de 0 à 100"""
        
        # Normalisation des facteurs
        co2_score = max(0, 100 - (co2_kg * 500))  # Pénalité forte pour le CO2
        health_score = min(100, calories / 2)  # Bonus pour les calories
        cost_score = max(0, 100 - (cost * 20))  # Pénalité pour le coût
        comfort_score = comfort * 100
        
        # Pondération
        eco_score = (
            co2_score * 0.4 +      # 40% pour l'environnement
            health_score * 0.3 +    # 30% pour la santé
            cost_score * 0.2 +      # 20% pour l'économie
            comfort_score * 0.1     # 10% pour le confort
        )
        
        return int(max(0, min(100, eco_score)))

    async def generate_recommendations(self, transport_options: List[Dict]) -> List[str]:
        """Générer des recommandations personnalisées"""
        recommendations = []
        
        if not transport_options:
            return ["Aucune option de transport disponible"]
        
        best_option = transport_options[0]
        
        # Recommandation principale
        recommendations.append(
            f"🌟 Meilleur choix écologique : {best_option['mode']} "
            f"(Score éco: {best_option['eco_score']}/100)"
        )
        
        # Analyse des économies de CO2
        car_option = next((opt for opt in transport_options if 'voiture' in opt['mode'].lower()), None)
        if car_option and best_option != car_option:
            co2_saved = car_option['co2_kg'] - best_option['co2_kg']
            recommendations.append(
                f"💚 Économisez {co2_saved:.2f} kg de CO2 vs voiture"
            )
        
        # Recommandations santé
        active_options = [opt for opt in transport_options if opt['calories_burned'] > 50]
        if active_options:
            best_health = max(active_options, key=lambda x: x['calories_burned'])
            recommendations.append(
                f"🏃 Option la plus active : {best_health['mode']} "
                f"({best_health['calories_burned']} calories)"
            )
        
        # Recommandations économiques
        cheapest = min(transport_options, key=lambda x: x['cost_euros'])
        if cheapest['cost_euros'] < 1.0:
            recommendations.append(
                f"💰 Option gratuite : {cheapest['mode']}"
            )
        
        return recommendations

# Instance globale
calculator = CarbonFootprintCalculator()

async def calculate_carbon_footprint(request: CarbonCalculationRequest) -> CarbonCalculationResponse:
    """
    Point d'entrée principal pour le calcul d'empreinte carbone
    """
    # Charger les données si nécessaire
    await calculator.load_data()
    
    # Calculer les options de transport
    transport_options = await calculator.calculate_route_options(
        request.origin_lat, request.origin_lng,
        request.destination_lat, request.destination_lng
    )
    
    # Convertir en objets TransportOption
    transport_option_objects = [
        TransportOption(**option) for option in transport_options
    ]
    
    # Meilleure option écologique
    best_eco_option = transport_option_objects[0] if transport_option_objects else None
    
    # Calculs des économies de carbone
    car_option = next((opt for opt in transport_option_objects if 'voiture' in opt.mode.lower()), None)
    carbon_savings = {}
    
    if car_option and best_eco_option:
        carbon_savings = {
            'vs_car_kg': round(car_option.co2_kg - best_eco_option.co2_kg, 3),
            'vs_car_percent': round(((car_option.co2_kg - best_eco_option.co2_kg) / car_option.co2_kg) * 100, 1) if car_option.co2_kg > 0 else 0,
            'trees_equivalent': round((car_option.co2_kg - best_eco_option.co2_kg) / 21.77, 2)  # 1 arbre absorbe ~21.77 kg CO2/an
        }
    
    # Générer les recommandations
    recommendations = await calculator.generate_recommendations(transport_options)
    
    return CarbonCalculationResponse(
        origin={'lat': request.origin_lat, 'lng': request.origin_lng},
        destination={'lat': request.destination_lat, 'lng': request.destination_lng},
        transport_options=transport_option_objects,
        best_eco_option=best_eco_option,
        carbon_savings=carbon_savings,
        recommendations=recommendations,
        generated_at=datetime.now()
    )
