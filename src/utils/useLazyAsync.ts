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

type UseLazyAsyncReturn<T, Args extends any[]> = [
  (...args: Args) => Promise<T | null>,
  AsyncState<T>,
];

export function useLazyAsync<T, Args extends any[]>(
  asyncFn: (...args: Args) => Promise<T>
): UseLazyAsyncReturn<T, Args> {
  const [state, setState] = useState<InternalAsyncState<T>>({
    data: null,
    error: null,
    status: "idle",
  });

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setState({
        data: null,
        error: null,
        status: "loading",
      });

      try {
        const result = await asyncFn(...args);
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
