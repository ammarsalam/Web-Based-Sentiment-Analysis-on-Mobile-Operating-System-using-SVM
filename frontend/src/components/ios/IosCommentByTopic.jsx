import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import axios from "axios";

const IosCommmentByTopic = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Fetch data from /comments_by_platform endpoint for Android platform
    axios.get("http://localhost:5000/topic_by_platform?platform=iOS")
      .then((res) => {
        // Format the response data into a structure compatible with the BarChart
        const formatted = res.data.map((item) => ({
          name: item.topic_name,  // Topic name
          Positive: item.positive,  // Positive sentiment count
          Negative: item.negative,  // Negative sentiment count
          Neutral: item.neutral,    // Neutral sentiment count
        }));
        setChartData(formatted);
      })
      .catch((err) => console.error("Error fetching sentiment data by topic:", err));
  }, []);

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className='text-xl font-semibold text-gray-100 mb-4'>Sentiment Distribution by Topic for iOS</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
            <XAxis dataKey='name' stroke='#9CA3AF' height={50} tickMargin={15} interval={0} />
            <YAxis stroke='#9CA3AF' />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Bar dataKey='Positive' stackId='a' fill='#60A5FA' />
            <Bar dataKey='Negative' stackId='a' fill='#F87171' />
            <Bar dataKey='Neutral' stackId='a' fill='#34D399' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default IosCommmentByTopic;
