
import React from 'react';
import { Layout } from '@/components/Layout';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <Layout title="Administration">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-4">
        {children}
      </div>
    </Layout>
  );
};

export default DashboardLayout;
