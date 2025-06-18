
import React from 'react';
import { MoreHorizontal, CheckCircle, XCircle, Eye, Calendar, User, Tag } from 'lucide-react';
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
import { AdminForumPost } from '@/services/admin/contentModerationService';

interface ForumPostsTableProps {
  posts: AdminForumPost[];
  onViewPost: (post: AdminForumPost) => void;
  onApprovePost: (postId: string) => void;
  onRejectPost: (postId: string) => void;
}

const ForumPostsTable: React.FC<ForumPostsTableProps> = ({
  posts,
  onViewPost,
  onApprovePost,
  onRejectPost
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

  const getStatusBadge = (post: AdminForumPost) => {
    if (post.is_reported) {
      return <Badge variant="destructive">Rejeté</Badge>;
    } else if (post.is_approved) {
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
            <TableHead>Titre</TableHead>
            <TableHead>Contenu</TableHead>
            <TableHead className="hidden md:table-cell">Catégorie</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">
                      {post.user_name || 'Utilisateur anonyme'}
                    </div>
                    {post.user_email && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {post.user_email}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[200px]">
                  <div className="font-medium">{truncateText(post.title, 30)}</div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Eye className="h-3 w-3 mr-1" />
                    {post.views_count || 0} vues
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[300px] text-sm text-gray-600 dark:text-gray-300">
                  {truncateText(post.content, 60)}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {post.forum_categories && (
                  <Badge 
                    variant="outline"
                    style={{ 
                      borderColor: post.forum_categories.color,
                      color: post.forum_categories.color 
                    }}
                  >
                    {post.forum_categories.name}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(post.created_at)}
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(post)}
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
                    <DropdownMenuItem onClick={() => onViewPost(post)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Consulter
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {!post.is_approved && !post.is_reported && (
                      <DropdownMenuItem 
                        onClick={() => onApprovePost(post.id)}
                        className="text-green-600 dark:text-green-400"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approuver
                      </DropdownMenuItem>
                    )}
                    {!post.is_reported && (
                      <DropdownMenuItem 
                        onClick={() => onRejectPost(post.id)}
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

export default ForumPostsTable;
