import React from 'react';
import { DownloadIcon, SparklesIcon } from './icons';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  imageUrl: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, imageUrl }) => {
  const buildDownloadUrl = (source: string): { url: string; revoke: (() => void) | null } => {
    if (!source.startsWith('data:')) {
      return { url: source, revoke: null };
    }

    const [header, base64Payload] = source.split(',');
    if (!header || !base64Payload) {
      return { url: source, revoke: null };
    }

    const mimeMatch = header.match(/^data:(.*?);base64$/);
    const mimeType = mimeMatch?.[1] ?? 'application/octet-stream';
    const binary = atob(base64Payload);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    const objectUrl = URL.createObjectURL(new Blob([bytes], { type: mimeType }));
    return { url: objectUrl, revoke: () => URL.revokeObjectURL(objectUrl) };
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const { url, revoke } = buildDownloadUrl(imageUrl);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai_portrait_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    revoke?.();
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-black/20 rounded-lg p-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-cyan-400 animate-spin"></div>
            <SparklesIcon className="w-16 h-16 text-purple-400" />
          </div>
          <p className="mt-6 text-lg font-semibold text-gray-200 animate-pulse">Создаем ваш шедевр...</p>
          <p className="text-sm text-gray-400">Это может занять некоторое время</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-center">
          <p className="text-xl text-red-400 font-bold">Ошибка</p>
          <p className="text-gray-300 mt-2">{error}</p>
        </div>
      );
    }

    if (imageUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full relative group">
          <img src={imageUrl} alt="Сгенерированный портрет" className="max-h-full max-w-full object-contain rounded-lg shadow-2xl shadow-black/50" />
          <div className="absolute bottom-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={handleDownload}
                className="bg-black/40 backdrop-blur-md border border-white/20 hover:border-cyan-400 hover:text-cyan-300 text-white font-bold py-2 px-5 rounded-full flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
              >
                <DownloadIcon className="w-5 h-5" />
                Скачать
              </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-black/20 rounded-lg p-4 text-center border-2 border-dashed border-gray-700">
        <SparklesIcon className="w-16 h-16 text-cyan-500/50 mb-4" />
        <h3 className="text-xl font-bold text-gray-400">Ваш портрет появится здесь</h3>
        <p className="text-gray-500 mt-2">Загрузите фото, выберите стиль и нажмите "Сгенерировать".</p>
      </div>
    );
  };
  
  return <div className="w-full h-full flex-grow">{renderContent()}</div>;
};
