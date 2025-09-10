'use client';

import React, { useState } from 'react';
import Header from './Header';
import ConsultationWizard from '../ConsultationWizard';

const HeaderWrapper: React.FC = () => {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <>
      <Header onConsultationClick={() => setShowWizard(true)} />
      {showWizard && (
        <ConsultationWizard onClose={() => setShowWizard(false)} />
      )}
    </>
  );
};

export default HeaderWrapper;