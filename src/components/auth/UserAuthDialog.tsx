
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

interface UserAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

const UserAuthDialog = ({
  open,
  onOpenChange,
  title = "Connexion requise",
  description = "Connectez-vous ou inscrivez-vous pour accéder à cette fonctionnalité.",
}: UserAuthDialogProps) => {
  const location = useLocation();
  // Store the current path to redirect back after login
  const currentPath = location.pathname;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-eco-light-green mb-4">
            <img 
              src="/logo.svg" 
              alt="ÉcoTrajet Logo" 
              className="h-8 w-8" 
            />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4 justify-center mt-4">
          <Button asChild className="flex items-center justify-center">
            <Link to="/signin" state={{ from: currentPath }}>
              <LogIn className="mr-2 h-4 w-4" />
              Connexion
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center justify-center">
            <Link to="/signup" state={{ from: currentPath }}>
              <UserPlus className="mr-2 h-4 w-4" />
              Inscription
            </Link>
          </Button>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="mt-2"
          >
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserAuthDialog;
