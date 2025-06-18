
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ExperienceManagement from '@/components/admin/experiences/ExperienceManagement';

const AdminExperiences = () => {
  return (
    <AdminLayout title="Gestion des expériences">
      <ExperienceManagement />
    </AdminLayout>
  );
};

export default AdminExperiences;
