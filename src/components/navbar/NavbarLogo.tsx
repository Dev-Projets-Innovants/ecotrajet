
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarLogoProps {
  textColorClass?: string;
}

const NavbarLogo = ({ textColorClass = "text-eco-green" }: NavbarLogoProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Link to="/" className={`flex items-center space-x-2 ${textColorClass}`}>
      <Leaf className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-500 hover:rotate-12" />
      <span className={`text-lg md:text-xl font-semibold tracking-tight ${isMobile ? 'max-w-24 truncate' : ''}`}>ÉcoTrajet</span>
    </Link>
  );
};

export default NavbarLogo;
