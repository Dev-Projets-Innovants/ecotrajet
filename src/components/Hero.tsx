import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
const Hero = () => {
  const {
    user,
    isAdmin
  } = useAuth();
  return <section className="relative min-h-screen flex items-center pt-16 pb-20 overflow-hidden">
      {/* Brighter background image with bicycles in Paris */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: 'url("https://www.apur.org/sites/default/files/images/publication/a-la-une/mobilites_emergentes_935_550.jpg")',
        backgroundPosition: 'center'
      }}></div>
        <div className="absolute inset-0 bg-black/40"></div> {/* Dark overlay for better text readability */}
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-4">
            <span className="inline-block py-1 rounded-full text-sm font-medium bg-eco-green/80 text-white border border-eco-green/40 backdrop-blur-sm shadow-lg px-[11px]">
              Mobilité durable
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6 text-white leading-[1.1]">
            Paris plus vert, <span className="relative inline-block">
              <span className="relative z-10 text-eco-green">trajet</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-eco-light-green/60 rounded-lg -z-0"></span>
            </span> après <span className="relative inline-block">
              <span className="relative z-10 text-eco-green">trajet</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-eco-light-green/60 rounded-lg -z-0"></span>
            </span>
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-white mb-8 leading-relaxed text-balance font-medium px-2">
            ÉcoTrajet vous aide à réduire votre empreinte carbone en choisissant les options de transport les plus écologiques pour vos déplacements quotidiens à Paris.
          </p>
          
          <div className="flex justify-center items-center">
            <div className="w-full sm:w-auto">
              <Button className="group rounded-full px-4 py-5 h-12 w-full sm:w-auto bg-eco-green hover:bg-eco-dark-green text-white shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm" asChild>
                <Link to={user ? isAdmin ? "/admin/dashboard" : "/dashboard" : "/signup"}>
                  <span>{user ? isAdmin ? "Accéder au tableau de bord admin" : "Accéder au tableau de bord" : "Commencer maintenant"}</span>
                  <span className="ml-2">
                    <ArrowRight size={18} />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;