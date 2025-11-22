#!/bin/bash
# Скрипт для тестирования созданного workflow

WORKFLOW_URL="https://n8n.anub1sx.work/webhook/portrait-generate"
# Замените на реальный URL webhook после создания workflow

echo "Тестирование Portrait Generator Workflow"
echo "=========================================="

# Тестовые данные (нужно будет заменить на реальное base64 изображение)
TEST_DATA='{
  "image": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "prompt": "Portrait in cyberpunk style with neon lights"
}'

echo "Отправка запроса..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d "$TEST_DATA" \
  "$WORKFLOW_URL" \
  -w "\nHTTP Status: %{http_code}\n" \
  -o response.json

echo ""
echo "Ответ сохранен в response.json"
cat response.json | jq '.' 2>/dev/null || cat response.json
