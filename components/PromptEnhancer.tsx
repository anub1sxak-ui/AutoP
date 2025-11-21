import React from 'react';

interface PromptEnhancerProps {
  value: string;
  onChange: (value: string) => void;
}

export const PromptEnhancer: React.FC<PromptEnhancerProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Дополнительные детали (опционально)
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Например: обязательно голубые глаза, рыжие волосы, улыбка, красная одежда..."
        rows={3}
        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all resize-none"
      />
      <p className="text-xs text-gray-400 mt-2">
        Добавьте дополнительные детали, которые будут применены к выбранному стилю. Можно указать цвет глаз, волос, одежду, выражение лица и т.д.
      </p>
    </div>
  );
};

