
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

interface NavbarLogoProps {
  textColorClass?: string;
}

const NavbarLogo = ({ textColorClass = "text-eco-green" }: NavbarLogoProps) => {
  return (
    <Link to="/" className={`flex items-center space-x-2 ${textColorClass}`}>
      <Leaf className="h-6 w-6 transition-transform duration-500 hover:rotate-12" />
      <span className="text-xl font-semibold tracking-tight">ÉcoTrajet</span>
    </Link>
  );
};

export default NavbarLogo;
