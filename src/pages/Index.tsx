
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
 * - GuidePreview: Aperçu du guide écologique
 * - CallToAction: Invitation à l'inscription
 * - Footer: Pied de page avec liens utiles
 */

import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MapPlaceholder from '@/components/MapPlaceholder';
import Features from '@/components/Features';
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
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const href = this.getAttribute('href');
        if (!href) return;
        
        const targetElement = document.querySelector(href);
        if (!targetElement) return;
        
        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      });
    });

    /**
     * Animation au défilement
     * Détecte quand les éléments deviennent visibles dans le viewport
     * et ajoute une classe 'visible' pour déclencher des animations CSS
     */
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        
        if (elementPosition < viewportHeight - 100) {
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
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <MapPlaceholder />
        <Features />
        <GuidePreview />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
