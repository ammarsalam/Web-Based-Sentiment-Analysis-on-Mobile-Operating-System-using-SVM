import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Convert "MM-YYYY" → "Mon-YY"
const formatMonthLabel = (monthStr) => {
  const [mm, yyyy] = monthStr.split("-");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIndex = parseInt(mm, 10) - 1;
  const shortYear = yyyy.slice(2);
  return `${monthNames[monthIndex]}-${shortYear}`;
};

const SentimentMultiLineChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/sentimenttrend")
      .then((response) => {
        const formatted = response.data.map(entry => ({
          month: formatMonthLabel(entry.month),
          Positive: entry.Positive,
          Negative: entry.Negative,
          Neutral: entry.Neutral,
          sortDate: new Date(entry.month.split("-").reverse().join("-"))
        })).sort((a, b) => a.sortDate - b.sortDate);
        setChartData(formatted);
      })
      .catch((error) => {
        console.error("Error fetching sentiment trend:", error);
      });
  }, []);

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className='text-xl font-semibold text-gray-100 mb-4'>Monthly Sentiment Trends</h2>
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
            <XAxis 
              dataKey='month'
              stroke='#9CA3AF'
              angle={0}
              textAnchor="middle"
              height={40}
              tickMargin={12}
            />
            <YAxis stroke='#9CA3AF' />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Line type='linear' dataKey='Positive' stroke='#60A5FA' strokeWidth={2} dot />
            <Line type='linear' dataKey='Neutral' stroke='#34D399' strokeWidth={2} dot />
            <Line type='linear' dataKey='Negative' stroke='#F87171' strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SentimentMultiLineChart;
