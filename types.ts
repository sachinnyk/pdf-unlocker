
export enum AppStatus {
  IDLE = 'IDLE',
  FILE_SELECTED = 'FILE_SELECTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface ProcessingState {
  status: AppStatus;
  progress: number;
  message: string;
  error?: string;
  resultUrl?: string;
  fileName?: string;
}

// Extend window for the CDN-loaded libraries
declare global {
  interface Window {
    pdfjsLib: any;
    PDFLib: any;
  }
}
