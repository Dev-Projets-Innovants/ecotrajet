
import React from 'react';
import CommunityRulesTooltip from './CommunityRulesTooltip';

const CommunityHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Communauté ÉcoTrajet
        </h1>
        <CommunityRulesTooltip />
      </div>
      <p className="text-gray-600 max-w-2xl">
        Partagez vos expériences, posez des questions et découvrez les conseils 
        de la communauté pour une mobilité plus durable.
      </p>
    </div>
  );
};

export default CommunityHeader;
