import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import axios from 'axios';

const COLORS = ["#6366F1", "#EC4899", "#F59E0B"];

const HarmonyosPieChart = () => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/harmonyosstats")
      .then((res) => {
        const data = res.data;
        const formatted = [
          { name: "Positive", value: Number(data.positive) || 0 },
          { name: "Negative", value: Number(data.negative) || 0 },
          { name: "Neutral", value: Number(data.neutral) || 0 }
        ];
        setCategoryData(formatted);
      })
      .catch((err) => console.error("Failed to fetch android stats:", err));
  }, []);

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className='text-xl font-medium mb-4 text-gray-100'>Sentiment Distribution In HarmonyOS</h2>
      <div className='h-80'>
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart>
            <Pie
              data={categoryData}
              cx={"50%"}
              cy={"50%"}
              labelLine={false}
              outerRadius={80}
              fill='#8884d8'
              dataKey='value'
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default HarmonyosPieChart