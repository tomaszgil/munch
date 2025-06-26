import { useCallback, useState } from "react";

type AsyncStatus = "idle" | "loading" | "success" | "error";

type InternalAsyncState<T> = {
  data: T | null;
  error: Error | null;
  status: AsyncStatus;
};

type AsyncState<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isIdle: boolean;
};

type UseLazyAsyncReturn<T> = [
  (signal?: AbortSignal) => Promise<T | null>,
  AsyncState<T>,
];

export function useLazyAsync<T>(
  asyncFn: (signal?: AbortSignal) => Promise<T>
): UseLazyAsyncReturn<T> {
  const [state, setState] = useState<InternalAsyncState<T>>({
    data: null,
    error: null,
    status: "idle",
  });

  const execute = useCallback(
    async (signal?: AbortSignal): Promise<T | null> => {
      setState({
        data: null,
        error: null,
        status: "loading",
      });

      try {
        const result = await asyncFn(signal);
        setState({
          data: result,
          error: null,
          status: "success",
        });
        return result;
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        setState({
          data: null,
          error: errorObj,
          status: "error",
        });
        return null;
      }
    },
    [asyncFn]
  );

  return [
    execute,
    {
      data: state.data,
      error: state.error,
      isLoading: state.status === "loading",
      isError: state.status === "error",
      isSuccess: state.status === "success",
      isIdle: state.status === "idle",
    },
  ];
}
