import React, { createContext, useContext, useState } from 'react';

const ConciergeContext = createContext();

export const ConciergeProvider = ({ children }) => {
  const [isConsulting, setIsConsulting] = useState(false);
  const [focusConfig, setFocusConfig] = useState({
    blur: false,
    opacity: 1,
  });

  const startConsultation = () => {
    setIsConsulting(true);
    setFocusConfig({ blur: true, opacity: 0.3 });
  };

  const endConsultation = () => {
    setIsConsulting(false);
    setFocusConfig({ blur: false, opacity: 1 });
  };

  return (
    <ConciergeContext.Provider value={{ isConsulting, focusConfig, startConsultation, endConsultation }}>
      {children}
    </ConciergeContext.Provider>
  );
};

export const useConcierge = () => useContext(ConciergeContext);
