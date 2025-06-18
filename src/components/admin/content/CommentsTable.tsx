
import React from 'react';
import { MoreHorizontal, CheckCircle, XCircle, Eye, Calendar, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminForumComment } from '@/services/admin/commentsModerationService';

interface CommentsTableProps {
  comments: AdminForumComment[];
  onViewComment: (comment: AdminForumComment) => void;
  onApproveComment: (commentId: string) => void;
  onRejectComment: (commentId: string) => void;
}

const CommentsTable: React.FC<CommentsTableProps> = ({
  comments,
  onViewComment,
  onApproveComment,
  onRejectComment
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (comment: AdminForumComment) => {
    if (comment.is_reported) {
      return <Badge variant="destructive">Rejeté</Badge>;
    } else if (comment.is_approved) {
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Approuvé</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white">En attente</Badge>;
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="rounded-md border dark:border-gray-800">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Auteur</TableHead>
            <TableHead>Contenu</TableHead>
            <TableHead className="hidden md:table-cell">Post</TableHead>
            <TableHead className="hidden md:table-cell">Likes</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.map((comment) => (
            <TableRow key={comment.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">
                      {comment.user_name || 'Utilisateur anonyme'}
                    </div>
                    {comment.user_email && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {comment.user_email}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[300px] text-sm text-gray-600 dark:text-gray-300">
                  {truncateText(comment.content, 80)}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {comment.forum_posts && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {truncateText(comment.forum_posts.title, 30)}
                  </div>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="text-sm text-gray-500">
                  {comment.likes_count || 0} likes
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(comment.created_at)}
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(comment)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onViewComment(comment)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Consulter
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {!comment.is_approved && !comment.is_reported && (
                      <DropdownMenuItem 
                        onClick={() => onApproveComment(comment.id)}
                        className="text-green-600 dark:text-green-400"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approuver
                      </DropdownMenuItem>
                    )}
                    {!comment.is_reported && (
                      <DropdownMenuItem 
                        onClick={() => onRejectComment(comment.id)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeter
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CommentsTable;
