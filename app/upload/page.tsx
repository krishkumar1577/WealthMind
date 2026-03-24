'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { saveToLocalStorage, getFromLocalStorage } from '@/lib/utils';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ['application/pdf', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'image/jpeg', 'image/png'];

type ProcessedFile = {
  filename: string;
  analysis: string;
  uploadedAt: string;
};

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);

  const validateFiles = (files: File[]): boolean => {
    const errors: Record<string, string> = {};

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        errors[file.name] = 'File exceeds 50MB limit';
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors[file.name] = 'File type not supported';
      }
    });

    setFileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      if (validateFiles(files)) {
        setUploadedFiles((prev) => [...prev, ...files]);
        toast.success(`${files.length} file(s) added successfully`);
      } else {
        toast.error('Some files failed validation. Check the errors below.');
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      if (validateFiles(files)) {
        setUploadedFiles((prev) => [...prev, ...files]);
        toast.success(`${files.length} file(s) added successfully`);
      } else {
        toast.error('Some files failed validation. Check the errors below.');
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    const removed = uploadedFiles[index];
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    
    // Clear error for this file if it exists
    if (fileErrors[removed.name]) {
      const newErrors = { ...fileErrors };
      delete newErrors[removed.name];
      setFileErrors(newErrors);
    }

    toast.success(`${removed.name} removed`);
  };

  const processFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('action', 'analyze');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        return {
          filename: data.filename,
          analysis: data.analysis,
          uploadedAt: data.uploadedAt,
        };
      } else {
        throw new Error(data.error || 'Failed to process file');
      }
    } catch (error) {
      console.error('File processing error:', error);
      throw error;
    }
  };

  const handleProcessDocuments = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('No files to process');
      return;
    }

    setIsProcessing(true);
    const processingToast = toast.loading('Processing documents with AI...');

    try {
      const processed: ProcessedFile[] = [];

      for (const file of uploadedFiles) {
        try {
          const result = await processFile(file);
          processed.push(result);
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          toast.error(`Failed to process ${file.name}`);
        }
      }

      if (processed.length > 0) {
        // Save processed files to localStorage
        saveToLocalStorage('wealthmind_processed_uploads', processed);

        toast.dismiss(processingToast);
        toast.success(`${processed.length} document(s) processed successfully!`);

        // Reset form after successful processing
        setUploadedFiles([]);
        setFileErrors({});
        setProcessedFiles(processed);

        // Redirect to chat after a short delay
        setTimeout(() => {
          router.push('/chat?prompt=Please analyze my uploaded financial documents and provide insights on my portfolio');
        }, 1500);
      } else {
        toast.dismiss(processingToast);
        toast.error('No files were successfully processed.');
      }
    } catch (error) {
      toast.dismiss(processingToast);
      console.error('Document processing error:', error);
      toast.error('Failed to process documents. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const fileTypes = ['PDF', 'CSV', 'XLSX', 'JPG'];

  return (
    <div className="h-screen flex flex-col bg-[#0d0d0d] text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✦</span>
          <span className="font-serif text-xl tracking-tight">Wealthmind</span>
        </div>
        <div className="small-caps text-xs text-white/[0.4] font-medium">
          DOCUMENT INTAKE
        </div>
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center hover:bg-white/[0.05] rounded-full transition-colors"
          aria-label="Close"
        >
          <svg
            fill="none"
            height="20"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            width="20"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-6">
        {/* Drop Zone */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative w-full max-w-[600px] h-[340px] flex flex-col items-center justify-center text-center p-8 rounded-[24px] border-2 border-dashed border-white/[0.12] transition-all ${
            isDragging ? 'bg-white/[0.04]' : 'hover:bg-white/[0.01]'
          }`}
        >
          {/* Spark Icon */}
          <div className="text-3xl mb-6 text-white/80">✦</div>

          {/* Call to Action */}
          <h1 className="font-serif text-[28px] leading-tight mb-3">
            Drop your financial documents here
          </h1>

          {/* Example List */}
          <p className="font-light text-white/[0.4] text-sm mb-8">
            Receipts, K-1s, Statements, Tax Returns, or 1099s
          </p>

          {/* Browse Button */}
          <button
            onClick={handleBrowseClick}
            disabled={isProcessing}
            className="bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.2] px-6 py-2 rounded-full text-xs font-medium text-white/90 tracking-wide uppercase transition-all disabled:opacity-50"
          >
            Browse Files
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.csv,.xlsx,.xls,.jpg,.jpeg,.png"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-8 w-full max-w-[600px]">
            <h2 className="small-caps text-xs text-white/[0.4] mb-4">
              UPLOADED FILES ({uploadedFiles.length})
            </h2>
            <div className="space-y-2 mb-6">
              {uploadedFiles.map((file, index) => (
                <div key={index}>
                  <div
                    className="flex items-center justify-between bg-white/[0.03] border border-white/[0.08] rounded-lg p-4 hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-lg">📄</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{file.name}</p>
                        <p className="text-xs text-white/[0.4]">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      disabled={isProcessing}
                      className="ml-4 px-3 py-1 text-xs text-white/[0.4] hover:text-white/[0.7] transition-colors disabled:opacity-50"
                    >
                      ✕
                    </button>
                  </div>
                  {fileErrors[file.name] && (
                    <p className="text-xs text-red-500 mt-1 ml-4">
                      {fileErrors[file.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <button 
              onClick={handleProcessDocuments}
              disabled={isProcessing}
              className="w-full px-6 py-3 bg-[#1a4d38] hover:bg-[#1a4d38]/80 disabled:bg-[#1a4d38]/50 text-white text-sm font-medium rounded-lg transition-colors small-caps"
            >
              {isProcessing ? 'Processing...' : 'Process Documents'}
            </button>
          </div>
        )}

        {/* Metadata and Security (shown when no files uploaded) */}
        {uploadedFiles.length === 0 && (
          <div className="mt-12 flex flex-col items-center gap-8 w-full max-w-[600px]">
            {/* File Types */}
            <div className="flex flex-wrap justify-center gap-3">
              {fileTypes.map((type) => (
                <span
                  key={type}
                  className="bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.07] px-3 py-1 rounded text-[10px] text-white/[0.4] font-medium tracking-widest uppercase transition-all"
                >
                  {type}
                </span>
              ))}
            </div>

            {/* Security Disclaimer */}
            <p className="small-caps text-[10px] text-white/[0.3] text-center max-w-md leading-relaxed">
              FILES ARE ENCRYPTED IN TRANSIT AND AT REST · NEVER SHARED · DELETED
              AFTER 30 DAYS
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
