
import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-blue-200 shadow-lg">
            <ShieldCheckIcon className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            Unlock<span className="text-blue-600">PDF</span>
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-blue-600 transition-colors">How it works</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
          <div className="h-4 w-px bg-slate-200"></div>
          <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Verified Client-Side
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
