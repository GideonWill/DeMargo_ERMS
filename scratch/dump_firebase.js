const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');
const fs = require('fs');

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
  fs.writeFileSync('./scratch/db_dump.json', JSON.stringify(val, null, 2), 'utf8');
  console.log("Wrote db_dump.json successfully. Total keys:", Object.keys(val).length);
}

main().catch(console.error).then(() => process.exit(0));
