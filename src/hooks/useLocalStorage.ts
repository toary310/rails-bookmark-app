"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  
  const getStoredValue = (): T => {
    try {
      if (typeof window === "undefined") {
        return initialValue;
      }
      
      const item = window.localStorage.getItem(key);
      
      if (item) {
        try {
          const parsedItem = JSON.parse(item);
          console.log(`ローカルストレージから読み込み成功: ${key}`, parsedItem);
          return parsedItem;
        } catch (parseError) {
          console.error(`ローカルストレージの値のパースエラー: ${key}`, parseError);
          return initialValue;
        }
      } else {
        return initialValue;
      }
    } catch (error) {
      console.error(`ローカルストレージからの読み込みエラー: ${key}`, error);
      return initialValue;
    }
  };
  
  const [storedValue, setStoredValue] = useState<T>(() => getStoredValue());
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        console.log(`ローカルストレージに保存: ${key}`, valueToStore);
      }
    } catch (error) {
      console.error(`ローカルストレージへの保存エラー: ${key}`, error);
    }
  };
  
  useEffect(() => {
    const syncToLocalStorage = () => {
      try {
        const currentValue = window.localStorage.getItem(key);
        if (currentValue === null) {
          window.localStorage.setItem(key, JSON.stringify(initialValue));
          console.log(`ローカルストレージに初期値を設定: ${key}`, initialValue);
        }
      } catch (error) {
        console.error(`ローカルストレージの初期化エラー: ${key}`, error);
      }
    };
    
    if (typeof window !== "undefined") {
      syncToLocalStorage();
      
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === key && event.newValue !== null) {
          try {
            const newValue = JSON.parse(event.newValue);
            console.log(`ストレージイベント検出: ${key}`, newValue);
            setStoredValue(newValue);
          } catch (error) {
            console.error(`ストレージイベント処理エラー: ${key}`, error);
          }
        }
      };
      
      window.addEventListener("storage", handleStorageChange);
      
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, [key, initialValue]);
  
  return [storedValue, setValue];
}
