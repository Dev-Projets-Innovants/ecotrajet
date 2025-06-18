
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ContentItem {
  id: number;
  author: string;
  title: string;
  content?: string;
  imageUrl?: string;
  description?: string;
  dateSubmitted: string;
  type?: string;
}

interface ContentViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: ContentItem | null;
  onModerate: (id: number, status: string, type: string) => void;
}

const ContentViewDialog: React.FC<ContentViewDialogProps> = ({
  isOpen,
  onClose,
  selectedItem,
  onModerate
}) => {
  if (!selectedItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {selectedItem.title || 'Détail du contenu'}
          </DialogTitle>
          <DialogDescription>
            Soumis par {selectedItem.author} le {selectedItem.dateSubmitted}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {selectedItem.type === 'photo' ? (
            <div className="space-y-4">
              <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-800">
                <img 
                  src={selectedItem.imageUrl} 
                  alt={selectedItem.title} 
                  className="w-full h-64 object-cover"
                />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{selectedItem.description}</p>
            </div>
          ) : (
            <Textarea 
              readOnly 
              value={selectedItem.content || ''} 
              className="min-h-[100px] bg-gray-50 dark:bg-gray-900"
            />
          )}
        </div>
        <DialogFooter className="flex justify-between sm:justify-between gap-2">
          <Button 
            type="button" 
            variant="destructive" 
            onClick={() => onModerate(
              selectedItem.id, 
              'rejected', 
              selectedItem.type === 'photo' ? 'photo' : 'testimonial'
            )}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Rejeter
          </Button>
          <Button 
            type="button"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => onModerate(
              selectedItem.id, 
              'approved', 
              selectedItem.type === 'photo' ? 'photo' : 'testimonial'
            )}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approuver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentViewDialog;
