
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <div className="mb-6">
          <span className="text-white font-bold text-lg">UnlockPDF Pro</span>
        </div>
        <p className="text-sm max-w-md mx-auto mb-8">
          A high-performance utility designed for privacy-conscious users. 
          By re-rendering document pages, we effectively strip security restrictions 
          while keeping your data on your machine.
        </p>
        <div className="flex justify-center space-x-8 text-sm mb-8">
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Source</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="text-xs text-slate-600">
          &copy; {new Date().getFullYear()} PDF Unlocker Pro. Designed for high-security environments.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
