const fs = require('fs');

// Читаем текущий workflow
const workflow = JSON.parse(fs.readFileSync('current_workflow_full.json', 'utf8'));

// Находим узел extract-pdf и заменяем его
const extractNodeIndex = workflow.nodes.findIndex(node => node.id === 'extract-pdf');

if (extractNodeIndex !== -1) {
  // Заменяем на HTTP Request узел для извлечения текста из PDF
  workflow.nodes[extractNodeIndex] = {
    "parameters": {
      "url": "=https://api.pdf.co/v1/pdf/convert/to/text",
      "authentication": "predefinedCredentialType",
      "nodeCredentialType": "httpHeaderAuth",
      "sendBody": true,
      "specifyBody": "json",
      "jsonBody": "={\n  \"url\": \"\",\n  \"file\": \"{{ $binary.data.data }}\"\n}",
      "options": {
        "response": {
          "response": {
            "fullResponse": false,
            "responseFormat": "json"
          }
        }
      }
    },
    "id": "extract-pdf",
    "name": "Extract PDF Text",
    "type": "n8n-nodes-base.httpRequest",
    "typeVersion": 4.2,
    "position": [850, 300]
  };
  
  console.log('Узел заменен на HTTP Request');
} else {
  // Альтернатива: используем Code node для подготовки данных
  workflow.nodes[extractNodeIndex] = {
    "parameters": {
      "jsCode": "// Подготовка PDF данных для передачи в AI\n// AI Agent может работать с base64 изображениями/файлами\nconst binaryData = $input.item.binary?.data;\n\nif (!binaryData) {\n  throw new Error('PDF данные не найдены');\n}\n\n// Конвертируем в base64 строку\nconst base64String = binaryData.data || Buffer.from(binaryData).toString('base64');\n\n// Возвращаем данные для передачи в AI\nreturn [{\n  json: {\n    pdf_base64: base64String,\n    pdf_mime_type: 'application/pdf',\n    file_name: $input.item.json.file_name || 'document.pdf'\n  },\n  binary: {\n    data: binaryData\n  }\n}];"
    },
    "id": "extract-pdf",
    "name": "Extract PDF Text",
    "type": "n8n-nodes-base.code",
    "typeVersion": 2,
    "position": [850, 300]
  };
  
  console.log('Узел заменен на Code node');
}

// Сохраняем обновленный workflow
fs.writeFileSync('workflow_updated.json', JSON.stringify(workflow, null, 2));
console.log('Workflow обновлен и сохранен в workflow_updated.json');
