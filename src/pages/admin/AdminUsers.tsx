
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { EditUserDialog } from '@/components/admin/users/EditUserDialog';
import { DeleteUserDialog } from '@/components/admin/users/DeleteUserDialog';
import { UserTableFilters } from '@/components/admin/users/UserTableFilters';
import { UserTable } from '@/components/admin/users/UserTable';
import { UserTablePagination } from '@/components/admin/users/UserTablePagination';
import { AdminUser } from '@/services/admin/usersService';

const AdminUsers = () => {
  const { 
    users, 
    isLoading, 
    error, 
    refetchUsers,
    updateUser,
    deleteUser
  } = useAdminUsers();

  // État pour la recherche et le filtrage
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // États pour les pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // États pour les dialogues
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Filtrer les utilisateurs selon les critères
  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || 
      (roleFilter === 'admin' && user.is_admin) ||
      (roleFilter === 'user' && !user.is_admin);
    
    return matchesSearch && matchesRole;
  });

  // Pagination
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchUsers();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEditUser = async (userId: string, updates: Partial<AdminUser>) => {
    await updateUser(userId, updates);
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id);
      setIsDeleteUserDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleEditUserClick = (user: AdminUser) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  };

  const handleDeleteUserClick = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };

  if (error) {
    return (
      <AdminLayout title="Gestion des utilisateurs">
        <div className="text-center text-red-600 py-8">
          <p>Erreur lors du chargement des utilisateurs: {error}</p>
          <Button onClick={handleRefresh} className="mt-4">
            Réessayer
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des utilisateurs">
      <div className="grid gap-6">
        {/* Barre d'outils avec recherche, filtres et actualisation */}
        <UserTableFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Tableau des utilisateurs */}
        <div className="rounded-md border">
          <UserTable
            users={paginatedUsers}
            isLoading={isLoading}
            onEditUser={handleEditUserClick}
            onDeleteUser={handleDeleteUserClick}
          />
        </div>

        {/* Pagination */}
        {!isLoading && (
          <UserTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredUsers.length}
            displayedItems={paginatedUsers.length}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Dialogues */}
      <EditUserDialog
        user={selectedUser}
        isOpen={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
        onSave={handleEditUser}
      />

      <DeleteUserDialog
        user={selectedUser}
        isOpen={isDeleteUserDialogOpen}
        onOpenChange={setIsDeleteUserDialogOpen}
        onConfirm={handleDeleteUser}
      />
    </AdminLayout>
  );
};

export default AdminUsers;
