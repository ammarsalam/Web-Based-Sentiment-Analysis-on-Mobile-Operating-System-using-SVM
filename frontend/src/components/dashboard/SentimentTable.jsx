import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import android from "../../assets/android1.png";
import ios from "../../assets/ios.png";
import harmonyos from "../../assets/harmonyos1.png";
import axios from "axios";

const SentimentTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [platformStats, setPlatformStats] = useState({ Android: 0, iOS: 0, HarmonyOS: 0 });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [platformComments, setPlatformComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [topics, setTopics] = useState([]);

  const SENTIMENT_DATA = [
    { id: 1, name: "Android", category: "Mobile", number: platformStats.Android, image: android },
    { id: 2, name: "iOS", category: "Mobile", number: platformStats.iOS, image: ios },
    { id: 3, name: "HarmonyOS", category: "Mobile", number: platformStats.HarmonyOS, image: harmonyos },
  ];

  useEffect(() => {
    axios.get("http://localhost:5000/platformstats")
      .then((response) => setPlatformStats(response.data))
      .catch((error) => console.error("Failed to fetch platform stats:", error));
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = SENTIMENT_DATA.map(item => ({ ...item, number: platformStats[item.name] || 0 }))
      .filter(product => product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term));
    setFilteredProducts(filtered);
  }, [platformStats, searchTerm]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handlePlatformClick = (platformName) => {
    setSelectedPlatform(platformName);
    setSentimentFilter("All");
    setTopicFilter("All");
    fetchTopics(platformName);
    fetchComments(platformName, "All", "All");
  };

  const fetchTopics = (platform) => {
    axios.get(`http://localhost:5000/topics/${platform}`)
      .then((res) => setTopics(res.data))
      .catch((err) => console.error("Error fetching topics:", err));
  };

  const handleFilterChange = (e, type) => {
    const value = e.target.value;
    if (type === "sentiment") setSentimentFilter(value);
    if (type === "topic") setTopicFilter(value);
    fetchComments(selectedPlatform, type === "sentiment" ? value : sentimentFilter, type === "topic" ? value : topicFilter);
  };

  const fetchComments = (platform, sentiment, topic) => {
    const query = [];
    if (sentiment !== "All") query.push(`sentiment=${sentiment}`);
    if (topic !== "All") query.push(`topic=${topic}`);
    const queryString = query.length > 0 ? `?${query.join("&")}` : "";
    axios.get(`http://localhost:5000/allcomments/${platform}${queryString}`)
      .then((res) => {
        setPlatformComments(res.data);
        setFilteredComments(res.data);
        setModalVisible(true);
      })
      .catch((err) => console.error("Error fetching comments:", err));
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPlatform("");
    setPlatformComments([]);
    setFilteredComments([]);
    setSentimentFilter("All");
    setTopicFilter("All");
    setTopics([]);
  };

  return (
    <motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-gray-100'>Overall Total Comments And It's Example Of Each Mobile OS</h2>
        <div className='relative'>
          <input type='text' placeholder='Search OS...' className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' onChange={handleSearch} value={searchTerm} />
          <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="w-1/3 px-6 py-3 text-left text-base font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="w-1/3 px-6 py-3 text-center text-base font-medium text-gray-400 uppercase tracking-wider">Category</th>
              <th className="w-1/3 px-6 py-3 text-center text-base font-medium text-gray-400 uppercase tracking-wider">Total Number of Comments</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredProducts.map((product) => (
              <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <td className="px-6 py-4 whitespace-nowrap text-base text-blue-400 cursor-pointer group relative" onClick={() => handlePlatformClick(product.name)}>
                  <div className="flex items-center gap-2 hover:underline">
                    <img src={product.image} alt="Product img" className="size-10 rounded-full" />
                    {product.name}
                  </div>
                  <div className="absolute left-12 top-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-700 text-white text-sm rounded px-3 py-1 whitespace-nowrap shadow-lg">
                    Click to view detailed user comments
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-300 text-center">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-300 text-center">{product.number}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 rounded-xl w-[100%] max-w-8xl max-h-[52vh] flex flex-col p-6 relative">
            {/* Modal Header + Close */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-white">{selectedPlatform} Comments</h3>
              <X className="text-gray-400 cursor-pointer hover:text-white" onClick={closeModal} />
            </div>
            {/* Fixed Filter */}
            <div className="flex justify-end gap-4 mb-3">
              <select value={sentimentFilter} onChange={(e) => handleFilterChange(e, "sentiment")} className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-1">
                <option value="All">All Sentiment</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
                <option value="Neutral">Neutral</option>
              </select>
              <select value={topicFilter} onChange={(e) => handleFilterChange(e, "topic")} className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-1">
                <option value="All">All Topics</option>
                {topics.map((topic, index) => (
                  <option key={index} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
            
            {/* Scrollable Comment Section */}
            <div className="overflow-y-auto pr-2 space-y-2 text-gray-300" style={{ maxHeight: 'calc(80vh - 120px)' }}>
              {filteredComments.length > 0 ? (
                filteredComments.map((commentObj, index) => (
                  <div key={index} className="bg-gray-800 p-3 rounded">
                     {/* <div className="text-sm text-gray-400 mb-1">Sentiment: {commentObj.sentiment} | Topic: {commentObj.topic}</div> */}
                    {commentObj.comment}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center">No comments found for selected filters.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SentimentTable;