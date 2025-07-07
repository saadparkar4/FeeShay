import { useState, useCallback } from "react";

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
    execute: (...args: any[]) => Promise<void>;
    reset: () => void;
}

export const useApi = <T>(apiFunction: (...args: any[]) => Promise<{ data: T }>): UseApiReturn<T> => {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = useCallback(
        async (...args: any[]) => {
            setState((prev) => ({ ...prev, loading: true, error: null }));

            try {
                const response = await apiFunction(...args);
                setState({
                    data: response.data,
                    loading: false,
                    error: null,
                });
            } catch (error: any) {
                setState({
                    data: null,
                    loading: false,
                    error: error.response?.data?.message || error.message || "An error occurred",
                });
            }
        },
        [apiFunction]
    );

    const reset = useCallback(() => {
        setState({
            data: null,
            loading: false,
            error: null,
        });
    }, []);

    return {
        ...state,
        execute,
        reset,
    };
};
