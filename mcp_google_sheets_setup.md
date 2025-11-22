# Настройка MCP сервера для Google Sheets

## Что такое MCP сервер?

MCP (Model Context Protocol) - это протокол для подключения различных сервисов к AI агентам. MCP сервер позволяет AI агенту взаимодействовать с внешними сервисами, такими как Google Sheets.

## Варианты подключения Google Sheets к MCP

### Вариант 1: Использование готового MCP сервера для Google Sheets

#### Шаг 1: Установка MCP сервера

```bash
# Установка через npm (если есть готовый пакет)
npm install -g @modelcontextprotocol/server-google-sheets

# Или через npx
npx @modelcontextprotocol/server-google-sheets
```

#### Шаг 2: Настройка Google API credentials

1. Создайте проект в [Google Cloud Console](https://console.cloud.google.com/)
2. Включите Google Sheets API
3. Создайте Service Account:
   - Перейдите в IAM & Admin → Service Accounts
   - Создайте новый Service Account
   - Скачайте JSON ключ
4. Предоставьте доступ к Google Sheet:
   - Откройте ваш Google Sheet
   - Нажмите "Поделиться"
   - Добавьте email из Service Account (например: `your-service-account@project-id.iam.gserviceaccount.com`)
   - Дайте права "Редактор" или "Читатель"

#### Шаг 3: Настройка MCP сервера

Создайте конфигурационный файл `mcp-config.json`:

```json
{
  "mcpServers": {
    "google-sheets": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-google-sheets"
      ],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/your/service-account-key.json",
        "GOOGLE_SHEET_ID": "your-google-sheet-id"
      }
    }
  }
}
```

### Вариант 2: Создание собственного MCP сервера для Google Sheets

#### Шаг 1: Установка зависимостей

```bash
npm init -y
npm install @modelcontextprotocol/sdk googleapis
```

#### Шаг 2: Создание MCP сервера

Создайте файл `google-sheets-mcp-server.js`:

```javascript
#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { google } from 'googleapis';

// Инициализация Google Sheets API
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Создание MCP сервера
const server = new Server(
  {
    name: 'google-sheets-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Список доступных инструментов
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'read_sheet',
        description: 'Читает данные из Google Sheet',
        inputSchema: {
          type: 'object',
          properties: {
            sheetId: {
              type: 'string',
              description: 'ID Google Sheet',
            },
            range: {
              type: 'string',
              description: 'Диапазон ячеек (например, A1:C10)',
            },
          },
          required: ['sheetId', 'range'],
        },
      },
      {
        name: 'write_sheet',
        description: 'Записывает данные в Google Sheet',
        inputSchema: {
          type: 'object',
          properties: {
            sheetId: {
              type: 'string',
              description: 'ID Google Sheet',
            },
            range: {
              type: 'string',
              description: 'Диапазон ячеек (например, A1:C10)',
            },
            values: {
              type: 'array',
              description: 'Массив массивов значений для записи',
            },
          },
          required: ['sheetId', 'range', 'values'],
        },
      },
      {
        name: 'append_to_sheet',
        description: 'Добавляет данные в конец Google Sheet',
        inputSchema: {
          type: 'object',
          properties: {
            sheetId: {
              type: 'string',
              description: 'ID Google Sheet',
            },
            range: {
              type: 'string',
              description: 'Диапазон (например, Sheet1!A:Z)',
            },
            values: {
              type: 'array',
              description: 'Массив массивов значений',
            },
          },
          required: ['sheetId', 'range', 'values'],
        },
      },
    ],
  };
});

// Обработка вызовов инструментов
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'read_sheet':
        const readResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: args.sheetId,
          range: args.range,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(readResponse.data.values, null, 2),
            },
          ],
        };

      case 'write_sheet':
        await sheets.spreadsheets.values.update({
          spreadsheetId: args.sheetId,
          range: args.range,
          valueInputOption: 'RAW',
          resource: {
            values: args.values,
          },
        });
        return {
          content: [
            {
              type: 'text',
              text: 'Данные успешно записаны',
            },
          ],
        };

      case 'append_to_sheet':
        await sheets.spreadsheets.values.append({
          spreadsheetId: args.sheetId,
          range: args.range,
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          resource: {
            values: args.values,
          },
        });
        return {
          content: [
            {
              type: 'text',
              text: 'Данные успешно добавлены',
            },
          ],
        };

      default:
        throw new Error(`Неизвестный инструмент: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Ошибка: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Запуск сервера
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Google Sheets MCP сервер запущен');
}

main().catch(console.error);
```

#### Шаг 3: Настройка переменных окружения

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
```

#### Шаг 4: Запуск сервера

```bash
node google-sheets-mcp-server.js
```

### Вариант 3: Использование через n8n MCP сервер

Если у вас уже есть n8n с MCP сервером, можно использовать существующий workflow для работы с Google Sheets через MCP.

## Интеграция с AI агентом

### Для Claude Desktop

Добавьте в `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "google-sheets": {
      "command": "node",
      "args": ["/path/to/google-sheets-mcp-server.js"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/service-account-key.json"
      }
    }
  }
}
```

### Для других AI агентов

Настройка зависит от конкретного AI агента. Обычно нужно указать:
- Команду запуска MCP сервера
- Аргументы
- Переменные окружения

## Получение Google Sheet ID

ID Google Sheet находится в URL:
```
https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
```

## Тестирование

После настройки можно протестировать через MCP клиент:

```bash
# Пример вызова через MCP
mcp call-tool google-sheets read_sheet \
  --sheetId "your-sheet-id" \
  --range "Sheet1!A1:C10"
```

## Полезные ссылки

- [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [MCP Documentation](https://modelcontextprotocol.io/)
