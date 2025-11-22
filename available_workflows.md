# Доступные Workflow в n8n

## Найденные Workflow

### 1. **Demo: My first AI Agent in n8n**

**ID:** `RJsrSyxRKmsnyOs2`  
**Статус:** ✅ Активен  
**Создан:** 2025-11-20T12:05:12.999Z  
**Обновлен:** 2025-11-22T12:18:44.000Z  
**Триггеров:** 1

#### Описание
AI Agent для анализа рецептов на очки. Принимает фотографию рецепта через Telegram и извлекает структурированные данные.

#### Функциональность
- **Вход:** Фотография рецепта на очки (через Telegram)
- **Обработка:** 
  - Анализ изображения с помощью AI (DeepSeek)
  - Извлечение данных: ФИО пациента, врача, дата, диагноз, диоптрии (OD/OS), ADD, PRISM, PD
  - Форматирование в JSON
- **Выход:** Сохранение данных в Google Sheets

#### Узлы (Nodes):
1. **When chat message received** - Chat триггер (Telegram)
2. **Get a chat** - Получение чата Telegram
3. **Agent** - LangChain Agent с промптом для анализа рецептов
4. **DeepSeek Chat Model** - Модель AI для обработки
5. **Simple Memory** - Буфер памяти для контекста
6. **Think** - Инструмент для размышлений
7. **Get row(s) in sheet in Google Sheets** - Сохранение в Google Sheets

#### Структура данных (JSON):
```json
{
  "patient_name": "",
  "doctor_name": "",
  "date": "",
  "diagnosis": "",
  "OD": { "sph": "", "cyl": "", "axis": "" },
  "OS": { "sph": "", "cyl": "", "axis": "" },
  "add": "",
  "prism": "",
  "pd": "",
  "comments": ""
}
```

#### Триггер
- **Тип:** Chat trigger (Telegram)
- **Формат входа:** `{ inputs: { chatInput: "<CHAT_MESSAGE_HERE>" } }`
- **Webhook ID:** `c6a1a8a1-6291-445c-8992-363951557eca`

#### Настройки
- **Execution Order:** v1
- **Available in MCP:** ✅ Да
- **Template:** self-building-ai-agent

#### Интеграции
- Telegram (чат ID: -1003411839934)
- Google Sheets (документ ID: 1RLSCpg5dAfUcyWCGiiPJDJDUdKJgAXSjGQAjQmnIg7E)
- DeepSeek AI Model

---

## Использование через MCP

### Поиск workflow:
```json
{
  "method": "tools/call",
  "params": {
    "name": "search_workflows",
    "arguments": {
      "limit": 50,
      "query": "optional search term"
    }
  }
}
```

### Получение деталей workflow:
```json
{
  "method": "tools/call",
  "params": {
    "name": "get_workflow_details",
    "arguments": {
      "workflowId": "RJsrSyxRKmsnyOs2"
    }
  }
}
```

### Выполнение workflow:
```json
{
  "method": "tools/call",
  "params": {
    "name": "execute_workflow",
    "arguments": {
      "workflowId": "RJsrSyxRKmsnyOs2",
      "inputs": {
        "chatInput": "Ваше сообщение здесь"
      }
    }
  }
}
```

---

## Статистика

- **Всего workflow:** 1
- **Активных:** 1
- **Архивных:** 0
