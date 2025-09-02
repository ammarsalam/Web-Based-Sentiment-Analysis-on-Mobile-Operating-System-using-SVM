import React, { useEffect, useState } from "react"
import Header from '../components/common/Header'
import { motion } from 'framer-motion'
import { PieChart, Smile, Frown, Meh } from "lucide-react";
import StatCard from '../components/common/StatCard';
import AndroidWordCloudPositive from '../components/android/AndroidWordCloudPositive';
import AndroidBarChart from '../components/android/AndroidBarChart';
import AndroidPieChart from '../components/android/AndroidPieChart';
import AndroidWordCloudNegative from "../components/android/AndroidWordCloudNegative";
import AndroidWordCloudNeutral from "../components/android/AndroidWordCloudNeutral";
import AndroidLabelBarChart from "../components/android/AndroidLabelBarChart";
import AndroidCommmentByTopic from "../components/android/AndroidCommentByTopic";
import axios from "axios"; 

const AndroidPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
  });

  useEffect(() => {
    axios.get("http://localhost:5000/androidstats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to fetch Ansroid stats:", err));
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Android" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Sentiment" icon={PieChart} value={stats.total} color="#FFFFFF" bgColor="#D97706" />
          <StatCard name="Positive Sentiment" icon={Smile} value={stats.positive} color="#FFFFFF" bgColor="#1D4ED8" />
          <StatCard name="Negative Sentiment" icon={Frown} value={stats.negative} color="#FFFFFF" bgColor="#B91C1C" />
          <StatCard name="Neutral Sentiment" icon={Meh} value={stats.neutral} color="#FFFFFF" bgColor="#047857" />
        </motion.div>

        {/* CHARTS */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
          <AndroidLabelBarChart/>
		      <AndroidPieChart />
          <AndroidCommmentByTopic/>
          <AndroidWordCloudPositive/>
          <AndroidWordCloudNegative/>
		    </div>
      </main>
    </div>
  )
}

export default AndroidPage