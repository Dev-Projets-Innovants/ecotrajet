
import React, { useEffect, useState } from 'react';
import { Star, Quote, MessageSquare } from 'lucide-react';
import { userExperiencesService, UserExperience } from '@/services/userExperiencesService';

const TestimonialsSection = () => {
  const [experiences, setExperiences] = useState<UserExperience[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les témoignages de notre communauté d'éco-citoyens
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les témoignages de notre communauté d'éco-citoyens
          </p>
        </div>
        
        {experiences.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience) => (
              <div key={experience.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-eco-light-green p-2 rounded-full mr-3">
                    <Quote className="h-4 w-4 text-eco-green" />
                  </div>
                  <div className="flex">
                    {renderStars(experience.rating)}
                  </div>
                </div>
                
                <blockquote className="text-gray-700 mb-4 leading-relaxed">
                  "{experience.experience_text}"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-eco-light-green rounded-full flex items-center justify-center mr-3">
                    <span className="text-eco-green font-semibold text-sm">
                      {experience.name ? experience.name.charAt(0).toUpperCase() : 'A'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {experience.name || 'Utilisateur anonyme'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Utilisateur ÉcoTrajet
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl p-8 shadow-sm max-w-md mx-auto">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun témoignage pour le moment
              </h3>
              <p className="text-gray-500">
                Soyez le premier à partager votre expérience avec ÉcoTrajet !
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
