import React, { useEffect, useState } from 'react';
import { getLeaderboard, LeaderboardEntry } from '../services/api';
import { Trophy, Medal } from 'lucide-react';

export const Leaderboard: React.FC = () => {
    const [data, setData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLeaderboard().then(res => {
            setData(res);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="text-center py-4 text-gray-500 animate-pulse">Loading leaderboard...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-nature-100 p-2 rounded-lg text-nature-600">
                    <Trophy size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Hostel Leaderboard</h2>
            </div>

            <div className="flex flex-col gap-3">
                {data.map((user, index) => (
                    <div key={user.user_id} className={`flex items-center justify-between p-3 flex-row rounded-xl ${index === 0 ? 'bg-amber-50 border border-amber-200' : index === 1 ? 'bg-slate-50 border border-slate-200' : index === 2 ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50 border border-transparent'}`}>
                        <div className="flex items-center gap-3">
                            <span className={`font-bold w-6 text-center ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-500' : index === 2 ? 'text-orange-600' : 'text-gray-400'}`}>
                                {index < 3 ? <Medal size={20} className="mx-auto" /> : `#${index + 1}`}
                            </span>
                            <span className="font-semibold text-gray-700">{user.user_name}</span>
                        </div>
                        <div className="text-sm font-medium">
                            <span className="text-nature-600">{user.total_co2_saved.toFixed(1)}</span>
                            <span className="text-gray-400 ml-1">kg CO₂ saved</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
