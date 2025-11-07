import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  imagePreview: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, imagePreview }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isValidType = /^(image\/png|image\/jpeg)$/.test(file.type);
    const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

    if (!isValidType) {
      window.alert('Поддерживаются только PNG и JPG.');
      event.target.value = '';
      return;
    }

    if (!isValidSize) {
      window.alert('Размер файла превышает 10 МБ.');
      event.target.value = '';
      return;
    }

    onFileSelect(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="relative group">
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
      />
      <div
        onClick={handleClick}
        className="relative w-full h-64 bg-black/20 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden p-1 transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
        <div className="relative w-full h-full border-2 border-dashed border-gray-500 group-hover:border-cyan-400 rounded-md flex items-center justify-center bg-gray-900/50 transition-colors duration-300">
          {imagePreview ? (
            <img src={imagePreview} alt="Предпросмотр" className="max-h-full max-w-full object-contain rounded-md p-1" />
          ) : (
            <div className="text-center text-gray-400 z-10">
              <UploadIcon className="w-12 h-12 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110" />
              <p className="font-semibold">Нажмите, чтобы загрузить фото</p>
              <p className="text-sm">PNG или JPG (макс. 10МБ)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
