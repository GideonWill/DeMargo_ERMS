// Firebase Seed Script — pushes all DeMargo employees to Realtime Database
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push, get } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyC09_b_uWspKRQPEyuaPk5JZwwDTH68zpw",
  authDomain: "demargo-erms.firebaseapp.com",
  projectId: "demargo-erms",
  databaseURL: "https://demargo-erms-default-rtdb.firebaseio.com/",
  storageBucket: "demargo-erms.firebasestorage.app",
  messagingSenderId: "132903868292",
  appId: "1:132903868292:web:1be583adf9f428c97cefd1",
};

const EMPLOYEES = [
  { id:"DM001",  name:"Ama Serwaa Bonsu",               title:"Media Manager",                  dept:"Media",                 phone:"0244000001", status:"Full Time",  doj:"01/03/2022", nokName:"Kofi Bonsu",              nokPhone:"0244000011", dob:"12/05/1990", emergencyContact:"0244000011", relationship:"Husband",  ssnit:"B190512001" },
  { id:"DM002",  name:"Kweku Mensah",                   title:"Graphic Designer",               dept:"Media",                 phone:"0244000002", status:"Full Time",  doj:"15/06/2021", nokName:"Akua Mensah",             nokPhone:"0244000012", dob:"22/08/1988", emergencyContact:"0244000012", relationship:"Wife",     ssnit:"B188822002" },
  { id:"DM003",  name:"Abena Kyei",                     title:"Supply Chain Officer",           dept:"Supply Chain Management",phone:"0244000003", status:"Full Time",  doj:"10/01/2023", nokName:"Yaw Kyei",                nokPhone:"0244000013", dob:"05/11/1992", emergencyContact:"0244000013", relationship:"Brother",  ssnit:"B192211003" },
  { id:"DM004",  name:"Kofi Asante",                    title:"Driver",                         dept:"Transport",             phone:"0244000004", status:"Full Time",  doj:"20/09/2020", nokName:"Ama Asante",              nokPhone:"0244000014", dob:"30/04/1985", emergencyContact:"0244000014", relationship:"Wife",     ssnit:"B185430004" },
  { id:"DM005",  name:"Akosua Frimpong",                title:"Production Manager",             dept:"Production",            phone:"0244000005", status:"Full Time",  doj:"05/04/2022", nokName:"Kwame Frimpong",          nokPhone:"0244000015", dob:"18/07/1987", emergencyContact:"0244000015", relationship:"Husband",  ssnit:"B187718005" },
  { id:"DM006",  name:"Yaw Darko",                      title:"Installation Technician",        dept:"Installation",          phone:"0244000006", status:"Contract",   doj:"12/11/2023", nokName:"Adwoa Darko",             nokPhone:"0244000016", dob:"09/03/1995", emergencyContact:"0244000016", relationship:"Sister",   ssnit:"B195309006" },
  { id:"DM007",  name:"Adwoa Osei",                     title:"Measurement Specialist",         dept:"Measurement",           phone:"0244000007", status:"Full Time",  doj:"01/07/2021", nokName:"Kojo Osei",               nokPhone:"0244000017", dob:"25/01/1991", emergencyContact:"0244000017", relationship:"Husband",  ssnit:"B199125007" },
  { id:"DM008",  name:"Kojo Boateng",                   title:"Administrative Officer",         dept:"Administration",        phone:"0244000008", status:"Full Time",  doj:"14/02/2020", nokName:"Esi Boateng",             nokPhone:"0244000018", dob:"14/06/1983", emergencyContact:"0244000018", relationship:"Wife",     ssnit:"B198314008" },
  { id:"DM009",  name:"Esi Appiah",                     title:"HR Officer",                     dept:"Administration",        phone:"0244000009", status:"Full Time",  doj:"03/08/2022", nokName:"Fiifi Appiah",            nokPhone:"0244000019", dob:"02/12/1990", emergencyContact:"0244000019", relationship:"Husband",  ssnit:"B199002009" },
  { id:"DM010",  name:"Fiifi Atta",                     title:"Driver",                         dept:"Transport",             phone:"0244000010", status:"Contract",   doj:"22/05/2023", nokName:"Maame Atta",              nokPhone:"0244000020", dob:"17/09/1993", emergencyContact:"0244000020", relationship:"Wife",     ssnit:"B199317010" },
  { id:"DM011",  name:"Maame Dankwah",                  title:"Procurement Officer",            dept:"Supply Chain Management",phone:"0551234567", status:"Full Time",  doj:"10/04/2021", nokName:"Kojo Dankwah",            nokPhone:"0551234568", dob:"04/02/1989", emergencyContact:"0551234568", relationship:"Husband",  ssnit:"B198904011" },
  { id:"DM012",  name:"Nana Adjoa Amponsah",            title:"Accountant",                     dept:"Administration",        phone:"0207654321", status:"Full Time",  doj:"20/03/2020", nokName:"Kofi Amponsah",           nokPhone:"0207654322", dob:"11/08/1986", emergencyContact:"0207654322", relationship:"Husband",  ssnit:"B198611012" },
  { id:"DM013",  name:"Kwame Acheampong",               title:"IT Support",                     dept:"Administration",        phone:"0261112233", status:"Full Time",  doj:"15/01/2023", nokName:"Abena Acheampong",        nokPhone:"0261112234", dob:"07/05/1994", emergencyContact:"0261112234", relationship:"Wife",     ssnit:"B199407013" },
  { id:"DM014",  name:"Abena Owusu",                    title:"Social Media Manager",           dept:"Media",                 phone:"0274445566", status:"Contract",   doj:"01/11/2023", nokName:"Emmanuel Owusu",          nokPhone:"0274445567", dob:"19/10/1996", emergencyContact:"0274445567", relationship:"Brother",  ssnit:"" },
  { id:"DM015",  name:"Emmanuel Gyamfi",                title:"Maintenance Engineer",            dept:"Facility Management",   phone:"0248887774", status:"Full Time",  doj:"06/06/2022", nokName:"Akos Gyamfi",             nokPhone:"0248887775", dob:"23/03/1988", emergencyContact:"0248887775", relationship:"Wife",     ssnit:"B198823015" },
  { id:"DM016",  name:"Akos Asiedu",                    title:"Customer Relations Officer",      dept:"Administration",        phone:"0233339988", status:"Full Time",  doj:"18/09/2022", nokName:"Yaw Asiedu",              nokPhone:"0233339989", dob:"30/07/1992", emergencyContact:"0233339989", relationship:"Husband",  ssnit:"B199230016" },
  { id:"DM017",  name:"Yaw Amoah",                      title:"Logistics Coordinator",          dept:"Supply Chain Management",phone:"0599998877", status:"Contract",   doj:"25/02/2024", nokName:"Ama Amoah",               nokPhone:"0599998878", dob:"14/04/1997", emergencyContact:"0599998878", relationship:"Mother",   ssnit:"" },
  { id:"DM018",  name:"Ama Boadu",                      title:"Cleaner",                        dept:"Facility Management",   phone:"0546662211", status:"Probation",  doj:"10/01/2026", nokName:"Yaw Boadu",               nokPhone:"0546662212", dob:"08/06/2001", emergencyContact:"0546662212", relationship:"Husband",  ssnit:"" },
  { id:"DM019",  name:"Kofi Ntim",                      title:"Security Officer",               dept:"Facility Management",   phone:"0505551234", status:"Full Time",  doj:"02/07/2021", nokName:"Adwoa Ntim",              nokPhone:"0505551235", dob:"20/01/1984", emergencyContact:"0505551235", relationship:"Wife",     ssnit:"B198420019" },
  { id:"DM020",  name:"Adwoa Kyeremateng",              title:"Event Coordinator",              dept:"Media",                 phone:"0279993344", status:"Full Time",  doj:"14/04/2022", nokName:"Kojo Kyeremateng",        nokPhone:"0279993345", dob:"06/09/1990", emergencyContact:"0279993345", relationship:"Husband",  ssnit:"B199006020" },
  { id:"DM021",  name:"Kwabena Ofori",                  title:"Field Technician",               dept:"Installation",          phone:"0241117788", status:"Contract",   doj:"05/08/2023", nokName:"Esinam Ofori",            nokPhone:"0241117789", dob:"29/11/1993", emergencyContact:"0241117789", relationship:"Wife",     ssnit:"" },
  { id:"DM022",  name:"Esinam Tagoe",                   title:"Quantity Surveyor",              dept:"Measurement",           phone:"0266668899", status:"Full Time",  doj:"22/10/2021", nokName:"Kwabena Tagoe",           nokPhone:"0266668900", dob:"03/07/1987", emergencyContact:"0266668900", relationship:"Husband",  ssnit:"B198703022" },
  { id:"DM023",  name:"Nana Ama Osei",                  title:"Office Assistant",               dept:"Administration",        phone:"0558884455", status:"Probation",  doj:"03/03/2026", nokName:"Kojo Osei",               nokPhone:"0558884456", dob:"15/03/2002", emergencyContact:"0558884456", relationship:"Brother",  ssnit:"" },
  { id:"AM001",  name:"Bernard Ebo Andoh",              title:"Operations Manager",             dept:"Administration",        phone:"0243399150", status:"Full Time",  doj:"01/09/2021", nokName:"Elizabeth Andoh",         nokPhone:"0243399151", dob:"15/04/1982", emergencyContact:"0243399151", relationship:"Wife",     ssnit:"GHA-400150243-1" },
  { id:"AM002",  name:"Justice Asante",                 title:"Operations Supervisor",          dept:"Production",            phone:"0241695969", status:"Full Time",  doj:"01/09/2021", nokName:"Abena Asante",            nokPhone:"0541693969", dob:"14/11/1985", emergencyContact:"0541693969", relationship:"Mother",   ssnit:"GHA-119851124-4" },
  { id:"AM003",  name:"Gilbert Boateng Antwi",          title:"Warehouse Manager",              dept:"Supply Chain Management",phone:"0557019618", status:"Full Time",  doj:"01/09/2021", nokName:"Grace Antwi",             nokPhone:"0557019619", dob:"04/02/1988", emergencyContact:"0557019619", relationship:"Wife",     ssnit:"GHA-300421975-0" },
  { id:"AM004",  name:"Jonas Acheampong",               title:"Production Lead",                dept:"Production",            phone:"0548133459", status:"Full Time",  doj:"01/09/2021", nokName:"Martha Acheampong",       nokPhone:"0548133460", dob:"23/06/1987", emergencyContact:"0548133460", relationship:"Wife",     ssnit:"GHA-500119872-3" },
  { id:"AM005",  name:"Samuel Agyemang Prempeh",        title:"Store Manager",                  dept:"Supply Chain Management",phone:"0551965892", status:"Full Time",  doj:"01/09/2021", nokName:"Ama Prempeh",             nokPhone:"0551965893", dob:"17/09/1990", emergencyContact:"0551965893", relationship:"Wife",     ssnit:"GHA-200119903-9" },
  { id:"AM006",  name:"Elvis Kesse",                    title:"Senior Tailor",                  dept:"Production",            phone:"0248143590", status:"Full Time",  doj:"01/09/2021", nokName:"Alice Kesse",             nokPhone:"0248143591", dob:"08/03/1989", emergencyContact:"0248143591", relationship:"Wife",     ssnit:"GHA-108190384-5" },
  { id:"AM007",  name:"Bright Agyei",                   title:"Tailor",                         dept:"Production",            phone:"0597434991", status:"Full Time",  doj:"01/09/2021", nokName:"Beatrice Agyei",          nokPhone:"0597434992", dob:"30/12/1991", emergencyContact:"0597434992", relationship:"Wife",     ssnit:"GHA-011920013-1" },
  { id:"AM008",  name:"Christian Adu Gyamfi",           title:"Tailor",                         dept:"Production",            phone:"0244563936", status:"Full Time",  doj:"01/09/2021", nokName:"Efua Gyamfi",             nokPhone:"0244563937", dob:"22/05/1993", emergencyContact:"0244563937", relationship:"Wife",     ssnit:"GHA-300520952-2" },
  { id:"AM009",  name:"Amina Abdulai",                  title:"Tailor",                         dept:"Production",            phone:"0533360003", status:"Full Time",  doj:"01/09/2021", nokName:"Mohammed Abdulai",        nokPhone:"0533360004", dob:"11/01/1992", emergencyContact:"0533360004", relationship:"Husband",  ssnit:"GHA-101120924-3" },
  { id:"AM010",  name:"Helena Kissi Kumiwaa",           title:"Cleaner",                        dept:"Facility Management",   phone:"0591528605", status:"Full Time",  doj:"15/02/2025", nokName:"Dominic Ampedu",          nokPhone:"0599158952", dob:"13/07/2002", emergencyContact:"0543233713", relationship:"Mother",   ssnit:"B200207130026" },
  { id:"AM011",  name:"Grace Bawah",                    title:"Cleaner",                        dept:"Facility Management",   phone:"0548342010", status:"Probation",  doj:"27/12/2025", nokName:"Gifty Onyedi",            nokPhone:"0243183270", dob:"13/08/2005", emergencyContact:"0243183270", relationship:"Mother",   ssnit:"" },
  { id:"AM012",  name:"Emmanuella Agyeiwaa Dankwah",    title:"Cleaner",                        dept:"Facility Management",   phone:"0536432335", status:"Probation",  doj:"23/12/2025", nokName:"Frimpong Samuel",         nokPhone:"0530182009", dob:"24/10/2002", emergencyContact:"0541623912", relationship:"Mother",   ssnit:"" },
  { id:"AM013",  name:"Wendy Aryee",                    title:"Cleaner",                        dept:"Facility Management",   phone:"0530182009", status:"Probation",  doj:"07/01/2026", nokName:"Percy Sackey",            nokPhone:"0530182009", dob:"26/09/2007", emergencyContact:"0532683314", relationship:"Mother",   ssnit:"" },
  { id:"AM015a", name:"Precious Gyamfua Acheampong",    title:"Cleaner",                        dept:"Facility Management",   phone:"0257809705", status:"Probation",  doj:"15/10/2025", nokName:"Linda Ama Acquah",        nokPhone:"0257620860", dob:"08/07/2007", emergencyContact:"0538814049", relationship:"Sister",   ssnit:"" },
  { id:"AM015b", name:"Gladys Apaati Nti",              title:"Cleaner",                        dept:"Facility Management",   phone:"0599990665", status:"Probation",  doj:"04/11/2025", nokName:"Suzanne Mcintyre Appiah", nokPhone:"0246888287", dob:"06/09/1997", emergencyContact:"0559842488", relationship:"Sister",   ssnit:"" },
  { id:"AM016",  name:"Emmanuel Ofori",                 title:"Cleaner",                        dept:"Facility Management",   phone:"",           status:"Probation",  doj:"07/02/2026", nokName:"Elizabeth Sany",          nokPhone:"0538814049", dob:"22/12/2005", emergencyContact:"0538814049", relationship:"Sister",   ssnit:"" },
  { id:"DM0029", name:"Adusei Opoku",                   title:"Administrative Assistant",       dept:"Administration",        phone:"0242008547", status:"Probation",  doj:"01/09/2025", nokName:"Wendy Yeboah",            nokPhone:"0539676378", dob:"10/09/1997", emergencyContact:"",           relationship:"",         ssnit:"GHA-713314283-8" },
];

