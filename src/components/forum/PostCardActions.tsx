
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostCardActionsProps {
  canEdit: boolean;
  canDelete: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const PostCardActions: React.FC<PostCardActionsProps> = ({
  canEdit,
  canDelete,
  onEditClick,
  onDeleteClick
}) => {
  if (!canEdit && !canDelete) {
    return null;
  }

  return (
    <div className="flex space-x-1">
      {canEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onEditClick}
          className="text-gray-400 hover:text-gray-600"
          title="Modifier ce post"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {canDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDeleteClick}
          className="text-gray-400 hover:text-red-600"
          title="Supprimer ce post"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default PostCardActions;
