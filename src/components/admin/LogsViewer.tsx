
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, RefreshCw } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const LogsViewer: React.FC = () => {
  // Note: In a real application, this data would come from an API or context
  const logs = [
    { id: 1, timestamp: '2024-04-12 14:32:45', level: 'INFO', message: 'Utilisateur connecté', source: 'auth-service' },
    { id: 2, timestamp: '2024-04-12 14:30:12', level: 'WARNING', message: 'Tentative de connexion échouée', source: 'auth-service' },
    { id: 3, timestamp: '2024-04-12 14:28:03', level: 'ERROR', message: 'Base de données temporairement indisponible', source: 'data-service' },
    { id: 4, timestamp: '2024-04-12 14:27:55', level: 'INFO', message: 'Nouveau document ajouté', source: 'document-service' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher dans les logs..."
            className="pl-8"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button size="sm" className="bg-eco-green hover:bg-eco-dark-green">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Horodatage</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.id}</TableCell>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    log.level === 'INFO' 
                      ? 'bg-blue-100 text-blue-800' 
                      : log.level === 'WARNING' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {log.level}
                  </span>
                </TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell>{log.source}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Détails</Button>
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

export default LogsViewer;
