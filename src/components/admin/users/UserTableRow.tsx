
import React from 'react';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminUser } from '@/services/admin/usersService';

interface UserTableRowProps {
  user: AdminUser;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onEdit,
  onDelete
}) => {
  const getFullName = (user: AdminUser) => {
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Sans nom';
  };

  return (
    <tr className="border-b">
      <td className="py-3 px-4">{getFullName(user)}</td>
      <td className="py-3 px-4">{user.email}</td>
      <td className="py-3 px-4">{user.city || '-'}</td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          user.is_admin 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {user.is_admin ? 'Admin' : 'Utilisateur'}
        </span>
      </td>
      <td className="py-3 px-4">
        {new Date(user.created_at).toLocaleDateString('fr-FR')}
      </td>
      <td className="py-3 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Edit className="h-4 w-4 mr-2" />
              Éditer
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(user)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};
