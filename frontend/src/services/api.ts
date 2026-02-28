import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export interface SwapSuggestion {
    original_item: string;
    swap_item: string;
    co2_saved: number;
    reasoning: string;
}

export interface DetectionResponse {
    detected_items: string[];
    total_co2: number;
    metaphor: string;
    swaps: SwapSuggestion[];
    leaderboard_rank?: number;
}

export interface LeaderboardEntry {
    user_id: string;
    user_name: string;
    total_co2_saved: number;
    rank?: number;
}

export interface TrendData {
    date: string;
    co2_emitted: number;
}

export const detectFood = async (imageFile: File): Promise<DetectionResponse> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axios.post<DetectionResponse>(`${API_URL}/detect`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    const response = await axios.get<LeaderboardEntry[]>(`${API_URL}/leaderboard`);
    return response.data;
};

export const getTrend = async (userId: string): Promise<TrendData[]> => {
    const response = await axios.get<TrendData[]>(`${API_URL}/trend/${userId}`);
    return response.data;
};