async function seedDatabase() {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    
    console.log('Checking existing data...');
    const snapshot = await get(ref(db, 'employees'));
    if (snapshot.exists()) {
      console.log('Data already exists in Firebase! Employees:', Object.keys(snapshot.val()).length);
      console.log('No seeding needed.');
    } else {
      console.log('Database is empty. Pushing', EMPLOYEES.length, 'employees...');
      let count = 0;
      for (const emp of EMPLOYEES) {
        await push(ref(db, 'employees'), emp);
        count++;
        console.log(`  [${count}/${EMPLOYEES.length}] Added: ${emp.name}`);
      }
      console.log('\n✅ Done! All', EMPLOYEES.length, 'employees pushed to Firebase.');
    }
  } catch (err) {
    console.error('❌ Firebase Error:', err.message);
    if (err.code === 'PERMISSION_DENIED') {
      console.log('\n⚠ PERMISSION DENIED — Fix Firebase rules:');
      console.log('  1. Go to https://console.firebase.google.com');
      console.log('  2. Open project demargo-erms');
      console.log('  3. Go to Realtime Database > Rules');
      console.log('  4. Set rules to:');
      console.log('     { "rules": { ".read": true, ".write": true } }');
      console.log('  5. Click Publish, then re-run this script.');
    }
  }
  process.exit(0);
}

seedDatabase();
