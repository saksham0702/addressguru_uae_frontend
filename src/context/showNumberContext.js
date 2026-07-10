import React, { createContext, useContext, useState } from "react";

const ShowNumberContext = createContext(null);

const MAX_FREE_REVEALS = 2;

export const ShowNumberProvider = ({ children }) => {
  const [revealCount, setRevealCount] = useState(0);

  const canReveal = () => revealCount < MAX_FREE_REVEALS;

  const registerReveal = () => {
    setRevealCount((prev) => prev + 1);
  };

  return (
    <ShowNumberContext.Provider
      value={{ revealCount, canReveal, registerReveal, MAX_FREE_REVEALS }}
    >
      {children}
    </ShowNumberContext.Provider>
  );
};

export const useShowNumber = () => {
  const ctx = useContext(ShowNumberContext);
  if (!ctx) {
    throw new Error("useShowNumber must be used within a ShowNumberProvider");
  }
  return ctx;
};
