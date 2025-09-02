import React, { useEffect, useState } from "react"
import Header from '../components/common/Header'
import { motion } from 'framer-motion'
import { PieChart, Smile, Frown, Meh } from "lucide-react";
import StatCard from '../components/common/StatCard';
import IosBarChart from '../components/ios/IosBarChart';
import IosPieChart from '../components/ios/IosPieChart';
import IosWordCloudPositive from '../components/ios/IosWordCloudPositive';
import IosWordCloudNegative from "../components/ios/IosWordCloudNegative";
import IosWordCloudNeutral from "../components/ios/IosWordCloudNeutral";
import IosLabelBarChart from "../components/ios/IosLabelBarChart";
import IosCommmentByTopic from "../components/ios/IosCommentByTopic";
import axios from "axios";

const IosPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
  });

  useEffect(() => {
    axios.get("http://localhost:5000/iosstats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to fetch iOS stats:", err));
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="iOS" />

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
          <IosLabelBarChart/>
		      <IosPieChart />
          <IosCommmentByTopic/>
          <IosWordCloudPositive/>
          <IosWordCloudNegative/>
	      </div>
      </main>
    </div>
  )
}

export default IosPage