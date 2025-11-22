# Workflow для Portrait Generator API

## 📋 Резюме

Я создал структуру workflow для интеграции вашего приложения генерации портретов с n8n. Workflow принимает запросы через webhook, обрабатывает их через Gemini API и возвращает результат.

## 📁 Файлы

- `workflow_for_import.json` - Готовый workflow для импорта в n8n
- `workflow_simple.json` - Упрощенная версия структуры
- `n8n_workflow_creation_guide.md` - Подробная инструкция
- `test_workflow.sh` - Скрипт для тестирования workflow

## 🚀 Быстрый старт

### Шаг 1: Импорт workflow

1. Откройте https://n8n.anub1sx.work
2. Войдите в систему
3. Нажмите на меню (три точки) → **Import from File**
4. Выберите файл `workflow_for_import.json`

### Шаг 2: Настройка переменных окружения

1. Перейдите в **Settings** → **Environment Variables**
2. Добавьте переменную:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Ваш Gemini API ключ

### Шаг 3: Активация

1. Откройте импортированный workflow
2. Переключите тумблер **Active** в правом верхнем углу
3. Скопируйте URL webhook из узла **Webhook**

## 🧪 Тестирование

После активации workflow используйте:

```bash
curl -X POST https://n8n.anub1sx.work/webhook/portrait-generate \
  -H "Content-Type: application/json" \
  -d '{
    "image": "base64_encoded_image",
    "prompt": "Portrait in cyberpunk style"
  }'
```

Или используйте скрипт:
```bash
./test_workflow.sh
```

## 📊 Структура Workflow

```
Webhook (POST /portrait-generate)
    ↓
HTTP Request (Gemini API)
    ↓
Respond to Webhook (JSON response)
```

## 🔧 Настройка узлов

### Webhook
- **Method:** POST
- **Path:** `portrait-generate`
- **Response Mode:** Respond to Webhook

### HTTP Request (Gemini API)
- **URL:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key={{ $env.GEMINI_API_KEY }}`
- **Method:** POST
- **Body:** JSON (автоматически формируется из webhook данных)

### Respond to Webhook
- **Response:** JSON
- **Body:** Формируется из ответа Gemini API

## ⚠️ Важные замечания

1. **API ключ:** Убедитесь, что переменная окружения `GEMINI_API_KEY` настроена правильно
2. **Формат изображения:** Изображение должно быть в формате base64 (без префикса `data:image/...`)
3. **Активация:** Workflow должен быть активен для работы webhook

## 📝 Формат запроса

```json
{
  "image": "iVBORw0KGgoAAAANSUhEUgAA...",
  "prompt": "Portrait in cyberpunk style with neon lights"
}
```

## 📝 Формат ответа

```json
{
  "success": true,
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "mimeType": "image/png"
}
```

## 🔍 Проверка работоспособности

После создания workflow проверьте:

1. ✅ Workflow активирован
2. ✅ Переменная `GEMINI_API_KEY` настроена
3. ✅ Webhook URL доступен
4. ✅ Тестовый запрос возвращает успешный ответ

## 📚 Дополнительная информация

Подробная документация находится в файле `n8n_workflow_creation_guide.md`
