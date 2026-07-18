import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { StockLocation } from "../types/stockLocations";
import { getStockLocationsRequest } from "../api/stockLocations";
import { StockLocationContext } from "./StockLocationContext";
import { useAuth } from "./useAuth";

type Props = {
  children: ReactNode;
};

export function StockLocationProvider({ children }: Props) {
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [activeLocationId, setActiveLocationIdState] = useState<number | null>(
    null,
  );

  // Pri prvom renderi už vieme, že sa bude načítavať.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: isAuthLoading } = useAuth();

  const applyLocations = useCallback((data: StockLocation[]) => {
    setLocations(data);

    setActiveLocationIdState((currentId) => {
      const currentStillExists = data.some(
        (location) => location.id === currentId,
      );

      if (currentStillExists) {
        return currentId;
      }

      const defaultLocation = data.find((location) => location.isDefault);

      return defaultLocation?.id ?? data[0]?.id ?? null;
    });
  }, []);

  const fetchLocations = useCallback(async (): Promise<StockLocation[]> => {
    const data = await getStockLocationsRequest();

    console.log("Stock locations:", data);

    return data;
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function initializeLocations() {
      // Počkáme, kým AuthProvider dokončí /auth/me alebo login.
      if (isAuthLoading) {
        return;
      }

      // Používateľ nie je prihlásený.
      if (!user) {
        if (!isCancelled) {
          setLocations([]);
          setActiveLocationIdState(null);
          setError(null);
          setIsLoading(false);
        }

        return;
      }

      try {
        setIsLoading(true);

        const data = await fetchLocations();

        if (isCancelled) {
          return;
        }

        applyLocations(data);
        setError(null);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setLocations([]);
        setActiveLocationIdState(null);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load stock locations",
        );
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void initializeLocations();

    return () => {
      isCancelled = true;
    };
  }, [user, isAuthLoading, fetchLocations, applyLocations]);

  const refreshLocations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchLocations();

      applyLocations(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load stock locations",
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetchLocations, applyLocations]);

  const setActiveLocationId = useCallback(
    (id: number) => {
      const locationExists = locations.some((location) => location.id === id);

      if (locationExists) {
        setActiveLocationIdState(id);
      }
    },
    [locations],
  );

  const activeLocation = useMemo(
    () =>
      locations.find((location) => location.id === activeLocationId) ?? null,
    [locations, activeLocationId],
  );

  const value = useMemo(
    () => ({
      locations,
      activeLocationId,
      activeLocation,
      isLoading,
      error,
      setActiveLocationId,
      refreshLocations,
    }),
    [
      locations,
      activeLocationId,
      activeLocation,
      isLoading,
      error,
      refreshLocations,
      setActiveLocationId,
    ],
  );

  return (
    <StockLocationContext.Provider value={value}>
      {children}
    </StockLocationContext.Provider>
  );
}
