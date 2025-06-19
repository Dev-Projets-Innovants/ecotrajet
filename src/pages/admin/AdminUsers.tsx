import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { UserTable } from '@/components/admin/users/UserTable';
import { UserTableHeader } from '@/components/admin/users/UserTableHeader';
import { UserTableFilters } from '@/components/admin/users/UserTableFilters';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { toast } from '@/hooks/use-toast';

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    users,
    totalUsers,
    loading,
    currentPage,
    setCurrentPage,
    refetch
  } = useAdminUsers({ searchQuery, roleFilter });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Données actualisées",
        description: "La liste des utilisateurs a été mise à jour",
      });
    } catch (error) {
      console.error('Error refreshing users:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'actualiser les données",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || 
      (roleFilter === 'admin' && user.is_admin) ||
      (roleFilter === 'user' && !user.is_admin);

    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout title="Gestion des utilisateurs">
      <div className="space-y-6">
        <UserTableHeader totalUsers={totalUsers} />
        
        <UserTableFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <UserTable
          users={filteredUsers}
          loading={loading}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalUsers={filteredUsers.length}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
