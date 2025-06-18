
import React, { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { userExperiencesService, UserExperience } from '@/services/userExperiencesService';

const TestimonialsSection = () => {
  const [experiences, setExperiences] = useState<UserExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data, error } = await userExperiencesService.getApprovedExperiences();
        if (error) {
          console.error('Error fetching experiences:', error);
        } else if (data) {
          setExperiences(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-eco-light-green to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Témoignages de notre communauté
            </h2>
            <div className="animate-pulse flex space-x-4 justify-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 h-4 w-20 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (experiences.length === 0) {
    return null; // Don't show the section if no experiences
  }

  return (
    <section className="py-16 bg-gradient-to-br from-eco-light-green to-white animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez les expériences partagées par notre communauté d'utilisateurs passionnés de mobilité durable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {experiences.map((experience) => (
            <Card key={experience.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <Quote className="h-8 w-8 text-eco-green mr-3 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {renderStars(experience.rating)}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      "{truncateText(experience.experience_text)}"
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    {experience.image_url ? (
                      <img
                        src={experience.image_url}
                        alt="Photo d'expérience"
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-eco-green rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold text-sm">
                          {experience.name ? experience.name.charAt(0).toUpperCase() : 'A'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {experience.name || 'Utilisateur anonyme'}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(experience.created_at).toLocaleDateString('fr-FR', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Vous aussi, partagez votre expérience avec ÉcoTrajet !
          </p>
          <a
            href="/guide"
            className="inline-flex items-center px-6 py-3 bg-eco-green text-white font-semibold rounded-lg hover:bg-eco-dark-green transition-colors duration-200"
          >
            Partager mon expérience
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
