
import React from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ForumCategory } from '@/services/forumService';

interface CommunityControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: ForumCategory[];
  onCreatePost: () => void;
}

const CommunityControls: React.FC<CommunityControlsProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onCreatePost,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Rechercher dans les discussions..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={onCreatePost}
          className="bg-eco-green hover:bg-eco-green/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau post
        </Button>
      </div>
    </div>
  );
};

export default CommunityControls;
