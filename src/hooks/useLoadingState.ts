import { useState } from 'react';
import { LoadingState } from '../types';

export const useLoadingState = (initialState: LoadingState = { isLoading: false, error: null }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>(initialState);

  const setLoading = (isLoading: boolean) => {
    setLoadingState(prev => ({ ...prev, isLoading }));
  };

  const setError = (error: string | null) => {
    setLoadingState(prev => ({ ...prev, error, isLoading: false }));
  };

  const reset = () => {
    setLoadingState({ isLoading: false, error: null });
  };

  const startLoading = () => {
    setLoadingState({ isLoading: true, error: null });
  };

  return {
    loadingState,
    setLoadingState,
    setLoading,
    setError,
    reset,
    startLoading,
    isLoading: loadingState.isLoading,
    error: loadingState.error,
  };
};