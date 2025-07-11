
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  LogOut, 
  Home
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent,
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import AdminNavigation from "./AdminNavigation";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  handleLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  sidebarOpen,
  toggleSidebar,
  handleLogout,
}) => {
  const navigate = useNavigate();

  const handleHomeNavigation = () => {
    navigate('/');
  };

  return (
    <Sidebar 
      className={`${sidebarOpen ? 'w-64' : 'w-16'} duration-300 transition-width bg-white z-50`}
      data-state={sidebarOpen ? "open" : "collapsed"}
    >
      <SidebarContent>
        {/* Logo et titre */}
        <div className="flex items-center justify-between h-16 px-3.5">
          <div className="flex items-center">
            <img 
              src="/logo.svg" 
              alt="ÉcoTrajet Logo" 
              className="h-8 w-8 text-eco-green" 
            />
            {sidebarOpen && (
              <span className="ml-2 font-semibold text-lg">ÉcoTrajet Admin</span>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="hidden md:flex"
            aria-label={sidebarOpen ? "Réduire le menu" : "Étendre le menu"}
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </Button>
        </div>

        {/* Navigation principale */}
        <div className="px-3 mt-3">
          <AdminNavigation isSidebarCollapsed={!sidebarOpen} />
        </div>

        {/* Pied de la sidebar avec contrôles */}
        <div className="mt-auto px-3 mb-4">
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'}`} 
              onClick={handleHomeNavigation}
            >
              <Home className={`${sidebarOpen ? 'h-5 w-5' : 'h-6 w-6'}`} />
              {sidebarOpen && <span className="ml-2">Accueil</span>}
            </Button>

            <Button 
              variant="ghost" 
              className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'}`} 
              onClick={handleLogout}
            >
              <LogOut className={`${sidebarOpen ? 'h-5 w-5' : 'h-6 w-6'}`} />
              {sidebarOpen && <span className="ml-2">Déconnexion</span>}
            </Button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
