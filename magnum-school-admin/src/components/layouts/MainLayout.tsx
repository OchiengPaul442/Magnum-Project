import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-row bg-[#FCFBFA]">
      <Sidebar />

      {/* Main Content Section */}
      <main className="flex-grow">
        <Topbar />
        <div className="px-4 py-6">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
