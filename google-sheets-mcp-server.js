#!/usr/bin/env node

/**
 * MCP сервер для Google Sheets
 * Позволяет AI агенту читать и записывать данные в Google Sheets
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { google } from 'googleapis';
import fs from 'fs';

// Инициализация Google Sheets API
let sheets;
let auth;

async function initializeGoogleSheets() {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (!credentialsPath) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS не установлена');
  }

  if (!fs.existsSync(credentialsPath)) {
    throw new Error(`Файл credentials не найден: ${credentialsPath}`);
  }

  auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheets = google.sheets({ version: 'v4', auth });
  console.error('Google Sheets API инициализирован');
}

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
        description: 'Читает данные из Google Sheet. Возвращает массив строк с данными.',
        inputSchema: {
          type: 'object',
          properties: {
            sheetId: {
              type: 'string',
              description: 'ID Google Sheet (из URL: docs.google.com/spreadsheets/d/SHEET_ID/edit)',
            },
            range: {
              type: 'string',
              description: 'Диапазон ячеек (например, Sheet1!A1:C10 или A1:Z для всех данных)',
              default: 'A1:Z',
            },
          },
          required: ['sheetId'],
        },
      },
      {
        name: 'write_sheet',
        description: 'Записывает данные в Google Sheet. Перезаписывает существующие данные в указанном диапазоне.',
        inputSchema: {
          type: 'object',
          properties: {
            sheetId: {
              type: 'string',
              description: 'ID Google Sheet',
            },
            range: {
              type: 'string',
              description: 'Диапазон ячеек (например, Sheet1!A1)',
            },
            values: {
              type: 'array',
              description: 'Массив массивов значений для записи. Каждый внутренний массив - это строка.',
              items: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
          required: ['sheetId', 'range', 'values'],
        },
      },
      {
        name: 'append_to_sheet',
        description: 'Добавляет данные в конец Google Sheet. Не перезаписывает существующие данные.',
        inputSchema: {
          type: 'object',
          properties: {
            sheetId: {
              type: 'string',
              description: 'ID Google Sheet',
            },
            range: {
              type: 'string',
              description: 'Диапазон листа (например, Sheet1!A:Z)',
              default: 'Sheet1!A:Z',
            },
            values: {
              type: 'array',
              description: 'Массив массивов значений. Каждый внутренний массив - это строка для добавления.',
              items: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
          required: ['sheetId', 'values'],
        },
      },
      {
        name: 'update_cell',
        description: 'Обновляет одну ячейку в Google Sheet',
        inputSchema: {
          type: 'object',
          properties: {
            sheetId: {
              type: 'string',
              description: 'ID Google Sheet',
            },
            range: {
              type: 'string',
              description: 'Адрес ячейки (например, Sheet1!A1)',
            },
            value: {
              type: 'string',
              description: 'Значение для записи',
            },
          },
          required: ['sheetId', 'range', 'value'],
        },
      },
      {
        name: 'get_sheet_info',
        description: 'Получает информацию о листах в Google Sheet',
        inputSchema: {
          type: 'object',
          properties: {
            sheetId: {
              type: 'string',
              description: 'ID Google Sheet',
            },
          },
          required: ['sheetId'],
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
      case 'read_sheet': {
        const range = args.range || 'A1:Z';
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: args.sheetId,
          range: range,
        });

        const values = response.data.values || [];
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                range: response.data.range,
                rowCount: values.length,
                data: values,
              }, null, 2),
            },
          ],
        };
      }

      case 'write_sheet': {
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
              text: JSON.stringify({
                success: true,
                message: `Записано ${args.values.length} строк(и) в диапазон ${args.range}`,
              }),
            },
          ],
        };
      }

      case 'append_to_sheet': {
        const range = args.range || 'Sheet1!A:Z';
        const response = await sheets.spreadsheets.values.append({
          spreadsheetId: args.sheetId,
          range: range,
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
              text: JSON.stringify({
                success: true,
                message: `Добавлено ${args.values.length} строк(и)`,
                updatedRange: response.data.updates?.updatedRange,
                updatedRows: response.data.updates?.updatedRows,
              }),
            },
          ],
        };
      }

      case 'update_cell': {
        await sheets.spreadsheets.values.update({
          spreadsheetId: args.sheetId,
          range: args.range,
          valueInputOption: 'RAW',
          resource: {
            values: [[args.value]],
          },
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Ячейка ${args.range} обновлена`,
              }),
            },
          ],
        };
      }

      case 'get_sheet_info': {
        const response = await sheets.spreadsheets.get({
          spreadsheetId: args.sheetId,
        });

        const sheetsInfo = response.data.sheets.map(sheet => ({
          title: sheet.properties.title,
          sheetId: sheet.properties.sheetId,
          rowCount: sheet.properties.gridProperties.rowCount,
          columnCount: sheet.properties.gridProperties.columnCount,
        }));

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                title: response.data.properties.title,
                sheets: sheetsInfo,
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Неизвестный инструмент: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: true,
            message: error.message,
            details: error.response?.data || error.stack,
          }),
        },
      ],
      isError: true,
    };
  }
});

// Запуск сервера
async function main() {
  try {
    await initializeGoogleSheets();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Google Sheets MCP сервер запущен и готов к работе');
  } catch (error) {
    console.error('Ошибка запуска сервера:', error);
    process.exit(1);
  }
}

main().catch(console.error);
