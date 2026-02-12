import { useState, useCallback } from "react";
import { streamAffirmation } from "@/lib/affirmation-stream";

export function useAffirmation() {
  const [affirmation, setAffirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (message: string) => {
    setAffirmation("");
    setError(null);
    setIsLoading(true);

    let soFar = "";

    await streamAffirmation({
      message,
      onDelta: (chunk) => {
        soFar += chunk;
        setAffirmation(soFar);
      },
      onDone: () => setIsLoading(false),
      onError: (err) => {
        setError(err);
        setIsLoading(false);
      },
    });
  }, []);

  const reset = useCallback(() => {
    setAffirmation("");
    setError(null);
  }, []);

  return { affirmation, isLoading, error, generate, reset };
}
