import React, { useState } from 'react';
import Header from '../components/common/Header';
import { motion } from 'framer-motion';

const SingleAnalyzerPage = () => {
  const [sentence, setSentence] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);  // To manage loading state

  // Function to send POST requests to the Flask backend for both predictions
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading

    try {
      // Send POST request to Flask backend for sentiment prediction
      const sentimentResponse = await fetch('http://localhost:5000/prediction', {
        method: 'POST', // HTTP method
        headers: {
          'Content-Type': 'application/json', // Ensure it's JSON data
        },
        body: JSON.stringify({ comment: sentence }), // Send the sentence as JSON
      });

      const sentimentResult = await sentimentResponse.json();
      setSentiment(sentimentResult.sentiment); // Set sentiment result

      // Send POST request to Flask backend for topic prediction
      const topicResponse = await fetch('http://localhost:5000/predictiontopicnmf', {
        method: 'POST', // HTTP method
        headers: {
          'Content-Type': 'application/json', // Ensure it's JSON data
        },
        body: JSON.stringify({ comment: sentence }), // Send the sentence as JSON
      });

      const topicResult = await topicResponse.json();
      setTopic(topicResult.predicted_topic); // Set topic result

    } catch (error) {
      // Handle errors (like server not running)
      setSentiment('Error: Unable to get sentiment.');
      setTopic('Error: Unable to get topic.');
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Single Sentiment Analyzer" />

      <main className="max-w-7xl mx-auto py-20 px-4 lg:px-8">
        {/* Input Section */}
        <motion.div 
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700 max-w-6xl mx-auto py-5 px-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-white text-center text-xl mb-4">Enter Sentence</h2>
          <textarea
            className="w-full p-4 rounded-md bg-cyan-100 text-black resize-none font-semibold"
            rows="4"
            placeholder="Type sentence here ..."
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
          />
          <div className="flex justify-center mt-4">
            <button 
              onClick={handleSubmit}
              className="bg-cyan-500 text-black px-6 py-2 rounded-md font-semibold hover:bg-cyan-600"
            >
              {loading ? 'Loading...' : 'Analyze'}
            </button>
          </div>
        </motion.div>

        {/* Output Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <motion.div 
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700 w-full max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-white text-lg mb-2 text-center"> Sentiment Label :</h2>
            <div className="bg-cyan-100 text-black p-3 rounded-md font-semibold text-center">
              {sentiment || "Awaiting input..."}
            </div>

            <h2 className="text-white text-lg mb-2 text-center mt-6"> Topic :</h2>
            <div className="bg-cyan-100 text-black p-3 rounded-md font-semibold text-center">
              {topic || "Awaiting input..."}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SingleAnalyzerPage;
