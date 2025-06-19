import React from 'react';
import { Link } from 'react-router-dom';
import NavLink from './NavLink';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { MapPin, BarChart, Trophy, Users, BookOpen, Calculator, LogOut, Shield, LayoutDashboard } from 'lucide-react';

interface NavbarDesktopProps {
  isAuthenticated: boolean;
  isAdmin?: boolean;
  handleMapClick: (e: React.MouseEvent) => void;
  handleDashboardClick: (e: React.MouseEvent) => void;
  handleCommunityClick: (e: React.MouseEvent) => void;
  handleRewardsClick: (e: React.MouseEvent) => void;
  handleProfileClick: (e: React.MouseEvent) => void;
  handleNotificationsClick: (e: React.MouseEvent) => void;
  handleChallengesClick: (e: React.MouseEvent) => void;
  handleAdminDashboardClick?: () => void;
  handleLogout: () => void;
  textColorClass?: string;
}

const NavbarDesktop = ({
  isAuthenticated,
  isAdmin = false,
  handleMapClick,
  handleDashboardClick,
  handleCommunityClick,
  handleRewardsClick,
  handleProfileClick,
  handleNotificationsClick,
  handleChallengesClick,
  handleAdminDashboardClick,
  handleLogout,
  textColorClass = "text-foreground"
}: NavbarDesktopProps) => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={`bg-transparent ${textColorClass}`}>Explorer</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                <ListItem
                  href="/map"
                  title="Carte interactive"
                  onClick={handleMapClick}
                  icon={<MapPin className="h-4 w-4 mr-2 text-eco-green" />}
                >
                  Explorez les options de mobilité écologique sur notre carte interactive.
                </ListItem>
                <ListItem 
                  href="/dashboard" 
                  title="Tableau de bord" 
                  onClick={handleDashboardClick}
                  icon={<BarChart className="h-4 w-4 mr-2 text-eco-green" />}
                >
                  Visualisez vos performances et votre impact environnemental.
                </ListItem>
                <ListItem 
                  href="/carbon-calculator" 
                  title="Calculateur d'empreinte" 
                  icon={<Calculator className="h-4 w-4 mr-2 text-eco-green" />}
                >
                  Calculez l'empreinte carbone de vos déplacements.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger className={`bg-transparent ${textColorClass}`}>Communauté</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                <ListItem 
                  href="/community" 
                  title="Forum" 
                  onClick={handleCommunityClick}
                  icon={<Users className="h-4 w-4 mr-2 text-eco-green" />}
                >
                  Échangez avec d'autres utilisateurs engagés pour l'environnement.
                </ListItem>
                <ListItem 
                  href="/challenges" 
                  title="Défis écologiques" 
                  onClick={handleChallengesClick}
                  icon={<Trophy className="h-4 w-4 mr-2 text-yellow-500" />}
                >
                  Participez à des défis collectifs pour réduire votre empreinte carbone.
                </ListItem>
                <ListItem 
                  href="/rewards" 
                  title="Récompenses" 
                  onClick={handleRewardsClick}
                  icon={<Trophy className="h-4 w-4 mr-2 text-eco-blue" />}
                >
                  Gagnez des points et débloquez des récompenses pour vos efforts écologiques.
                </ListItem>
                <ListItem 
                  href="/guide" 
                  title="Guide écologique" 
                  icon={<BookOpen className="h-4 w-4 mr-2 text-eco-green" />}
                >
                  Découvrez des conseils et astuces pour une mobilité plus responsable.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {isAuthenticated ? (
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <NavLink to="/admin/dashboard" onClick={handleAdminDashboardClick} className={textColorClass}>
              <Button variant="ghost" className={`flex items-center ${textColorClass}`}>
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </NavLink>
          )}
          {!isAdmin && (
            <NavLink to="/dashboard" onClick={handleDashboardClick} className={textColorClass}>
              <Button variant="ghost" className={`flex items-center ${textColorClass}`}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </NavLink>
          )}
          <NavLink 
            to={isAdmin ? "/admin/profile" : "/profile"} 
            onClick={handleProfileClick} 
            className={textColorClass}
          >
            <Button variant="ghost" className={textColorClass}>Profil</Button>
          </NavLink>
          <Button variant="ghost" onClick={handleLogout} className={`flex items-center ${textColorClass}`}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <NavLink to="/signin" className={textColorClass}>
            <Button variant="ghost" className={textColorClass}>Connexion</Button>
          </NavLink>
          <NavLink to="/signup">
            <Button>Inscription</Button>
          </NavLink>
        </div>
      )}
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center text-sm font-medium leading-none">
            {icon}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default NavbarDesktop;
