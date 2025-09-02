import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import axios from "axios";

const SentimentBarChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:5000/androidstats"),
      axios.get("http://localhost:5000/iosstats"),
      axios.get("http://localhost:5000/harmonyosstats")
    ])
      .then(([androidRes, iosRes, harmonyRes]) => {
        const formatted = [
          {
            name: "Android",
            Positive: androidRes.data.positive,
            Negative: androidRes.data.negative,
            Neutral: androidRes.data.neutral
          },
          {
            name: "iOS",
            Positive: iosRes.data.positive,
            Negative: iosRes.data.negative,
            Neutral: iosRes.data.neutral
          },
          {
            name: "HarmonyOS",
            Positive: harmonyRes.data.positive,
            Negative: harmonyRes.data.negative,
            Neutral: harmonyRes.data.neutral
          }
        ];
        setChartData(formatted);
      })
      .catch((err) => console.error("Error fetching sentiment data:", err));
  }, []);

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className='text-xl font-semibold text-gray-100 mb-4'>Sentiment Comparison Across Mobile OS</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
              <XAxis dataKey='name' stroke='#9CA3AF' />
              <YAxis stroke='#9CA3AF' />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Bar dataKey='Positive' stackId='a' fill='#6366F1' />
            <Bar dataKey='Negative' stackId='a' fill='#EC4899' />
            <Bar dataKey='Neutral' stackId='a' fill='#F59E0B' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default SentimentBarChart