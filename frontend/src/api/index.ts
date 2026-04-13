const BASE = 'http://127.0.0.1:8000/api';

function token() {
    return localStorage.getItem('access') || '';
}

function authHeaders(): HeadersInit {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token()}`,
    };
}

async function request<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE}${path}`, { headers: authHeaders() });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
}

export const api = {
    progress: () => request<ProgressResponse>('/progress/'),
    aiFeedback: () => request<AIFeedbackResponse>('/ai-feedback/'),
    sessions: () => request<Session[]>('/sessions/'),
};

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Session {
    id: number;
    topic: string;
    score: number;
    total_questions: number;
    accuracy: number;
    time_limit: number;
    time_taken: number;
    timed_out: boolean;
    created_at: string;
}

export interface TopicStats {
    topic: string;
    accuracy: number;
    sessions: number;
    total_questions: number;
    total_correct: number;
}

export interface ProgressResponse {
    overall: {
        total_sessions: number;
        total_questions_attempted: number;
        total_correct_answers: number;
        accuracy: number;
    };
    topics: Record<string, {
        accuracy: number;
        sessions: number;
        total_questions: number;
        total_correct: number;
    }>;
}

export interface AIFeedbackResponse {
    topic_stats: TopicStats[];
    feedback: {
        weak_topics: string[];
        strong_topics: string[];
        feedback: string;
        next_steps: string[];
    } | null;
    message?: string;
}