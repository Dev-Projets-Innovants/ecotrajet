
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const FieldsManagement: React.FC = () => {
  // Exemple de champs personnalisés
  const [fields, setFields] = useState([
    { id: 1, name: 'Code postal', type: 'string', required: true, section: 'Utilisateur' },
    { id: 2, name: 'Date de naissance', type: 'date', required: false, section: 'Utilisateur' },
    { id: 3, name: 'Préférences de transport', type: 'multiselect', required: false, section: 'Préférences' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button className="bg-eco-green hover:bg-eco-dark-green">
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter un champ
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Requis</TableHead>
              <TableHead>Section</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.id}>
                <TableCell className="font-medium">{field.id}</TableCell>
                <TableCell>{field.name}</TableCell>
                <TableCell>{field.type}</TableCell>
                <TableCell>{field.required ? 'Oui' : 'Non'}</TableCell>
                <TableCell>{field.section}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
        <p className="text-amber-700 text-sm">
          <strong>Attention:</strong> La modification ou la suppression de champs peut affecter les données existantes et le fonctionnement de l'application.
        </p>
      </div>
    </div>
  );
};

export default FieldsManagement;
