# Быстрая инструкция по настройке MCP сервера для Google Sheets

## Шаг 1: Подготовка Google API credentials

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите **Google Sheets API**:
   - APIs & Services → Enable APIs and Services
   - Найдите "Google Sheets API" и включите
4. Создайте Service Account:
   - APIs & Services → Credentials
   - Create Credentials → Service Account
   - Создайте аккаунт (например, "mcp-sheets-server")
   - Перейдите в созданный аккаунт → Keys → Add Key → JSON
   - Скачайте JSON файл (например, `service-account-key.json`)

## Шаг 2: Предоставьте доступ к Google Sheet

1. Откройте ваш Google Sheet
2. Нажмите "Поделиться" (Share)
3. Добавьте email из Service Account (находится в JSON файле, поле `client_email`)
4. Дайте права "Редактор" (Editor)

## Шаг 3: Установка зависимостей

```bash
# Установите Node.js (если еще не установлен)
# Затем установите зависимости:

npm install @modelcontextprotocol/sdk googleapis
```

## Шаг 4: Настройка переменных окружения

```bash
# Установите путь к JSON файлу с credentials
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"

# Или создайте файл .env:
echo "GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json" > .env
```

## Шаг 5: Запуск MCP сервера

```bash
# Сделайте файл исполняемым
chmod +x google-sheets-mcp-server.js

# Запустите сервер
node google-sheets-mcp-server.js
```

## Шаг 6: Интеграция с AI агентом

### Для Claude Desktop

Отредактируйте `claude_desktop_config.json` (обычно находится в):
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

Добавьте:

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

### Для других AI агентов

Настройка зависит от конкретного агента. Обычно нужно указать:
- Команду: `node`
- Аргументы: `["/path/to/google-sheets-mcp-server.js"]`
- Переменные окружения: `GOOGLE_APPLICATION_CREDENTIALS`

## Получение Google Sheet ID

ID находится в URL вашего Google Sheet:
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
```

Скопируйте `YOUR_SHEET_ID_HERE` - это и есть ID.

## Доступные инструменты

После подключения AI агент сможет использовать:

1. **read_sheet** - Читать данные из Sheet
2. **write_sheet** - Записывать данные в Sheet
3. **append_to_sheet** - Добавлять данные в конец Sheet
4. **update_cell** - Обновлять одну ячейку
5. **get_sheet_info** - Получать информацию о листах

## Примеры использования

AI агент сможет выполнять команды типа:
- "Прочитай данные из Sheet1 в таблице с ID xyz"
- "Добавь новую строку с данными..."
- "Обнови ячейку A1 значением..."

## Устранение проблем

### Ошибка "GOOGLE_APPLICATION_CREDENTIALS не установлена"
- Убедитесь, что переменная окружения установлена
- Проверьте путь к JSON файлу

### Ошибка доступа к Sheet
- Убедитесь, что Service Account email добавлен в доступ к Sheet
- Проверьте права доступа (должны быть "Редактор" или "Владелец")

### Ошибка "API not enabled"
- Убедитесь, что Google Sheets API включен в Google Cloud Console

## Полезные ссылки

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP SDK GitHub](https://github.com/modelcontextprotocol/typescript-sdk)
