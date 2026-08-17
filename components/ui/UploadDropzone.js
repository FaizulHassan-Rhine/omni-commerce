'use client';

import { cn } from '@/lib/utils';
import { ImagePlus, Upload, X } from 'lucide-react';
import { useId, useState } from 'react';
import { getPlaceholderImage } from '@/lib/images';

const ACCEPT = 'image/png,image/jpeg,image/jpg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif';
const MAX_BYTES = 10 * 1024 * 1024;

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function UploadDropzone({
  files: filesProp,
  onUpload,
  accept = ACCEPT,
  multiple = false,
  className,
}) {
  const inputId = `product-upload-${useId().replace(/:/g, '')}`;
  const [internalFiles, setInternalFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [reading, setReading] = useState(false);

  const files = filesProp ?? internalFiles;

  const commit = (next) => {
    if (filesProp === undefined) setInternalFiles(next);
    onUpload?.(next);
  };

  const addFiles = async (fileList) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;

    const oversized = incoming.find((file) => file.size > MAX_BYTES);
    if (oversized) {
      setError('Each image must be 10MB or smaller.');
      return;
    }

    setError('');
    setReading(true);

    try {
      const mapped = await Promise.all(
        incoming.map(async (file) => {
          let preview = '';
          try {
            preview = await readAsDataUrl(file);
          } catch {
            preview = URL.createObjectURL(file);
          }
          return {
            id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
            name: file.name,
            size: file.size,
            preview,
            file,
          };
        })
      );
      commit(multiple ? [...files, ...mapped] : mapped);
    } catch {
      setError('Could not read that image. Try another file or use the sample image.');
    } finally {
      setReading(false);
    }
  };

  const removeFile = (id) => {
    commit(files.filter((f) => f.id !== id));
  };

  const useSample = () => {
    setError('');
    commit([
      {
        id: 'sample-product',
        name: 'sample-product.png',
        preview: getPlaceholderImage('product', 0),
        file: null,
      },
    ]);
  };

  return (
    <div className={cn('relative space-y-3', className)}>
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = '';
        }}
        className="absolute left-0 top-0 h-px w-px opacity-0"
      />

      {files.length === 0 ? (
        <label
          htmlFor={inputId}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          className={cn(
            'flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all',
            dragOver
              ? 'border-brand-primary bg-brand-gradient-subtle'
              : 'border-gray-300 bg-gray-50 hover:border-brand-primary/60 hover:bg-white dark:border-gray-700 dark:bg-transparent'
          )}
        >
          <div className="rounded-xl bg-brand-gradient-subtle p-3">
            <Upload className="h-6 w-6 text-brand-primary" />
          </div>
          <p className="mt-3 text-sm font-medium text-gray-800 dark:text-slate-200">
            {reading ? 'Loading image…' : 'Drag & drop images here, or click to browse'}
          </p>
          <p className="mt-1 text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
          <span className="mt-4 inline-flex rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white">
            Choose images
          </span>
        </label>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-transparent">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-text-primary">
              {files.length} image{files.length === 1 ? '' : 's'} selected
            </p>
            <label htmlFor={inputId} className="cursor-pointer text-sm font-medium text-brand-primary hover:underline">
              {multiple ? 'Add more' : 'Replace'}
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {files.map((f) => (
              <div key={f.id} className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                <img
                  src={f.preview}
                  alt={f.name}
                  className="h-40 w-full object-cover"
                />
                <div className="flex items-center justify-between gap-2 px-2 py-1.5">
                  <p className="truncate text-xs text-text-secondary">{f.name}</p>
                  <button
                    type="button"
                    onClick={() => removeFile(f.id)}
                    className="rounded-full bg-red-500 p-1 text-white cursor-pointer"
                    aria-label={`Remove ${f.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
            {multiple && (
              <label
                htmlFor={inputId}
                className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-text-muted hover:border-brand-primary hover:text-brand-primary"
              >
                <ImagePlus className="h-6 w-6" />
                <span className="mt-1 text-xs font-medium">Add image</span>
              </label>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={useSample}
        className="text-sm font-medium text-brand-primary hover:underline"
      >
        Use a sample product image
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function PromptInput({ value, onChange, placeholder, className }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className={cn('input resize-none', className)}
    />
  );
}
