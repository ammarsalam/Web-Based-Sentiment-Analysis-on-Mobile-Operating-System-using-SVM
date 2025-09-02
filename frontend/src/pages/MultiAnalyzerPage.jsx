import React, { useState } from 'react';
import Header from '../components/common/Header';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ["#6366F1", "#10B981", "#EC4899"];

const MultiAnalyzerPage = () => {
  const [csvData, setCsvData] = useState([]);
  const [analyzedData, setAnalyzedData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCsvData(results.data);
        },
      });
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalyzedData([]); // Clear previous results
    const analyzed = [];

    for (let row of csvData) {
      const comment = row.Comments || "";

      try {
        // Send POST request to Flask backend for sentiment prediction
        const sentimentResponse = await fetch('http://localhost:5000/prediction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ comment }),
        });

        const sentimentResult = await sentimentResponse.json();

        // Send POST request to Flask backend for topic prediction
        const topicResponse = await fetch('http://localhost:5000/predictiontopicnmf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ comment }),
        });

        const topicResult = await topicResponse.json();

        if (sentimentResponse.ok && topicResponse.ok) {
          analyzed.push({
            comment,
            sentiment: sentimentResult.sentiment,
            topic: topicResult.predicted_topic
          });
        } else {
          analyzed.push({
            comment,
            sentiment: `Error: ${sentimentResult.error || "N/A"}`,
            topic: `Error: ${topicResult.error || "N/A"}`
          });
        }
      } catch (error) {
        analyzed.push({
          comment,
          sentiment: `Error: ${error.message}`,
          topic: `Error: ${error.message}`
        });
      }
    }

    setAnalyzedData(analyzed);
    setLoading(false);
  };

  const handleClear = () => {
    setCsvData([]);
    setAnalyzedData([]);
    setFileName('');
    setLoading(false);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(analyzedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "results_multi_sentiment.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to generate data for charts (sentiment and topic count)
  const getSentimentChartData = () => {
    const sentimentCounts = { Positive: 0, Negative: 0, Neutral: 0 };
    const topicCounts = { "Device Experience and Performance": 0, "Software Updates": 0, "Security and Privacy Concerns": 0 };

    analyzedData.forEach((data) => {
      sentimentCounts[data.sentiment] = (sentimentCounts[data.sentiment] || 0) + 1;
      topicCounts[data.topic] = (topicCounts[data.topic] || 0) + 1;
    });

    return { sentimentCounts, topicCounts };
  };

  // Toggle visualization modal
  const toggleVisualization = () => setShowVisualization(!showVisualization);

  //Visualization bar chart based on os type 
  const getTopicByOSTable = () => {
    const allTopics = [
      "Device Experience and Performance",
      "Software Updates",
      "Security and Privacy Concerns"
    ];

    const topicMap = {};

    // Initialize all topics with 0 for all OS types
    allTopics.forEach(topic => {
      topicMap[topic] = { topic, Android: 0, iOS: 0, HarmonyOS: 0 };
    });

    // Fill actual counts
    analyzedData.forEach(({ topic, osType }) => {
      if (topicMap[topic]) {
        if (osType === 'Android') topicMap[topic].Android++;
        else if (osType === 'iOS') topicMap[topic].iOS++;
        else if (osType === 'HarmonyOS') topicMap[topic].HarmonyOS++;
      }
    });
    return Object.values(topicMap);
  };

  // Visualization bar chart based on sentiment
  const getTopicBySentimentTable = () => {
    const allTopics = [
      "Device Experience and Performance",
      "Software Updates",
      "Security and Privacy Concerns"
    ];

    const topicMap = {};

    // Initialize all topics with 0 for each sentiment type
    allTopics.forEach(topic => {
      topicMap[topic] = { topic, Positive: 0, Neutral: 0, Negative: 0 };
    });

    // Count by topic and sentiment
    analyzedData.forEach(({ topic, sentiment }) => {
      if (topicMap[topic]) {
        if (sentiment === "Positive Sentiment") topicMap[topic].Positive++;
        else if (sentiment === "Neutral Sentiment") topicMap[topic].Neutral++;
        else if (sentiment === "Negative Sentiment") topicMap[topic].Negative++;
      }
    });

    return Object.values(topicMap);
  };

  
  // Visualization bar chart number comments based on sentiment
  const getSentimentBarChartData = () => {
    const counts = { Positive: 0, Neutral: 0, Negative: 0 };
    analyzedData.forEach(({ sentiment }) => {
      if (sentiment === "Positive Sentiment") counts.Positive++;
      else if (sentiment === "Neutral Sentiment") counts.Neutral++;
      else if (sentiment === "Negative Sentiment") counts.Negative++;
    });
    return [
      { name: "Positive", value: counts.Positive },
      { name: "Neutral", value: counts.Neutral },
      { name: "Negative", value: counts.Negative },
    ];
  };

  const SENTIMENT_COLOR = {
    Positive: "#60A5FA",   // blue
    Neutral: "#34D399",    // green
    Negative: "#F87171"    // red
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Multiple Sentiment Analyzer" />

      <main className="max-w-7xl mx-auto py-20 px-4 lg:px-8">
        {/* Upload Section */}
        <motion.div 
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-white text-xl font-medium mb-6 text-center">Import CSV File</h2>

          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <label className="text-white text-sm font-medium whitespace-nowrap">
              Upload CSV File:
            </label>

            <label
              htmlFor="csvFile"
              className="bg-white text-black px-4 py-1 rounded cursor-pointer text-sm font-medium hover:bg-gray-200"
            >
              Choose File
            </label>

            <input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />

            <span className="text-white text-sm">
              {fileName ? fileName : "No file chosen"}
            </span>
          </div>

          <div className="flex justify-center flex-wrap gap-3">
            <button
              onClick={handleAnalyze}
              disabled={csvData.length === 0 || loading}
              className="bg-cyan-500 text-black px-6 py-2 rounded-md font-semibold hover:bg-cyan-600"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
            <button
              onClick={handleClear}
              className="bg-red-400 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-500"
            >
              Clear
            </button>
            
          </div>
        </motion.div>

        {/* LOADING MESSAGE */}
        {loading && (
          <div className="text-center mt-8 text-cyan-300 font-semibold animate-pulse">
            🔄 Analyzing comments... please wait
          </div>
        )}

        {/* RESULT TABLE */}
        {!loading && analyzedData.length > 0 && (
          <motion.div 
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 max-w-6xl mx-auto mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Centered title */}
            <div className="text-center mb-2">
              <h2 className="text-white text-2xl font-bold">Sentiment Analysis Results</h2>
            </div>

            {/* Right-aligned Download + Visualization buttons */}
            <div className="flex justify-end gap-3 mb-2">
              <button
                onClick={handleDownload}
                className="bg-green-400 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-500"
              >
                Download CSV
              </button>
              <button
                onClick={toggleVisualization}
                className="bg-blue-400 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-500"
              >
                Visualization
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto divide-y divide-gray-700 text-white text-sm text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-lg">Comment</th>
                    <th className="px-4 py-2 text-lg text-center">Sentiment Label</th>
                    <th className="px-4 py-2 text-lg text-right">Topic </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {analyzedData.map((row, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{row.comment}</td>
                      <td className="px-4 py-2 text-center">{row.sentiment}</td>
                      <td className="px-4 py-2 text-right">{row.topic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Visualization Pop up */}
        {showVisualization && (
          <motion.div
            className="fixed inset-0 backdrop-blur-sm bg-white/10 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-gray-900 text-white p-8 rounded-lg max-w-5xl w-full overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-center">Sentiment & Topic Visualization</h3>

              {/* Bar Chart for Sentiment Distribution */}
              <motion.div
                className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className='text-xl font-medium mb-4 text-gray-100'>Overall Sentiment Distribution</h2>
                <div className='h-80'>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getSentimentBarChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
                        itemStyle={{ color: "#E5E7EB" }}
                      />
                      <Legend />
                      <Bar dataKey="value" fill="#FFFFFF">
                        {getSentimentBarChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Pie Chart for Sentiment Label Distribution */}
              <motion.div
                className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className='text-xl font-medium mb-4 text-gray-100'>Sentiment Distribution</h2>
                <div className='h-80'>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(getSentimentChartData().sentimentCounts).filter(([_, value]) => value > 0).map(([name, value]) => ({ name, value }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                      >
                        {Object.entries(getSentimentChartData().sentimentCounts)
                          .filter(([_, value]) => value > 0)
                          .map(([name], index) => (
                            <Cell key={`cell-${index}`} fill={SENTIMENT_COLOR[name.replace(" Sentiment", "")]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
                        itemStyle={{ color: "#E5E7EB" }}
                      />
                      <Legend
                        payload={Object.entries(SENTIMENT_COLOR).map(([name, color]) => ({
                          value: `${name} Sentiment`,
                          type: 'circle',
                          color
                        }))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Bar Chart for Topic Count based on sentiment */}
              <motion.div
                className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className='text-xl font-semibold text-gray-100 mb-4'>Topic Count Distribution Based on Sentiment</h2>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={getTopicBySentimentTable()}>
                      <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                      <XAxis dataKey='topic' stroke='#9CA3AF' height={50} tickMargin={15} interval={0} />
                      <YAxis stroke='#9CA3AF' />
                      <Tooltip
                        contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
                        itemStyle={{ color: "#E5E7EB" }}
                      />
                      <Legend />
                      <Bar dataKey='Positive' stackId="a" fill='#60A5FA' />
                      <Bar dataKey='Neutral' stackId="a" fill='#34D399' />
                      <Bar dataKey='Negative' stackId="a" fill='#F87171' />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <div className="flex justify-center mt-6">
                <button
                  className="bg-red-500 px-6 py-2 rounded-md text-white hover:bg-red-600"
                  onClick={toggleVisualization}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default MultiAnalyzerPage;
