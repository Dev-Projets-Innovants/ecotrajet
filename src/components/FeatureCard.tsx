
/**
 * Composant FeatureCard
 * 
 * Ce composant représente une carte de fonctionnalité dans la section "Fonctionnalités" de la page d'accueil.
 * Il affiche une icône, un titre et une description, et intègre une animation au défilement
 * pour apparaître progressivement lorsque l'utilisateur fait défiler la page.
 * 
 * Caractéristiques:
 * - Animation à l'entrée dans le viewport
 * - Délai d'animation configurable basé sur l'index
 * - Utilisation des icônes Lucide
 * - Design avec effet de verre (glass-card)
 */

import React, { useRef, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';

// Interface définissant les propriétés acceptées par le composant
interface FeatureCardProps {
  icon: LucideIcon;         // Icône Lucide à afficher
  title: string;            // Titre de la fonctionnalité
  description: string;      // Description détaillée
  index: number;            // Position pour calculer le délai d'animation
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, index }) => {
  // Référence vers l'élément DOM de la carte pour l'observer
  const cardRef = useRef<HTMLDivElement>(null);

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

    // Commence à observer l'élément si la référence existe
    if (cardRef.current) observer.observe(cardRef.current);
    
    // Nettoyage: arrête d'observer lorsque le composant est démonté
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      // Applique les classes pour le style et l'animation
      className="animate-on-scroll glass-card rounded-xl p-6 transition-all duration-500 hover:shadow-xl"
      // Délai d'animation progressif basé sur l'index
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Conteneur circulaire pour l'icône */}
      <div className="w-12 h-12 rounded-full bg-eco-light-green flex items-center justify-center mb-5">
        <Icon className="h-6 w-6 text-eco-green" />
      </div>
      {/* Titre de la fonctionnalité */}
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {/* Description de la fonctionnalité */}
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
