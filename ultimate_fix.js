const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Enforce loading = false by default
content = content.replace(/useState\(true\)/g, 'useState(false)');

// 2. Add databaseURL if missing (more robustly)
if (!content.includes('databaseURL')) {
    content = content.replace('projectId: "demargo-erms",', 'projectId: "demargo-erms",\n  databaseURL: "https://demargo-erms-default-rtdb.firebaseio.com/",');
}

// 3. Add error handler to onValue if not already there
if (!content.includes('(error) => {')) {
    content = content.replace(/\s*\}\);\s*return \(\) => unsubscribe\(\);/g, `\n    }, (error) => {\n      console.error("Firebase error:", error);\n      setLoading(false);\n    });\n    return () => unsubscribe();`);
}

fs.writeFileSync(path, content, 'utf8');
console.log("Success: UI should be back!");
