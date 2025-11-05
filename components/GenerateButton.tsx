import React from 'react';
import { SparklesIcon } from './icons';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isLoading, isDisabled }) => {
  const buttonClasses = `
    w-full py-4 px-6 text-xl font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-3
    focus:outline-none focus:ring-4
    ${isDisabled 
      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
      : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40 focus:ring-cyan-500/50'
    }
    ${isLoading ? 'opacity-75 cursor-wait' : ''}
  `;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={buttonClasses}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Генерация...
        </>
      ) : (
        <>
          <SparklesIcon className="w-6 h-6" />
          Сгенерировать
        </>
      )}
    </button>
  );
};
