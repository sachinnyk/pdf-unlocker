
import React, { useState, useCallback, useRef } from 'react';
import { AppStatus, ProcessingState } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import UnlockerCore from './components/UnlockerCore';
import StatusDisplay from './components/StatusDisplay';
import { LockClosedIcon, ShieldCheckIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [state, setState] = useState<ProcessingState>({
    status: AppStatus.IDLE,
    progress: 0,
    message: 'Ready to unlock'
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setState({
        status: AppStatus.FILE_SELECTED,
        progress: 0,
        message: 'File selected',
        fileName: selectedFile.name
      });
    }
  };

  const reset = () => {
    setFile(null);
    setPassword('');
    setState({
      status: AppStatus.IDLE,
      progress: 0,
      message: 'Ready to unlock'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 transition-all duration-300">
          
          {/* Intro Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
              <LockClosedIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-2">
              Unlock Protected PDFs
            </h1>
            <p className="text-slate-600 text-lg max-w-lg mx-auto">
              Remove passwords from your PDF files securely in your browser. 
              <span className="block font-medium text-blue-600 mt-1">Files never leave your device.</span>
            </p>
          </div>

          {/* Workflow */}
          <div className="space-y-8">
            {state.status === AppStatus.IDLE && (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer group relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <DocumentArrowUpIcon className="h-12 w-12 text-slate-400 mx-auto group-hover:text-blue-500 transition-colors" />
                <p className="mt-4 text-lg font-medium text-slate-700">Click or drag PDF here</p>
                <p className="mt-1 text-sm text-slate-500">Supports standard password-protected PDFs</p>
              </div>
            )}

            {(state.status === AppStatus.FILE_SELECTED || state.status === AppStatus.ERROR) && file && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500 rounded text-white font-bold text-xs">PDF</div>
                    <span className="font-medium text-slate-700 truncate max-w-[200px] md:max-w-md">{file.name}</span>
                  </div>
                  <button 
                    onClick={reset}
                    className="text-sm text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Enter PDF Password</label>
                  <input
                    type="password"
                    placeholder="Enter password to unlock"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                  />
                  {state.status === AppStatus.ERROR && (
                    <p className="text-red-500 text-sm font-medium mt-1">{state.error}</p>
                  )}
                </div>

                <UnlockerCore 
                  file={file} 
                  password={password} 
                  state={state}
                  setState={setState}
                />
              </div>
            )}

            {(state.status === AppStatus.PROCESSING || state.status === AppStatus.COMPLETED) && (
              <StatusDisplay state={state} onReset={reset} />
            )}
          </div>

          {/* Privacy Note */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheckIcon className="h-5 w-5 text-green-500" />
              <span>100% Private & Secure</span>
            </div>
            <span className="hidden md:block">•</span>
            <span>No Server Uploads</span>
            <span className="hidden md:block">•</span>
            <span>Local Browser Processing</span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            { title: 'Zero Data Risk', desc: 'All operations happen locally in your browser memory. Your sensitive files never touch our servers.' },
            { title: 'Visual Fidelity', desc: 'Pages are re-rendered at 300 DPI to ensure your documents look crisp and professional.' },
            { title: 'Easy Download', desc: 'Once unlocked, download a clean, password-free version of your document instantly.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
