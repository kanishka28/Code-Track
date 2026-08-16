import { createContext, useContext, useCallback, useEffect, useState } from "react";
import { getProgressSummary } from "../services/progressService";
import { useAuth } from "./AuthContext";

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {

    const { user } = useAuth();

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshSummary = useCallback(async () => {

        if (!user) {
            setSummary(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await getProgressSummary();
            setSummary(data);
        } catch (error) {
            console.error("Failed to load progress summary:", error);
        } finally {
            setLoading(false);
        }

    }, [user]);

    // Refetch whenever the logged-in user changes (login/logout)
    useEffect(() => {
        refreshSummary();
    }, [refreshSummary]);

    return (
        <ProgressContext.Provider value={{ summary, loading, refreshSummary }}>
            {children}
        </ProgressContext.Provider>
    );
}

export function useProgress() {
    const ctx = useContext(ProgressContext);
    if (!ctx) {
        throw new Error("useProgress must be used inside a ProgressProvider");
    }
    return ctx;
}