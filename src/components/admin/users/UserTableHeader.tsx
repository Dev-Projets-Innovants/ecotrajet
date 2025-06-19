
import React from 'react';

interface UserTableHeaderProps {
  totalUsers?: number;
}

export const UserTableHeader: React.FC<UserTableHeaderProps> = ({ totalUsers }) => {
  return (
    <>
      {totalUsers !== undefined && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            {totalUsers} utilisateur{totalUsers > 1 ? 's' : ''}
          </h2>
        </div>
      )}
      <thead>
        <tr className="border-b bg-muted/50">
          <th className="py-3 px-4 text-left font-medium">Nom</th>
          <th className="py-3 px-4 text-left font-medium">Email</th>
          <th className="py-3 px-4 text-left font-medium">Ville</th>
          <th className="py-3 px-4 text-left font-medium">Rôle</th>
          <th className="py-3 px-4 text-left font-medium">Membre depuis</th>
          <th className="py-3 px-4 text-left font-medium">Actions</th>
        </tr>
      </thead>
    </>
  );
};
