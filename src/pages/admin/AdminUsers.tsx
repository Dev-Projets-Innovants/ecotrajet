
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { UserTable } from '@/components/admin/users/UserTable';
import { UserTableHeader } from '@/components/admin/users/UserTableHeader';
import { UserTableFilters } from '@/components/admin/users/UserTableFilters';
import { EditUserDialog } from '@/components/admin/users/EditUserDialog';
import { DeleteUserDialog } from '@/components/admin/users/DeleteUserDialog';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { AdminUser } from '@/services/admin/usersService';
import { toast } from '@/hooks/use-toast';

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  const {
    users,
    isLoading,
    error,
    refetchUsers,
    updateUser,
    deleteUser
  } = useAdminUsers();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchUsers();
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

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
  };

  const handleDeleteUser = (user: AdminUser) => {
    setDeletingUser(user);
  };

  const handleSaveUser = async (userId: string, updates: Partial<AdminUser>) => {
    try {
      await updateUser(userId, updates);
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleConfirmDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      setDeletingUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
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

  if (error) {
    return (
      <AdminLayout title="Gestion des utilisateurs">
        <div className="text-center text-red-600">
          <p>Erreur lors du chargement des utilisateurs: {error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des utilisateurs">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
          </h2>
        </div>
        
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
          isLoading={isLoading}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>

      <EditUserDialog
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveUser}
      />

      <DeleteUserDialog
        user={deletingUser}
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
};

export default AdminUsers;
