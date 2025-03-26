
import React from 'react';
import { Filter } from 'lucide-react';
import { 
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarCheckboxItem
} from '@/components/ui/menubar';

const MapFilterMenu = () => {
  return (
    <Menubar className="border-none p-0 bg-transparent">
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-2 bg-background border border-input px-3 py-2 h-10 rounded-md">
          <Filter className="h-4 w-4" />
          <span>Filtres</span>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem className="font-semibold">Points d'intérêt</MenubarItem>
          <MenubarSeparator />
          <MenubarCheckboxItem>
            Stations de vélo
          </MenubarCheckboxItem>
          <MenubarCheckboxItem>
            Bornes de recharge
          </MenubarCheckboxItem>
          <MenubarCheckboxItem>
            Covoiturage
          </MenubarCheckboxItem>
          <MenubarCheckboxItem>
            Espaces verts
          </MenubarCheckboxItem>
          <MenubarCheckboxItem>
            Commerces responsables
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default MapFilterMenu;
