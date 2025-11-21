import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { StyleSelector } from './components/StyleSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { Header } from './components/Header';
import { GenerateButton } from './components/GenerateButton';
import { CustomStyleModal } from './components/CustomStyleModal';
import { PromptEnhancer } from './components/PromptEnhancer';
import { STYLES } from './constants';
import { generatePortrait } from './services/geminiService';
import type { Style } from './types';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [customStyle, setCustomStyle] = useState<Style | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [additionalPrompt, setAdditionalPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCustomStyleSave = (prompt: string) => {
    const newCustomStyle: Style = {
      id: 'custom',
      name: 'CUSTOM',
      prompt: prompt,
      previewImage: '/images/styles/placeholder.svg'
    };
    setCustomStyle(newCustomStyle);
    setSelectedStyle(newCustomStyle);
  };

  const handleCustomClick = () => {
    setIsCustomModalOpen(true);
  };

  const handleSelectStyle = (style: Style) => {
    setSelectedStyle(style);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!selectedFile || !selectedStyle) {
      setError('Пожалуйста, загрузите фото и выберите стиль.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Объединяем основной промпт стиля с дополнительным промптом
      let finalPrompt = selectedStyle.prompt;
      if (additionalPrompt.trim()) {
        // Добавляем дополнительный промпт к основному
        finalPrompt = `${selectedStyle.prompt}. Additional requirements: ${additionalPrompt.trim()}`;
      }
      
      const imageUrl = await generatePortrait(selectedFile, finalPrompt);
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(`Ошибка: ${err.message}`);
      } else {
        setError('Не удалось создать портрет. Произошла неизвестная ошибка.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, selectedStyle, additionalPrompt]);

  return (
    <div className="min-h-screen w-full text-gray-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Controls Column */}
          <div className="flex flex-col gap-8 bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
            <div>
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-cyan-400">1. Загрузите ваше фото</h2>
              <ImageUploader onFileSelect={handleFileSelect} imagePreview={imagePreview} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-cyan-400">2. Выберите стиль</h2>
              <StyleSelector 
                styles={STYLES} 
                selectedStyle={selectedStyle} 
                onSelectStyle={handleSelectStyle}
                onCustomClick={handleCustomClick}
                hasCustomStyle={customStyle !== null}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-cyan-400">3. Дополнительные детали</h2>
              <PromptEnhancer 
                value={additionalPrompt}
                onChange={setAdditionalPrompt}
              />
            </div>
            <GenerateButton 
              onClick={handleGenerateClick} 
              isLoading={isLoading} 
              isDisabled={!selectedFile || !selectedStyle}
            />
          </div>

          {/* Result Column */}
          <div className="flex flex-col bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-cyan-400">4. Результат</h2>
            <ResultDisplay 
              isLoading={isLoading}
              error={error}
              imageUrl={generatedImage}
            />
          </div>
        </div>
      </main>
      <CustomStyleModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSave={handleCustomStyleSave}
      />
    </div>
  );
};

export default App;