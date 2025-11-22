# Быстрый старт: MCP сервер для Google Sheets

## Шаг 1: Установка зависимостей

```bash
npm install @modelcontextprotocol/sdk googleapis
```

## Шаг 2: Настройка Google Cloud

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите **Google Sheets API**:
   - APIs & Services → Library
   - Найдите "Google Sheets API"
   - Нажмите "Enable"

4. Создайте Service Account:
   - APIs & Services → Credentials
   - Create Credentials → Service Account
   - Заполните данные и создайте
   - Перейдите в созданный Service Account
   - Keys → Add Key → Create new key → JSON
   - Скачайте JSON файл

5. Предоставьте доступ к Google Sheet:
   - Откройте ваш Google Sheet
   - Нажмите "Поделиться" (Share)
   - Добавьте email из Service Account (находится в JSON файле, поле `client_email`)
   - Дайте права "Редактор" (Editor)

## Шаг 3: Настройка переменных окружения

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
```

Или создайте файл `.env`:
```
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json
```

## Шаг 4: Получение Sheet ID

Из URL вашего Google Sheet:
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
```

Скопируйте `YOUR_SHEET_ID_HERE` - это ваш Sheet ID.

## Шаг 5: Запуск MCP сервера

```bash
node google-sheets-mcp-server.js
```

Сервер запустится и будет готов к использованию через stdio.

## Шаг 6: Интеграция с AI агентом

### Для Claude Desktop

Добавьте в `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) или `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "google-sheets": {
      "command": "node",
      "args": ["/absolute/path/to/google-sheets-mcp-server.js"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/absolute/path/to/service-account-key.json"
      }
    }
  }
}
```

Перезапустите Claude Desktop.

### Для других AI агентов

Настройка зависит от конкретного агента. Обычно нужно указать:
- Команду: `node`
- Аргументы: `["/path/to/google-sheets-mcp-server.js"]`
- Переменные окружения: `{"GOOGLE_APPLICATION_CREDENTIALS": "/path/to/key.json"}`

## Доступные инструменты

После подключения AI агент сможет использовать:

1. **read_sheet** - Читать данные из таблицы
2. **write_sheet** - Записывать данные (перезаписывает)
3. **append_to_sheet** - Добавлять данные в конец
4. **update_cell** - Обновлять одну ячейку
5. **get_sheet_info** - Получать информацию о таблице

## Примеры использования

AI агент может использовать инструменты так:

```
Прочитай данные из Sheet1!A1:C10 в таблице с ID abc123
```

```
Добавь новую строку в конец таблицы: ["Значение1", "Значение2", "Значение3"]
```

## Устранение проблем

### Ошибка: "The caller does not have permission"

- Убедитесь, что Service Account добавлен в Google Sheet с правами "Редактор"
- Проверьте, что используете правильный email из JSON ключа

### Ошибка: "GOOGLE_APPLICATION_CREDENTIALS not set"

- Убедитесь, что переменная окружения установлена
- Проверьте путь к JSON файлу

### Ошибка: "API not enabled"

- Убедитесь, что Google Sheets API включен в Google Cloud Console

## Дополнительная информация

Подробная документация в файле `mcp_google_sheets_setup.md`
