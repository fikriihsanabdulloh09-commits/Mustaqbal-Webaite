'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, FileIcon, Image as ImageIcon, Video, FileText, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  bucket: string;
  accept?: string;
  maxSize?: number; // in bytes
  onUploadComplete?: (url: string, file: File) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
  multiple?: boolean;
  preview?: boolean;
}

interface UploadingFile {
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

export function FileUploader({
  bucket,
  accept = 'image/*',
  maxSize = 10485760, // 10MB default
  onUploadComplete,
  onUploadError,
  className,
  multiple = false,
  preview = true,
}: FileUploaderProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File terlalu besar. Maksimal ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
    }

    // Check file type
    if (accept !== '*') {
      const acceptedTypes = accept.split(',').map(t => t.trim());
      const fileType = file.type;
      const isAccepted = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.replace('/*', ''));
        }
        return fileType === type;
      });

      if (!isAccepted) {
        return `Tipe file tidak didukung. Hanya ${accept}`;
      }
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = fileName;

    try {
      // Upload file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      throw new Error(error.message || 'Upload gagal');
    }
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesToUpload = Array.from(files).slice(0, multiple ? files.length : 1);

    // Validate all files first
    const validationErrors: string[] = [];
    filesToUpload.forEach(file => {
      const error = validateFile(file);
      if (error) {
        validationErrors.push(`${file.name}: ${error}`);
      }
    });

    if (validationErrors.length > 0) {
      toast.error(validationErrors.join('\n'));
      return;
    }

    // Initialize uploading files state
    const newUploadingFiles: UploadingFile[] = filesToUpload.map(file => ({
      file,
      progress: 0,
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Upload files
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const fileIndex = uploadingFiles.length + i;

      try {
        // Simulate progress (real progress tracking needs custom implementation)
        setUploadingFiles(prev => {
          const updated = [...prev];
          updated[fileIndex] = { ...updated[fileIndex], progress: 50 };
          return updated;
        });

        const url = await uploadFile(file);

        setUploadingFiles(prev => {
          const updated = [...prev];
          updated[fileIndex] = { ...updated[fileIndex], progress: 100, url };
          return updated;
        });

        if (onUploadComplete) {
          onUploadComplete(url, file);
        }

        toast.success(`${file.name} berhasil diupload`);
      } catch (error: any) {
        setUploadingFiles(prev => {
          const updated = [...prev];
          updated[fileIndex] = { ...updated[fileIndex], progress: 0, error: error.message };
          return updated;
        });

        if (onUploadError) {
          onUploadError(error);
        }

        toast.error(`Gagal upload ${file.name}: ${error.message}`);
      }
    }
  }, [bucket, multiple, onUploadComplete, onUploadError]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-8 h-8" />;
    if (file.type.startsWith('video/')) return <Video className="w-8 h-8" />;
    if (file.type.includes('pdf')) return <FileText className="w-8 h-8" />;
    return <FileIcon className="w-8 h-8" />;
  };

  const clearCompleted = () => {
    setUploadingFiles(prev => prev.filter(f => f.progress !== 100));
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
          isDragging
            ? 'border-teal-500 bg-teal-50'
            : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
        )}
      >
        <Upload className={cn(
          'w-12 h-12 mx-auto mb-4',
          isDragging ? 'text-teal-600' : 'text-gray-400'
        )} />
        <p className="text-lg font-medium text-gray-700 mb-1">
          {isDragging ? 'Drop file di sini' : 'Drag & Drop atau Klik untuk Upload'}
        </p>
        <p className="text-sm text-gray-500">
          {accept === 'image/*' && 'Gambar: JPG, PNG, WebP, GIF'}
          {accept === 'video/*' && 'Video: MP4, WebM'}
          {accept.includes('pdf') && 'Dokumen: PDF, DOC, XLS'}
          {accept === '*' && 'Semua jenis file'}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Maksimal {(maxSize / 1024 / 1024).toFixed(0)}MB per file
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Uploading Files List */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              Upload Progress ({uploadingFiles.filter(f => f.progress === 100).length}/{uploadingFiles.length})
            </p>
            {uploadingFiles.some(f => f.progress === 100) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCompleted}
                className="text-xs"
              >
                Clear Completed
              </Button>
            )}
          </div>

          {uploadingFiles.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 bg-white"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 text-gray-400">
                  {getFileIcon(item.file)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.file.name}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="flex-shrink-0 h-6 w-6 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 mb-2">
                    {(item.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                  {item.error ? (
                    <p className="text-xs text-red-600">{item.error}</p>
                  ) : (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-teal-600 h-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      {item.progress === 100 && item.url && preview && (
                        <div className="mt-3">
                          {item.file.type.startsWith('image/') && (
                            <img
                              src={item.url}
                              alt={item.file.name}
                              className="w-full h-32 object-cover rounded border"
                            />
                          )}
                          <p className="text-xs text-green-600 mt-2 break-all">
                            ✓ Berhasil: {item.url}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
