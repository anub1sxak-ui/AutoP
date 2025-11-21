import React from 'react';
import type { Style } from '../types';
import { CustomIcon } from './icons';

interface StyleSelectorProps {
  styles: Style[];
  selectedStyle: Style | null;
  onSelectStyle: (style: Style) => void;
  onCustomClick: () => void;
  hasCustomStyle: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ 
  styles, 
  selectedStyle, 
  onSelectStyle, 
  onCustomClick,
  hasCustomStyle 
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {styles.map((style) => (
        <div
          key={style.id}
          onClick={() => onSelectStyle(style)}
          className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 aspect-square group
            ${selectedStyle?.id === style.id ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-900 shadow-2xl shadow-cyan-500/30' : 'ring-1 ring-white/10 hover:ring-white/30'}
          `}
        >
          <img src={style.previewImage} alt={style.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-2">
            <span className="text-white text-sm font-semibold truncate">{style.name}</span>
          </div>
          {selectedStyle?.id === style.id && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center border-2 border-gray-900">
              <svg className="w-3 h-3 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      ))}
      
      {/* Custom Style Button */}
      <div
        onClick={onCustomClick}
        className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 aspect-square group flex items-center justify-center
          ${selectedStyle?.id === 'custom' ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-gray-900 shadow-2xl shadow-purple-500/30' : 'ring-1 ring-white/10 hover:ring-white/30'}
          bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-cyan-600/20 border border-purple-400/30
        `}
      >
        <div className="flex flex-col items-center justify-center gap-2 p-4">
          <CustomIcon className={`w-12 h-12 transition-transform duration-300 group-hover:scale-110 ${
            selectedStyle?.id === 'custom' ? 'text-purple-300' : 'text-purple-400'
          }`} />
          <div className="text-center">
            <span className={`text-sm font-bold block ${
              selectedStyle?.id === 'custom' ? 'text-purple-200' : 'text-purple-300'
            }`}>
              CUSTOM
            </span>
            {hasCustomStyle && (
              <span className="text-xs text-purple-400/70 mt-1 block">Стиль создан</span>
            )}
          </div>
        </div>
        {selectedStyle?.id === 'custom' && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-purple-400 rounded-full flex items-center justify-center border-2 border-gray-900">
            <svg className="w-3 h-3 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
