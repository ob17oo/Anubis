"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, FileImage } from "lucide-react";

interface ImageUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate preview URL if it's a File, otherwise use string URL
  const previewUrl = value instanceof File ? URL.createObjectURL(value) : value;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateAndSetFile = useCallback((file: File) => {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Только JPG, PNG и WEBP форматы поддерживаются.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(`Размер файла не должен превышать ${MAX_SIZE_MB}MB.`);
      return;
    }
    onChange(file);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  }, [disabled, validateAndSetFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    onChange(null);
    setError(null);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden ${
          disabled ? "opacity-50 cursor-not-allowed bg-secondary/20 border-border" :
          isDragging
            ? "border-primary bg-primary/5"
            : error 
              ? "border-destructive bg-destructive/5" 
              : "border-border hover:border-primary/50 hover:bg-secondary/20 cursor-pointer"
        }`}
      >
        <input
          type="file"
          accept="image/jpeg, image/png, image/webp"
          onChange={handleFileChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />

        {previewUrl ? (
          <div className="absolute inset-0 w-full h-full z-0 group">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="bg-destructive/90 text-destructive-foreground p-3 rounded-full hover:bg-destructive transition-colors z-20 shadow-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center p-6 pointer-events-none z-0 text-muted-foreground">
            <div className={`p-4 rounded-full mb-4 ${error ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
              {error ? <FileImage className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
            </div>
            <p className="text-lg font-medium text-foreground mb-1">
              Перетащите изображение сюда
            </p>
            <p className="text-sm opacity-80 mb-4">
              или кликните для выбора файла
            </p>
            <div className="text-xs opacity-60 flex gap-4">
              <span>JPG, PNG, WEBP</span>
              <span>До {MAX_SIZE_MB}MB</span>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}
