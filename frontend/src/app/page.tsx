"use client"
import { useEffect, useState } from "react";
import { fetchKPIs, fetchDailySales, fetchCategorySales, fetchAIInsights } from "@/lib/api";
import KPICard from "@/components/KPICard";
import { SalesTrendChart, CategoryBarChart } from "@/components/Charts";
import AIInsights from "@/components/AIInsights";
import { LayoutDashboard, Database, BarChart3, Settings, LogOut, Search, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [kpis, setKpis] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [aiInsights, setAiInsights] = useState({ summary: "", recommendations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [kpiData, dailyData, catData, aiData] = await Promise.all([
          fetchKPIs(),
          fetchDailySales(),
          fetchCategorySales(),
          fetchAIInsights()
        ]);
        setKpis(kpiData);
        setDailySales(dailyData);
        setCategorySales(catData);
        setAiInsights(aiData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <main className="flex min-h-screen">
      <div className="mesh-bg" />

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col gap-8 fixed h-full bg-black/20 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
            <Database className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">ETL<span className="text-indigo-400">Gen</span></h1>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<BarChart3 size={20} />} label="Analytics" />
          <NavItem icon={<Database size={20} />} label="Data Pipeline" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="mt-auto">
          <NavItem icon={<LogOut size={20} />} label="Logout" />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Business Intelligence</h2>
            <p className="text-gray-400 mt-1">Real-time insights from your ETL pipeline</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search metrics..."
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-indigo-500 transition-colors w-64"
              />
            </div>
            <button className="bg-white/5 p-2 rounded-full border border-white/10 text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
            </button>
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-400">
              JD
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* KPI Row */}
          <div className="col-span-12 grid grid-cols-4 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="glass-card h-32 animate-pulse bg-white/5" />
              ))
            ) : (
              kpis.map((kpi: any, i) => (
                <KPICard key={i} label={kpi.label} value={kpi.value} trend={kpi.trend} />
              ))
            )}
          </div>

          {/* Charts Row */}
          <div className="col-span-8 flex flex-col gap-6">
            <div className="glass-card">
              <h3 className="text-lg font-bold mb-6">Revenue Growth Trend</h3>
              <SalesTrendChart data={dailySales} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="glass-card">
                <h3 className="text-lg font-bold mb-6">Sales by Category</h3>
                <CategoryBarChart data={categorySales} />
              </div>
              <div className="glass-card flex flex-col items-center justify-center text-center p-8">
                <div className="bg-indigo-500/10 p-4 rounded-full mb-4">
                  <Database className="text-indigo-400" size={32} />
                </div>
                <h4 className="font-bold mb-2">ETL Pipeline Health</h4>
                <p className="text-sm text-gray-400 mb-4">Last sync completed successfully 12 minutes ago.</p>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-indigo-500 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: "98%" }}
                    transition={{ duration: 1.5 }}
                  />
                </div>
                <span className="text-xs text-indigo-400 mt-2 font-medium">98% Data Integrity</span>
              </div>
            </div>
          </div>

          {/* AI Side Column */}
          <div className="col-span-4">
            <AIInsights summary={aiInsights.summary} recommendations={aiInsights.recommendations} loading={loading} />
          </div>
        </div>
      </div>
    </main>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
      ${active ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
    `}>
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
}
