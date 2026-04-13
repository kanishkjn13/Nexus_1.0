import { useState, useEffect } from 'react';
import api from '../api/axios';

export function useProgress() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/sessions/progress/')
            .then((res) => setData(res.data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}