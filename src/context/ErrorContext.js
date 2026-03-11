"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import ErrorModal from "@/components/ui/ErrorModal";
import { setErrorHandler } from "@/utils/api";
import { handleApiError } from "@/utils/ErrorHandler";

const ErrorContext = createContext();

export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    setErrorHandler((error) => {
      showError(handleApiError(error));
    });
  }, []);

  const showError = useCallback((message, options = {}) => {
    setError({
      message,
      type: options.type || "error", // error | warning | info
    });
  }, []);

  const clearError = () => setError(null);

  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {children}
      {error && (
        <ErrorModal
          message={error.message}
          type={error.type}
          onClose={clearError}
        />
      )}
    </ErrorContext.Provider>
  );
};
