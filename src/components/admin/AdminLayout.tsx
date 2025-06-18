
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./sidebar/AdminSidebar";
import AdminHeader from "./header/AdminHeader";
import { useAuth } from "@/hooks/useAuth";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider defaultOpen={sidebarOpen}>
        <div className="flex flex-1 w-full">
          {/* Sidebar */}
          <AdminSidebar 
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            handleLogout={handleLogout}
          />

          {/* Main content */}
          <div className="flex-1 flex flex-col ml-0 md:ml-auto transition-all">
            <AdminHeader 
              title={title}
              toggleSidebar={toggleSidebar}
            />
            <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
