
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export const ProfileActions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/signin'}
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
          size="sm"
        >
          <LogOut className="h-3 w-3 mr-2" />
          Se déconnecter
        </Button>
      </CardContent>
    </Card>
  );
};
