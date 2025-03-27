
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 pb-20 overflow-hidden">
      {/* Brighter background image with bicycles in Paris */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1471623432079-b009d30b6729?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div> {/* Dark overlay for better text readability */}
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-eco-green/80 text-white border border-eco-green/40 backdrop-blur-sm shadow-lg">
              Mobilité durable
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance mb-6 text-white leading-[1.1]">
            Paris plus vert, <span className="relative inline-block">
              <span className="relative z-10 text-eco-green">trajet</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-eco-light-green/60 rounded-lg -z-0"></span>
            </span> après <span className="relative inline-block">
              <span className="relative z-10 text-eco-green">trajet</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-eco-light-green/60 rounded-lg -z-0"></span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white mb-10 leading-relaxed text-balance font-medium">
            ÉcoTrajet vous aide à réduire votre empreinte carbone en choisissant les options de transport les plus écologiques pour vos déplacements quotidiens à Paris.
          </p>
          
          <div className="flex justify-center items-center">
            <div className="w-full sm:w-auto">
              <Button 
                className="group rounded-full px-6 py-6 h-12 w-full sm:w-auto bg-eco-green hover:bg-eco-dark-green text-white shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm"
                asChild
              >
                <Link to="/signup">
                  <span>Commencer maintenant</span>
                  <span className="ml-2">
                    <ArrowRight size={18} />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
