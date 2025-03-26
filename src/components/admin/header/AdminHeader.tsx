
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  toggleSidebar: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, toggleSidebar }) => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm z-10 dark:shadow-none">
      <div className="px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2 hidden md:flex"
          >
            <Menu size={20} />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
