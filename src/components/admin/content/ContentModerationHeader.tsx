
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  filters?: {
    status: 'all' | 'pending' | 'approved' | 'rejected';
    search: string;
  };
  onFiltersChange?: (filters: { status?: 'all' | 'pending' | 'approved' | 'rejected' }) => void;
  showForumPosts?: boolean;
}

const ContentModerationHeader: React.FC<ContentModerationHeaderProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  showForumPosts = false
}) => {
  return (
    <>
      <Tabs 
        value={activeTab} 
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          {showForumPosts && (
            <TabsTrigger value="posts" className="flex items-center gap-2">
              Posts du Forum
            </TabsTrigger>
          )}
          <TabsTrigger value="comments" className="flex items-center gap-2">
            Commentaires
          </TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder={`Rechercher ${
                activeTab === 'posts' ? 'un post' :
                activeTab === 'comments' ? 'un commentaire' : 
                'du contenu'
              }...`}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          {/* Filtres pour les posts du forum et commentaires */}
          {(activeTab === 'posts' || activeTab === 'comments') && filters && onFiltersChange && (
            <Select
              value={filters.status}
              onValueChange={(value: 'all' | 'pending' | 'approved' | 'rejected') => 
                onFiltersChange({ status: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvés</SelectItem>
                <SelectItem value="rejected">Rejetés</SelectItem>
              </SelectContent>
            </Select>
          )}
          
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
