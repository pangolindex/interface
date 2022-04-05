import { useLayoutEffect, useMemo, useState } from "react";
import { DataWrapper } from "src/store/helpers";
import {
  Metadata,
} from "src/utils/bridgeUtils/metaplex";


const useMetaplexData = (
  addresses: string[]
): DataWrapper<Map<string, Metadata | undefined> | undefined> => {
  const [results, setResults] = useState<
    Map<string, Metadata | undefined> | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [receivedAt, setReceivedAt] = useState<string | null>(null);

  useLayoutEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    return () => {
      cancelled = true;
    };
  }, [addresses, setResults, setIsLoading, setError]);

  const output = useMemo(
    () => ({
      data: results,
      isFetching: isLoading,
      error,
      receivedAt,
    }),
    [results, isLoading, error, receivedAt]
  );
  return output;
};

export default useMetaplexData;
