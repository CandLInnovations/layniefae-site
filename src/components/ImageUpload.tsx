'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (images: { url: string; alt: string }[]) => void;
  existingImages?: { url: string; alt: string }[];
  maxImages?: number;
}

export default function ImageUpload({ 
  onImageUpload, 
  existingImages = [], 
  maxImages = 5 
}: ImageUploadProps) {
  const [images, setImages] = useState<{ url: string; alt: string; file?: File }[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Upload error:', error.error);
        return null;
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleFileSelect = async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    const newImages: { url: string; alt: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`${file.name} is too large. Maximum size is 5MB`);
        continue;
      }

      const url = await uploadImage(file);
      if (url) {
        newImages.push({
          url,
          alt: file.name.split('.')[0]
        });
      }
    }

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImageUpload(updatedImages);
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImageUpload(updatedImages);
  };

  const updateAltText = (index: number, alt: string) => {
    const updatedImages = images.map((img, i) => 
      i === index ? { ...img, alt } : img
    );
    setImages(updatedImages);
    onImageUpload(updatedImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragOver 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-gray-300 hover:border-purple-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="space-y-2">
          <div className="text-6xl">📸</div>
          <div className="text-lg font-medium text-gray-700">
            {uploading ? 'Uploading...' : 'Add Product Images'}
          </div>
          <div className="text-sm text-gray-500">
            Drag & drop images here or click to browse<br />
            Maximum {maxImages} images, 5MB each
          </div>
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={`image-${index}`} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <Image
                  src={image.url}
                  alt={image.alt || 'Product image'}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              
              {/* Remove Button */}
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              
              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
              
              {/* Alt Text Input */}
              <input
                type="text"
                value={image.alt || ''}
                onChange={(e) => updateAltText(index, e.target.value)}
                placeholder="Image description..."
                className="mt-2 w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Image Count */}
      <div className="text-sm text-gray-500 text-center">
        {images.length} of {maxImages} images
      </div>
    </div>
  );
}