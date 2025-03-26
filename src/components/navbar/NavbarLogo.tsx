
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const NavbarLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2 text-eco-green">
      <Leaf className="h-6 w-6 transition-transform duration-500 hover:rotate-12" />
      <span className="text-xl font-semibold tracking-tight">ÉcoTrajet</span>
    </Link>
  );
};

export default NavbarLogo;
