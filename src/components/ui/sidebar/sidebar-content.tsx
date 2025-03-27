
/**
 * Composants Sidebar et SidebarContent
 * 
 * Ce fichier définit deux composants essentiels pour la barre latérale de l'application:
 * 1. Sidebar: Le conteneur principal de la barre latérale
 * 2. SidebarContent: La zone de contenu à l'intérieur de la barre latérale
 * 
 * Ces composants s'adaptent automatiquement à l'état de la sidebar (étendue/réduite)
 * et au type d'appareil (mobile/desktop) en utilisant le contexte fourni par SidebarProvider.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";

export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => {
    // Récupération des informations d'état depuis le contexte de la sidebar
    const { state, open, openMobile, isMobile } = useSidebar();

    return (
      <aside
        ref={ref}
        // Attributs data pour faciliter le ciblage CSS en fonction de l'état
        data-state={state}
        data-mobile={isMobile || undefined}
        className={cn(
          // Classes de base pour le positionnement et l'apparence
          "fixed inset-y-0 left-0 z-20 flex w-[var(--sidebar-width)] flex-col border-r bg-white transition-all dark:bg-gray-900",
          // Ajoute une ombre sur mobile pour mieux se détacher du fond
          isMobile && "shadow-lg",
          // Réduit la largeur lorsque la sidebar est repliée sur desktop
          !isMobile && state === "collapsed" && "w-[var(--sidebar-width-icon)]",
          // Masque la sidebar lorsqu'elle est fermée sur mobile
          isMobile && !openMobile && "-translate-x-full",
          // Classes personnalisées transmises par le parent
          className
        )}
        {...props}
      />
    );
  }
);

// Définit un nom d'affichage pour faciliter le débogage
Sidebar.displayName = "Sidebar";

export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        // Configuration du conteneur de contenu pour la mise en page
        className={cn("flex flex-1 flex-col overflow-hidden", className)}
        {...props}
      />
    );
  }
);

// Définit un nom d'affichage pour faciliter le débogage
SidebarContent.displayName = "SidebarContent";
