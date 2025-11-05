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
  // Fix: Property 'env' does not exist on type 'ImportMeta'. Use process.env.API_KEY per guidelines.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API key is not configured. Please set the API_KEY environment variable.");
  }
  
  const ai = new GoogleGenAI({ apiKey: apiKey });
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

  throw new Error("Не удалось извлечь изображение из ответа AI.");
};