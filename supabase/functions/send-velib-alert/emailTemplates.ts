
import { VelibAlertRequest } from "../../../src/types/alerts.js";

export const getAlertTypeLabel = (type: string): string => {
  switch (type) {
    case 'bikes_available': return 'vélos disponibles';
    case 'docks_available': return 'places libres';
    case 'ebikes_available': return 'vélos électriques';
    case 'mechanical_bikes': return 'vélos mécaniques';
    default: return type;
  }
};

export const generateEmailHTML = (data: VelibAlertRequest): string => {
  const alertTypeLabel = getAlertTypeLabel(data.alertType);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Alerte Vélib' - EcoTrajet</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🚲 EcoTrajet</h1>
                  <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Votre mobilité durable</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">🔔 Alerte Vélib' déclenchée !</h2>
                  
                  <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">Station ${data.stationName}</h3>
                    <p style="color: #6b7280; margin: 5px 0;"><strong>Code station :</strong> ${data.stationCode}</p>
                    <p style="color: #6b7280; margin: 5px 0;"><strong>Type d'alerte :</strong> ${alertTypeLabel}</p>
                    <p style="color: #6b7280; margin: 5px 0;"><strong>Seuil configuré :</strong> ${data.threshold}</p>
                    <p style="color: #6b7280; margin: 5px 0;"><strong>Valeur actuelle :</strong> ${data.currentValue}</p>
                  </div>
                  
                  <div style="background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0;">
                    <p style="color: #15803d; margin: 0; font-weight: 500;">
                      ✅ Bonne nouvelle ! Il y a maintenant ${data.currentValue} ${alertTypeLabel.toLowerCase()} à la station ${data.stationName}.
                    </p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://ecotrajet.lovable.app/map" style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
                      📍 Voir sur la carte
                    </a>
                  </div>
                  
                  <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
                    Cette alerte a été envoyée car les conditions que vous avez définies sont maintenant remplies. 
                    Profitez-en pour planifier votre trajet écologique !
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
                    © 2025 EcoTrajet - Votre plateforme de mobilité durable
                  </p>
                  <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0; text-align: center;">
                    Cet email a été envoyé suite à votre demande d'alerte Vélib'
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
