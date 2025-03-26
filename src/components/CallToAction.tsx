
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  const ctaRef = useRef<HTMLDivElement>(null);

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

    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => {
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-eco-green opacity-[0.03] z-0"></div>
      
      <div 
        ref={ctaRef}
        className="container max-w-5xl mx-auto px-4 md:px-6 relative z-10 animate-on-scroll"
      >
        <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-gradient-to-br from-eco-green/10 to-eco-blue/10 p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à réduire votre empreinte carbone ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Rejoignez des milliers de Parisiens qui font déjà la différence avec ÉcoTrajet. 
              Inscrivez-vous gratuitement et commencez votre voyage vers une mobilité plus verte.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button className="group rounded-full px-6 py-6 h-12 bg-eco-green hover:bg-eco-dark-green text-white shadow-md transition-all duration-300 flex items-center space-x-2 btn-hover-effect">
                <span>Commencer maintenant</span>
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Link to="/guide/tutorials">
                <Button variant="outline" className="group rounded-full px-6 py-6 h-12 border-eco-green text-eco-green hover:bg-eco-light-green shadow-sm transition-all duration-300 flex items-center space-x-2">
                  <Video size={18} className="mr-2" />
                  <span>Voir les tutoriels</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
