import React from 'react';
import { motion } from 'framer-motion';
import wordcloud from '../../assets/negative_android_wordcloud2.png';

const AndroidWordCloudNegative = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = wordcloud;
    link.download = "android_negative_wordcloud.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className='text-xl font-medium mb-4 text-gray-100'>Negative Word Cloud In Android</h2>
    
      <div className="relative group flex justify-center">
        <img
          src={wordcloud}
          alt="Android Word Cloud"
          className="rounded-lg max-w-full max-h-[500px] border border-gray-600 transition-transform duration-300 transform group-hover:scale-105"
        />
    
        <button
          onClick={handleDownload}
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600"
        >
          Download
        </button>
      </div>
    </motion.div>
  )
}

export default AndroidWordCloudNegative