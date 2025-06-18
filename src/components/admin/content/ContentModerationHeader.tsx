
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface ContentModerationHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const ContentModerationHeader: React.FC<ContentModerationHeaderProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange
}) => {
  return (
    <>
      <Tabs 
        value={activeTab} 
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="testimonials" className="flex items-center gap-2">
            Témoignages
          </TabsTrigger>
          <TabsTrigger value="photos" className="flex items-center gap-2">
            Photos
          </TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder={`Rechercher un ${activeTab === 'testimonials' ? 'témoignage' : 'photo'}...`}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrer
          </Button>
        </div>
      </Tabs>
    </>
  );
};

export default ContentModerationHeader;
