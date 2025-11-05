import { GoogleGenAI, Modality } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else if (reader.result instanceof ArrayBuffer) {
        const arr = new Uint8Array(reader.result);
        const b64 = btoa(String.fromCharCode.apply(null, Array.from(arr)));
        resolve(b64);
      } else {
        reject(new Error("Не удалось прочитать файл"));
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
  // FIX: Adhering to guidelines to use process.env.API_KEY for the API key.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    // FIX: Updated error message to reflect the correct environment variable.
    throw new Error("Ключ API не найден. Убедитесь, что переменная API_KEY правильно настроена в переменных окружения вашего хостинга (например, Vercel).");
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

  // Используем опциональную цепочку для безопасного доступа к вложенным свойствам.
  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      const mimeType = part.inlineData.mimeType;
      return `data:${mimeType};base64,${base64ImageBytes}`;
    }
  }

  // Более конкретная ошибка, если изображение не возвращено
  throw new Error("Изображение не было сгенерировано в ответе AI. Возможно, сработали фильтры безопасности.");
};
