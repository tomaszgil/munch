import { useSyncExternalStore } from "react";

export function useLocalStorageState<T>(key: string, defaultValue: T) {
  const subscribe = (listener: () => void) => {
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  };

  const getSnapshot = () => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  };

  const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const setValue = (newValue: T | ((prev: T) => T)) => {
    const valueToStore =
      newValue instanceof Function ? newValue(value) : newValue;
    localStorage.setItem(key, JSON.stringify(valueToStore));
    // Trigger storage event for other tabs
    window.dispatchEvent(new StorageEvent("storage", { key }));
  };

  return [value, setValue] as const;
}
