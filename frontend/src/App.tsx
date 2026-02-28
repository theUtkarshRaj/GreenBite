import { useEffect, useState } from 'react';
import { detectFood, DetectionResponse } from './services/api';
import { CameraCapture } from './components/CameraCapture';
import { Leaderboard } from './components/Leaderboard';
import { Leaf, ArrowRight, Loader2, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getTrend, TrendData } from './services/api';

function App() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<DetectionResponse | null>(null);
    const [trend, setTrend] = useState<TrendData[]>([]);

    useEffect(() => {
        getTrend("user_1").then(setTrend).catch(console.error);
    }, []);

    const handleCapture = async (file: File) => {
        setLoading(true);
        try {
            const res = await detectFood(file);
            setResult(res);
        } catch (error) {
            console.error("Detection failed:", error);
            alert("Failed to connect to backend. Ensure it is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10 w-full shadow-sm">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-2">
                    <div className="bg-nature-500 p-1.5 rounded-lg text-white">
                        <Leaf size={24} />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-nature-600 to-emerald-600 bg-clip-text text-transparent">
                        GreenBite
                    </h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 mt-8 flex flex-col gap-8 md:flex-row md:items-start">
                {/* Left Column: Camera and Results */}
                <div className="flex-1 flex flex-col gap-6">
                    <CameraCapture onCapture={handleCapture} />

                    {loading && (
                        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-500">
                            <Loader2 className="animate-spin mb-4 text-nature-500" size={32} />
                            <p className="font-medium animate-pulse">Analyzing carbon footprint...</p>
                        </div>
                    )}

                    {result && !loading && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-nature-50 border-b border-nature-100 p-6 flex flex-col items-center text-center">
                                <span className="text-sm font-semibold text-nature-600 uppercase tracking-wider mb-2">Total Estimated Footprint</span>
                                <div className="text-5xl font-black text-gray-800 tracking-tight flex items-baseline gap-2">
                                    {result.total_co2} <span className="text-2xl font-bold text-gray-400">kg CO₂</span>
                                </div>
                            </div>

                            <div className="p-6 border-b border-gray-100 flex items-start gap-3 bg-blue-50/50">
                                <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
                                <p className="text-sm font-medium text-blue-800 leading-relaxed italic border-l-2 border-blue-400 pl-3">
                                    "{result.metaphor}"
                                </p>
                            </div>

                            {result.swaps.length > 0 && (
                                <div className="p-6">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Leaf size={18} className="text-emerald-500" /> Greener Alternatives
                                    </h3>
                                    <div className="flex flex-col gap-3">
                                        {result.swaps.map((swap, i) => (
                                            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2 text-sm font-bold">
                                                        <span className="line-through text-gray-400">{swap.original_item}</span>
                                                        <ArrowRight size={14} className="text-gray-300" />
                                                        <span className="text-emerald-600">{swap.swap_item}</span>
                                                    </div>
                                                    <span className="text-xs font-bold leading-none bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                                                        Save {swap.co2_saved} kg
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 leading-relaxed">{swap.reasoning}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column: Trend and Leaderboard */}
                <div className="flex-1 flex flex-col gap-6 w-full max-w-md mx-auto md:max-w-none">
                    {/* Trend Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Your Weekly Trend</h2>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="date" tickFormatter={(val) => val.split("-")[2]} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Line type="monotone" dataKey="co2_emitted" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <Leaderboard />
                </div>
            </main>
        </div>
    );
}

export default App;
