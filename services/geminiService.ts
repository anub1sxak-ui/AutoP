import { GoogleGenAI, Modality } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        // Fallback for ArrayBuffer case, though less common with readAsDataURL
        const arr = new Uint8Array(reader.result as ArrayBuffer);
        const b64 = btoa(String.fromCharCode.apply(null, Array.from(arr)));
        resolve(b64);
      }
    };
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
  // FIX: Switched from import.meta.env to process.env.API_KEY to fix TypeScript error and adhere to coding guidelines.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    // FIX: Updated the error message to refer to the correct environment variable.
    throw new Error("Ключ API не найден. Убедитесь, что переменная окружения API_KEY правильно настроена.");
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

  // Use optional chaining to safely access nested properties.
  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      const mimeType = part.inlineData.mimeType;
      return `data:${mimeType};base64,${base64ImageBytes}`;
    }
  }

  // A more specific error if no image is returned
  throw new Error("Изображение не было сгенерировано в ответе AI. Возможно, сработали фильтры безопасности.");
};
