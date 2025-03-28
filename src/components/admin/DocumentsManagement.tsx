
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Upload, Filter } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const DocumentsManagement: React.FC = () => {
  // Note: In a real application, this data would come from an API or context
  const documents = [
    { id: 1, name: 'Rapport annuel 2024', type: 'PDF', size: '2.4 MB', updatedAt: '12/04/2024', category: 'Rapports' },
    { id: 2, name: 'Guide utilisateur', type: 'DOCX', size: '1.1 MB', updatedAt: '05/03/2024', category: 'Documentation' },
    { id: 3, name: 'Statistiques Q1 2024', type: 'XLSX', size: '3.7 MB', updatedAt: '01/04/2024', category: 'Statistiques' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher un document..."
            className="pl-8"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button size="sm" className="bg-eco-green hover:bg-eco-dark-green">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Taille</TableHead>
              <TableHead>Mise à jour</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.id}</TableCell>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.size}</TableCell>
                <TableCell>{doc.updatedAt}</TableCell>
                <TableCell>{doc.category}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm">Télécharger</Button>
                    <Button variant="ghost" size="sm">Supprimer</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm" disabled>
          Précédent
        </Button>
        <Button variant="outline" size="sm">
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default DocumentsManagement;
