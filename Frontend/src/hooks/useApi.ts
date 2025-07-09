import React, { useState, useCallback, useEffect } from "react";

// Generic API response interface
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
    execute: (...args: any[]) => Promise<void>;
    reset: () => void;
}

export const useApi = <T>(
    apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
    options?: {
        immediate?: boolean;
        onSuccess?: (data: T) => void;
        onError?: (error: string) => void;
    }
): UseApiReturn<T> => {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = useCallback(
        async (...args: any[]) => {
            try {
                setState((prev) => ({ ...prev, loading: true, error: null }));

                const response = await apiFunction(...args);

                if (response.success && response.data) {
                    setState({
                        data: response.data,
                        loading: false,
                        error: null,
                    });
                    options?.onSuccess?.(response.data);
                } else {
                    const errorMessage = response.error || response.message || "An error occurred";
                    setState({
                        data: null,
                        loading: false,
                        error: errorMessage,
                    });
                    options?.onError?.(errorMessage);
                }
            } catch (err: any) {
                const errorMessage = err.message || "An error occurred";
                setState({
                    data: null,
                    loading: false,
                    error: errorMessage,
                });
                options?.onError?.(errorMessage);
            } finally {
                setState((prev) => ({ ...prev, loading: false }));
            }
        },
        [apiFunction, options]
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

// Hook for paginated data
interface UsePaginatedApiReturn<T> {
    data: T[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    reset: () => void;
}

export function usePaginatedApi<T = any>(
    apiFunction: (params: { page: number; limit: number; [key: string]: any }) => Promise<
        ApiResponse<{
            data: T[];
            total: number;
            page: number;
            limit: number;
        }>
    >,
    initialParams?: Record<string, any>
): UsePaginatedApiReturn<T> {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);

    const loadData = useCallback(
        async (pageNum: number, append: boolean = false) => {
            try {
                setLoading(true);
                setError(null);

                const response = await apiFunction({
                    page: pageNum,
                    limit: 10,
                    ...initialParams,
                });

                if (response.success && response.data) {
                    const { data: newData, total: totalCount, page: currentPage, limit } = response.data;

                    if (append) {
                        setData((prev) => [...prev, ...newData]);
                    } else {
                        setData(newData);
                    }

                    setTotal(totalCount);
                    setPage(currentPage);
                    setHasMore(currentPage * limit < totalCount);
                } else {
                    const errorMessage = response.error || response.message || "An error occurred";
                    setError(errorMessage);
                }
            } catch (err: any) {
                const errorMessage = err.message || "An error occurred";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [apiFunction, initialParams]
    );

    const loadMore = useCallback(async () => {
        if (!loading && hasMore) {
            await loadData(page + 1, true);
        }
    }, [loading, hasMore, page, loadData]);

    const refresh = useCallback(async () => {
        setPage(1);
        setHasMore(true);
        await loadData(1, false);
    }, [loadData]);

    const reset = useCallback(() => {
        setData([]);
        setLoading(false);
        setError(null);
        setPage(1);
        setHasMore(true);
        setTotal(0);
    }, []);

    return {
        data,
        loading,
        error,
        hasMore,
        loadMore,
        refresh,
        reset,
    };
}

// Hook for real-time data updates
interface UseRealtimeApiReturn<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useRealtimeApi<T = any>(
    apiFunction: () => Promise<ApiResponse<T>>,
    interval: number = 30000 // 30 seconds default
): UseRealtimeApiReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiFunction();

            if (response.success && response.data) {
                setData(response.data);
            } else {
                const errorMessage = response.error || response.message || "An error occurred";
                setError(errorMessage);
            }
        } catch (err: any) {
            const errorMessage = err.message || "An error occurred";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [apiFunction]);

    useEffect(() => {
        fetchData();

        const intervalId = setInterval(fetchData, interval);

        return () => clearInterval(intervalId);
    }, [fetchData, interval]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
}
