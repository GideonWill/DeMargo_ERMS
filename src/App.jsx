import { useState, useMemo, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push, remove, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC09_b_uWspKRQPEyuaPk5JZwwDTH68zpw",
  authDomain: "demargo-erms.firebaseapp.com",
  projectId: "demargo-erms",
  databaseURL: "https://demargo-erms-default-rtdb.firebaseio.com/",
  storageBucket: "demargo-erms.firebasestorage.app",
  messagingSenderId: "132903868292",
  appId: "1:132903868292:web:1be583adf9f428c97cefd1",
  measurementId: "G-DW0Z986MPY"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ─────────────────────────────────────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_EMPLOYEES = [
  { id:"AD001", name:"Christabel Marcel Quayson", title:"Procurement officer", dept:"Administration", phone:"0241991903", status:"Full Time", doj:"02/02/2024", nokName:"Michelle Marcel", nokPhone:"0249684448", dob:"18/12/2004", emergencyContact:"0249684448", relationship:"Sister", ssnit:"1400010882787" },
  { id:"AD002", name:"Michael Nana Kwame Danso Boateng", title:"Personal Assistant", dept:"Administration", phone:"0548970301", status:"Full Time", doj:"30/09/2025", nokName:"Prince kwaku Boateng", nokPhone:"0541900918", dob:"02/03/2002", emergencyContact:"0541900918", relationship:"Brother", ssnit:"140001088568" },
  { id:"AM001", name:"Dorcas Acquah", title:"Custodian", dept:"Facility Management", phone:"0538980608", status:"Full Time", doj:"30/09/2024", nokName:"Michealle Kpedo", nokPhone:"0246614867", dob:"20/08/2003", emergencyContact:"0246614867", relationship:"Sister", ssnit:"B290308200028" },
  { id:"AM002", name:"Pierrette Zida", title:"Custodian", dept:"Facility Management", phone:"0556304651", status:"Full Time", doj:"30/09/2024", nokName:"Pascal Zida", nokPhone:"0531765135", dob:"29/06/1998", emergencyContact:"0242815770", relationship:"Brother", ssnit:"D209806290028" },
  { id:"AM003", name:"Elizabeth Pobi", title:"Custodian", dept:"Facility Management", phone:"0558691227", status:"Full Time", doj:"30/09/2024", nokName:"Lydia Pobi", nokPhone:"0503506069", dob:"04/07/2000", emergencyContact:"0542835939", relationship:"Sister", ssnit:"E029707040026" },
  { id:"AM004", name:"Jessica Kpogo", title:"Custodian", dept:"Facility Management", phone:"0596907065", status:"Full Time", doj:"25/03/2024", nokName:"Stacy Frimpongmaa", nokPhone:"0550400620", dob:"28/02/2002", emergencyContact:"0550400620", relationship:"Sister", ssnit:"C010202280229" },
  { id:"AM005", name:"Hannah Akua Osei", title:"Custodian", dept:"Facility Management", phone:"0550623703", status:"Full Time", doj:"25/03/2024", nokName:"Antonia Mintah", nokPhone:"0543569603", dob:"24/04/2002", emergencyContact:"0555579954", relationship:"Sister", ssnit:"C120204240025" },
  { id:"AM006", name:"Abigail Ketu", title:"Custodian", dept:"Facility Management", phone:"0591772524", status:"Full Time", doj:"02/03/2024", nokName:"Emmanuella Danso", nokPhone:"0591772524", dob:"09/05/2001", emergencyContact:"0554629916", relationship:"Daughter", ssnit:"" },
  { id:"AM007", name:"Clinton Brown (FM)", title:"Custodian / Installer", dept:"Facility Management", phone:"0504463338", status:"Full Time", doj:"01/08/2025", nokName:"Gloria Takyi", nokPhone:"0244982096", dob:"18/04/2005", emergencyContact:"0244982096", relationship:"Mother", ssnit:"" },
  { id:"AM008", name:"Mariam Alhassan", title:"Custodian", dept:"Facility Management", phone:"0508469035", status:"Full Time", doj:"21/08/2025", nokName:"Nadia Fatawu", nokPhone:"0245809456", dob:"15/06/2001", emergencyContact:"0551422795", relationship:"Daughter", ssnit:"L130106150020" },
  { id:"AM009", name:"Priscilla Amonquandor", title:"Custodian", dept:"Facility Management", phone:"0554476347", status:"Full Time", doj:"15/05/2025", nokName:"Sk Amonquandor", nokPhone:"0552418797", dob:"15/04/1991", emergencyContact:"0552418797", relationship:"Father", ssnit:"" },
  { id:"AM010", name:"Helena Kissi Kumiwaa", title:"Custodian", dept:"Facility Management", phone:"0591528605", status:"Full Time", doj:"14/02/2025", nokName:"Dominic Ampedu", nokPhone:"0599537826", dob:"13/07/2002", emergencyContact:"0543233713", relationship:"Brother", ssnit:"B200207130026" },
  { id:"AM011", name:"Grace Bawah", title:"Custodian", dept:"Facility Management", phone:"0548342010", status:"Probation", doj:"24/12/2025", nokName:"Gifty Hoenydzi", nokPhone:"0535229382", dob:"13/08/2005", emergencyContact:"0535229382", relationship:"Mother", ssnit:"" },
  { id:"AM012", name:"Emmanuella Agyeiwaa Dankwah", title:"Custodian", dept:"Facility Management", phone:"0536432335", status:"Probation", doj:"23/12/2025", nokName:"Dorinda A. Dankwah", nokPhone:"0248597258", dob:"24/10/2002", emergencyContact:"0541623912", relationship:"Sister", ssnit:"" },
  { id:"AM013", name:"Wendy Aryee", title:"Custodian", dept:"Facility Management", phone:"0530182009", status:"Probation", doj:"06/01/2026", nokName:"Percy Sackey", nokPhone:"0502300424", dob:"26/09/2007", emergencyContact:"0554961052", relationship:"Brother", ssnit:"" },
  { id:"AM014", name:"Pascal Tetteh", title:"Custodian", dept:"Facility Management", phone:"", status:"Full Time", doj:"04/10/2025", nokName:"Eunice Brown", nokPhone:"0599620130", dob:"15/08/2002", emergencyContact:"0504463338", relationship:"Sister", ssnit:"" },
  { id:"AM015a", name:"Precious Gyamfua Acheampong", title:"Custodian", dept:"Facility Management", phone:"0257809705", status:"Probation", doj:"15/10/2025", nokName:"Isaac B. Acheampong", nokPhone:"0207794819", dob:"08/07/2007", emergencyContact:"0257620860", relationship:"Brother", ssnit:"" },
  { id:"AM016", name:"Emmanuel Ofori", title:"Custodian", dept:"Facility Management", phone:"0594164425", status:"Probation", doj:"07/01/2026", nokName:"Roland Ofori", nokPhone:"0538814049", dob:"22/12/2005", emergencyContact:"0538814049", relationship:"Brother", ssnit:"" },
  { id:"AM017", name:"Christabel Alawotey", title:"Custodian", dept:"Facility Management", phone:"", status:"Probation", doj:"", nokName:"", nokPhone:"", dob:"", emergencyContact:"", relationship:"", ssnit:"" },
  { id:"AM019", name:"Christabel Acheampongma", title:"Custodian", dept:"Facility Management", phone:"0557733588", status:"Probation", doj:"06/04/2026", nokName:"", nokPhone:"", dob:"17/01/2006", emergencyContact:"", relationship:"", ssnit:"" },
  { id:"DM004", name:"George Nettey", title:"Head of Media", dept:"Media", phone:"0598463535 / 0501897636", status:"Full Time", doj:"10/2021", nokName:"Samuel Nettey", nokPhone:"0204743704", dob:"29/11/2000", emergencyContact:"0204743704", relationship:"Brother", ssnit:"" },
  { id:"DM005", name:"Robert Quaye", title:"Videographer", dept:"Installation", phone:"", status:"Full-time", doj:"15 October 2024", nokName:"Ebenezer Quaye", nokPhone:"0530601784", dob:"24 January", emergencyContact:"0591072583", relationship:"Brother", ssnit:"" },
  { id:"DM007", name:"Julius Mensah", title:"Head of Transport", dept:"Transport", phone:"0598733647", status:"Full Time", doj:"31/01/2024", nokName:"Juliana Mensah", nokPhone:"0545808994", dob:"23/03/2003", emergencyContact:"0249338950", relationship:"", ssnit:"" },
  { id:"DM017", name:"Michael Mantey", title:"Head of Installation", dept:"Installation", phone:"0531984299", status:"Full Time", doj:"12/01/2020", nokName:"Robert Apenteng", nokPhone:"+48791206373", dob:"19/12/1999", emergencyContact:"0546478040", relationship:"", ssnit:"" },
  { id:"DM018", name:"Samuel Nettey", title:"Head of Measurement", dept:"Measurement", phone:"0204743704", status:"Full Time", doj:"04/2022", nokName:"George Nettey", nokPhone:"0598463535", dob:"19/08/1998", emergencyContact:"0598463535", relationship:"Brother", ssnit:"" },
  { id:"DM020", name:"Desmond Agobia", title:"Installer", dept:"Installation", phone:"0544157305", status:"Full Time", doj:"24/01/2024", nokName:"Honey Life Int. Church", nokPhone:"0550811098", dob:"03/04/1999", emergencyContact:"0540207768", relationship:"Sister", ssnit:"" },
  { id:"DM021", name:"Joseph Allotey", title:"Installer", dept:"Installation", phone:"0538756886", status:"Full Time", doj:"24/01/2024", nokName:"Edith Adoley Mills", nokPhone:"0537567555", dob:"26/09/2005", emergencyContact:"0557517321", relationship:"Mother", ssnit:"" },
  { id:"DM023", name:"David Nii Obodai", title:"Installer", dept:"Installation", phone:"0597223954", status:"Full-time", doj:"5th May 2025", nokName:"Lydia Addy", nokPhone:"0597223954", dob:"26th October", emergencyContact:"0597223954", relationship:"Mother", ssnit:"", bankAccount:"1400010032368" },
  { id:"DM024", name:"Gideon Asante", title:"Measurement Officer", dept:"Measurement", phone:"0555200376", status:"Probation", doj:"05/05/2025", nokName:"Kwame Asante", nokPhone:"0557549942", dob:"", emergencyContact:"", relationship:"", ssnit:"" },
  { id:"DM027", name:"Samuel Amartey Otu", title:"Installer", dept:"Installation", phone:"", status:"Full-time", doj:"18th April 2021", nokName:"Gladys Mensah Otu", nokPhone:"0245127514", dob:"", emergencyContact:"0245127514", relationship:"Mother", ssnit:"", bankAccount:"1400007862492" },
  { id:"DM039", name:"Evans Kyei", title:"Installer", dept:"Installation", phone:"0539309358", status:"Probation", doj:"06/09/2025", nokName:"Esther Kyei", nokPhone:"0596221194", dob:"25/09/2002", emergencyContact:"0532640085", relationship:"", ssnit:"" },
  { id:"DM040", name:"Clinton Brown", title:"Installer", dept:"Installation", phone:"0504463338", status:"Probation", doj:"", nokName:"Gloria Takyi", nokPhone:"0244982096", dob:"18/04/2005", emergencyContact:"0244982096", relationship:"Mother", ssnit:"" },
  { id:"DM044", name:"Jeremiah Quayson", title:"Installer", dept:"Installation", phone:"0244543146", status:"Probation", doj:"01/10/2025", nokName:"Dorcas Mensah", nokPhone:"0552833855", dob:"18/02/2005", emergencyContact:"0244543146", relationship:"Mother", ssnit:"" },
  { id:"DM045", name:"Pascal Tetter", title:"Installer / Cleaner", dept:"Installation", phone:"0596903186", status:"Probation", doj:"04/10/2025", nokName:"Eunice Brown", nokPhone:"0599620130", dob:"15/08/2002", emergencyContact:"0599620130", relationship:"Sister", ssnit:"" },
  { id:"DM046", name:"Elijah Andah", title:"Driver", dept:"Transport", phone:"0545119937", status:"Probation", doj:"16/06/2025", nokName:"Jeff Ansah", nokPhone:"0593699050", dob:"", emergencyContact:"", relationship:"", ssnit:"" },
  { id:"DM047", name:"Prince Nana Kwasi Kyei", title:"Installer", dept:"Installation", phone:"", status:"Full-time", doj:"10th October 2025", nokName:"Gifty", nokPhone:"0538321601", dob:"20th May", emergencyContact:"0275655998", relationship:"Sister", ssnit:"", bankAccount:"1400010871915" },
  { id:"DM048", name:"Habib Abdul Rahman Yussif", title:"Measurement Officer", dept:"Measurement", phone:"0248124461", status:"Probation", doj:"19/12/2025", nokName:"Dennis Okrah", nokPhone:"0557896087", dob:"09/02/2002", emergencyContact:"0593887858", relationship:"Wife", ssnit:"C340202090015", bankAccount:"1400010884626" },
  { id:"DM049", name:"Emmanuel Asare Akoto", title:"Installer", dept:"Installation", phone:"", status:"Full-time", doj:"7th January, 2026", nokName:"Velma Akoto", nokPhone:"0598183339", dob:"22/09/2007", emergencyContact:"0545186121", relationship:"Sister", ssnit:"", bankAccount:"1400010873551" },
  { id:"DM050", name:"Kingsley Adjartey", title:"Installer", dept:"Installation", phone:"", status:"Full-time", doj:"15th December 2025", nokName:"Tei James", nokPhone:"0533690495", dob:"13/05/2000", emergencyContact:"0533690495", relationship:"Brother", ssnit:"" },
  { id:"DM051", name:"Isaac Mensah", title:"Installer", dept:"Installation", phone:"", status:"Full-time", doj:"21st February 2026", nokName:"Kelvin Mensah", nokPhone:"0530584759", dob:"1st July 2007", emergencyContact:"0530584759", relationship:"Brother", ssnit:"", bankAccount:"1400010873292" },
  { id:"DM052", name:"Amankwah Richmond", title:"Installer", dept:"Installation", phone:"", status:"Full-time", doj:"7th January 2026", nokName:"Kate Amoaku", nokPhone:"0532055414", dob:"25/02/2002", emergencyContact:"0249638069", relationship:"Sister", ssnit:"", bankAccount:"1400010877433" },
  { id:"DM053", name:"Opoku Roland", title:"Installer", dept:"Installation", phone:"", status:"Full-time", doj:"21st February 2026", nokName:"Kelvin Kissi", nokPhone:"0200496098", dob:"29/03/2005", emergencyContact:"0200496098", relationship:"Brother", ssnit:"", bankAccount:"1400010870668" },
  { id:"DM054", name:"Stephen Ankrah", title:"Installer", dept:"Installation", phone:"", status:"Full-time", doj:"28th October 2025", nokName:"Ankrah Blessing", nokPhone:"0547540192", dob:"5th February 2002", emergencyContact:"0547540192", relationship:"Sister", ssnit:"" },
  { id:"PD001", name:"Tuah Vida", title:"Production Manager", dept:"Production", phone:"0577753329", status:"Full Time", doj:"19/06/2026", nokName:"Juliana Tuah", nokPhone:"0549805635", dob:"01/05/1994", emergencyContact:"0244308677", relationship:"Sister", ssnit:"B039405010028" },
  { id:"PD002", name:"Otu Charles", title:"Tailoring Head", dept:"Production", phone:"0531427829", status:"Full Time", doj:"02/04/2024", nokName:"Otu Ebenezer", nokPhone:"0544421839", dob:"23/02/2003", emergencyContact:"0544421839", relationship:"Brother", ssnit:"1400008807746" },
  { id:"PD003", name:"Asiedu Larbi Cynthia", title:"Deputy Production Manager", dept:"Production", phone:"0244821287", status:"Full Time", doj:"03/09/2024", nokName:"Wilfreda N.S Wilson", nokPhone:"0531638118", dob:"19/11/1977", emergencyContact:"0244481212", relationship:"Daughter", ssnit:"1400009535607" },
  { id:"PD004", name:"Ocloo Princess Charity", title:"Deputy Tailoring Head", dept:"Production", phone:"0535324956", status:"Full Time", doj:"09/09/2024", nokName:"Ocloo Pascaline Etornam", nokPhone:"0531383382", dob:"24/03/1999", emergencyContact:"0535386255", relationship:"Sister", ssnit:"1400009538005" },
  { id:"PD005", name:"Sarpong Esther", title:"Tailor", dept:"Production", phone:"0596221194", status:"Full Time", doj:"06/04/2025", nokName:"Kojo Asante", nokPhone:"0531335521", dob:"01/01/2005", emergencyContact:"0532640085", relationship:"Brother", ssnit:"F230501010022" },
  { id:"PD006", name:"Osae Mary Afful", title:"Tailor", dept:"Production", phone:"0535303732", status:"Full Time", doj:"01/09/2025", nokName:"Issabel Osei Banahene", nokPhone:"0545013171", dob:"06/11/2000", emergencyContact:"0248219483", relationship:"Sister", ssnit:"" },
  { id:"PD007", name:"Opokua Mavis", title:"Tailor", dept:"Production", phone:"0256870984", status:"Full Time", doj:"10/09/2024", nokName:"Solomon Opoku", nokPhone:"0535497824", dob:"05/01/2002", emergencyContact:"0594474041", relationship:"Brother", ssnit:"E070201050061" },
  { id:"PD008", name:"Boakye Joel Atuahene", title:"Tailor", dept:"Production", phone:"0551362771", status:"Full Time", doj:"20/08/2025", nokName:"Boakye Hagar", nokPhone:"0542375312", dob:"28/06/2003", emergencyContact:"0593369296", relationship:"Sister", ssnit:"1400010862711" },
  { id:"PD009", name:"Iddrisu Abass", title:"Tailor", dept:"Production", phone:"0553907260", status:"Full Time", doj:"08/05/2025", nokName:"Iddrisu Abu", nokPhone:"0554092253", dob:"09/05/2002", emergencyContact:"0554092253", relationship:"Brother", ssnit:"1400009655354" },
  { id:"PD010", name:"Donkoh Thomas", title:"Tailor", dept:"Production", phone:"0591627374", status:"Full Time", doj:"08/05/2025", nokName:"Ofori Evelyn", nokPhone:"0243579250", dob:"17/11/2005", emergencyContact:"0243579250", relationship:"Sister", ssnit:"1400009983987" },
  { id:"PD011", name:"Bondzie Kwesi Theophilus", title:"Tailor", dept:"Production", phone:"0533822154", status:"Full Time", doj:"20/08/2025", nokName:"Bondzie Ishmael", nokPhone:"0547771413", dob:"20/08/1989", emergencyContact:"0547771413", relationship:"Brother", ssnit:"A168908200099" },
  { id:"PD012", name:"Quayson Samuel", title:"Tailor", dept:"Production", phone:"0544360599", status:"Probation", doj:"08/03/2026", nokName:"Quayson Betty", nokPhone:"0540896656", dob:"04/09/2004", emergencyContact:"0540896656", relationship:"Sister", ssnit:"1400010882593" },
  { id:"PD013", name:"Godson Adiglah", title:"Tailor", dept:"Production", phone:"0592288875", status:"Full Time", doj:"04/10/2025", nokName:"Adiglah Melody", nokPhone:"0545974996", dob:"24/04/2004", emergencyContact:"0545974996", relationship:"Sister", ssnit:"1400010882698" },
  { id:"PD014", name:"Danyo Emmanuel", title:"Tailor", dept:"Production", phone:"0599537826", status:"Probation", doj:"28/02/2026", nokName:"Danyo Francisca", nokPhone:"0554513182", dob:"20/11/2006", emergencyContact:"0554513182", relationship:"Sister", ssnit:"" },
  { id:"PD015", name:"Asare Emelia Pokua", title:"Pulling", dept:"Production", phone:"0594124180", status:"Full Time", doj:"29/05/2024", nokName:"Peprah Augustus", nokPhone:"0558489335", dob:"15/06/2001", emergencyContact:"0247052875", relationship:"Son", ssnit:"1400009537718" },
  { id:"PD016", name:"Dzotepe Yayra", title:"Pulling", dept:"Production", phone:"0531610054", status:"Full Time", doj:"27/04/2025", nokName:"Dzotepe Maxwell", nokPhone:"0249966574", dob:"04/05/2002", emergencyContact:"0547029768", relationship:"Brother", ssnit:"1400009579078" },
  { id:"PD017", name:"Eunice Konadu", title:"Pulling", dept:"Production", phone:"0532790104", status:"Full Time", doj:"20/08/2025", nokName:"Michael Asante", nokPhone:"0544107388", dob:"02/04/2005", emergencyContact:"0546422503", relationship:"Brother", ssnit:"", bankAccount:"1400010868434" },
  { id:"PD018", name:"Awunor Beatrice", title:"Pulling", dept:"Production", phone:"0535681563", status:"Full Time", doj:"09/01/2026", nokName:"Awunor Eliana", nokPhone:"0595465312", dob:"16/11/2004", emergencyContact:"0595465312", relationship:"Daughter", ssnit:"" },
  { id:"PD019", name:"Nartey Victoria", title:"Pulling", dept:"Production", phone:"0256403633", status:"Probation", doj:"02/02/2026", nokName:"Nartey Bridget", nokPhone:"0542497738", dob:"27/11/2005", emergencyContact:"0547613388", relationship:"Sister", ssnit:"1400010870811" },
  { id:"PD020", name:"Mensah Lydia Vashti", title:"Pulling", dept:"Production", phone:"0591516222", status:"Probation", doj:"13/03/2026", nokName:"Mandela Agyemang Mensah", nokPhone:"0591516222", dob:"05/10/2005", emergencyContact:"0596210108", relationship:"Son", ssnit:"1400010872188" },
  { id:"PD021", name:"Abayi Yayra Bernice", title:"Pulling", dept:"Production", phone:"0537964573", status:"Probation", doj:"13/03/2026", nokName:"Abayi William", nokPhone:"0244431809", dob:"19/08/2006", emergencyContact:"0244431809", relationship:"Father", ssnit:"" },
  { id:"PD022", name:"Helena Kissi Kumiwaa", title:"Pulling / Cleaning", dept:"Production", phone:"0591528605", status:"Full Time", doj:"14/02/2025", nokName:"Amperdu Dominic", nokPhone:"0599537826", dob:"13/07/2002", emergencyContact:"0543233713", relationship:"Brother", ssnit:"1400009623053" },
  { id:"PD023", name:"Precious Ama Gyamfua", title:"Pulling / Cleaning", dept:"Production", phone:"0257809705", status:"Full Time", doj:"15/10/2025", nokName:"Isaac N. B Acheampong", nokPhone:"0207794819", dob:"08/07/2007", emergencyContact:"0257620860", relationship:"Brother", ssnit:"" },
  { id:"PD024", name:"Amonquandor Priscilla", title:"Pulling / Cleaning", dept:"Production", phone:"0554476347", status:"Full Time", doj:"", nokName:"", nokPhone:"", dob:"", emergencyContact:"", relationship:"", ssnit:"1400009659589" },
];

// ─────────────────────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const ALL_DEPTS   = ["All", ...Array.from(new Set(INITIAL_EMPLOYEES.map(e => e.dept))).sort()];
const ALL_STATUSES = ["All", "Full Time", "Contract", "Probation"];

const DEPT_COLORS = {
  "Administration":         "#6366f1",
  "Media":                  "#ec4899",
  "Supply Chain Management":"#f59e0b",
  "Transport":              "#14b8a6",
  "Production":             "#f97316",
  "Installation":           "#3b82f6",
  "Measurement":            "#a855f7",
  "Facility Management":    "#10b981",
};

const STATUS_STYLE = {
  "Full Time":  { pill:"bg-emerald-500/15 text-emerald-400 border-emerald-500/30", dot:"bg-emerald-400" },
  "Contract":   { pill:"bg-amber-500/15  text-amber-400   border-amber-500/30",   dot:"bg-amber-400"   },
  "Probation":  { pill:"bg-sky-500/15    text-sky-400     border-sky-500/30",     dot:"bg-sky-400"     },
};

const EMPTY = { id:"", name:"", title:"", dept:"Administration", phone:"", status:"Full Time", doj:"", nokName:"", nokPhone:"", dob:"", emergencyContact:"", relationship:"", ssnit:"", bankAccount:"", ghanaCardId:"", image:"", hasStrike: false, strikeLetter: "", strikeLetterName: "" };

// ─────────────────────────────────────────────────────────────────────────────
//  UTILS
// ─────────────────────────────────────────────────────────────────────────────
function generateNextId(employees = []) {
  const prefix = "DM";

  let maxNum = 0;
  (employees || []).forEach(emp => {
    if (!emp || !emp.id) return;
    const match = emp.id.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  });

  let candidateNum = maxNum + 1;
  let candidateId = `${prefix}${String(candidateNum).padStart(4, "0")}`;

  while ((employees || []).some(e => e && e.id === candidateId)) {
    candidateNum++;
    candidateId = `${prefix}${String(candidateNum).padStart(4, "0")}`;
  }

  return candidateId;
}

function getInitials(name) {
  return name.split(" ").slice(0, 2).map(n => n[0] ?? "").join("").toUpperCase();
}

function parseDateString(str) {
  if (!str) return null;
  const clean = str.trim().toLowerCase();
  if (!clean) return null;

  // Handle DD/MM/YYYY or MM/YYYY or DD-MM-YYYY
  if (clean.includes('/') || clean.includes('-')) {
    const delimiter = clean.includes('/') ? '/' : '-';
    const parts = clean.split(delimiter);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY/MM/DD
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) return new Date(y, m, d);
      } else {
        // DD/MM/YYYY
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const y = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) return new Date(y, m, d);
      }
    } else if (parts.length === 2) {
      // MM/YYYY
      const m = parseInt(parts[0], 10) - 1;
      const y = parseInt(parts[1], 10);
      if (!isNaN(y) && !isNaN(m)) return new Date(y, m, 1);
    }
  }

  // Handle textual dates (e.g., "15 October 2024", "5th May 2025", "7th January, 2026")
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const monthsAbbr = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  
  let foundMonthIndex = -1;
  let foundMonthStr = "";
  for (let i = 0; i < months.length; i++) {
    if (clean.includes(months[i])) { foundMonthIndex = i; foundMonthStr = months[i]; break; }
  }
  if (foundMonthIndex === -1) {
    for (let i = 0; i < monthsAbbr.length; i++) {
      if (clean.includes(monthsAbbr[i])) { foundMonthIndex = i; foundMonthStr = monthsAbbr[i]; break; }
    }
  }

  if (foundMonthIndex !== -1) {
    const normalized = clean.replace(/(\d+)(st|nd|rd|th)/gi, "$1");
    const withoutMonth = normalized.replace(foundMonthStr, " ");
    const numMatches = withoutMonth.match(/\d+/g);
    if (numMatches && numMatches.length >= 1) {
      let day = 1;
      let year = null;
      if (numMatches.length === 1) {
        const val = parseInt(numMatches[0], 10);
        if (val > 1900 && val < 2100) year = val;
        else day = val;
      } else {
        day = parseInt(numMatches[0], 10);
        year = parseInt(numMatches[1], 10);
      }
      if (year) return new Date(year, foundMonthIndex, day);
    }
  }

  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) return parsed;
  return null;
}

