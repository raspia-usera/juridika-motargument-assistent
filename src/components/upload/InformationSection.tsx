
import React from 'react';

const InformationSection: React.FC = () => {
  return (
    <div className="mt-6 alert alert-info">
      <p className="text-sm">
        <strong>OBS:</strong> För utvecklings- och testningsändamål används temporärt anonym åtkomst.
        I produktionsmiljö kommer striktare behörighetsregler att implementeras. Alla uppladdade dokument 
        lagras säkert och bearbetas lokalt för maximal integritet.
      </p>
    </div>
  );
};

export default InformationSection;
