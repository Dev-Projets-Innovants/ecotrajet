
import React from 'react';
import { Link } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
  isAnchor?: boolean;
}

const NavLink = ({ to, onClick, children, className = "", isAnchor = false }: NavLinkProps) => {
  const baseClasses = "font-medium hover:text-eco-green transition-colors";
  const combinedClasses = `${baseClasses} ${className}`;

  if (isAnchor) {
    return (
      <a href={to} className={combinedClasses} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={combinedClasses} onClick={onClick}>
      {children}
    </Link>
  );
};

export default NavLink;
