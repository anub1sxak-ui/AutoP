import type { Style } from './types';

// Используем локальные изображения для превью стилей.
// Поместите ваши квадратные изображения (например, 200x200) 
// в папку /public/images/styles/ и обновите пути ниже.

export const STYLES: Style[] = [
  // Анимация и мультфильмы
  {
    id: 'pixar_3d',
    name: 'Pixar (обновлённый)',
    prompt: 'Pixar-style 3D animated portrait of the uploaded person. Soft daylight, large expressive eyes, friendly smile, smooth 3D skin texture, cinematic lighting, colorful background with warm tones. Rendered as if from a Pixar movie still, with high detail and emotional warmth.',
    previewImage: '/images/styles/пиксар.png'
  },
  {
    id: 'disney_princess',
    name: 'Мультики Disney',
    prompt: 'Disney-style animated portrait of the uploaded person. Gentle round shapes, soft colorful shading, expressive eyes, warm fairy-tale lighting, magical atmosphere. Looks like a character from a Disney movie — vibrant, positive, full of wonder.',
    previewImage: '/images/styles/дисней.png'
  },
  {
    id: 'anime_manga',
    name: 'Аниме / Манга',
    prompt: 'Anime portrait, big eyes, colorful shading, soft gradient background',
    previewImage: '/images/styles/аниме.png'
  },
  {
    id: 'blue_tractor',
    name: 'Синий Трактор',
    prompt: 'Cartoon portrait inspired by the Russian children’s show ‘Синий трактор’ — simplified shapes, thick black outlines, bright cheerful colors, soft lighting, round facial features, gentle farm or countryside background. Child-friendly, joyful and cute aesthetic.',
    previewImage: '/images/styles/трактор.png'
  },
  {
    id: 'cartoon_network',
    name: 'Cartoon Network',
    prompt: 'Flat colorful cartoon portrait, thick outlines, playful vibe',
    previewImage: '/images/styles/мульты.png'
  },
  // Фэнтези и фантастика
  {
    id: 'middle_earth',
    name: 'Властелин Колец',
    prompt: 'Epic fantasy portrait in the style of The Lord of the Rings. The uploaded person as an elf, ranger, or wizard, detailed medieval costume, enchanted forest or mountain background, cinematic lighting, mystical atmosphere, high fantasy realism.',
    previewImage: '/images/styles/ВК.png'
  },
  {
    id: 'hogwarts_magic',
    name: 'Гарри Поттер',
    prompt: 'Harry Potter universe portrait — the uploaded person as a Hogwarts student or wizard, wearing a cloak and scarf of a chosen house, holding a wand, surrounded by floating candles and magical light. Warm golden tones, fantasy realism, magical misty background.',
    previewImage: '/images/styles/Поттериана.png'
  },
  {
    id: 'fantasy_elf_rpg',
    name: 'Фэнтези / Эльф',
    prompt: 'Fantasy elf portrait, glowing eyes, magical forest light',
    previewImage: '/images/styles/эльф.png'
  },
  {
    id: 'cyberpunk_neon',
    name: 'Киберпанк (обновлённый)',
    prompt: 'Ultra-detailed cyberpunk portrait of the uploaded person, preserving all real facial features and proportions. Futuristic neon lighting reflecting from wet streets and glass surfaces. Subtle holographic glow on skin and hair edges, metallic reflections in the eyes, and fine rain particles in the air. Background filled with luminous billboards, holograms, and blurred motion of flying vehicles in a dense futuristic city at night. High-contrast cinematic composition, deep shadows with pink-blue neon accents (#00FFFF / #FF0099). The atmosphere is moody, futuristic, and alive — like a still frame from a cyberpunk movie where technology meets humanity.',
    previewImage: '/images/styles/киберпанк.png'
  },
  {
    id: 'atlantis',
    name: 'Атлантида',
    prompt: 'Fantasy portrait of the uploaded person as a citizen of Atlantis — glowing aqua tones, ethereal underwater lighting, floating particles, iridescent fabrics, ancient runic patterns, light reflections like waves on skin. Magical, mysterious, oceanic mood.',
    previewImage: '/images/styles/атлантида.png'
  },
  {
    id: 'steampunk',
    name: 'Стимпанк',
    prompt: 'Steampunk portrait, brass goggles, gears, mechanical details',
    previewImage: '/images/styles/Стимпанк.png'
  },
  {
    id: 'post_apocalypse',
    name: 'Постапокалипсис',
    prompt: 'Dusty wasteland portrait, rugged look, cinematic dust lighting',
    previewImage: '/images/styles/постапокалипсис.png'
  },
  // Игры, кино и комиксы
  {
    id: 'gotham_noir',
    name: 'Вселенная Бэтмена',
    prompt: 'Dark Gotham-style portrait inspired by Batman universe. The uploaded person appears as a character from Gotham City — moody urban background, rain, neon reflections, cinematic lighting, dramatic shadows on face, heroic yet mysterious expression. Realistic rendering.',
    previewImage: '/images/styles/готэм.png'
  },
  {
    id: 'wednesday_addams',
    name: 'Wednesday / Nevermore',
    prompt: 'Portrait of the uploaded person in the visual style of the Netflix series Wednesday Addams. Gothic dark-academia aesthetic, pale skin tone, soft matte lighting, monochrome palette with cool blue-gray shadows. The person wears a black school uniform with a white collar, braided dark hair (if applicable), subtle black eyeliner and neutral lips. Background inspired by Nevermore Academy — gothic stone walls, candles, misty window light. The mood is mysterious, calm, and intelligent, cinematic 8K film still style.',
    previewImage: '/images/styles/адамс.png'
  },
  {
    id: 'comic_marvel',
    name: 'Комикс / Marvel',
    prompt: 'Comic book hero portrait, dynamic shading, bold lines, cinematic feel',
    previewImage: '/images/styles/Комикс  Marvel.png'
  },
  {
    id: 'gta_game',
    name: 'GTA',
    prompt: 'GTA poster-style illustration — bold vector shading, urban graffiti background, soft caricature contour yet identical face. Vivid colors, pop-culture energy, stylized as a game cover.',
    previewImage: '/images/styles/гта.png'
  },
  // Исторические и культурные
  {
    id: 'medieval_knight',
    name: 'Средневековье',
    prompt: 'Medieval-style portrait of the uploaded person as a noble knight or lady of the royal court. Painted with oil-on-canvas texture, soft brushwork, golden highlights, intricate armor or gown, candlelight atmosphere, background of castle walls or tapestry. Historical realism with fantasy tone.',
    previewImage: '/images/styles/средневековье.png'
  },
  {
    id: 'gangster_30s',
    name: 'Гангстерские 30-е',
    prompt: '1930s American gangster-style portrait, inspired by noir movies and vintage photography. The uploaded person is dressed in a classic suit and fedora hat, dim smoky bar or street background, sepia film tone, moody shadows, dramatic expression. Old Chicago / Prohibition era atmosphere.',
    previewImage: '/images/styles/30е.png'
  },
  {
    id: 'cuban_havana',
    name: '🇨🇺 Кубинский стиль',
    prompt: "Cuban-style portrait inspired by 1950–1960s Havana and the spirit of ‘Isla de la Libertad’. The uploaded person appears as a charismatic Cuban with a confident look, dressed in light tropical shirt or military-style attire like Che Guevara. Holding or near a cigar, surrounded by warm Caribbean sunlight and pastel-colored colonial buildings. Classic American cars from the 1950s (Chevrolet, Buick, Cadillac) parked in the background. Vibrant retro palette — turquoise, coral, faded yellow, and beige. The atmosphere is nostalgic, cinematic, revolutionary, and full of life — a fusion of freedom, music, and history.",
    previewImage: '/images/styles/куба.png'
  },
  {
    id: 'mexican_fiesta',
    name: 'Fiesta Mexicana',
    prompt: 'Vibrant portrait inspired by Mexican fiesta — the uploaded person in festive sombrero surrounded by papel picado flags, cacti, tequila bottles. Warm sunlight, confetti, vivid reds and greens, joyful motion, cinematic composition.',
    previewImage: '/images/styles/Fiesta Mexicana.png'
  },
  {
    id: 'japanese_ukiyoe',
    name: 'Укиё-э / Самурай',
    prompt: 'Ukiyo-e portrait, woodblock print texture, traditional clothing',
    previewImage: '/images/styles/самурай.png'
  },
  {
    id: 'soviet_poster',
    name: 'СССР Постер',
    prompt: 'Soviet propaganda-poster style portrait — bold red and beige colors, geometric composition, strong confident expression, stylized typography background. Vintage print texture and optimism of 1950s illustration.',
    previewImage: '/images/styles/ссср.png'
  },
  {
    id: 'old_hollywood_noir',
    name: 'Старый Голливуд',
    prompt: 'Old-Hollywood black-and-white portrait — elegant soft-focus lighting, smooth shadows, 1940s glamour feel. The uploaded person as a movie star, vintage film-grain finish.',
    previewImage: '/images/styles/Старый Голливуд.png'
  },
  {
    id: 'ancient_egypt',
    name: 'Древний Египет',
    prompt: 'Ancient Egyptian painting style, gold tones, hieroglyphic background',
    previewImage: '/images/styles/древний египет.png'
  },
  {
    id: 'wild_west_cowboy',
    name: 'Дикий Запад',
    prompt: 'Western-themed portrait — sepia tone, desert sunlight, cowboy hat and dust trail in background. Gritty cinematic feel, calm confident expression.',
    previewImage: '/images/styles/дикий запад.png'
  },
  // Живопись и арт-стили
  {
    id: 'oil_painting_renaissance',
    name: 'Масло (Ренессанс)',
    prompt: 'Oil painting on canvas, realistic brush strokes, golden lighting',
    previewImage: '/images/styles/Масло (Ренессанс).png'
  },
  {
    id: 'watercolor_sketch',
    name: 'Акварель / Скетч',
    prompt: 'Delicate watercolor portrait, paper texture, pastel tones',
    previewImage: '/images/styles/акварель.png'
  },
  {
    id: 'pop_art_warhol',
    name: 'Поп-арт',
    prompt: 'Pop art portrait, vivid colors, halftone texture, bold shapes',
    previewImage: '/images/styles/Поп Арт.png'
  },
  // Реализм и современность
  {
    id: 'studio_vogue',
    name: 'Студия / Vogue',
    prompt: 'High-fashion studio portrait, perfect lighting, glossy skin, Vogue style',
    previewImage: '/images/styles/Студия  Vogue.png'
  },
  {
    id: 'cinematic_realism',
    name: 'Кинореализм',
    prompt: 'Cinematic portrait — 8K clarity, shallow depth of field, soft bokeh, film-grain finish, color grading for dramatic emotional tone. Realistic yet stylized cinematic frame.',
    previewImage: '/images/styles/Кинореализм.png'
  }
];