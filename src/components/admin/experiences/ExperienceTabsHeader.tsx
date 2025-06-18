
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface ExperienceTabsHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  stats: {
    total: number;
    approved: number;
    pending: number;
  };
}

const ExperienceTabsHeader: React.FC<ExperienceTabsHeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  stats
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">Toutes ({stats.total})</TabsTrigger>
        <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
        <TabsTrigger value="approved">Approuvées ({stats.approved})</TabsTrigger>
      </TabsList>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher une expérience..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtrer
        </Button>
      </div>
    </Tabs>
  );
};

export default ExperienceTabsHeader;
