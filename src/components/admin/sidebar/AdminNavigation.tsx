
/**
 * Composant AdminNavigation
 * 
 * Ce composant définit la navigation principale du panneau d'administration.
 * Il fournit les liens vers toutes les sections administratives et gère
 * la mise en évidence de l'élément actif.
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  MessageSquare, 
  BarChart2, 
  Bell, 
  Trophy,
  UserCircle,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  title: string;
  isSidebarCollapsed: boolean;
}

// Élément de navigation individuel
const NavItem: React.FC<NavItemProps> = ({
  href,
  icon: Icon,
  title,
  isSidebarCollapsed
}) => {
  const { pathname } = useLocation();
  const isActive = pathname === href;

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
        "hover:bg-muted/80",
        isActive
          ? "bg-eco-light-green text-eco-dark-green hover:bg-eco-light-green"
          : "text-muted-foreground"
      )}
    >
      <Icon className={`${isSidebarCollapsed ? 'h-6 w-6' : 'h-5 w-5'} ${!isSidebarCollapsed ? 'mr-2' : ''}`} />
      {!isSidebarCollapsed && <span>{title}</span>}
    </Link>
  );
};

interface AdminNavigationProps {
  isSidebarCollapsed: boolean;
}

// Navigation principale du panneau d'administration
const AdminNavigation: React.FC<AdminNavigationProps> = ({ isSidebarCollapsed }) => {
  // Définition des éléments de navigation (sans paramètres)
  const navigationItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, title: 'Tableau de bord' },
    { href: '/admin/users', icon: Users, title: 'Utilisateurs' },
    { href: '/admin/rewards', icon: Award, title: 'Récompenses' },
    { href: '/admin/challenges', icon: Trophy, title: 'Défis' },
    { href: '/admin/content', icon: MessageSquare, title: 'Contenu' },
    { href: '/admin/experiences', icon: Heart, title: 'Expériences' },
    { href: '/admin/analytics', icon: BarChart2, title: 'Analytique' },
    { href: '/admin/notifications', icon: Bell, title: 'Notifications' },
    { href: '/admin/profile', icon: UserCircle, title: 'Profil' },
  ];

  return (
    <nav className="space-y-1 py-2">
      {navigationItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          title={item.title}
          isSidebarCollapsed={isSidebarCollapsed}
        />
      ))}
    </nav>
  );
};

export default AdminNavigation;