function calcTenure(doj) {
  if (!doj) return null;
  const startDate = parseDateString(doj);
  if (!startDate || isNaN(startDate.getTime())) return null;

  const now = new Date();
  if (startDate > now) {
    return {
      years: 0,
      months: 0,
      totalMonths: 0,
      formatted: "New / Upcoming",
      isProbationDone: false,
      isLeaveEligible: false,
      probationMonthsLeft: 6,
      leaveMonthsLeft: 12,
      probationProgress: 0,
      leaveProgress: 0,
      startDate
    };
  }

  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalMonths = Math.max(0, years * 12 + months);
  
  let formatted = "";
  if (years > 0 && months > 0) {
    formatted = `${years} yr${years > 1 ? "s" : ""}, ${months} mo${months > 1 ? "s" : ""}`;
  } else if (years > 0) {
    formatted = `${years} yr${years > 1 ? "s" : ""}`;
  } else if (months > 0) {
    formatted = `${months} mo${months > 1 ? "s" : ""}`;
  } else {
    formatted = "< 1 mo";
  }

  const isProbationDone = totalMonths >= 6;
  const isLeaveEligible = totalMonths >= 12;
  const probationMonthsLeft = Math.max(0, 6 - totalMonths);
  const leaveMonthsLeft = Math.max(0, 12 - totalMonths);
  const probationProgress = Math.min(100, Math.round((totalMonths / 6) * 100));
  const leaveProgress = Math.min(100, Math.round((totalMonths / 12) * 100));

  return {
    years,
    months,
    totalMonths,
    formatted,
    isProbationDone,
    isLeaveEligible,
    probationMonthsLeft,
    leaveMonthsLeft,
    probationProgress,
    leaveProgress,
    startDate
  };
}

