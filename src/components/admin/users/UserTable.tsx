
import React from 'react';
import { UserTableHeader } from './UserTableHeader';
import { UserTableRow } from './UserTableRow';
import { AdminUser } from '@/services/admin/usersService';

interface UserTableProps {
  users: AdminUser[];
  isLoading: boolean;
  onEditUser: (user: AdminUser) => void;
  onDeleteUser: (user: AdminUser) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  onEditUser,
  onDeleteUser
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-eco-green"></div>
        <p className="ml-3 text-base">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <UserTableHeader />
        <tbody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onEdit={onEditUser}
              onDelete={onDeleteUser}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
