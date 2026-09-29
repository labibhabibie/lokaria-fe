"use client";

import { useCallback, useMemo, useRef, useSyncExternalStore, type Dispatch, type SetStateAction } from "react";

export function usePartnerStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const initialJson = useRef(JSON.stringify(initialValue)).current;
  const eventName = `lokaria-storage:${key}`;
  const subscribe = useCallback((notify: () => void) => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) notify();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(eventName, notify);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(eventName, notify);
    };
  }, [eventName, key]);
  const getSnapshot = useCallback(() => window.localStorage.getItem(key) ?? initialJson, [initialJson, key]);
  const getServerSnapshot = useCallback(() => initialJson, [initialJson]);
  const serialized = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo(() => {
    try {
      return JSON.parse(serialized) as T;
    } catch {
      return initialValue;
    }
  }, [initialValue, serialized]);
  const setValue: Dispatch<SetStateAction<T>> = useCallback((action) => {
    const currentJson = window.localStorage.getItem(key) ?? initialJson;
    let current = initialValue;
    try {
      current = JSON.parse(currentJson) as T;
    } catch {
      window.localStorage.removeItem(key);
    }
    const next = typeof action === "function" ? (action as (previous: T) => T)(current) : action;
    window.localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new Event(eventName));
  }, [eventName, initialJson, initialValue, key]);

  return [value, setValue];
}
