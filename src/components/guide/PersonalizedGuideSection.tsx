
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle, ArrowRight, MapPin, Lightbulb } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGeminiRecommendations } from '@/hooks/useGeminiRecommendations';

interface PersonalizedGuide {
  title: string;
  introduction: string;
  steps: Array<{
    id: number;
    title: string;
    content: string;
    tips: string[];
    citySpecific: string;
  }>;
  nextSteps: string;
  personalizedMessage: string;
}

interface PersonalizedGuideSectionProps {
  section?: string;
}

const PersonalizedGuideSection: React.FC<PersonalizedGuideSectionProps> = ({ 
  section = 'premiers-pas' 
}) => {
  const { user, profile } = useAuth();
  const { getPersonalizedGuide, isLoading } = useGeminiRecommendations();
  const [guide, setGuide] = useState<PersonalizedGuide | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadPersonalizedGuide();
    }
  }, [user?.id, section]);

  const loadPersonalizedGuide = async () => {
    if (!user?.id) return;
    
    const personalizedGuide = await getPersonalizedGuide(user.id, section);
    setGuide(personalizedGuide);
  };

  const toggleStepCompletion = (stepId: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  if (!user || !guide) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-eco-green">
            <Sparkles className="h-5 w-5 mr-2" />
            Guide Personnalisé
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-eco-green"></div>
              <span className="ml-2 text-sm text-gray-600">Génération de votre guide personnalisé...</span>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">Connectez-vous pour obtenir un guide personnalisé</p>
              <Button onClick={loadPersonalizedGuide}>
                Générer mon guide
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête du guide */}
      <Card className="bg-gradient-to-r from-eco-light-green/20 to-white border-eco-green/20">
        <CardHeader>
          <CardTitle className="flex items-center text-eco-green">
            <Sparkles className="h-5 w-5 mr-2" />
            {guide.title}
          </CardTitle>
          <CardDescription>
            Guide personnalisé pour {profile?.first_name || 'vous'} • {profile?.city || 'Paris'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{guide.introduction}</p>
          {guide.personalizedMessage && (
            <div className="p-3 bg-eco-green/10 rounded-lg border-l-4 border-eco-green">
              <p className="text-eco-green font-medium">{guide.personalizedMessage}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Étapes du guide */}
      <div className="space-y-4">
        {guide.steps.map((step, index) => (
          <Card 
            key={step.id}
            className={`transition-all duration-200 ${
              completedSteps.includes(step.id) 
                ? 'bg-green-50 border-green-200' 
                : 'hover:shadow-md'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-lg">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 text-sm font-semibold ${
                    completedSteps.includes(step.id)
                      ? 'bg-green-500 text-white'
                      : 'bg-eco-light-green text-eco-green'
                  }`}>
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {step.title}
                </CardTitle>
                <Button
                  variant={completedSteps.includes(step.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleStepCompletion(step.id)}
                  className={completedSteps.includes(step.id) ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {completedSteps.includes(step.id) ? 'Terminé' : 'Marquer comme terminé'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{step.content}</p>
              
              {/* Conseils généraux */}
              {step.tips && step.tips.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
                    Conseils pratiques
                  </h5>
                  <ul className="space-y-1">
                    {step.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-sm text-gray-600 flex items-start">
                        <span className="text-eco-green mr-2">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Conseil spécifique à la ville */}
              {step.citySpecific && (
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h5 className="font-medium text-blue-900 mb-1 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Spécifique à {profile?.city || 'votre ville'}
                  </h5>
                  <p className="text-sm text-blue-800">{step.citySpecific}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Étapes suivantes */}
      {guide.nextSteps && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <ArrowRight className="h-5 w-5 mr-2" />
              Et après ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{guide.nextSteps}</p>
            <Button 
              className="mt-4" 
              onClick={loadPersonalizedGuide}
              disabled={isLoading}
            >
              Générer la suite du guide
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Statistiques de progression */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Votre progression</p>
              <p className="text-2xl font-bold text-eco-green">
                {completedSteps.length}/{guide.steps.length}
              </p>
            </div>
            <div className="text-right">
              <Badge 
                variant={completedSteps.length === guide.steps.length ? "default" : "secondary"}
                className={completedSteps.length === guide.steps.length ? "bg-green-500" : ""}
              >
                {Math.round((completedSteps.length / guide.steps.length) * 100)}% complété
              </Badge>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div 
              className="bg-eco-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSteps.length / guide.steps.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizedGuideSection;
