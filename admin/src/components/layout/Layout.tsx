import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Column: Fixed Sidebar */}
      <Sidebar />

      {/* Right Column: Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen relative">
        <Navbar />
        
        {/* Page Content */}
        <div className="flex-1 p-8 animate-fade-in overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
