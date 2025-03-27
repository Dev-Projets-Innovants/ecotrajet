
/**
 * Page des Conditions d'Utilisation
 * 
 * Cette page présente les conditions d'utilisation de l'application ÉcoTrajet, 
 * spécifiant les droits et responsabilités des utilisateurs.
 * 
 * Contenu principal:
 * - Introduction et présentation du service
 * - Conditions de création et d'utilisation d'un compte
 * - Droits de propriété intellectuelle
 * - Règles d'utilisation acceptable
 * - Conditions de modification des services
 * - Limitations de responsabilité
 * - Dispositions légales applicables
 * - Informations de contact
 */

import React from 'react';
import { Layout } from '@/components/Layout';

const TermsOfUse = () => {
  return (
    <Layout title="Conditions d'utilisation">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Conditions d'utilisation</h1>
        
        {/* Le contenu est structuré avec la classe prose de Tailwind pour une meilleure présentation du texte */}
        <div className="prose prose-green max-w-none">
          {/* Section 1: Introduction */}
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Bienvenue sur ÉcoTrajet. En utilisant notre application, vous acceptez les présentes conditions d'utilisation. 
            Veuillez les lire attentivement avant d'utiliser notre plateforme.
          </p>
          
          {/* Section 2: Description du Service */}
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Description du Service</h2>
          <p>
            ÉcoTrajet est une application de mobilité durable qui aide les utilisateurs à réduire leur empreinte carbone 
            lors de leurs déplacements. Notre plateforme propose des itinéraires écologiques, des défis environnementaux 
            et un système de récompenses pour encourager les déplacements durables.
          </p>
          
          {/* Section 3: Création de compte */}
          <h2 className="text-xl font-semibold mt-8 mb-4">3. Création de compte</h2>
          <p>
            Pour accéder à certaines fonctionnalités de l'application, vous devez créer un compte. Vous êtes responsable 
            de maintenir la confidentialité de vos informations de compte et de toutes les activités qui se produisent sous votre compte.
          </p>
          
          {/* Section 4: Propriété intellectuelle */}
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Propriété intellectuelle</h2>
          <p>
            Tous les contenus présents sur ÉcoTrajet, y compris les textes, graphiques, logos, icônes et images, 
            sont la propriété d'ÉcoTrajet et sont protégés par les lois françaises et internationales sur la propriété intellectuelle.
          </p>
          
          {/* Section 5: Utilisation acceptable */}
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Utilisation acceptable</h2>
          <p>
            En utilisant ÉcoTrajet, vous acceptez de ne pas:
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>Utiliser le service à des fins illégales</li>
            <li>Interférer avec ou perturber le service</li>
            <li>Collecter des informations sur d'autres utilisateurs sans leur consentement</li>
            <li>Créer de faux comptes ou usurper l'identité d'autres utilisateurs</li>
          </ul>
          
          {/* Section 6: Modification des services */}
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Modification des services</h2>
          <p>
            ÉcoTrajet se réserve le droit de modifier, suspendre ou interrompre tout aspect du service à tout moment, 
            y compris la disponibilité de toute fonctionnalité, base de données ou contenu.
          </p>
          
          {/* Section 7: Limitation de responsabilité */}
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Limitation de responsabilité</h2>
          <p>
            ÉcoTrajet fournit le service "tel quel" et "tel que disponible". Nous ne garantissons pas que le service 
            sera ininterrompu, sécurisé ou exempt d'erreurs.
          </p>
          
          {/* Section 8: Droit applicable */}
          <h2 className="text-xl font-semibold mt-8 mb-4">8. Droit applicable</h2>
          <p>
            Les présentes conditions sont régies par le droit français. Tout litige relatif à l'interprétation ou 
            à l'exécution des présentes conditions sera soumis aux tribunaux compétents de Paris.
          </p>
          
          {/* Section 9: Modifications des conditions */}
          <h2 className="text-xl font-semibold mt-8 mb-4">9. Modifications des conditions</h2>
          <p>
            ÉcoTrajet se réserve le droit de modifier les présentes conditions à tout moment. Les modifications 
            entreront en vigueur dès leur publication sur notre site.
          </p>
          
          {/* Section 10: Contact */}
          <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact</h2>
          <p>
            Pour toute question concernant les présentes conditions d'utilisation, veuillez nous contacter à l'adresse: contact@ecotrajet.fr
          </p>
        </div>

        {/* Pied de page avec date de dernière mise à jour */}
        <div className="mt-12 text-sm text-gray-500">
          Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfUse;
