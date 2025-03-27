
/**
 * Composant SidebarHeader
 * 
 * Ce composant représente l'en-tête de la barre latérale (sidebar) dans l'interface utilisateur.
 * Il s'adapte automatiquement en fonction de l'état de la sidebar (étendue ou réduite).
 * 
 * Caractéristiques:
 * - Ajuste sa présentation en fonction de l'état de la sidebar
 * - Centre son contenu lorsque la sidebar est réduite
 * - Utilise l'utilitaire cn() pour combiner les classes CSS conditionnellement
 * - Transmet tous les attributs HTML standards à l'élément div sous-jacent
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";

// Interface des props acceptées par le composant
export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

// Définition du composant avec support pour la référence React
export const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => {
    // Récupère l'état actuel de la sidebar depuis le contexte
    const { state } = useSidebar();

    return (
      <div
        ref={ref}
        data-state={state}  // Attribut data pour faciliter le ciblage CSS
        className={cn(
          // Classes de base: hauteur, alignement, bordure et espacement
          "flex h-14 items-center border-b px-4",
          // Classe conditionnelle: centre le contenu et réduit l'espacement si réduit
          state === "collapsed" && "justify-center px-2",
          // Classes personnalisées fournies par l'utilisateur
          className
        )}
        {...props}  // Transmet les autres props au div
      />
    );
  }
);

// Définit un nom d'affichage pour faciliter le débogage
SidebarHeader.displayName = "SidebarHeader";
