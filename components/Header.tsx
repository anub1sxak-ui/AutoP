import React from 'react';
import { LogoIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-black/10 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 md:px-8 flex items-center gap-4">
        <LogoIcon className="w-10 h-10 text-cyan-400" />
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
            AI Автопортрет
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Создайте свой уникальный портрет в один клик</p>
        </div>
      </div>
    </header>
  );
};
