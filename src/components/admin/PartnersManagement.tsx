
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, RefreshCw } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const PartnersManagement: React.FC = () => {
  // Note: In a real application, this data would come from an API or context
  const partners = [
    { id: 1, name: 'Vélib', type: 'Transport', contact: 'contact@velib.com', status: 'Actif' },
    { id: 2, name: 'RATP', type: 'Transport', contact: 'partenariats@ratp.fr', status: 'Actif' },
    { id: 3, name: 'Ecoway', type: 'Service', contact: 'info@ecoway.fr', status: 'En attente' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher un partenaire..."
            className="pl-8"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button size="sm" className="bg-eco-green hover:bg-eco-dark-green">
            <UserPlus className="h-4 w-4 mr-2" />
            Ajouter
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
              <TableHead>Contact</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell className="font-medium">{partner.id}</TableCell>
                <TableCell>{partner.name}</TableCell>
                <TableCell>{partner.type}</TableCell>
                <TableCell>{partner.contact}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    partner.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {partner.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm">Éditer</Button>
                    <Button variant="ghost" size="sm">Détails</Button>
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

export default PartnersManagement;
