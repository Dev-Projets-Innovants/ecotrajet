
import React from 'react';
import { Layout } from '@/components/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout title="Politique de confidentialité">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>
        
        <div className="prose prose-green max-w-none">
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            La présente politique de confidentialité décrit comment ÉcoTrajet collecte, utilise et partage 
            vos informations personnelles lorsque vous utilisez notre application.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Informations que nous collectons</h2>
          <p>
            Nous collectons plusieurs types d'informations vous concernant, notamment:
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>Informations personnelles: nom, adresse e-mail, numéro de téléphone</li>
            <li>Informations de localisation: données GPS pour les itinéraires et suggestions</li>
            <li>Données d'utilisation: habitudes de déplacement, préférences de transport</li>
            <li>Informations sur l'appareil: type d'appareil, version du système d'exploitation, identifiants uniques</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. Comment nous utilisons vos informations</h2>
          <p>
            Nous utilisons les informations collectées pour:
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>Fournir, maintenir et améliorer notre service</li>
            <li>Personnaliser votre expérience utilisateur</li>
            <li>Communiquer avec vous concernant votre compte ou nos services</li>
            <li>Analyser l'utilisation de notre service afin de l'améliorer</li>
            <li>Calculer votre impact environnemental et proposer des alternatives durables</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Partage de vos informations</h2>
          <p>
            Nous ne vendons pas vos données personnelles. Nous pouvons partager vos informations avec:
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>Des prestataires de services qui nous aident à exploiter notre application</li>
            <li>Des partenaires pour les programmes de récompenses et défis</li>
            <li>Des autorités légales si nous y sommes contraints par la loi</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Protection de vos informations</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles. 
            Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est totalement sécurisée.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Conservation des données</h2>
          <p>
            Nous conservons vos informations aussi longtemps que nécessaire pour fournir nos services 
            et remplir nos obligations légales. Vous pouvez demander la suppression de vos données à tout moment.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Droits des utilisateurs</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants:
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>Droit d'accès à vos données personnelles</li>
            <li>Droit de rectification des données inexactes</li>
            <li>Droit à l'effacement de vos données</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité des données</li>
            <li>Droit d'opposition au traitement</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">8. Cookies et technologies similaires</h2>
          <p>
            Notre application utilise des cookies et technologies similaires pour améliorer l'expérience utilisateur, 
            analyser les tendances et administrer le site.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">9. Modifications de cette politique</h2>
          <p>
            Nous pouvons mettre à jour notre politique de confidentialité de temps à autre. Nous vous informerons de tout 
            changement en publiant la nouvelle politique sur cette page.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">10. Nous contacter</h2>
          <p>
            Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à:
          </p>
          <p className="mt-2">
            Email: privacy@ecotrajet.fr<br />
            Adresse: 123 Avenue de la Mobilité Durable, 75001 Paris, France
          </p>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
