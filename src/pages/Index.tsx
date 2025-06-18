
/**
 * Page d'accueil ÉcoTrajet
 * 
 * Cette page est le point d'entrée principal de l'application. Elle présente une vue d'ensemble
 * des fonctionnalités offertes par ÉcoTrajet et vise à encourager l'inscription des utilisateurs.
 * 
 * Composants inclus:
 * - Navbar: Barre de navigation principale
 * - Hero: Section de présentation principale avec call-to-action
 * - MapPlaceholder: Aperçu de la carte interactive des stations Vélib
 * - Features: Présentation des fonctionnalités principales de l'application
 * - TestimonialsSection: Témoignages de la communauté
 * - GuidePreview: Aperçu du guide écologique
 * - CallToAction: Invitation à l'inscription
 * - Footer: Pied de page avec liens utiles
 */

import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MapPlaceholder from '@/components/MapPlaceholder';
import Features from '@/components/Features';
import TestimonialsSection from '@/components/TestimonialsSection';
import GuidePreview from '@/components/GuidePreview';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    /**
     * Configuration du défilement fluide
     * Permet aux utilisateurs de naviguer entre les sections de la page d'accueil
     * en cliquant sur les liens d'ancre (#section) avec une animation fluide
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      // Ajoute un écouteur d'événement à chaque lien d'ancre
      anchor.addEventListener('click', function (e) {
        e.preventDefault();  // Empêche le comportement par défaut du navigateur
        
        // Récupère l'attribut href du lien
        const href = this.getAttribute('href');
        if (!href) return;  // Sort si l'attribut href n'existe pas
        
        // Trouve l'élément cible via son sélecteur
        const targetElement = document.querySelector(href);
        if (!targetElement) return;  // Sort si l'élément cible n'existe pas
        
        // Calcule la position de l'élément par rapport au haut de la page
        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
        
        // Effectue le défilement avec animation
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'  // Animation fluide
        });
      });
    });

    /**
     * Animation au défilement
     * Détecte quand les éléments deviennent visibles dans le viewport
     * et ajoute une classe 'visible' pour déclencher des animations CSS
     */
    const animateOnScroll = () => {
      // Sélectionne tous les éléments avec la classe 'animate-on-scroll'
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      // Pour chaque élément, vérifie sa position par rapport au viewport
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        
        // Si l'élément est suffisamment visible dans le viewport
        if (elementPosition < viewportHeight - 100) {
          // Ajoute la classe pour déclencher l'animation
          element.classList.add('visible');
        }
      });
    };
    
    // Exécute l'animation une fois au chargement initial
    animateOnScroll();
    
    // Ajoute un écouteur d'événement pour le défilement
    window.addEventListener('scroll', animateOnScroll);
    
    // Nettoyage lors du démontage du composant
    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Barre de navigation en haut de la page */}
      <Navbar />
      
      {/* Contenu principal avec sections */}
      <main className="flex-grow">
        {/* Section héros avec présentation principale */}
        <Hero />
        
        {/* Aperçu de la carte interactive */}
        <MapPlaceholder />
        
        {/* Présentation des fonctionnalités */}
        <Features />
        
        {/* Témoignages de la communauté */}
        <TestimonialsSection />
        
        {/* Aperçu du guide écologique */}
        <GuidePreview />
        
        {/* Appel à l'action pour l'inscription */}
        <CallToAction />
      </main>
      
      {/* Pied de page avec informations complémentaires */}
      <Footer />
    </div>
  );
};

export default Index;
