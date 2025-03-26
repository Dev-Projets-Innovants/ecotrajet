
import React, { useRef, useEffect } from 'react';
import FeatureCard from './FeatureCard';
import { Map, BarChart2, Award } from 'lucide-react';

const Features = () => {
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      root: null,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (titleRef.current) observer.observe(titleRef.current);

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
    };
  }, []);

  const features = [
    {
      icon: Map,
      title: "Carte interactive",
      description: "Visualisez en temps réel toutes les options de mobilité écologique disponibles autour de vous avec des informations détaillées."
    },
    {
      icon: BarChart2,
      title: "Suivi d'impact écologique",
      description: "Mesurez votre empreinte carbone et suivez vos progrès au fil du temps grâce à notre tableau de bord personnalisé."
    },
    {
      icon: Award,
      title: "Système de récompenses",
      description: "Gagnez des points et débloquez des avantages en choisissant des options écologiques pour vos déplacements quotidiens."
    },
  ];

  return (
    <section id="features" className="py-20 bg-secondary relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent"></div>
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div 
          ref={titleRef}
          className="text-center mb-16 animate-on-scroll"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-eco-light-green text-eco-green text-sm font-medium mb-4">
            Fonctionnalités
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Des outils pour une mobilité plus verte</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ÉcoTrajet vous offre une suite complète d'outils pour faciliter vos choix de mobilité durable au quotidien.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Features;
