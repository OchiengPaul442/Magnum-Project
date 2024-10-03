import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

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
        <Topbar showAddButton={showAddButton} />
        <div className="px-6 py-6 w-full max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
