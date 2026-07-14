import { useContext } from "react";
import { StockLocationContext } from "./StockLocationContext";

export function useStockLocation() {
  const context = useContext(StockLocationContext);

  if (!context) {
    throw new Error(
      "useStockLocation must be used inside StockLocationProvider",
    );
  }

  return context;
}
