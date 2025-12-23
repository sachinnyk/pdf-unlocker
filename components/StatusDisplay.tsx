
import React from 'react';
import { AppStatus, ProcessingState } from '../types';
import { 
  CheckCircleIcon, 
  ArrowPathIcon, 
  ArrowDownTrayIcon, 
  ArrowLeftIcon 
} from '@heroicons/react/24/solid';

interface StatusDisplayProps {
  state: ProcessingState;
  onReset: () => void;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ state, onReset }) => {
  return (
    <div className="py-8 animate-in fade-in duration-500">
      {state.status === AppStatus.PROCESSING && (
        <div className="text-center space-y-6">
          <div className="relative inline-block">
             <div className="w-24 h-24 border-4 border-blue-100 rounded-full"></div>
             <div 
               className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
             ></div>
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-xl font-bold text-blue-600">{Math.round(state.progress)}%</span>
             </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800">Processing Document</h3>
            <p className="text-slate-500">{state.message}</p>
          </div>
          <div className="max-w-xs mx-auto w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${state.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {state.status === AppStatus.COMPLETED && (
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-800">Unlock Successful!</h3>
            <p className="text-slate-500">Your unlocked PDF is ready for download.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={state.resultUrl}
              download={state.fileName?.replace('.pdf', '_unlocked.pdf') || 'unlocked.pdf'}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Download Unlocked PDF</span>
            </a>
            
            <button
              onClick={onReset}
              className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 px-6 py-4 font-semibold transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Start Over</span>
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 max-w-lg mx-auto">
            <p><strong>Note:</strong> To strip the password, this tool re-renders pages as high-resolution images. While the text remains visually clear, it may no longer be selectable in the new file.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusDisplay;
