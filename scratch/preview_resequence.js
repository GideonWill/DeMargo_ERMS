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
  
  // Sort employees predictably (e.g. by current ID)
  list.sort((a, b) => (a.id || "").localeCompare(b.id || "", undefined, { numeric: true, sensitivity: 'base' }));

  const mapping = list.map((emp, index) => {
    const seq = index + 1;
    const newId = `DM${String(seq).padStart(4, '0')}`; // e.g. DM0001 to DM0068
    return {
      num: seq,
      oldId: emp.id,
      newId,
      name: emp.name,
      dept: emp.dept,
      title: emp.title
    };
  });

  console.log(JSON.stringify(mapping, null, 2));
}

main().catch(console.error).then(() => process.exit(0));
