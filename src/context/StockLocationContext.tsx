import { createContext } from "react";
import { type StockLocation } from "../types/stockLocations";

type StockLocationContextType = {
  locations: StockLocation[];
  activeLocationId: number | null;
  activeLocation: StockLocation | null;
  isLoading: boolean;
  error: string | null;
  setActiveLocationId: (id: number) => void;
  refreshLocations: () => Promise<void>;
};

export const StockLocationContext =
  createContext<StockLocationContextType | null>(null);
