
import React from 'react';
import { MoreHorizontal, CheckCircle, XCircle, Eye, Edit, Trash2, Star } from 'lucide-react';
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
import { Badge } from "@/components/ui/badge";
import { UserExperience } from '@/services/userExperiencesService';

interface ExperienceTableProps {
  experiences: UserExperience[];
  onViewExperience: (experience: UserExperience) => void;
  onEditExperience: (experience: UserExperience) => void;
  onDeleteExperience: (experience: UserExperience) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const ExperienceTable: React.FC<ExperienceTableProps> = ({
  experiences,
  onViewExperience,
  onEditExperience,
  onDeleteExperience,
  onApprove,
  onReject
}) => {
  const getStatusBadge = (isApproved: boolean) => {
    return isApproved ? (
      <Badge className="bg-green-500 hover:bg-green-600">Approuvé</Badge>
    ) : (
      <Badge className="bg-amber-500 hover:bg-amber-600">En attente</Badge>
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Auteur</TableHead>
            <TableHead>Expérience</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {experiences.map((experience) => (
            <TableRow key={experience.id}>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {experience.name || 'Anonyme'}
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {experience.user_id?.slice(0, 8)}...
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  <p className="truncate">
                    {experience.experience_text.substring(0, 100)}
                    {experience.experience_text.length > 100 && '...'}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {renderStars(experience.rating)}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{experience.category}</Badge>
              </TableCell>
              <TableCell>
                {new Date(experience.created_at).toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell>{getStatusBadge(experience.is_approved)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onViewExperience(experience)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditExperience(experience)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {!experience.is_approved && (
                      <DropdownMenuItem 
                        onClick={() => onApprove(experience.id)}
                        className="text-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approuver
                      </DropdownMenuItem>
                    )}
                    {experience.is_approved && (
                      <DropdownMenuItem 
                        onClick={() => onReject(experience.id)}
                        className="text-amber-600"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeter
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDeleteExperience(experience)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
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

export default ExperienceTable;
