'use client';
import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
  showAddButton?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showAddButton }) => {
  return (
    <div className="min-h-screen flex bg-[#FCFBFA] overflow-hidden">
      {/* Sidebar */}
      <div className="flex-none">
        <Sidebar />
      </div>

      {/* Main Content Section */}
      <main className="flex-grow h-screen overflow-y-auto">
        {/* Topbar Section Animation */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="sticky top-0 z-50"
        >
          <Topbar showAddButton={showAddButton} />
        </motion.div>

        {/* Main Content Section Animation */}
        <motion.div
          className="px-6 py-6 w-full max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default MainLayout;
