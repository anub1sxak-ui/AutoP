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
  
  // Убеждаемся, что промпт содержит указание на применение к загруженной фотографии
  // Это важно для кастомных стилей, которые могут не содержать эту информацию
  const lowerPrompt = prompt.toLowerCase();
  const hasPersonReference = lowerPrompt.includes('uploaded person') || 
                             lowerPrompt.includes('the person') ||
                             lowerPrompt.includes('portrait of') ||
                             lowerPrompt.includes('person in') ||
                             lowerPrompt.includes('person as');
  
  const finalPrompt = hasPersonReference 
    ? prompt 
    : `Portrait of the uploaded person, ${prompt}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        imagePart,
        {
          text: finalPrompt,
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

// Предустановленные креативные промпты для fallback
const FALLBACK_PROMPTS = [
  "Portrait of the uploaded person as a mystical forest guardian, surrounded by bioluminescent plants, ethereal blue-green lighting, magical particles floating in the air, ancient runes glowing softly, cinematic fantasy atmosphere with deep shadows and vibrant highlights.",
  "Portrait of the uploaded person transformed into a retro-futuristic space explorer, wearing a sleek metallic suit with holographic displays, standing on an alien planet with twin suns, neon-colored atmosphere, sci-fi cinematic composition with dramatic lighting.",
  "Portrait of the uploaded person as a steampunk inventor, surrounded by brass gears and mechanical contraptions, warm amber gaslight illumination, Victorian-era aesthetic, intricate clockwork details, sepia-toned with golden highlights, industrial fantasy mood.",
  "Portrait of the uploaded person reimagined as a celestial being, floating in a cosmic nebula, stardust particles swirling around, ethereal purple and pink lighting, galaxy patterns reflected in the eyes, mystical and otherworldly atmosphere, dreamlike composition.",
  "Portrait of the uploaded person as a cyberpunk street artist, vibrant neon graffiti background, holographic tags floating nearby, electric blue and magenta lighting, urban night scene with rain reflections, futuristic street culture aesthetic, high-energy vibe.",
  "Portrait of the uploaded person transformed into an ancient Egyptian pharaoh, golden hieroglyphic patterns, warm desert sunlight, intricate jewelry with lapis lazuli accents, majestic temple background, regal and powerful presence, historical fantasy style.",
  "Portrait of the uploaded person as a magical academy student, floating spellbooks and glowing runes, warm candlelight mixed with mystical blue energy, gothic architecture background, scholarly yet enchanting atmosphere, fantasy academia aesthetic.",
  "Portrait of the uploaded person reimagined as a post-apocalyptic survivor, weathered clothing, dramatic desert landscape with ruins, golden hour lighting, dust particles in the air, gritty cinematic style, survivalist aesthetic with hope undertones.",
  "Portrait of the uploaded person as a digital glitch art subject, fragmented reality effect, neon color distortions, cyberpunk aesthetic, holographic interference patterns, futuristic digital art style, high-tech visual breakdown.",
  "Portrait of the uploaded person transformed into a watercolor painting come to life, soft pastel colors bleeding together, paper texture visible, artistic brush strokes, dreamy impressionist style, ethereal and fluid composition, painterly aesthetic."
];

const getRandomFallbackPrompt = (): string => {
  return FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)];
};

export const generateRandomPrompt = async (): Promise<string> => {
  const apiKey = (import.meta.env.GEMINI_API_KEY as string | undefined) || (import.meta.env.VITE_GEMINI_API_KEY as string | undefined);

  if (!apiKey) {
    // Если нет API ключа, используем fallback
    return getRandomFallbackPrompt();
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            text: `Create a creative and unusual prompt for generating an artistic portrait in a unique style. 
The prompt should be in English, 30-100 words long, describing the artistic style, atmosphere, lighting, and portrait details.
The prompt should start with "Portrait of the uploaded person" and then describe the style transformation.
Be creative - come up with something unusual and interesting! It can be any style: fantasy, historical, modern, abstract, etc.
Return only the prompt, without additional explanations.`,
          },
        ],
      },
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      // Если ответ пустой, используем fallback
      return getRandomFallbackPrompt();
    }

    // Очищаем текст от возможных кавычек и лишних символов
    return text.trim().replace(/^["']|["']$/g, '');
  } catch (error: any) {
    // Обработка ошибок API (429, 500 и т.д.)
    console.warn('API error, using fallback prompt:', error);
    
    // Если это ошибка лимита или ресурсов, используем fallback
    if (error?.error?.code === 429 || error?.error?.status === 'RESOURCE_EXHAUSTED') {
      return getRandomFallbackPrompt();
    }
    
    // Для других ошибок тоже используем fallback, но можем показать предупреждение
    return getRandomFallbackPrompt();
  }
};
