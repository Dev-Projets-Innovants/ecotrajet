
import React from 'react';
import { Layout } from '@/components/Layout';

const LegalNotice = () => {
  return (
    <Layout title="Mentions légales">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>
        
        <div className="prose prose-green max-w-none">
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Informations légales</h2>
          <p>
            Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 pour 
            la Confiance dans l'économie numérique, dite L.C.E.N., nous portons à la connaissance des utilisateurs 
            les informations suivantes:
          </p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">1.1 Éditeur</h3>
          <p>
            Le site ÉcoTrajet est édité par:<br />
            ÉcoTrajet SAS<br />
            Société par Actions Simplifiée au capital de 50 000 €<br />
            123 Avenue de la Mobilité Durable, 75001 Paris, France<br />
            Immatriculée au RCS de Paris sous le numéro: 123 456 789<br />
            Numéro de TVA intracommunautaire: FR 12 123456789<br />
            Téléphone: +33 1 23 45 67 89<br />
            Email: contact@ecotrajet.fr
          </p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">1.2 Directeur de la publication</h3>
          <p>
            Le Directeur de la publication est Monsieur/Madame [Nom du directeur], en sa qualité de Président de la société ÉcoTrajet SAS.
          </p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">1.3 Hébergeur</h3>
          <p>
            Le site ÉcoTrajet est hébergé par:<br />
            [Nom de l'hébergeur]<br />
            [Adresse de l'hébergeur]<br />
            [Téléphone de l'hébergeur]
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Accès au site</h2>
          <p>
            Le site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. 
            Tous les coûts afférents à l'accès au site, que ce soient les frais matériels, logiciels ou 
            d'accès à Internet sont exclusivement à la charge de l'utilisateur.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. Propriété intellectuelle</h2>
          <p>
            L'ensemble des éléments constituant le site ÉcoTrajet (textes, graphismes, logiciels, photographies, 
            images, vidéos, sons, logos, marques, etc.) est la propriété exclusive de la société ÉcoTrajet SAS 
            ou de ses partenaires. Toute reproduction, représentation, modification, publication, adaptation totale 
            ou partielle des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, 
            sauf autorisation écrite préalable de la société ÉcoTrajet SAS.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Gestion du site</h2>
          <p>
            La société ÉcoTrajet SAS se réserve le droit de modifier ou supprimer, à tout moment, sans préavis, 
            tout contenu ou information présent sur le site.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Limitation de responsabilité</h2>
          <p>
            La société ÉcoTrajet SAS ne pourra être tenue responsable des dommages directs et indirects causés 
            au matériel de l'utilisateur, lors de l'accès au site ÉcoTrajet.
          </p>
          <p className="mt-2">
            ÉcoTrajet SAS décline toute responsabilité quant à l'utilisation qui pourrait être faite des 
            informations et contenus présents sur le site.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Droit applicable et juridiction compétente</h2>
          <p>
            Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux 
            français seront compétents.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Données personnelles</h2>
          <p>
            Les informations concernant la collecte et le traitement des données personnelles sont détaillées 
            dans notre Politique de confidentialité.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">8. Crédits</h2>
          <p>
            Conception et développement: ÉcoTrajet SAS<br />
            Illustrations: [Nom du créateur]<br />
            Photographies: [Source des photographies]
          </p>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
        </div>
      </div>
    </Layout>
  );
};

export default LegalNotice;
