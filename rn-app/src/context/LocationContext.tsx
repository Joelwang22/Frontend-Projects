import React, { createContext, useState, useContext } from 'react';

type Coords = { lat: number; lng: number } | null;
type LocationCtx = {
  coords: Coords;
  setCoords: (c: Coords) => void;
};

const LocationContext = createContext<LocationCtx | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [coords, setCoords] = useState<Coords>(null);
  return (
    <LocationContext.Provider value={{ coords, setCoords }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation outside provider');
  return ctx;
};