function calcAge(dob) {
  if (!dob) return null;
  const p = dob.split("/");
  if (p.length !== 3) return null;
  const d = new Date(`${p[2]}-${p[1]}-${p[0]}`);
  if (isNaN(d)) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (now.getMonth() - d.getMonth() < 0 || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
  return age > 0 && age < 110 ? age : null;
}

function parseDOB(dob) {
  if (!dob) return null;
  const clean = dob.trim().toLowerCase();
  
  // Match DD/MM/YYYY or DD/MM
  if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length >= 2) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const y = parts.length === 3 ? parseInt(parts[2], 10) : null;
      if (!isNaN(d) && !isNaN(m) && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        return { day: d, monthIndex: m - 1, year: y };
      }
    }
  }

  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const monthsAbbr = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  
  let foundMonthIndex = -1;
  let foundMonthStr = "";
  
  for (let i = 0; i < months.length; i++) {
    if (clean.includes(months[i])) {
      foundMonthIndex = i;
      foundMonthStr = months[i];
      break;
    }
  }
  if (foundMonthIndex === -1) {
    for (let i = 0; i < monthsAbbr.length; i++) {
      if (clean.includes(monthsAbbr[i])) {
        foundMonthIndex = i;
        foundMonthStr = monthsAbbr[i];
        break;
      }
    }
  }

  if (foundMonthIndex !== -1) {
    const withoutMonth = clean.replace(foundMonthStr, ' ');
    const numMatches = withoutMonth.match(/\d+/g);
    if (numMatches && numMatches.length > 0) {
      const day = parseInt(numMatches[0], 10);
      let year = null;
      if (numMatches.length > 1) {
        const potentialYear = parseInt(numMatches[1], 10);
        if (potentialYear > 1900 && potentialYear < 2100) {
          year = potentialYear;
        }
      }
      if (day >= 1 && day <= 31) {
        return { day, monthIndex: foundMonthIndex, year };
      }
    }
  }

  return null;
}

