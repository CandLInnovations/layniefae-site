'use client';

import React, { useState } from 'react';
import Header from './Header';
import ConsultationWizard from '../ConsultationWizard';
import ShoppingCart from '../ShoppingCart';

const HeaderWrapper: React.FC = () => {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <>
      <Header onConsultationClick={() => setShowWizard(true)} />
      {showWizard && (
        <ConsultationWizard onClose={() => setShowWizard(false)} />
      )}
      <ShoppingCart />
    </>
  );
};

export default HeaderWrapper;