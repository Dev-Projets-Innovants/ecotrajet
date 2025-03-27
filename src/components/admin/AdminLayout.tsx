
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./sidebar/AdminSidebar";
import AdminHeader from "./header/AdminHeader";
import AdminContent from "./content/AdminContent";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    // In a real app, handle logout logic here
    navigate('/admin');
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <SidebarProvider defaultOpen={sidebarOpen}>
        <div className="flex flex-1 w-full">
          {/* Sidebar */}
          <AdminSidebar 
            sidebarOpen={sidebarOpen}
            darkMode={darkMode}
            toggleSidebar={toggleSidebar}
            toggleDarkMode={toggleDarkMode}
            handleLogout={handleLogout}
          />

          {/* Main content */}
          <div className="flex-1 flex flex-col ml-0 md:ml-auto transition-all">
            <AdminHeader 
              title={title}
              toggleSidebar={toggleSidebar}
            />
            <AdminContent>
              {children}
            </AdminContent>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
