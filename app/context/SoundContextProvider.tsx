import React, { useState } from "react";
import SoundContext from "./SoundContext";

const SoundContextProvider = ({ children }: { children: any }) => {
  const [playingSound, setPlayingSound] = useState<any>(null);

  return (
    <SoundContext.Provider value={{ playingSound, setPlayingSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export default SoundContextProvider;
