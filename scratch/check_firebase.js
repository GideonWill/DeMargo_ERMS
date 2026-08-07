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
  const val = snapshot.val();
  if (!val) {
    console.log("No employees in DB");
    return;
  }
  console.log("Total DB keys:", Object.keys(val).length);
  console.log("Keys:", Object.keys(val).sort());
  
  // Check for discrepancies between key and emp.id
  const mismatched = [];
  Object.entries(val).forEach(([key, emp]) => {
    if (!emp) {
      console.log("Null record at key:", key);
      return;
    }
    if (emp.id !== key) {
      mismatched.push({ key, empId: emp.id, name: emp.name });
    }
  });
  console.log("Mismatched keys:", mismatched);
}

main().catch(console.error).then(() => process.exit(0));
