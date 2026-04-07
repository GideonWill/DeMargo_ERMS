const fs = require('fs');
const code = fs.readFileSync('src/App.jsx', 'utf8');
const lines = code.split(/\r?\n/);
const loadingLines = [];
lines.forEach((l, i) => {
    if (l.includes('loading')) {
        loadingLines.push(`${i+1}: ${l}`);
    }
});
fs.writeFileSync('tmp_loading_check.txt', loadingLines.join('\n'));
