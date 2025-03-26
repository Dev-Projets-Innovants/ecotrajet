
import React, { useRef, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

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

    if (cardRef.current) observer.observe(cardRef.current);

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className="animate-on-scroll glass-card rounded-xl p-6 transition-all duration-500 hover:shadow-xl"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="w-12 h-12 rounded-full bg-eco-light-green flex items-center justify-center mb-5">
        <Icon className="h-6 w-6 text-eco-green" />
      </div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
