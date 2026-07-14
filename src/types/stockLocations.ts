// src/api/stockLocations.ts

export type StockLocation = {
  id: number;
  name: string;
  isDefault: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tabletStocks: number;
  };
};