function exportCSV(employees) {
  const HEADERS = ["ID","Name","Title","Department","Phone","Status","Date of Employment","Tenure","Probation Completed","Leave Eligible","Date of Birth","NOK Name","NOK Phone","Relationship","Emergency Contact","SSNIT","Bank Account","Ghana Card ID"];
  const rows = employees.map(e => {
    const t = calcTenure(e.doj);
    return [
      e.id,
      e.name,
      e.title,
      e.dept,
      e.phone,
      e.status,
      e.doj,
      t ? t.formatted : "N/A",
      t ? (t.isProbationDone ? "Yes" : `No (${t.probationMonthsLeft}m left)`) : "N/A",
      t ? (t.isLeaveEligible ? "Yes" : `No (${t.leaveMonthsLeft}m left)`) : "N/A",
      e.dob,
      e.nokName,
      e.nokPhone,
      e.relationship,
      e.emergencyContact,
      e.ssnit,
      e.bankAccount,
      e.ghanaCardId
    ];
  });
  const csv  = [HEADERS,...rows].map(r => r.map(c => `"${(c||"").replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const url  = URL.createObjectURL(new Blob([csv], { type:"text/csv" }));
  const a    = Object.assign(document.createElement("a"), { href:url, download:"demargo_employees.csv" });
  a.click(); URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
//  ICONS
// ─────────────────────────────────────────────────────────────────────────────
const Ico = {
  Search: ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  Plus: ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  Edit: ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Trash: ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
  Eye: ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Close: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  ),
  Users: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Chart: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Download: ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Phone: ({ className = "w-3.5 h-3.5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Calendar: ({ className = "w-3.5 h-3.5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Grid: ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  List: ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  Alert: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  AlertTriangle: ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Check: ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  CheckCircle: ({ className = "w-3.5 h-3.5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  ShieldCheck: ({ className = "w-3.5 h-3.5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  CheckBadge: ({ className = "w-3.5 h-3.5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  Clock: ({ className = "w-3.5 h-3.5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Hourglass: ({ className = "w-3.5 h-3.5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>
    </svg>
  ),
  Palmtree: ({ className = "w-3.5 h-3.5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h11z"/><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-9"/><path d="M5.8 21a14.7 14.7 0 0 1 6.2-13"/><path d="M13 14c-.62 2.68-.45 5.5.8 8"/>
    </svg>
  ),
  Sun: ({ className = "w-3.5 h-3.5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  ),
  Lock: ({ className = "w-3.5 h-3.5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Sparkles: ({ className = "w-3.5 h-3.5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/>
    </svg>
  ),
  ChevronDown: ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  ChevronUp: ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  ),
  ID: ({ className = "w-3.5 h-3.5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8L2 7"/><circle cx="9" cy="14" r="2"/><path d="M13 14h4M13 18h4M9 18v-2"/>
    </svg>
  ),
  Gift: ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5" rx="1"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  ),
  File: ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  Layers: ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
};

const TENURE_OPTIONS = [
  {
    id: "All",
    label: "All Service & Leave Statuses",
    shortLabel: "All Milestones",
    description: "Viewing all employees across all tenure and service duration stages",
    icon: Ico.Sparkles,
    color: "#818cf8",
  },
  {
    id: "LeaveEligible",
    label: "Leave Eligible (≥ 1 Year)",
    shortLabel: "Leave Eligible",
    description: "Completed 12+ months service • Qualified for annual paid leave allowance",
    icon: Ico.Palmtree,
    color: "#2dd4bf",
  },
  {
    id: "LeaveIneligible",
    label: "Not Leave Eligible (< 1 Year)",
    shortLabel: "Not Leave Eligible",
    description: "Under 12 months service • Currently accumulating tenure toward leave eligibility",
    icon: Ico.Lock,
    color: "#f59e0b",
  },
  {
    id: "ProbationDone",
    label: "Completed Probation (≥ 6 Mos)",
    shortLabel: "Probation Completed",
    description: "Reached 6+ months milestone • Successfully passed initial probation period",
    icon: Ico.ShieldCheck,
    color: "#34d399",
  },
  {
    id: "InProbation",
    label: "Active Probation (< 6 Mos)",
    shortLabel: "Active Probation",
    description: "Currently serving their initial 6-month probationary timeline",
    icon: Ico.Hourglass,
    color: "#38bdf8",
  },
  {
    id: "ProbationReviewNeeded",
    label: "Probation Ended (Review for Full-Time)",
    shortLabel: "Probation Review Needed",
    description: "Status is 'Probation' but tenure is ≥ 6 months • HR action needed to promote to Full-Time",
    icon: Ico.AlertTriangle,
    color: "#fb7185",
    badge: "Action Required"
  }
];

function TenureDropdown({ value, onChange, counts = {} }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const currentOption = TENURE_OPTIONS.find(o => o.id === value) || TENURE_OPTIONS[0];
  const IconComponent = currentOption.icon;

  return (
    <div className="relative min-w-[240px]" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2.5 rounded-xl border border-white/10 bg-[#0c0f1a] px-3.5 py-2.5 text-sm text-white transition-all hover:border-white/20 focus:border-indigo-500 focus:outline-none group shadow-sm"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border"
            style={{
              background: `${currentOption.color}20`,
              borderColor: `${currentOption.color}40`,
              color: currentOption.color
            }}
          >
            <IconComponent className="w-3.5 h-3.5" />
          </span>
          <span className="truncate font-medium text-xs sm:text-sm">
            {currentOption.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {counts[currentOption.id] !== undefined && (
            <span
              className="px-1.5 py-0.5 rounded-md text-[10px] font-bold border"
              style={{
                background: `${currentOption.color}15`,
                borderColor: `${currentOption.color}30`,
                color: currentOption.color
              }}
            >
              {counts[currentOption.id]}
            </span>
          )}
          <Ico.ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="absolute left-0 right-0 sm:right-auto sm:w-[380px] top-full mt-2 z-50 rounded-2xl border border-white/15 bg-[#0c1020]/95 backdrop-blur-2xl p-2 shadow-2xl animate-scale-in">
          <div className="px-2.5 py-1.5 mb-1 border-b border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Filter by Milestone</span>
            <span className="text-[11px] text-white/40">Select Section</span>
          </div>
          <div className="space-y-1 max-h-[380px] overflow-y-auto pr-0.5 scrollbar-thin">
            {TENURE_OPTIONS.map((opt) => {
              const OptIcon = opt.icon;
              const isSelected = opt.id === value;
              const count = counts[opt.id] ?? 0;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onChange(opt.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-start justify-between gap-3 p-2.5 rounded-xl text-left transition-all group ${
                    isSelected
                      ? "bg-white/10 border border-white/15 shadow-inner"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 transition-transform group-hover:scale-110"
                      style={{
                        background: `${opt.color}20`,
                        borderColor: `${opt.color}40`,
                        color: opt.color
                      }}
                    >
                      <OptIcon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs sm:text-sm font-semibold truncate ${isSelected ? "text-white" : "text-white/80 group-hover:text-white"}`}>
                          {opt.label}
                        </span>
                        {opt.badge && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-white/40 mt-0.5 line-clamp-1 leading-snug">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                      style={{
                        background: `${opt.color}15`,
                        borderColor: `${opt.color}30`,
                        color: opt.color
                      }}
                    >
                      {count}
                    </span>
                    {isSelected && (
                      <span className="text-emerald-400">
                        <Ico.Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  ATOMS
// ─────────────────────────────────────────────────────────────────────────────
function Avatar({ name, dept, size = "md", image }) {
  const color = DEPT_COLORS[dept] || "#6366f1";
  const sz = { sm:"w-8 h-8 text-xs", md:"w-10 h-10 text-sm", lg:"w-16 h-16 text-xl" }[size];
  if (image) {
    return (
      <div className={`${sz} rounded-xl shrink-0 overflow-hidden bg-white/10 ring-1 ring-white/10 shadow-lg`}>
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`${sz} rounded-xl flex items-center justify-center font-bold text-white shrink-0`}
      style={{ background:`linear-gradient(135deg,${color}cc,${color}55)`, boxShadow:`0 4px 16px ${color}44` }}>
      {getInitials(name)}
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE["Probation"];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{status}
    </span>
  );
}

function LeaveEligibilityBadge({ tenure }) {
  if (!tenure) return null;
  if (tenure.isLeaveEligible) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30" title="Completed 1+ year. Eligible for annual leave.">
        <Ico.Palmtree className="w-3.5 h-3.5 text-teal-300" /> Leave Ready (1y+)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/5 text-white/45 border border-white/10" title={`Requires 1 year of service. ${tenure.leaveMonthsLeft} month(s) remaining.`}>
      <Ico.Lock className="w-3 h-3 text-white/40" /> Leave in {tenure.leaveMonthsLeft}m
    </span>
  );
}

function ProbationStatusBadge({ tenure, status }) {
  if (!tenure) return null;
  
  if (status === "Probation") {
    if (tenure.isProbationDone) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse" title="Completed 6+ months probation. Ready for Full Time review!">
          <Ico.AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Prob. Completed ({tenure.totalMonths}m)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-sky-500/15 text-sky-300 border border-sky-500/30" title={`${tenure.probationMonthsLeft} month(s) remaining in 6-month probation period.`}>
        <Ico.Hourglass /> Prob. {tenure.totalMonths}/6m
      </span>
    );
  }

  // If status is Full Time or Contract
  if (tenure.isProbationDone) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/20" title="Completed 6+ months of service">
        <Ico.ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 6m+ Confirmed
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-sky-500/15 text-sky-300 border border-sky-500/30" title={`${tenure.totalMonths} of 6 initial months`}>
        <Ico.Hourglass /> &lt;6m ({tenure.totalMonths}/6m)
      </span>
    );
  }
}

