const fs = require('fs');
const lines = fs.readFileSync('C:\\Users\\DANE\\.gemini\\antigravity-ide\\brain\\ffb4dd25-9acc-4b2e-b0d8-76840b1a325a\\.system_generated\\logs\\transcript.jsonl', 'utf-8').split('\n');
let out = '';
for (const line of lines) {
  if (!line) continue;
  const obj = JSON.parse(line);
  if (obj.tool_calls) {
    for (const call of obj.tool_calls) {
      if (call.name === 'replace_file_content' || call.name === 'multi_replace_file_content') {
        const str = JSON.stringify(call.args);
        if (str && str.includes('function Birthdays')) {
          out += str + '\n';
        }
      }
    }
  }
}
fs.writeFileSync('C:\\Users\\DANE\\Documents\\GitHub\\DeMargo_ERMS\\scratch_out_utf8.txt', out, 'utf-8');
