
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UsersManagement from '@/components/admin/UsersManagement';
import DocumentsManagement from '@/components/admin/DocumentsManagement';
import LogsViewer from '@/components/admin/LogsViewer';
import FieldsManagement from '@/components/admin/FieldsManagement';
import PartnersManagement from '@/components/admin/PartnersManagement';

const AdminPanel = ({ tab = 'users' }) => {
  const [activeTab, setActiveTab] = useState(tab);
  const navigate = useNavigate();

  const handleTabChange = (value) => {
    setActiveTab(value);
    navigate(`/admin/${value}`);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Administration</h1>
          <p className="text-gray-500">Gérez les utilisateurs, les documents et les paramètres de l'application</p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full mb-8">
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="fields">Champs</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="partners">Partenaires</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsManagement />
          </TabsContent>

          <TabsContent value="fields">
            <FieldsManagement />
          </TabsContent>

          <TabsContent value="logs">
            <LogsViewer />
          </TabsContent>

          <TabsContent value="partners">
            <PartnersManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminPanel;
