const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyC09_b_uWspKRQPEyuaPk5JZwwDTH68zpw",
  authDomain: "demargo-erms.firebaseapp.com",
  projectId: "demargo-erms",
  databaseURL: "https://demargo-erms-default-rtdb.firebaseio.com/",
  storageBucket: "demargo-erms.firebasestorage.app",
  messagingSenderId: "132903868292",
  appId: "1:132903868292:web:1be583adf9f428c97cefd1",
};

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const snapshot = await get(ref(db, 'employees'));
  const val = snapshot.val() || {};
  const list = Object.values(val);
  
  console.log(`Total active workers in DB: ${list.length}`);
  
  // Print current workers sorted by current ID
  console.log("\n--- Current Employees List ---");
  list.sort((a, b) => (a.id || "").localeCompare(b.id || "", undefined, { numeric: true, sensitivity: 'base' }));
  list.forEach((emp, index) => {
    console.log(`${(index + 1).toString().padStart(2, ' ')}. Old ID: ${emp.id.padEnd(8)} | Name: ${emp.name.padEnd(35)} | Dept: ${emp.dept}`);
  });
}

main().catch(console.error).then(() => process.exit(0));
