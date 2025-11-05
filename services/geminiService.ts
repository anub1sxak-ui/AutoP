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
  // FIX: Per coding guidelines, the API key must be retrieved from `process.env.API_KEY`.
  // This also resolves the TypeScript error `Property 'env' does not exist on type 'ImportMeta'`.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    // A more specific error message for easier debugging.
    throw new Error("Ключ API не найден. Убедитесь, что переменная окружения 'API_KEY' установлена.");
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

  // A more specific error if no image is returned
  throw new Error("Изображение не было сгенерировано в ответе AI. Возможно, сработали фильтры безопасности.");
};
