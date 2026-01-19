"use client"
import { motion } from "framer-motion";
import { Sparkles, Lightbulb, ArrowRight } from "lucide-react";

interface AIInsightsProps {
    summary: string;
    recommendations: string[];
    loading?: boolean;
}

export default function AIInsights({ summary, recommendations, loading }: AIInsightsProps) {
    if (loading) {
        return (
            <div className="glass-card animate-pulse flex flex-col gap-4 h-[400px]">
                <div className="h-6 w-1/4 bg-white/10 rounded"></div>
                <div className="h-20 w-full bg-white/10 rounded"></div>
                <div className="h-40 w-full bg-white/10 rounded"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card flex flex-col gap-6"
        >
            <div className="flex items-center gap-3">
                <div className="bg-indigo-500/20 p-2 rounded-lg">
                    <Sparkles className="text-indigo-400" size={24} />
                </div>
                <h2 className="text-xl font-bold">GenAI Strategic Insights</h2>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-gray-300 leading-relaxed">
                    {summary}
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="flex items-center gap-2 font-semibold text-gray-200">
                    <Lightbulb size={20} className="text-amber-400" />
                    Recommended Actions
                </h3>
                <div className="grid gap-3">
                    {recommendations.map((rec, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
                        >
                            <div className="mt-1 bg-indigo-500/20 p-1 rounded-full group-hover:bg-indigo-500/40 transition-colors">
                                <ArrowRight size={14} className="text-indigo-400" />
                            </div>
                            <span className="text-sm text-gray-300">{rec}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
