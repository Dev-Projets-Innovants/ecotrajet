
import React from 'react';

export const UserTableHeader: React.FC = () => {
  return (
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
  );
};
