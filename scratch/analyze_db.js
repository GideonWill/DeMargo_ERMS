const fs = require('fs');
const db = JSON.parse(fs.readFileSync('./scratch/db_dump.json', 'utf8'));

console.log("Total entries:", Object.keys(db).length);

const entries = Object.entries(db).map(([k, v]) => ({ key: k, id: v.id, name: v.name, dept: v.dept, title: v.title }));

console.log("\n--- Suspect / High / Typo IDs ---");
entries.filter(e => e.key.includes('O') || e.key === 'DM000' || e.key.startsWith('DM006') || e.key.startsWith('DM007') || e.key.length > 6 || e.key === 'DR0059').forEach(e => {
  console.log(`${e.key.padEnd(8)} | ${e.name.padEnd(35)} | ${e.dept.padEnd(20)} | ${e.title}`);
});

console.log("\n--- All DM Prefix Employees ---");
entries.filter(e => e.key.startsWith('DM') || e.key.startsWith('DM')).forEach(e => {
  console.log(`${e.key.padEnd(8)} | ${e.name.padEnd(35)} | ${e.dept.padEnd(20)}`);
});
