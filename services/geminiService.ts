import { GoogleGenAI, Modality } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Не удалось прочитать файл как base64"));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

export const generatePortrait = async (imageFile: File, prompt: string): Promise<string> => {
  // Vite injects this at build time - use import.meta.env for client-side env vars
  const apiKey = (import.meta.env.GEMINI_API_KEY as string | undefined) || (import.meta.env.VITE_GEMINI_API_KEY as string | undefined);

  if (!apiKey) {
    throw new Error(
      "Ключ API не найден. Укажите GEMINI_API_KEY в переменных окружения (.env.local или Vercel env)."
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const imagePart = await fileToGenerativePart(imageFile);
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        imagePart,
        {
          text: prompt,
        },
      ],
    },
    config: {
        responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      const mimeType = part.inlineData.mimeType;
      return `data:${mimeType};base64,${base64ImageBytes}`;
    }
  }

  throw new Error("Изображение не было сгенерировано в ответе AI. Возможно, сработали фильтры безопасности.");
};

export const generateRandomPrompt = async (): Promise<string> => {
  const apiKey = (import.meta.env.GEMINI_API_KEY as string | undefined) || (import.meta.env.VITE_GEMINI_API_KEY as string | undefined);

  if (!apiKey) {
    throw new Error(
      "Ключ API не найден. Укажите GEMINI_API_KEY в переменных окружения (.env.local или Vercel env)."
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        {
          text: `Создай креативный и необычный промпт для генерации художественного портрета в уникальном стиле. 
Промпт должен быть на английском языке, длиной от 30 до 100 слов, описывать художественный стиль, атмосферу, освещение и детали портрета.
Будь креативным - придумай что-то необычное и интересное! Это может быть любой стиль: фантастический, исторический, современный, абстрактный и т.д.
Верни только промпт, без дополнительных объяснений.`,
        },
      ],
    },
  });

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Не удалось сгенерировать промпт. Попробуйте еще раз.");
  }

  // Очищаем текст от возможных кавычек и лишних символов
  return text.trim().replace(/^["']|["']$/g, '');
};
