# Руководство по созданию Workflow в n8n

## Структура Workflow для Portrait Generator API

Я подготовил структуру workflow для интеграции с вашим приложением генерации портретов.

### Описание Workflow

**Название:** Portrait Generator API

**Назначение:** 
- Принимает POST запросы с изображением (base64) и промптом
- Отправляет запрос в Gemini API для генерации портрета
- Возвращает сгенерированное изображение в формате data URI

### Узлы (Nodes):

1. **Webhook** (триггер)
   - Метод: POST
   - Путь: `portrait-generate`
   - Принимает JSON: `{ "image": "base64_string", "prompt": "style description" }`

2. **HTTP Request** (Gemini API)
   - URL: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key={{ $env.GEMINI_API_KEY }}`
   - Метод: POST
   - Headers: `Content-Type: application/json`
   - Тело запроса формируется из данных webhook
   - **Важно:** Нужно настроить переменную окружения `GEMINI_API_KEY` в n8n

3. **Respond to Webhook** (ответ)
   - Возвращает JSON с результатом: 
     ```json
     {
       "success": true,
       "image": "data:image/png;base64,...",
       "mimeType": "image/png"
     }
     ```

### Инструкция по созданию:

#### Вариант 1: Импорт через веб-интерфейс (рекомендуется)

1. Откройте https://n8n.anub1sx.work
2. Войдите в систему
3. Нажмите на меню (три точки) → **Import from File**
4. Выберите файл `workflow_for_import.json`
5. Настройте переменную окружения `GEMINI_API_KEY`:
   - Settings → Environment Variables
   - Добавьте переменную `GEMINI_API_KEY` со значением вашего Gemini API ключа
6. Активируйте workflow (переключите тумблер в правом верхнем углу)

#### Вариант 2: Создание вручную

1. Откройте https://n8n.anub1sx.work
2. Создайте новый workflow
3. Добавьте узлы согласно структуре:
   - **Webhook** → **HTTP Request** → **Respond to Webhook**
4. Настройте каждый узел согласно описанию выше
5. Настройте переменную окружения `GEMINI_API_KEY`

### Тестирование Workflow

После создания и активации workflow:

1. Получите URL webhook (будет показан в узле Webhook после активации)
2. Используйте скрипт `test_workflow.sh` для тестирования:
   ```bash
   ./test_workflow.sh
   ```
   (Не забудьте обновить URL в скрипте)

3. Или протестируйте вручную:
   ```bash
   curl -X POST https://n8n.anub1sx.work/webhook/portrait-generate \
     -H "Content-Type: application/json" \
     -d '{
       "image": "base64_encoded_image_here",
       "prompt": "Portrait in cyberpunk style"
     }'
   ```

### Структура запроса:

```json
{
  "image": "iVBORw0KGgoAAAANSUhEUgAA...",  // base64 без префикса data:image/...
  "prompt": "Portrait in cyberpunk style with neon lights"
}
```

### Структура ответа:

```json
{
  "success": true,
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "mimeType": "image/png"
}
```
