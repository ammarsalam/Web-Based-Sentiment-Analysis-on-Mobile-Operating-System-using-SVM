import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import axios from "axios";

const IosBarChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/ioskeywordstats")
      .then((res) => setChartData(res.data))
      .catch((err) => console.error("Error fetching iOS factor stats:", err));
  }, []);

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className='text-lg font-medium mb-4 text-gray-100'>IOS sentiment Based On Factors</h2>
        
      <div className='h-80'>
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

export default IosBarChart