
/**
 * Composant Features
 * 
 * Ce composant affiche la section "Fonctionnalités" de la page d'accueil,
 * présentant les principales caractéristiques de l'application ÉcoTrajet
 * sous forme de cartes interactives avec des icônes.
 * 
 * Caractéristiques:
 * - Animation au défilement pour le titre et les cartes
 * - Disposition responsive en grille (1 colonne sur mobile, 3 sur desktop)
 * - Utilisation du composant FeatureCard pour chaque fonctionnalité
 * - Effets de dégradé en haut et en bas de la section
 */

import React, { useRef, useEffect } from 'react';
import FeatureCard from './FeatureCard';
import { Map, BarChart2, Award } from 'lucide-react';

const Features = () => {
  // Référence vers l'élément de titre pour l'animation
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Configuration de l'observateur d'intersection
    const observerOptions = {
      threshold: 0.1,       // Déclenche quand 10% de l'élément est visible
      root: null,           // Utilise le viewport comme conteneur
      rootMargin: '0px'     // Pas de marge additionnelle
    };

    // Création de l'observateur qui ajoute la classe 'visible' 
    // lorsque l'élément entre dans le viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Ajoute la classe pour déclencher l'animation
          entry.target.classList.add('visible');
          // Arrête d'observer l'élément une fois qu'il est visible
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Commence à observer le titre si la référence existe
    if (titleRef.current) observer.observe(titleRef.current);
    
    // Nettoyage: arrête d'observer lorsque le composant est démonté
    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
    };
  }, []);

  // Données des fonctionnalités à afficher
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
      {/* Effet de dégradé en haut de la section */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent"></div>
      
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {/* En-tête de la section avec animation */}
        <div 
          ref={titleRef}
          className="text-center mb-16 animate-on-scroll"
        >
          {/* Badge de catégorie */}
          <div className="inline-block px-3 py-1 rounded-full bg-eco-light-green text-eco-green text-sm font-medium mb-4">
            Fonctionnalités
          </div>
          {/* Titre principal */}
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Des outils pour une mobilité plus verte</h2>
          {/* Description de la section */}
          <p className="text-gray-600 max-w-2xl mx-auto">
            ÉcoTrajet vous offre une suite complète d'outils pour faciliter vos choix de mobilité durable au quotidien.
          </p>
        </div>
        
        {/* Grille des fonctionnalités - responsive (1 colonne sur mobile, 3 sur desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Génération des cartes de fonctionnalités à partir des données */}
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
      
      {/* Effet de dégradé en bas de la section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Features;