function StatCard({ label, value, color, sub }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 group hover:border-white/20 transition-all duration-300">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background:`radial-gradient(circle at 20% 50%,${color}18 0%,transparent 70%)` }} />
      <p className="text-xs font-semibold uppercase tracking-widest text-white/40">{label}</p>
      <p className="mt-1 text-4xl font-black text-white" style={{ fontFamily:"'Playfair Display',serif" }}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-white/35">{sub}</p>}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full" style={{ background:color }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MODAL SHELL
// ─────────────────────────────────────────────────────────────────────────────
function Modal({ children, onClose }) {
  // Close the modal when Escape key is pressed
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0c0f1a] shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const InputField = ({ label, k, form, set, errors, placeholder="", disabled=false, readOnly=false }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-widest text-white/45 mb-1.5">{label}</label>
    <input value={form[k] || ""} onChange={e=>set(k,e.target.value)} placeholder={placeholder} disabled={disabled} readOnly={readOnly}
      className={`w-full rounded-xl border bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:bg-white/8 focus:border-indigo-500 ${disabled || readOnly ? "opacity-60 cursor-not-allowed bg-white/3 select-none" : ""} ${errors[k]?"border-red-500":"border-white/10"}`} />
    {errors[k] && <p className="text-red-400 text-xs mt-1">{errors[k]}</p>}
  </div>
);

const SelectField = ({ label, k, form, set, options }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-widest text-white/45 mb-1.5">{label}</label>
    <select value={form[k]} onChange={e=>set(k,e.target.value)}
      className="w-full rounded-xl border border-white/10 bg-[#0c0f1a] px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition-all">
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

function EmployeeForm({ initial, onSave, onCancel, mode, showToast, employees = [] }) {
  const [form, setForm] = useState({ ...initial });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleDeptChange = (k, v) => {
    if (k === "dept" && mode === "add") {
      const nextId = generateNextId(employees, v);
      setForm(f => ({ ...f, dept: v, id: nextId }));
    } else {
      set(k, v);
    }
  };

  function validate() {
    const e = {};
    if (!form.id.trim())   e.id   = "Employee ID is required";
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.title.trim())e.title= "Job title is required";
    setErrors(e);
    return !Object.keys(e).length;
  }

  return (
    <div>
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-black text-white" style={{ fontFamily:"'Playfair Display',serif" }}>
            {mode==="add" ? "New Employee" : "Edit Employee"}
          </h2>
          <p className="text-sm text-white/40 mt-0.5">{mode==="add" ? "Add a new team member to the system" : `Editing ${initial.name}`}</p>
        </div>
        <button onClick={onCancel} className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"><Ico.Close /></button>
      </div>

      <div className="p-6 space-y-6">
        {/* Photo Upload */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Profile Photo</p>
          <div className="flex items-center gap-4">
             <Avatar name={form.name || "User"} dept={form.dept} image={form.image} size="lg" />
             <label className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white font-semibold hover:bg-white/10 transition-colors">
               Upload Photo
               <input type="file" accept="image/*" className="hidden" onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                     const reader = new FileReader();
                     reader.onload = (ev) => set('image', ev.target.result);
                     reader.readAsDataURL(e.target.files[0]);
                  }
               }}/>
             </label>
             {form.image && (
                <button type="button" onClick={() => set('image', '')} className="text-sm font-semibold text-red-500 hover:text-red-400 px-3 py-2 rounded-xl border border-red-500/20 bg-red-500/10 transition-colors">Remove</button>
             )}
          </div>
        </section>

        {/* Basic */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Basic Information</p>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Employee ID" k="id" placeholder="DM0001" form={form} set={set} errors={errors} readOnly={true} />
            <InputField label="Full Name"   k="name" placeholder="John Doe" form={form} set={set} errors={errors} />
            <InputField label="Job Title"   k="title" placeholder="Senior Designer" form={form} set={set} errors={errors} />
            <SelectField label="Department" k="dept" options={ALL_DEPTS.filter(d=>d!=="All")} form={form} set={handleDeptChange} />
            <InputField label="Phone Number" k="phone" placeholder="0200000000" form={form} set={set} errors={errors} />
            <SelectField label="Employment Status" k="status" options={["Full Time","Contract","Probation"]} form={form} set={set} />
            <InputField label="Date of Employment" k="doj" placeholder="DD/MM/YYYY" form={form} set={set} errors={errors} />
            <InputField label="Date of Birth"      k="dob" placeholder="DD/MM/YYYY" form={form} set={set} errors={errors} />
          </div>
        </section>

        {/* Next of Kin */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Next of Kin</p>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Full Name"          k="nokName"          placeholder="Jane Doe" form={form} set={set} errors={errors} />
            <InputField label="Phone"              k="nokPhone"         placeholder="0200000000" form={form} set={set} errors={errors} />
            <InputField label="Relationship"       k="relationship"     placeholder="Sister" form={form} set={set} errors={errors} />
            <InputField label="Emergency Contact"  k="emergencyContact" placeholder="0200000000" form={form} set={set} errors={errors} />
          </div>
        </section>

        {/* Additional */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Financial Details</p>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="SSNIT Number" k="ssnit" placeholder="B000000000000" form={form} set={set} errors={errors} />
            <InputField label="Bank Account" k="bankAccount" placeholder="0000000000000" form={form} set={set} errors={errors} />
            <InputField label="Ghana Card ID" k="ghanaCardId" placeholder="GHA-XXXXXXXXXX-X" form={form} set={set} errors={errors} />
          </div>
        </section>

        {/* Disciplinary / Strike Action */}
        <section className="border-t border-white/10 pt-6">
          <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3">Disciplinary & Strike Action</p>
          <div className="space-y-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="hasStrike" 
                checked={!!form.hasStrike} 
                onChange={e => {
                  const checked = e.target.checked;
                  setForm(f => {
                    const next = { ...f, hasStrike: checked };
                    if (!checked) {
                      next.strikeLetter = "";
                      next.strikeLetterName = "";
                    }
                    return next;
                  });
                }}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-red-500 focus:ring-red-500 focus:ring-opacity-25"
              />
              <label htmlFor="hasStrike" className="text-sm font-semibold text-white cursor-pointer select-none">
                Apply Disciplinary Strike Action
              </label>
            </div>
            
            {form.hasStrike && (
              <div className="space-y-3 pl-7 animate-fade-in">
                <p className="text-xs text-white/40">Upload a strike letter PDF. Storing is handled as a file attachment on the employee record.</p>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300 font-semibold hover:bg-red-500/20 transition-colors flex items-center gap-2">
                    <Ico.Download className="rotate-180" /> Upload Strike Letter (PDF)
                    <input 
                      type="file" 
                      accept="application/pdf" 
                      className="hidden" 
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          if (file.type !== "application/pdf") {
                            if (showToast) showToast("Only PDF files are allowed", "error");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setForm(f => ({
                              ...f,
                              strikeLetter: ev.target.result,
                              strikeLetterName: file.name
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {form.strikeLetter && (
                    <div className="flex items-center gap-2 text-sm text-white/70 bg-white/5 px-3 py-2 rounded-xl border border-white/10 max-w-xs truncate">
                      <Ico.File />
                      <span className="truncate" title={form.strikeLetterName}>{form.strikeLetterName || "strike_letter.pdf"}</span>
                      <button 
                        type="button" 
                        onClick={() => setForm(f => ({ ...f, strikeLetter: "", strikeLetterName: "" }))} 
                        className="text-red-400 hover:text-red-300 ml-2 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="flex gap-3 p-6 border-t border-white/10">
        <button onClick={onCancel}
          className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-white/60 hover:text-white hover:border-white/25 transition-colors">
          Cancel
        </button>
        <button onClick={()=>{ if(validate()) onSave(form); }}
          className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-98"
          style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
          <Ico.Check /> {mode==="add" ? "Add Employee" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  EMPLOYEE DETAIL
// ─────────────────────────────────────────────────────────────────────────────
function EmployeeDetail({ emp, onClose, onEdit, onDelete }) {
  console.log('EmployeeDetail emp:', emp);
  const [fullscreenImage, setFullscreenImage] = useState(false);
  const age   = calcAge(emp.dob);
  const tenure = calcTenure(emp.doj);
  const color = DEPT_COLORS[emp.dept] || "#6366f1";

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm py-1.5 border-b border-white/5 last:border-0">
      <span className="text-white/45 shrink-0 mr-4">{label}</span>
      <span className="text-white font-medium text-right">{value || "—"}</span>
    </div>
  );

  return (
    <div>
      {emp.hasStrike && (
        <div className="bg-red-500/15 border-b border-red-500/20 px-6 py-3 flex items-center gap-3 text-red-400 font-semibold text-sm">
          <span className="animate-pulse flex h-2 w-2 rounded-full bg-red-500 shrink-0" />
          <span className="tracking-wide uppercase font-bold flex items-center gap-1.5">
            <Ico.Alert /> Active Disciplinary Strike
          </span>
        </div>
      )}
      {/* Hero */}
      <div className="relative p-6 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0" style={{ background:`radial-gradient(ellipse at 0% 50%,${color}15 0%,transparent 65%)` }} />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div 
              className={emp.image ? "cursor-pointer hover:scale-105 transition-transform" : ""} 
              onClick={() => emp.image && setFullscreenImage(true)}
            >
              <Avatar name={emp.name} dept={emp.dept} size="lg" image={emp.image} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white leading-tight" style={{ fontFamily:"'Playfair Display',serif" }}>{emp.name}</h2>
              <p className="text-white/55 mt-0.5 text-sm">{emp.title}</p>
              <div className="flex items-center flex-wrap gap-2 mt-2">
                <StatusBadge status={emp.status} />
                <span className="text-xs px-2 py-0.5 rounded-full border border-white/12 text-white/40 font-mono">{emp.id}</span>
                <span className="text-xs px-2 py-0.5 rounded-full border border-white/12 text-white/40" style={{ borderColor:`${color}40`, color }}>{emp.dept}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors shrink-0"><Ico.Close /></button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Core details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label:"Phone",          value:emp.phone,    icon:<Ico.Phone /> },
            { label:"Date Joined",    value:emp.doj,      icon:<Ico.Calendar /> },
            { label:"Date of Birth",  value:emp.dob ? emp.dob : "", icon:<Ico.Calendar /> },
            { label:"Employment",     value:emp.status },
          ].map(({ label, value, icon })=>(
            <div key={label} className="rounded-xl border border-white/8 bg-white/4 p-3">
              <p className="text-xs text-white/35 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-sm font-semibold text-white flex items-center gap-1.5">{icon}{value||"—"}</p>
            </div>
          ))}
        </div>

        {/* SSNIT, Bank & Ghana Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {emp.ssnit && (
            <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/8 p-3">
              <p className="text-xs text-indigo-400 uppercase tracking-wider mb-1">SSNIT Number</p>
              <p className="text-sm font-mono font-semibold text-white">{emp.ssnit}</p>
            </div>
          )}
          {emp.bankAccount && (
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/8 p-3">
              <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1">Bank Account</p>
              <p className="text-sm font-mono font-semibold text-white">{emp.bankAccount}</p>
            </div>
          )}
          
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 p-3">
            <p className="text-xs text-amber-400 uppercase tracking-wider mb-1">Ghana Card ID</p>
            <p className="text-sm font-mono font-semibold text-white">{emp.ghanaCardId || "—"}</p>
          </div>

        </div>

        {/* Tenure & Service Milestones Card */}
        {tenure ? (
          <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent p-4 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                  <Ico.Clock />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Length of Service / Tenure</p>
                  <p className="text-base font-black text-white">{tenure.formatted} <span className="text-xs text-white/40 font-normal">({tenure.totalMonths} total month{tenure.totalMonths === 1 ? '' : 's'})</span></p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <LeaveEligibilityBadge tenure={tenure} />
                <ProbationStatusBadge tenure={tenure} status={emp.status} />
              </div>
            </div>

            {/* 2 Milestones Progress Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
              {/* 6-Month Probation Milestone */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white/80 flex items-center gap-1.5">
                    <Ico.Hourglass /> 6-Month Probation
                  </span>
                  {tenure.isProbationDone ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Ico.CheckCircle /> Completed
                    </span>
                  ) : (
                    <span className="text-sky-300 font-medium">{tenure.probationMonthsLeft} mo left</span>
                  )}
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${tenure.isProbationDone ? 'bg-emerald-500' : 'bg-sky-500'}`}
                    style={{ width: `${tenure.probationProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-white/40">
                  {tenure.isProbationDone 
                    ? 'Completed required 6-month probation period' 
                    : `${tenure.totalMonths} of 6 months completed`}
                </p>
              </div>

              {/* 1-Year Leave Eligibility Milestone */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white/80 flex items-center gap-1.5">
                    <Ico.Umbrella /> 1-Year Leave Policy
                  </span>
                  {tenure.isLeaveEligible ? (
                    <span className="text-teal-300 font-bold flex items-center gap-1">
                      <Ico.CheckCircle /> Eligible to Apply
                    </span>
                  ) : (
                    <span className="text-amber-300 font-medium">{tenure.leaveMonthsLeft} mo left</span>
                  )}
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${tenure.isLeaveEligible ? 'bg-teal-400' : 'bg-amber-400'}`}
                    style={{ width: `${tenure.leaveProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-white/40">
                  {tenure.isLeaveEligible 
                    ? 'Qualified (1+ year of continuous service)' 
                    : `Needs 12 months for leave eligibility (${tenure.totalMonths}/12)`}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/8 bg-white/4 p-3 text-center">
            <p className="text-xs text-white/40 italic">Start date (Date of Employment) not provided for tenure tracking.</p>
          </div>
        )}

        {/* Next of Kin */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/35 mb-3">Next of Kin & Emergency</p>
          <div className="rounded-xl border border-white/8 bg-white/4 p-4">
            <InfoRow label="Name"             value={emp.nokName} />
            <InfoRow label="Phone"            value={emp.nokPhone} />
            <InfoRow label="Relationship"     value={emp.relationship} />
            {emp.emergencyContact && emp.emergencyContact !== emp.nokPhone && (
              <InfoRow label="Emergency Contact" value={emp.emergencyContact} />
            )}
          </div>
        </div>

        {/* Strike Details */}
        {emp.hasStrike && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3">Strike Documents</p>
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
                  <Ico.File className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate" title={emp.strikeLetterName || "strike_letter.pdf"}>
                    {emp.strikeLetterName || "strike_letter.pdf"}
                  </p>
                  <p className="text-xs text-white/40">Disciplinary letter attachment</p>
                </div>
              </div>
              {emp.strikeLetter ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <button 
                    onClick={() => {
                      try {
                        // Convert base64 data URL to Blob then open as blob:// URL
                        const [header, b64] = emp.strikeLetter.split(",");
                        const mime = (header.match(/:(.*?);/) || [])[1] || "application/pdf";
                        const binary = atob(b64);
                        const bytes = new Uint8Array(binary.length);
                        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                        const blob = new Blob([bytes], { type: mime });
                        const blobUrl = URL.createObjectURL(blob);
                        const tab = window.open(blobUrl, "_blank");
                        if (!tab) alert("Please allow popups to view the strike letter.");
                        // Revoke after short delay so the new tab has time to load
                        setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
                      } catch (e) {
                        console.error(e);
                        // Fallback: trigger a download
                        const link = document.createElement("a");
                        link.href = emp.strikeLetter;
                        link.download = emp.strikeLetterName || "strike_letter.pdf";
                        link.click();
                      }
                    }}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-3.5 py-2 text-xs font-semibold text-red-300 transition-colors whitespace-nowrap"
                  >
                    View Strike Letter
                  </button>
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = emp.strikeLetter;
                      link.download = emp.strikeLetterName || "strike_letter.pdf";
                      link.click();
                    }}
                    className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3.5 py-2 text-xs font-semibold text-white/50 hover:text-white transition-colors whitespace-nowrap"
                  >
                    Download
                  </button>
                </div>
              ) : (
                <span className="text-xs text-white/30 italic">No document uploaded</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 p-6 border-t border-white/10">
        <button onClick={()=>onDelete(emp)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-semibold transition-colors">
          <Ico.Trash /> Remove
        </button>
        <button onClick={()=>onEdit(emp)}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
          <Ico.Edit /> Edit Employee
        </button>
      </div>
      
      {fullscreenImage && emp.image && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setFullscreenImage(false)}
        >
          <div className="relative max-w-3xl max-h-[90vh] flex flex-col items-center justify-center">
            <img src={emp.image} alt={emp.name} className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl ring-1 ring-white/10" />
            <button 
              className="absolute -top-4 -right-4 p-2 bg-black/80 hover:bg-black rounded-full text-white/70 hover:text-white transition-colors ring-1 ring-white/20"
              onClick={(e) => { e.stopPropagation(); setFullscreenImage(false); }}
            >
              <Ico.Close />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  ANALYTICS
// ─────────────────────────────────────────────────────────────────────────────
function Analytics({ employees }) {
  const byDept   = useMemo(()=>{
    const m = {};
    employees.forEach(e=>{ m[e.dept] = (m[e.dept]||0)+1; });
    return Object.entries(m).sort((a,b)=>b[1]-a[1]);
  },[employees]);

  const byStatus = useMemo(()=>{
    const m = {};
    employees.forEach(e=>{ m[e.status] = (m[e.status]||0)+1; });
    return m;
  },[employees]);

  const tenureStats = useMemo(()=>{
    let leaveEligible = 0;
    let leaveIneligible = 0;
    let probationPassed = 0;
    let inProbation = 0;
    let probationReviewNeeded = 0;

    employees.forEach(e => {
      const t = calcTenure(e.doj);
      if (t) {
        if (t.isLeaveEligible) leaveEligible++;
        else leaveIneligible++;

        if (t.isProbationDone) {
          probationPassed++;
          if (e.status === "Probation") probationReviewNeeded++;
        } else {
          inProbation++;
        }
      }
    });

    return { leaveEligible, leaveIneligible, probationPassed, inProbation, probationReviewNeeded };
  }, [employees]);

  const maxCount = byDept[0]?.[1] || 1;
  const ssnitCount = employees.filter(e=>e.ssnit).length;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-white" style={{ fontFamily:"'Playfair Display',serif" }}>Analytics</h2>

      {/* Status breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(byStatus).map(([status, count])=>{
          const s = STATUS_STYLE[status] || STATUS_STYLE["Probation"];
          return (
            <div key={status} className={`rounded-2xl border p-4 ${s.pill}`}>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">{status}</p>
              <p className="text-3xl font-black text-white mt-1" style={{ fontFamily:"'Playfair Display',serif" }}>{count}</p>
              <p className="text-xs text-white/40 mt-0.5">{Math.round(count/employees.length*100)}% of staff</p>
            </div>
          );
        })}
      </div>

      {/* Service & Policy Eligibility Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Leave Eligibility */}
        <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold uppercase tracking-widest text-teal-400 flex items-center gap-2">
              <Ico.Umbrella /> Annual Leave Eligibility (1+ Year)
            </p>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold">
              {Math.round((tenureStats.leaveEligible / (employees.length || 1)) * 100)}% Eligible
            </span>
          </div>
          <p className="text-3xl font-black text-white" style={{ fontFamily:"'Playfair Display',serif" }}>
            {tenureStats.leaveEligible} <span className="text-sm font-normal text-white/50">of {employees.length} employees</span>
          </p>
          <div className="mt-3 h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-teal-400 transition-all duration-700" style={{ width: `${Math.round((tenureStats.leaveEligible / (employees.length || 1)) * 100)}%` }} />
          </div>
          <p className="text-xs text-white/40 mt-2">
            {tenureStats.leaveIneligible} employee(s) are currently within their first year of service.
          </p>
        </div>

        {/* 6-Month Probation Breakdown */}
        <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold uppercase tracking-widest text-sky-400 flex items-center gap-2">
              <Ico.Hourglass /> 6-Month Probation Status
            </p>
            {tenureStats.probationReviewNeeded > 0 ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold animate-pulse">
                {tenureStats.probationReviewNeeded} Ready for Review
              </span>
            ) : (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold">
                {tenureStats.inProbation} in active probation
              </span>
            )}
          </div>
          <p className="text-3xl font-black text-white" style={{ fontFamily:"'Playfair Display',serif" }}>
            {tenureStats.probationPassed} <span className="text-sm font-normal text-white/50">completed 6+ months</span>
          </p>
          <div className="mt-3 h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-sky-400 transition-all duration-700" style={{ width: `${Math.round((tenureStats.probationPassed / (employees.length || 1)) * 100)}%` }} />
          </div>
          <p className="text-xs text-white/40 mt-2">
            {tenureStats.inProbation} employee(s) actively working towards the 6-month probation milestone.
          </p>
        </div>
      </div>

      {/* Dept bar chart */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-bold uppercase tracking-widest text-white/45 mb-5">Headcount by Department</p>
        <div className="space-y-3">
          {byDept.map(([dept, count])=>{
            const color = DEPT_COLORS[dept] || "#6366f1";
            return (
              <div key={dept}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white/80 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background:color }} />{dept}
                  </span>
                  <span className="text-white/40 font-semibold">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width:`${Math.round(count/maxCount*100)}%`, background:color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SSNIT */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-bold uppercase tracking-widest text-white/45 mb-4">SSNIT Registration Coverage</p>
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <p className="text-4xl font-black text-white" style={{ fontFamily:"'Playfair Display',serif" }}>{ssnitCount}</p>
            <p className="text-xs text-white/40 mt-1">of {employees.length} registered</p>
          </div>
          <div className="flex-1">
            <div className="h-3 rounded-full bg-white/8 overflow-hidden mb-1.5">
              <div className="h-full rounded-full transition-all duration-700" style={{ width:`${Math.round(ssnitCount/employees.length*100)}%`, background:"linear-gradient(90deg,#6366f1,#a855f7)" }} />
            </div>
            <p className="text-xs text-white/35">{Math.round(ssnitCount/employees.length*100)}% coverage</p>
          </div>
        </div>
      </div>

      {/* Dept diversity */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-bold uppercase tracking-widest text-white/45 mb-4">Department Overview</p>
        <div className="flex flex-wrap gap-2">
          {byDept.map(([dept,count])=>{
            const color = DEPT_COLORS[dept] || "#6366f1";
            return (
              <div key={dept} className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm" style={{ borderColor:`${color}35`, background:`${color}10` }}>
                <span className="w-2 h-2 rounded-full" style={{ background:color }} />
                <span className="text-white/80 font-medium">{dept}</span>
                <span className="text-xs font-bold" style={{ color }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  BIRTHDAYS
// ─────────────────────────────────────────────────────────────────────────────
function Birthdays({ employees, onEmployeeClick }) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const empsWithDOB = employees.map(e => {
    const dobObj = parseDOB(e.dob);
    return { ...e, dobObj };
  }).filter(e => e.dobObj);

  // Group by month
  const byMonth = Array.from({ length: 12 }, () => []);
  empsWithDOB.forEach(emp => {
    byMonth[emp.dobObj.monthIndex].push(emp);
  });
  
  // Sort each month chronologically
  byMonth.forEach(monthArr => monthArr.sort((a, b) => a.dobObj.day - b.dobObj.day));

  const currentMonthBirthdays = byMonth[currentMonth];

  return (
    <div className="space-y-10">
      
      {/* Celebration Banner */}
      <div>
        <h2 className="text-3xl font-black text-white mb-6" style={{ fontFamily:"'Playfair Display',serif" }}>This Month's Birthdays</h2>
        {currentMonthBirthdays.length === 0 ? (
          <div className="p-8 rounded-2xl border border-white/10 bg-white/5 text-center text-white/50">
            No birthdays this month.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentMonthBirthdays.map(emp => {
              const isToday = emp.dobObj.day === currentDay;
              const isPassed = emp.dobObj.day < currentDay;
              const color = DEPT_COLORS[emp.dept] || "#6366f1";
              
              return (
                <div key={emp.id} onClick={() => onEmployeeClick(emp)} className={`relative overflow-hidden rounded-2xl border p-5 transition-all cursor-pointer hover:scale-[1.02] hover:border-white/20
                  ${isToday ? "border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]" : "border-white/10 bg-white/5"}
                  ${isPassed ? "opacity-60" : "opacity-100"}`}>
                  
                  {isToday && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold uppercase rounded-bl-xl tracking-wider animate-pulse">
                      Today!
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-4">
                    <Avatar name={emp.name} dept={emp.dept} size="lg" image={emp.image} />
                    <div className="min-w-0">
                      <p className="font-bold text-lg text-white truncate">{emp.name}</p>
                      <p className="text-xs text-white/50 truncate">{emp.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="w-2 h-2 rounded-full" style={{ background:color }} />
                         <span className="text-xs text-white/40">{emp.dept}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Date</p>
                      <p className="text-lg font-black text-white">{months[currentMonth].substring(0,3)} {emp.dobObj.day}</p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Annual Grid */}
      <div>
        <h2 className="text-3xl font-black text-white mb-6" style={{ fontFamily:"'Playfair Display',serif" }}>Annual Calendar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {months.map((m, i) => (
            <div key={m} className={`rounded-2xl border ${i === currentMonth ? "border-indigo-500/30 bg-indigo-500/5" : "border-white/10 bg-white/4"} p-4 flex flex-col h-64`}>
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                <h3 className="font-black text-white/80">{m}</h3>
                <span className="text-xs font-bold bg-white/10 px-2 py-0.5 rounded-full text-white/50">{byMonth[i].length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-hide">
                {byMonth[i].length === 0 ? (
                  <p className="text-xs text-white/30 text-center mt-4">No birthdays</p>
                ) : (
                  byMonth[i].map(emp => (
                    <div key={emp.id} onClick={() => onEmployeeClick(emp)} className="flex items-center justify-between gap-3 group cursor-pointer hover:bg-white/5 p-1 rounded-lg transition-colors -mx-1">
                       <div className="flex items-center gap-2 min-w-0">
                         <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0" 
                              style={{ background:DEPT_COLORS[emp.dept]||"#6366f1" }}>
                           {emp.dobObj.day}
                         </div>
                         <div className="min-w-0">
                           <p className="text-sm font-semibold text-white/90 truncate group-hover:text-white transition-colors">{emp.name}</p>
                           <p className="text-[10px] text-white/40 truncate">{emp.title}</p>
                         </div>
                       </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIRM DIALOG
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/15 bg-[#0c0f1a] p-6 shadow-2xl animate-scale-in">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center text-red-400 shrink-0 mt-0.5"><Ico.Alert /></div>
          <div>
            <h3 className="text-lg font-bold text-white">Confirm Deletion</h3>
            <p className="text-sm text-white/55 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-white/60 hover:text-white transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-600 hover:bg-red-500 py-2.5 text-sm font-semibold text-white transition-colors">Delete Employee</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  TOAST
// ─────────────────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  const isSuccess = type === "success";
  return (
    <div className={`fixed bottom-6 right-6 z-[70] flex items-center gap-3 px-5 py-3 rounded-xl border shadow-2xl animate-slide-in-right
      ${isSuccess ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300" : "border-red-500/30 bg-red-500/15 text-red-300"}`}>
      {isSuccess ? <Ico.Check /> : <Ico.Alert />}
      <span className="text-sm font-semibold">{msg}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [loading,   setLoading]   = useState(false);
  const [search,       setSearch]       = useState("");
  const [deptFilter,   setDeptFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [tenureFilter, setTenureFilter] = useState("All");
  const [strikeFilter, setStrikeFilter] = useState("All");
  const [viewMode,     setViewMode]     = useState("grid");
  const [tab,          setTab]          = useState("employees");
  const [modal,        setModal]        = useState(null);
  const [confirm,      setConfirm]      = useState(null);
  const [toast,        setToast]        = useState(null);

  // Firebase Listener — employees stored by their own ID (e.g. employees/AM001)
  useEffect(() => {
    const empsRef = ref(db, 'employees');
    const unsubscribe = onValue(empsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Each key IS the employee ID; no separate firebaseId needed
        const list = Object.values(data).filter(Boolean);
        setEmployees(list);
      } else {
        // Seed Firebase with initial data, keyed by employee ID
        const seedObj = {};
        INITIAL_EMPLOYEES.forEach(emp => { seedObj[emp.id] = emp; });
        set(ref(db, 'employees'), seedObj);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const filtered = useMemo(() => employees.filter(e => {
    const q = search.toLowerCase();
    const t = calcTenure(e.doj);
    const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.title.toLowerCase().includes(q) || e.dept.toLowerCase().includes(q) || e.phone.includes(q);
    const matchesDept   = deptFilter === "All" || e.dept === deptFilter;
    const matchesStatus = statusFilter === "All" || e.status === statusFilter;
    const matchesStrike = strikeFilter === "All" || (strikeFilter === "Yes" && e.hasStrike) || (strikeFilter === "No" && !e.hasStrike);

    let matchesTenure = true;
    if (tenureFilter === "LeaveEligible") matchesTenure = t?.isLeaveEligible;
    else if (tenureFilter === "LeaveIneligible") matchesTenure = t && !t.isLeaveEligible;
    else if (tenureFilter === "ProbationDone") matchesTenure = t?.isProbationDone;
    else if (tenureFilter === "InProbation") matchesTenure = t && !t.isProbationDone;
    else if (tenureFilter === "ProbationReviewNeeded") matchesTenure = t?.isProbationDone && e.status === "Probation";

    return matchesSearch && matchesDept && matchesStatus && matchesStrike && matchesTenure;
  }), [employees, search, deptFilter, statusFilter, strikeFilter, tenureFilter]);

  const milestoneCounts = useMemo(() => {
    const counts = {
      All: employees.length,
      LeaveEligible: 0,
      LeaveIneligible: 0,
      ProbationDone: 0,
      InProbation: 0,
      ProbationReviewNeeded: 0,
    };

    employees.forEach(e => {
      const t = calcTenure(e.doj);
      if (t?.isLeaveEligible) counts.LeaveEligible++;
      else counts.LeaveIneligible++;

      if (t?.isProbationDone) counts.ProbationDone++;

      if (e.status === "Probation") {
        if (t?.isProbationDone) {
          counts.ProbationReviewNeeded++;
        } else {
          counts.InProbation++;
        }
      } else if (t && !t.isProbationDone && e.status !== "Full Time") {
        counts.InProbation++;
      }
    });

    return counts;
  }, [employees]);

  const stats = useMemo(() => {
    return {
      total:           employees.length,
      fullTime:        employees.filter(e=>e.status==="Full Time").length,
      contract:        employees.filter(e=>e.status==="Contract").length,
      probation:       employees.filter(e=>e.status==="Probation").length,
      leaveEligible:   milestoneCounts.LeaveEligible,
      probationPassed: milestoneCounts.ProbationDone,
      activeProbation: milestoneCounts.InProbation,
      reviewNeeded:    milestoneCounts.ProbationReviewNeeded,
    };
  }, [employees, milestoneCounts]); 

  // Handlers — use employee's own ID as the stable Firebase key
  const handleSave = async (form) => {
    try {
      const { firebaseId, ...cleanForm } = form; // strip any stale firebaseId
      if (!cleanForm.id || !cleanForm.id.trim()) {
        showToast("Employee ID is required", "error"); return;
      }
      if (modal.type === "add") {
        if (employees.find(e => e.id === cleanForm.id)) {
          showToast("Employee ID already exists", "error"); return;
        }
      } else if (modal.type === "edit") {
        const oldId = modal.emp?.id;
        if (oldId && oldId !== cleanForm.id) {
          if (employees.find(e => e.id === cleanForm.id)) {
            showToast("Employee ID already exists", "error"); return;
          }
          // Delete old ID key from Firebase so orphan records never remain
          await remove(ref(db, `employees/${oldId}`));
        }
      }
      // Always write to employees/<id> — covers both add and edit
      await set(ref(db, `employees/${cleanForm.id}`), cleanForm);
      showToast(modal.type === "add" ? "Employee added successfully" : "Employee updated");
      setModal(null);
    } catch (err) {
      console.error("Save error:", err);
      showToast("Operation failed — " + (err.message || ""), "error");
    }
  };

  const handleDelete = (emp) => setConfirm({ id: emp.id });

  const confirmDelete = async () => {
    try {
      await remove(ref(db, `employees/${confirm.id}`));
      setModal(null); setConfirm(null);
      showToast("Employee removed");
    } catch (err) {
      showToast("Delete failed — " + (err.message || ""), "error");
    }
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background:"linear-gradient(135deg,#080b12 0%,#0c1020 60%,#080b12 100%)", fontFamily:"'DM Sans',sans-serif" }}>

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/8" style={{ background:"rgba(8,11,18,0.85)", backdropFilter:"blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0 py-1">
              <img src="/logo.png" alt="DeMargo Logo" className="h-[46px] w-auto object-contain drop-shadow-lg" />
              <div className="hidden sm:block pl-3 border-l border-white/10">
                <h1 className="text-sm font-black text-white" style={{ fontFamily:"'Playfair Display',serif" }}>Employee Records</h1>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button onClick={()=>exportCSV(filtered)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-white/55 hover:text-white hover:border-white/20 text-xs font-semibold transition-colors">
                <Ico.Download /> <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button onClick={()=>setModal({ type:"add", emp:{ ...EMPTY, id: generateNextId(employees, "Administration") } })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                <Ico.Plus /> <span>Add Employee</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
             <p className="text-white/40 text-sm font-semibold tracking-widest uppercase">Syncing with Cloud...</p>
          </div>
        ) : (
          <>
            {/* TABS */}
            <div className="flex gap-1 p-1 rounded-xl w-full overflow-x-auto sm:w-fit border border-white/10 bg-white/5 scrollbar-hide">
              {[{ id:"employees", label:"Employees", icon:<Ico.Users /> },{ id:"analytics", label:"Analytics", icon:<Ico.Chart /> },{ id:"birthdays", label:"Birthdays", icon:<Ico.Gift /> }].map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${tab===t.id?"text-white shadow-lg":"text-white/45 hover:text-white"}`}
                  style={tab===t.id ? { background:"linear-gradient(135deg,#6366f1,#8b5cf6)" } : {}}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {tab === "analytics" ? <Analytics employees={employees} /> : tab === "birthdays" ? <Birthdays employees={employees} onEmployeeClick={emp => setModal({ type:"view", emp })} /> : (
              <>
                {/* STAT CARDS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard label="Total Employees" value={stats.total}     color="#6366f1" sub={`${stats.leaveEligible} leave eligible (1y+)`} />
                  <StatCard label="Full Time"        value={stats.fullTime}  color="#10b981" sub={`${stats.probationPassed} passed probation (6m+)`} />
                  <StatCard label="Contract"         value={stats.contract}  color="#f59e0b" />
                  <StatCard label="Probation"        value={stats.probation} color="#3b82f6" sub={`${stats.activeProbation} in initial 6 months`} />
                </div>

                {/* FILTER BAR */}
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="relative flex-1 min-w-[200px]">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none"><Ico.Search /></div>
                    <input value={search} onChange={e=>setSearch(e.target.value)}
                      placeholder="Search by name, ID, role, department…"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/28 outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                  <select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#0c0f1a] px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors">
                    {ALL_DEPTS.map(d=><option key={d}>{d}</option>)}
                  </select>
                  <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#0c0f1a] px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors">
                    {ALL_STATUSES.map(s=><option key={s}>{s}</option>)}
                  </select>
<TenureDropdown value={tenureFilter} onChange={setTenureFilter} counts={milestoneCounts} />
                  <select value={strikeFilter} onChange={e=>setStrikeFilter(e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#0c0f1a] px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors">
                    <option value="All">All Strike Statuses</option>
                    <option value="Yes">Under Strike</option>
                    <option value="No">No Strike</option>
                  </select>
                  <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                    {[{ m:"grid",icon:<Ico.Grid /> },{ m:"list",icon:<Ico.List /> }].map(v=>(
                      <button key={v.m} onClick={()=>setViewMode(v.m)}
                        className={`p-2 rounded-lg transition-all ${viewMode===v.m?"text-white":"text-white/38 hover:text-white"}`}
                        style={viewMode===v.m ? { background:"linear-gradient(135deg,#6366f1,#8b5cf6)" } : {}}>
                        {v.icon}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-white/30">{filtered.length} of {employees.length} employees</span>
                </div>
                {/* SECTION BANNER FOR ACTIVE MILESTONE / SERVICE STATUS */}
                {(() => {
                  const currentSection = TENURE_OPTIONS.find(o => o.id === tenureFilter);
                  if (!currentSection || tenureFilter === "All") return null;
                  const SectionIcon = currentSection.icon;
                  return (
                    <div className="relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all shadow-xl animate-fade-in"
                      style={{
                        borderColor: `${currentSection.color}40`,
                        background: `linear-gradient(135deg, ${currentSection.color}15 0%, rgba(12,16,32,0.95) 100%)`
                      }}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-lg border"
                            style={{
                              background: `${currentSection.color}20`,
                              borderColor: `${currentSection.color}40`,
                              color: currentSection.color
                            }}>
                            <SectionIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                {currentSection.label}
                              </h3>
                              {currentSection.badge && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                                  {currentSection.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-white/65 mt-0.5 max-w-2xl leading-relaxed">
                              {currentSection.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <span className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-inner border border-white/10"
                            style={{ background: `${currentSection.color}25` }}>
                            {filtered.length} Employee{filtered.length === 1 ? "" : "s"} in this Section
                          </span>
                          <button onClick={() => setTenureFilter("All")}
                            className="p-1.5 px-2.5 rounded-xl border border-white/10 hover:bg-white/10 text-white/50 hover:text-white transition-colors text-xs font-medium flex items-center gap-1.5"
                            title="Show All Employees">
                            <Ico.Close className="w-3.5 h-3.5" />
                            <span>Show All</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}


                {filtered.length === 0 && (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30"><Ico.Users className="w-8 h-8" /></div>
                    <p className="text-lg font-bold text-white/60">No employees found</p>
                    <p className="text-sm text-white/30 mt-1">Try adjusting your search or filters</p>
                  </div>
                )}

                {filtered.length > 0 && viewMode === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((emp, i)=>{
                      const color = DEPT_COLORS[emp.dept] || "#6366f1";
                      const tenure = calcTenure(emp.doj);
                      return (
                        <div key={emp.id}
                          className={`card-anim group relative rounded-2xl border bg-white/4 hover:bg-white/6 transition-all duration-200 cursor-pointer overflow-hidden ${emp.hasStrike ? "border-red-500/40 hover:border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-white/8 hover:border-white/18"}`}
                          style={{ animationDelay:`${Math.min(i,15)*25}ms` }}
                          onClick={()=>setModal({ type:"view", emp })}>
                          <div className={`absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300 ${emp.hasStrike ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} style={{ background: emp.hasStrike ? "#ef4444" : color }} />
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Avatar name={emp.name} dept={emp.dept} image={emp.image} />
                                <div className="min-w-0">
                                  <p className="font-bold text-white text-sm leading-tight truncate">{emp.name}</p>
                                  <p className="text-xs text-white/48 mt-0.5 truncate">{emp.title}</p>
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={e=>e.stopPropagation()}>
                                <button onClick={()=>setModal({ type:"edit", emp })}
                                  className="p-1.5 rounded-lg hover:bg-white/12 text-white/45 hover:text-white transition-colors" title="Edit Employee"><Ico.Edit /></button>
                                <button onClick={()=>handleDelete(emp)}
                                  className="p-1.5 rounded-lg hover:bg-red-500/15 text-white/45 hover:text-red-400 transition-colors" title="Delete Employee"><Ico.Trash /></button>
                              </div>
                            </div>

                            {/* Department & Status & Strike */}
                            <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <StatusBadge status={emp.status} />
                                {emp.hasStrike && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border border-red-500/30 bg-red-500/10 text-red-400">
                                    <Ico.AlertTriangle className="w-3 h-3 text-red-400 inline mr-1" /> Strike
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-white/30 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:color }} />{emp.dept}
                              </span>
                            </div>

                            {/* Tenure & Service Milestones Badges */}
                            {tenure ? (
                              <div className="rounded-xl border border-white/8 bg-white/4 p-2.5 space-y-2 mb-2.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-white/70 flex items-center gap-1.5">
                                    <Ico.Clock />
                                    <span className="text-indigo-300 font-extrabold">{tenure.formatted}</span>
                                    <span className="text-[10px] text-white/35">tenure</span>
                                  </span>
                                  <span className="text-[10px] text-white/40 font-mono">
                                    {tenure.totalMonths} mo{tenure.totalMonths === 1 ? '' : 's'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <ProbationStatusBadge tenure={tenure} status={emp.status} />
                                  <LeaveEligibilityBadge tenure={tenure} />
                                </div>
                              </div>
                            ) : (
                              <div className="rounded-xl border border-white/5 bg-white/2 p-2 mb-2.5 text-center">
                                <span className="text-[11px] text-white/30 italic">No start date provided</span>
                              </div>
                            )}

                            {/* Contact & Join Date */}
                            <div className="space-y-1 pt-1 border-t border-white/5">
                              {emp.phone && <p className="flex items-center gap-1.5 text-xs text-white/30"><Ico.Phone />{emp.phone}</p>}
                              {emp.doj   && <p className="flex items-center gap-1.5 text-xs text-white/30"><Ico.Calendar />Joined {emp.doj}</p>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {filtered.length > 0 && viewMode === "list" && (
                  <div className="rounded-2xl border border-white/10 bg-white/4 overflow-hidden">
                    <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 border-b border-white/8 text-xs font-bold uppercase tracking-widest text-white/30">
                      <div className="col-span-1">ID</div>
                      <div className="col-span-3">Employee</div>
                      <div className="col-span-2">Department</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-3">Tenure & Milestones</div>
                      <div className="col-span-1">Phone</div>
                      <div className="col-span-1">Actions</div>
                    </div>
                    {filtered.map(emp=>{
                      const tenure = calcTenure(emp.doj);
                      return (
                        <div key={emp.id}
                          className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-white/5 hover:bg-white/4 transition-colors cursor-pointer items-center"
                          onClick={()=>setModal({ type:"view", emp })}>
                          <div className="col-span-1 text-xs font-mono text-white/35 truncate">{emp.id}</div>
                          <div className="col-span-3 flex items-center gap-2 min-w-0">
                            <Avatar name={emp.name} dept={emp.dept} size="sm" image={emp.image} />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white truncate flex items-center gap-1.5">
                                {emp.name}
                                {emp.hasStrike && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-black tracking-wider uppercase border border-red-500/30 bg-red-500/10 text-red-400">
                                    Strike
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-white/40 truncate">{emp.title}</p>
                            </div>
                          </div>
                          <div className="col-span-2 hidden md:flex items-center gap-1.5 text-xs text-white/50">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:DEPT_COLORS[emp.dept]||"#6366f1" }} />
                            <span className="truncate">{emp.dept}</span>
                          </div>
                          <div className="col-span-1 hidden md:block"><StatusBadge status={emp.status} /></div>
                          <div className="col-span-3 hidden md:block">
                            {tenure ? (
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                                  <Ico.Clock /> {tenure.formatted}
                                </p>
                                <div className="flex items-center gap-1 flex-wrap">
                                  <ProbationStatusBadge tenure={tenure} status={emp.status} />
                                  <LeaveEligibilityBadge tenure={tenure} />
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-white/30">—</span>
                            )}
                          </div>
                          <div className="col-span-1 hidden md:block text-xs text-white/40 truncate">{emp.phone||"—"}</div>
                          <div className="col-span-1 flex gap-1" onClick={e=>e.stopPropagation()}>
                            <button onClick={()=>setModal({ type:"edit", emp })}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-white/38 hover:text-white transition-colors" title="Edit Employee"><Ico.Edit /></button>
                            <button onClick={()=>handleDelete(emp)}
                              className="p-1.5 rounded-lg hover:bg-red-500/15 text-white/38 hover:text-red-400 transition-colors" title="Delete Employee"><Ico.Trash /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* MODALS */}
      {modal?.type === "view" && (
        <Modal onClose={()=>setModal(null)}>
          <EmployeeDetail emp={modal.emp} onClose={()=>setModal(null)}
            onEdit={emp=>setModal({ type:"edit", emp })} onDelete={handleDelete} />
        </Modal>
      )}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <Modal onClose={()=>setModal(null)}>
          <EmployeeForm initial={modal.emp} onSave={handleSave} onCancel={()=>setModal(null)} mode={modal.type} showToast={showToast} employees={employees} />
        </Modal>
      )}
      {confirm && (
        <ConfirmDialog message="This will permanently remove the employee and all their data. This cannot be undone."
          onConfirm={confirmDelete} onCancel={()=>setConfirm(null)} />
      )}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
