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

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const snapshot = await get(ref(db, 'employees/DMOO1'));
  const val = snapshot.val();
  if (val) {
    console.log("Fixing DMOO1 typo key to AM020 for Regina Alawotey...");
    val.id = "AM020";
    await set(ref(db, 'employees/AM020'), val);
    await remove(ref(db, 'employees/DMOO1'));
    console.log("Done!");
  } else {
    console.log("DMOO1 key not found or already cleaned up.");
  }
}

main().catch(console.error).then(() => process.exit(0));
