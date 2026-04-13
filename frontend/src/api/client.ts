export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

export function getImageUrl(imagePath?: string | null): string | undefined {
    if (!imagePath) return undefined;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE}${imagePath}`;
}

export function authHeaders(): Record<string, string> {
    const token = localStorage.getItem('access');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T = unknown>(
    path: string,
    options: RequestInit & { multipart?: boolean } = {}
): Promise<T> {
    const { multipart, ...fetchOptions } = options;
    const headers: Record<string, string> = {
        ...authHeaders(),
        ...(options.headers as Record<string, string>),
    };
    if (!multipart) headers['Content-Type'] = 'application/json';

    const res = await fetch(`${API_BASE}${path}`, { ...fetchOptions, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as any)?.detail ?? `Request failed: ${res.status}`);
    return data as T;
}