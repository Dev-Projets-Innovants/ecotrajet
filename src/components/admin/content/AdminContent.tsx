
import React from "react";

interface AdminContentProps {
  children: React.ReactNode;
}

const AdminContent: React.FC<AdminContentProps> = ({ children }) => {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6">
      {children}
    </main>
  );
};

export default AdminContent;
