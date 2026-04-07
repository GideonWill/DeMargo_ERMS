const fs = require('fs');
const code = fs.readFileSync('src/App.jsx', 'utf8');
const lines = code.split(/\r?\n/);
const results = [];
lines.forEach((l, i) => {
    if (l.includes('setLoading')) {
        results.push(`${i+1}: ${l}`);
    }
});
fs.writeFileSync('tmp_setloading_check.txt', results.join('\n'));
