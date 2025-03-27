
/**
 * Système de barre latérale (Sidebar) réutilisable
 * 
 * Ce fichier implémente le Provider et le contexte pour la barre latérale utilisée dans
 * l'interface utilisateur d'ÉcoTrajet. Il gère l'état de la barre latérale (étendue/réduite),
 * les interactions mobiles, et la sauvegarde de l'état pour les visites ultérieures.
 * 
 * Fonctionnalités principales:
 * - Barre latérale réactive qui peut être étendue ou réduite (collapsible)
 * - Support pour les appareils mobiles avec un comportement adapté
 * - Raccourci clavier pour basculer l'état (Ctrl/Cmd + B)
 * - Sauvegarde de l'état préféré dans un cookie
 * - Fournit un contexte React pour accéder à l'état et aux fonctions depuis n'importe quel composant
 */

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Constantes de configuration pour la sidebar
const SIDEBAR_COOKIE_NAME = "sidebar:state";                    // Nom du cookie pour sauvegarder l'état
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;                // Durée de vie du cookie: 7 jours
const SIDEBAR_KEYBOARD_SHORTCUT = "b";                          // Touche de raccourci clavier
const SIDEBAR_WIDTH = "16rem";                                  // Largeur de la sidebar en mode étendu
const SIDEBAR_WIDTH_MOBILE = "18rem";                           // Largeur de la sidebar sur mobile
const SIDEBAR_WIDTH_ICON = "3rem";                              // Largeur de la sidebar en mode réduit (icônes)

// Types d'état possible pour la sidebar
export type SidebarState = "expanded" | "collapsed";

/**
 * Type pour le contexte de la sidebar
 * Définit l'interface utilisée pour interagir avec la sidebar depuis d'autres composants
 */
type SidebarContext = {
  state: SidebarState;              // État actuel: "expanded" ou "collapsed"
  open: boolean;                    // La sidebar est-elle ouverte (desktop)
  setOpen: (open: boolean) => void; // Fonction pour définir l'état ouvert/fermé
  openMobile: boolean;              // La sidebar est-elle ouverte (mobile)
  setOpenMobile: (open: boolean) => void; // Fonction pour définir l'état mobile
  isMobile: boolean;                // L'appareil est-il mobile
  toggleSidebar: () => void;        // Fonction pour basculer l'état de la sidebar
};

// Création du contexte React pour la sidebar
const SidebarContext = React.createContext<SidebarContext | null>(null);

/**
 * Hook personnalisé pour accéder au contexte de la sidebar
 * Permet à n'importe quel composant d'accéder facilement à l'état et aux fonctions de la sidebar
 */
export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

// Props pour le composant SidebarProvider
export interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;            // État ouvert par défaut
  open?: boolean;                   // État ouvert contrôlé de l'extérieur
  onOpenChange?: (open: boolean) => void; // Callback pour les changements d'état
}

/**
 * Composant SidebarProvider
 * 
 * Fournit le contexte et la logique pour la sidebar à ses composants enfants
 * Gère l'état, les interactions et la persistance des préférences utilisateur
 */
export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  SidebarProviderProps
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    // Vérification si l'appareil est mobile
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);

    // État interne de la sidebar
    // On utilise openProp et setOpenProp pour le contrôle depuis l'extérieur du composant
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }

        // Sauvegarde l'état dans un cookie pour le conserver entre les sessions
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open]
    );

    /**
     * Fonction pour basculer l'état de la sidebar
     * Adapte le comportement en fonction du type d'appareil (mobile/desktop)
     */
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    /**
     * Configuration du raccourci clavier
     * Permet à l'utilisateur de basculer la sidebar avec Ctrl/Cmd + B
     */
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    // Détermine l'état textuel (expanded/collapsed) pour faciliter le styling
    const state = open ? "expanded" : "collapsed";

    // Création de l'objet de contexte avec toutes les valeurs et fonctions nécessaires
    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-screen w-full",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  }
);

SidebarProvider.displayName = "SidebarProvider";

// Export des constantes pour une utilisation ailleurs dans l'application
export {
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_KEYBOARD_SHORTCUT,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_MOBILE,
  SIDEBAR_WIDTH_ICON,
};
