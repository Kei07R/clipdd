import { createContext, useContext, useState } from 'react';
import { StyleResult } from '../services/api';

type ImageContextType = {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
  results: StyleResult[];
  setResults: (results: StyleResult[]) => void;
};

const ImageContext = createContext<ImageContextType>({
  imageUri: null,
  setImageUri: () => {},
  results: [],
  setResults: () => {},
});

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [results, setResults] = useState<StyleResult[]>([]);
  return (
    <ImageContext.Provider value={{ imageUri, setImageUri, results, setResults }}>
      {children}
    </ImageContext.Provider>
  );
}

export function useImage() {
  return useContext(ImageContext);
}
