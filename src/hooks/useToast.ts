import { useCallback, useEffect, useRef, useState } from 'react';

/** Mensagem temporária (toast). O timer é cancelado ao trocar de mensagem e ao desmontar. */
export function useToast(durationMs = 3000) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const showToast = useCallback(
    (message: string) => {
      window.clearTimeout(timerRef.current);
      setToastMessage(message);
      timerRef.current = window.setTimeout(() => setToastMessage(null), durationMs);
    },
    [durationMs],
  );

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return { toastMessage, showToast };
}

