const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, set, remove } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyC09_b_uWspKRQPEyuaPk5JZwwDTH68zpw",
  authDomain: "demargo-erms.firebaseapp.com",
  projectId: "demargo-erms",
  databaseURL: "https://demargo-erms-default-rtdb.firebaseio.com/",
  storageBucket: "demargo-erms.firebasestorage.app",
  messagingSenderId: "132903868292",
  appId: "1:132903868292:web:1be583adf9f428c97cefd1",
};

async function resequenceDatabase() {
  console.log("Connecting to Firebase...");
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  
  const snapshot = await get(ref(db, 'employees'));
  const data = snapshot.val() || {};
  const oldKeys = Object.keys(data);
  console.log(`Found ${oldKeys.length} employee records in Firebase.`);

  // Convert to array and sort predictably
  const employeesList = Object.values(data);
  employeesList.sort((a, b) => (a.id || "").localeCompare(b.id || "", undefined, { numeric: true, sensitivity: 'base' }));

  const newKeysSet = new Set();
  const migrationMap = [];

  employeesList.forEach((emp, index) => {
    const seq = index + 1;
    const newId = `DM${String(seq).padStart(4, '0')}`; // DM0001, DM0002 ... DM0068
    const updatedEmp = {
      ...emp,
      id: newId
    };
    newKeysSet.add(newId);
    migrationMap.push({ num: seq, oldId: emp.id, newId, name: emp.name, empData: updatedEmp });
  });

  console.log("\nWriting 68 resequenced employees individually to Firebase...");
  for (const item of migrationMap) {
    console.log(`[${item.num.toString().padStart(2, ' ')}/68] Writing ${item.newId} (${item.name})...`);
    await set(ref(db, `employees/${item.newId}`), item.empData);
  }

  // Remove old keys that are not in the new resequenced set (e.g. AD001, AM001, DM0070, PD021, etc.)
  console.log("\nCleaning up old keys...");
  for (const oldKey of oldKeys) {
    if (!newKeysSet.has(oldKey)) {
      console.log(`Removing old key: ${oldKey}`);
      await remove(ref(db, `employees/${oldKey}`));
    }
  }

  console.log("\nDatabase re-sequencing successfully completed!");
}

resequenceDatabase().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
}).then(() => process.exit(0));
