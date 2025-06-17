
import React from 'react';
import { Button } from '@/components/ui/button';

interface UserTablePaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  displayedItems: number;
  onPageChange: (page: number) => void;
}

export const UserTablePagination: React.FC<UserTablePaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  displayedItems,
  onPageChange
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Affichage de {displayedItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} à {Math.min(currentPage * itemsPerPage, totalItems)} sur {totalItems} utilisateurs
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))} 
          disabled={currentPage <= 1}
        >
          Précédent
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))} 
          disabled={currentPage >= totalPages}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};
