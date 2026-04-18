import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxCount?: number;
}

export default function ImageUploader({ images, onChange, maxCount = 9 }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter available slots
    const availableSlots = maxCount - images.length;
    const filesToProcess = files.slice(0, availableSlots);

    const newImages: string[] = [];
    let processed = 0;

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          // 在真实场景下，可以在这里通过 Canvas 进行尺寸压缩和转换
          newImages.push(event.target.result as string);
        }
        processed++;
        if (processed === filesToProcess.length) {
          onChange([...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });

    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, index) => (
          <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
            <img src={img} alt={`upload-${index}`} className="w-full h-full object-cover" />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-black/60 rounded-full p-1 backdrop-blur-sm active:scale-95"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}

        {images.length < maxCount && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl bg-neutral-900 border-2 border-dashed border-neutral-700 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform hover:border-neutral-500 group"
          >
            <Camera className="w-8 h-8 text-neutral-500 group-hover:text-white transition-colors mb-2" />
            <span className="text-[10px] text-neutral-500 font-bold">
              {images.length} / {maxCount}
            </span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
