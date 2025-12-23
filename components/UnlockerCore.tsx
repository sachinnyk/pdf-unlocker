
import React from 'react';
import { AppStatus, ProcessingState } from '../types';

interface UnlockerCoreProps {
  file: File;
  password: string;
  state: ProcessingState;
  setState: (state: ProcessingState | ((prev: ProcessingState) => ProcessingState)) => void;
}

const UnlockerCore: React.FC<UnlockerCoreProps> = ({ file, password, state, setState }) => {
  
  const startProcessing = async () => {
    if (!password) {
      setState(prev => ({ ...prev, status: AppStatus.ERROR, error: 'Password is required to decrypt' }));
      return;
    }

    setState(prev => ({
      ...prev,
      status: AppStatus.PROCESSING,
      progress: 0,
      message: 'Initializing worker...'
    }));

    try {
      // 1. Initialize Libraries (assume loaded from CDN)
      const pdfjsLib = window.pdfjsLib;
      const { PDFDocument } = window.PDFLib;
      
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      // 2. Load the encrypted file
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        password: password
      });

      let pdfDoc;
      try {
        pdfDoc = await loadingTask.promise;
      } catch (err: any) {
        if (err.name === 'PasswordException') {
          throw new Error('Incorrect password. Please try again.');
        } else {
          throw new Error('Could not load PDF: ' + err.message);
        }
      }

      const numPages = pdfDoc.numPages;
      setState(prev => ({ ...prev, message: `Decrypting ${numPages} pages...`, progress: 5 }));

      // 3. Create a new unlocked PDF
      const newPdf = await PDFDocument.create();

      // 4. Render and add each page
      for (let i = 1; i <= numPages; i++) {
        setState(prev => ({ 
          ...prev, 
          message: `Processing page ${i} of ${numPages}...`, 
          progress: 10 + (i / numPages) * 85 
        }));

        const page = await pdfDoc.getPage(i);
        
        // We use a high scale to maintain quality (approx 300 DPI)
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) throw new Error('Canvas context not available');
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Convert canvas to image bytes
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        const imageBytes = await fetch(imageData).then(res => res.arrayBuffer());
        
        // Embed in new PDF
        const image = await newPdf.embedJpg(imageBytes);
        const { width, height } = image.scale(0.5); // Back to original dimensions (1.0 scale)
        const pdfPage = newPdf.addPage([width, height]);
        pdfPage.drawImage(image, {
          x: 0,
          y: 0,
          width,
          height
        });
        
        // Cleanup canvas
        canvas.width = 0;
        canvas.height = 0;
      }

      // 5. Finalize and generate download URL
      setState(prev => ({ ...prev, message: 'Generating final document...', progress: 98 }));
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setState(prev => ({
        ...prev,
        status: AppStatus.COMPLETED,
        progress: 100,
        message: 'Unlock complete',
        resultUrl: url
      }));

    } catch (err: any) {
      console.error('Processing error:', err);
      setState(prev => ({
        ...prev,
        status: AppStatus.ERROR,
        error: err.message || 'An unexpected error occurred during decryption.'
      }));
    }
  };

  return (
    <button
      onClick={startProcessing}
      disabled={state.status === AppStatus.PROCESSING}
      className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
        state.status === AppStatus.PROCESSING 
          ? 'bg-slate-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
      }`}
    >
      {state.status === AppStatus.PROCESSING ? 'Unlocking...' : 'Unlock Now'}
    </button>
  );
};

export default UnlockerCore;
