
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
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

    if (titleRef.current) observer.observe(titleRef.current);
    if (subtitleRef.current) observer.observe(subtitleRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
      if (subtitleRef.current) observer.unobserve(subtitleRef.current);
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);

  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-24 overflow-hidden">
      <div className="hero-gradient absolute inset-0 z-0"></div>
      <div className="absolute inset-0 z-0 opacity-40" aria-hidden="true">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-eco-light-green rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-eco-light-blue rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance animate-on-scroll mb-6"
          >
            Paris plus vert, <span className="text-eco-green">trajet</span> après <span className="text-eco-green">trajet</span>
          </h1>
          <p 
            ref={subtitleRef}
            className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed text-balance animate-on-scroll"
            style={{ animationDelay: '200ms' }}
          >
            ÉcoTrajet vous aide à réduire votre empreinte carbone en choisissant les options de transport les plus écologiques pour vos déplacements quotidiens à Paris.
          </p>
          <div 
            ref={ctaRef}
            className="animate-on-scroll"
            style={{ animationDelay: '400ms' }}
          >
            <Button className="group rounded-full px-6 py-6 h-12 bg-eco-green hover:bg-eco-dark-green text-white shadow-md transition-all duration-300 flex items-center space-x-2 btn-hover-effect">
              <span>Commencer maintenant</span>
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
