"use client"
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
    label: string;
    value: string;
    trend: number;
}

export default function KPICard({ label, value, trend }: KPICardProps) {
    const isPositive = trend >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card flex flex-col justify-between"
        >
            <div className="flex flex-col gap-1">
                <span className="text-gray-400 text-sm font-medium">{label}</span>
                <span className="text-3xl font-bold tracking-tight">{value}</span>
            </div>

            <div className={`flex items-center gap-1 mt-4 text-sm font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{Math.abs(trend)}%</span>
                <span className="text-gray-500 font-normal ml-1">vs last month</span>
            </div>
        </motion.div>
    );
}
