
import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const CommunityRulesTooltip: React.FC = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-blue-500 hover:text-blue-600 cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Règles de la communauté ÉcoTrajet</h4>
            <div className="text-xs space-y-1">
              <p><strong>Respectez autrui :</strong> Les messages sexistes, racistes, homophobes, ou toute forme de discrimination ne sont pas tolérés.</p>
              <p><strong>Restez constructif :</strong> Évitez les attaques personnelles, les propos diffamatoires ou les contenus offensants.</p>
              <p><strong>Partagez responsable :</strong> Assurez-vous que vos publications respectent la vie privée d'autrui et les droits d'auteur.</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CommunityRulesTooltip;
