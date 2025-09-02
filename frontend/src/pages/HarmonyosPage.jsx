import React, { useEffect, useState } from "react"
import Header from '../components/common/Header'
import { motion } from 'framer-motion'
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import StatCard from '../components/common/StatCard';
import HarmonyosBarChart from '../components/harmonyos/HarmonyosBarChart';
import HarmonyosPieChart from '../components/harmonyos/HarmonyosPieChart';
import HarmonyosWordCloudPositive from '../components/harmonyos/HarmonyosWordCloudPositive';
import HarmonyosWordCloudNegative from "../components/harmonyos/HarmonyosWordCloudNegative";
import HarmonyosWordCloudNeutral from "../components/harmonyos/HarmonyosWordCloudNeutral";
import HarmonyosLabelBarChart from "../components/harmonyos/HarmonyosLabelBarChart";
import HarmonyosCommmentByTopic from "../components/harmonyos/HarmonyosCommentByTopic";
import axios from "axios";

const HarmonyosPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
  });

  useEffect(() => {
    axios.get("http://localhost:5000/harmonyosstats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to fetch HarmonyOS stats:", err));
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="HarmonyOS" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Sentiment" icon={Package} value={stats.total} color="#FACC15" bgColor="#D97706" />
          <StatCard name="Positive Sentiment" icon={TrendingUp} value={stats.positive} color="#3B82F6" bgColor="#1D4ED8" />
          <StatCard name="Negative Sentiment" icon={AlertTriangle} value={stats.negative} color="#EF4444" bgColor="#B91C1C" />
          <StatCard name="Neutral Sentiment" icon={DollarSign} value={stats.neutral} color="#10B981" bgColor="#047857" />
        </motion.div>

        {/* CHARTS */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
          <HarmonyosLabelBarChart/>
		      <HarmonyosPieChart />
          <HarmonyosCommmentByTopic/>
          <HarmonyosWordCloudPositive/>
          <HarmonyosWordCloudNegative/>
		    </div>
      </main>
    </div>
  )
}

export default HarmonyosPage