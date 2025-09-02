import React from 'react';
import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color, bgColor }) => {
  return (
    <motion.div
      className={`overflow-hidden shadow-lg rounded-xl border border-gray-400`}
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)" }}
      style={{ backgroundColor: bgColor }}
    >
      <div className='px-4 py-5 sm:p-6'>
        <span className='flex items-center text-lg font-medium text-white'>
          <Icon size={20} className='mr-2' style={{ color }} />
          {name}
        </span>
        <p className='mt-1 text-3xl font-semibold text-white'>{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
