
import React from 'react';
import { MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface Photo {
  id: number;
  author: string;
  authorId: number;
  title: string;
  imageUrl: string;
  description: string;
  dateSubmitted: string;
  status: string;
}

interface PhotoTableProps {
  photos: Photo[];
  onViewItem: (item: Photo & { type: string }) => void;
  onModerateItem: (id: number, status: string, type: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

const PhotoTable: React.FC<PhotoTableProps> = ({
  photos,
  onViewItem,
  onModerateItem,
  getStatusBadge
}) => {
  return (
    <div className="rounded-md border dark:border-gray-800">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Auteur</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {photos.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="font-medium">{item.author}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">ID: {item.authorId}</div>
              </TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell className="hidden md:table-cell">{item.dateSubmitted}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
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
                    <DropdownMenuItem onClick={() => onViewItem({...item, type: 'photo'})}>
                      Consulter
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onModerateItem(item.id, 'approved', 'photo')}
                      className="text-green-600 dark:text-green-400"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approuver
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onModerateItem(item.id, 'rejected', 'photo')}
                      className="text-red-600 dark:text-red-400"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rejeter
                    </DropdownMenuItem>
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

export default PhotoTable;
