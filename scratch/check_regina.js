const fs = require('fs');
const db = JSON.parse(fs.readFileSync('./scratch/db_dump.json', 'utf8'));

Object.entries(db).forEach(([k, v]) => {
  if (v.name.includes("Regina") || k === "DMOO1") {
    console.log(k, v);
  }
});
