import { useState, useMemo, useEffect } from "react";
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
  { id:"DM001", name:"Blessing Kesinornu",             title:"Secretary",                      dept:"Administration",        phone:"0573394099",                  status:"Full Time", doj:"15/07/2023", nokName:"Confidence Kudadze",        nokPhone:"0552158255", dob:"21/04/1993", emergencyContact:"0245463109", relationship:"Sister",  ssnit:"" },
  { id:"DM004", name:"George Nettey",                  title:"Head of Media",                  dept:"Media",                 phone:"0598463535 / 0501897636",     status:"Full Time", doj:"10/2021",    nokName:"Samuel Nettey",             nokPhone:"0204743704", dob:"29/11/2000", emergencyContact:"0204743704", relationship:"Brother", ssnit:"" },
  { id:"DM005", name:"Robert Quaye",                   title:"Installer / Photographer",       dept:"Media",                 phone:"",                            status:"Contract",  doj:"05/08/2024", nokName:"Ebenezer Quaye",            nokPhone:"0530601784", dob:"24/01/2002", emergencyContact:"",           relationship:"",        ssnit:"" },
  { id:"DM006", name:"Christabel Marcel Quayson",      title:"Procurement",                    dept:"Supply Chain Management",phone:"0537874228",                 status:"Full Time", doj:"02/02/2024", nokName:"Abigail Marcel Quayson",    nokPhone:"0539226709", dob:"18/12/2004", emergencyContact:"0249684448", relationship:"Mother",  ssnit:"" },
  { id:"DM007", name:"Julius Mensah",                  title:"Head of Transport",              dept:"Transport",             phone:"0598733647",                  status:"Full Time", doj:"31/01/2024", nokName:"Juliana Mensah",            nokPhone:"0545808994", dob:"23/03/2003", emergencyContact:"0249338950", relationship:"",        ssnit:"" },
  { id:"DM008", name:"Vida Tuah",                      title:"Production Manageress",          dept:"Production",            phone:"0541889283 / 0577753329",     status:"Full Time", doj:"19/07/2023", nokName:"Juliana Tuah",              nokPhone:"0549805635", dob:"01/05/1994", emergencyContact:"0274633311", relationship:"",        ssnit:"B039405010028" },
  { id:"DM009", name:"Charles Otu",                    title:"Head of Tailoring",              dept:"Production",            phone:"0531427821",                  status:"Full Time", doj:"02/04/2024", nokName:"Ebenezer Otu",              nokPhone:"0544421839", dob:"23/03/2003", emergencyContact:"0544421839", relationship:"",        ssnit:"" },
  { id:"DM010", name:"Cynthia Asiedu Larbi",           title:"Seamstress",                     dept:"Production",            phone:"0244821287 / 0207499067",     status:"Contract",  doj:"03/09/2024", nokName:"Wilfreda Naa Shady Wilson", nokPhone:"0531638118", dob:"19/11/1977", emergencyContact:"0244481212", relationship:"Sister",  ssnit:"" },
  { id:"DM011", name:"Princess Charity Ocloo",         title:"Seamstress",                     dept:"Production",            phone:"0535324956",                  status:"Contract",  doj:"09/09/2024", nokName:"Pascal Selorm Ocloo",       nokPhone:"0246143046", dob:"24/03/1999", emergencyContact:"0535386255", relationship:"Mother",  ssnit:"" },
  { id:"DM012", name:"Esther Sarpong",                 title:"Seamstress",                     dept:"Production",            phone:"0596221194",                  status:"Probation", doj:"06/04/2025", nokName:"Philip Ayamah",             nokPhone:"0276268728", dob:"01/01/2005", emergencyContact:"0532640085", relationship:"Mother",  ssnit:"" },
  { id:"DM013", name:"Emelia Asare Pokuaa",            title:"Pulling",                        dept:"Production",            phone:"0594124180",                  status:"Contract",  doj:"29/05/2024", nokName:"Augustus Peprah",           nokPhone:"0594124180", dob:"15/06/2001", emergencyContact:"0247055287", relationship:"Husband", ssnit:"" },
  { id:"DM014", name:"Mavis Opokua",                   title:"Pulling",                        dept:"Production",            phone:"0256870984 / 0505535892",     status:"Contract",  doj:"10/09/2024", nokName:"Augustina Okutuwaa",        nokPhone:"0594474041", dob:"05/01/2002", emergencyContact:"0594474041", relationship:"Mother",  ssnit:"" },
  { id:"DM015", name:"Yayra Dzotepe",                  title:"Pulling",                        dept:"Production",            phone:"0595226755",                  status:"Probation", doj:"28/04/2025", nokName:"Patrick Dzotepe",           nokPhone:"0535462059", dob:"04/05/2002", emergencyContact:"0243496840", relationship:"Mother",  ssnit:"" },
  { id:"DM016", name:"Thomas Donkoh",                  title:"Cutting",                        dept:"Production",            phone:"0591627374",                  status:"Probation", doj:"02/05/2025", nokName:"Evelyn Ofori",              nokPhone:"0559559045", dob:"17/10/2005", emergencyContact:"0559559045", relationship:"Sister",  ssnit:"" },
  { id:"DM017", name:"Michael Mantey",                 title:"Head of Installation",           dept:"Installation",          phone:"0531984299",                  status:"Full Time", doj:"12/01/2020", nokName:"Robert Apenteng",           nokPhone:"+48791206373",dob:"19/12/1999", emergencyContact:"0546478040", relationship:"",        ssnit:"" },
  { id:"DM018", name:"Samuel Nettey",                  title:"Assistant Head of Installation", dept:"Installation",          phone:"0204743704",                  status:"Full Time", doj:"04/2022",    nokName:"George Nettey",             nokPhone:"0598463535", dob:"19/08/1998", emergencyContact:"0598463535", relationship:"Brother", ssnit:"" },
  { id:"DM020", name:"Desmond Agobia",                 title:"Installer",                      dept:"Installation",          phone:"0544157305",                  status:"Full Time", doj:"24/01/2024", nokName:"Honey Life Int. Church",    nokPhone:"0550811098", dob:"03/04/1999", emergencyContact:"0540207768", relationship:"Sister",  ssnit:"" },
  { id:"DM021", name:"Joseph Allotey",                 title:"Installer",                      dept:"Installation",          phone:"0538756886",                  status:"Full Time", doj:"24/01/2024", nokName:"Edith Adoley Mills",        nokPhone:"0537567555", dob:"26/09/2005", emergencyContact:"0557517321", relationship:"Mother",  ssnit:"" },
  { id:"DM022", name:"Sheriff Mborowi",                title:"Installer",                      dept:"Installation",          phone:"0597554680",                  status:"Full Time", doj:"05/08/2024", nokName:"Kwabena Nkombe",            nokPhone:"0247625822", dob:"10/11/2001", emergencyContact:"",           relationship:"",        ssnit:"" },
  { id:"DM023", name:"David Nii Obodai",               title:"Installer",                      dept:"Installation",          phone:"0598348375",                  status:"Probation", doj:"05/05/2025", nokName:"Lydia Addy",                nokPhone:"0597223954", dob:"",           emergencyContact:"",           relationship:"",        ssnit:"" },
  { id:"DM024", name:"Gideon Asante",                  title:"Installer",                      dept:"Installation",          phone:"0555200376",                  status:"Probation", doj:"05/05/2025", nokName:"Kwame Asante",              nokPhone:"0557549942", dob:"",           emergencyContact:"",           relationship:"",        ssnit:"" },
  { id:"DM025", name:"Christian Tetteh",               title:"Installer",                      dept:"Installation",          phone:"0535344215",                  status:"Probation", doj:"17/02/2025", nokName:"Isaac Tetteh",              nokPhone:"0547670191", dob:"",           emergencyContact:"",           relationship:"",        ssnit:"" },
  { id:"DM026", name:"Abass Idrissu",                  title:"Tailor",                         dept:"Production",            phone:"0553907260",                  status:"Probation", doj:"05/05/2025", nokName:"Abu Idrissu",               nokPhone:"0554092253", dob:"",           emergencyContact:"",           relationship:"",        ssnit:"" },
  { id:"DM027", name:"Samuel Amartey Otu",             title:"Head of Measurement",            dept:"Measurement",           phone:"0597470343",                  status:"Full Time", doj:"19/02/2022", nokName:"Gladys Mensah Otu",         nokPhone:"0243127514", dob:"12/09/1985", emergencyContact:"0245127514", relationship:"Sister",  ssnit:"" },
  { id:"DM028", name:"Elizabeth Obosu",                title:"Seamstress",                     dept:"Production",            phone:"0593735722",                  status:"Full Time", doj:"12/12/2023", nokName:"Dominic Ackon",             nokPhone:"0531233147", dob:"25/12/1990", emergencyContact:"0544421839", relationship:"Husband", ssnit:"" },
  { id:"DM029", name:"Luqman Aryeetey",                title:"Administrative Assistant",       dept:"Administration",        phone:"0544901665",                  status:"Probation", doj:"23/09/2025", nokName:"Majeed Aryeetey",           nokPhone:"0591469698", dob:"29/12/1999", emergencyContact:"0553985411", relationship:"Sister",  ssnit:"" },
  { id:"DM030", name:"Vasco Nyansah",                  title:"Administrative Assistant",       dept:"Administration",        phone:"0558472865",                  status:"Probation", doj:"23/09/2025", nokName:"Vivian Nyansah",            nokPhone:"0558103162", dob:"05/05/2001", emergencyContact:"0558103162", relationship:"Sister",  ssnit:"" },
  { id:"DM031", name:"Gideon William Ogunu",           title:"Administrative Assistant",       dept:"Administration",        phone:"0277811521",                  status:"Probation", doj:"23/09/2025", nokName:"Rhoda Ogunu",               nokPhone:"0549978969", dob:"22/03/1999", emergencyContact:"0549978969", relationship:"Sister",  ssnit:"" },
  { id:"DM032", name:"Theophilus Kwesi Bondzie",       title:"Pulling",                        dept:"Production",            phone:"0533822154",                  status:"Probation", doj:"20/08/2025", nokName:"Ishmael Bondzie",           nokPhone:"0541777413", dob:"20/08/1989", emergencyContact:"0547771413", relationship:"Brother", ssnit:"" },
  { id:"DM033", name:"Osae Mary Afful",                title:"Seamstress",                     dept:"Production",            phone:"0535303732",                  status:"Probation", doj:"01/09/2025", nokName:"Issabel Osei Banahene",     nokPhone:"0545013171", dob:"06/11/2000", emergencyContact:"0248219483", relationship:"Mother",  ssnit:"" },
  { id:"DM036", name:"Godson Adiglah",                 title:"Cutting",                        dept:"Production",            phone:"0592288875",                  status:"Probation", doj:"04/10/2025", nokName:"Melody Adiglah",            nokPhone:"0545974996", dob:"24/04/2001", emergencyContact:"0246779509", relationship:"Mother",  ssnit:"" },
  { id:"DM037", name:"Deborah Aboagye",                title:"Pulling",                        dept:"Production",            phone:"0242545446",                  status:"Probation", doj:"15/09/2025", nokName:"Josephine Aboagye",         nokPhone:"0556224174", dob:"31/12/2002", emergencyContact:"0556224174", relationship:"Father",  ssnit:"" },
  { id:"DM038", name:"Eunice Konadu",                  title:"Pulling",                        dept:"Production",            phone:"0532790104",                  status:"Probation", doj:"18/08/2025", nokName:"Michael Asante",            nokPhone:"0554401452", dob:"02/04/2004", emergencyContact:"0546422503", relationship:"Father",  ssnit:"" },
  { id:"DM039", name:"Evans Kyei",                     title:"Installer",                      dept:"Installation",          phone:"0539309358",                  status:"Probation", doj:"06/09/2025", nokName:"Esther Kyei",               nokPhone:"0596221194", dob:"25/09/2002", emergencyContact:"0532640085", relationship:"",        ssnit:"" },
  { id:"DM040", name:"Clinton Brown",                  title:"Installer",                      dept:"Installation",          phone:"0504463338",                  status:"Probation", doj:"",           nokName:"Gloria Takyi",              nokPhone:"0244982096", dob:"18/04/2005", emergencyContact:"0244982096", relationship:"Mother",  ssnit:"" },
  { id:"DM041", name:"Stephen Ankrah",                 title:"Installer",                      dept:"Installation",          phone:"",                            status:"Probation", doj:"",           nokName:"",                          nokPhone:"",           dob:"",           emergencyContact:"",           relationship:"",        ssnit:"" },
  { id:"DM042", name:"Michael Nana Kwame Danso-Boateng",title:"Installer",                    dept:"Installation",          phone:"0548970301",                  status:"Probation", doj:"29/09/2025", nokName:"Prince K. Boateng",         nokPhone:"0541900918", dob:"02/03/2002", emergencyContact:"0536276473", relationship:"Sister",  ssnit:"" },
  { id:"DM044", name:"Jeremiah Quayson",               title:"Installer",                      dept:"Installation",          phone:"0244543146",                  status:"Probation", doj:"01/10/2025", nokName:"Dorcas Mensah",             nokPhone:"0552833855", dob:"18/02/2005", emergencyContact:"0244543146", relationship:"Mother",  ssnit:"" },
  { id:"DM045", name:"Pascal Tetter",                  title:"Installer / Cleaner",            dept:"Installation",          phone:"0596903186",                  status:"Probation", doj:"04/10/2025", nokName:"Eunice Brown",              nokPhone:"0599620130", dob:"15/08/2002", emergencyContact:"0599620130", relationship:"Sister",  ssnit:"" },
  { id:"DM046", name:"Elijah Andah",                   title:"Driver",                         dept:"Transport",             phone:"0545119937",                  status:"Probation", doj:"16/06/2025", nokName:"Jeff Ansah",                nokPhone:"0593699050", dob:"",           emergencyContact:"",           relationship:"",        ssnit:"" },
  { id:"DM047", name:"Prince Kwesi Kyei",              title:"Installer",                      dept:"Installation",          phone:"0209800691",                  status:"Probation", doj:"11/09/2025", nokName:"Gifty Arhin",               nokPhone:"0538321601", dob:"20/05/2001", emergencyContact:"0275655998", relationship:"Mother",  ssnit:"" },
  { id:"DM048", name:"Habib Abdul Rahman Yussif",      title:"Installer",                      dept:"Installation",          phone:"0248124461",                  status:"Probation", doj:"19/12/2025", nokName:"Dennis Okrah",              nokPhone:"0557896087", dob:"09/02/2002", emergencyContact:"0593887858", relationship:"Wife",    ssnit:"C340202090015" },
  { id:"DM049", name:"Emmanuel Asare Akoto",           title:"Installer",                      dept:"Installation",          phone:"0536851350",                  status:"Probation", doj:"12/01/2026", nokName:"Velma Asare Akoto",         nokPhone:"0598183339", dob:"22/09/2007", emergencyContact:"0545186121", relationship:"Uncle",   ssnit:"" },
  { id:"DM050", name:"Kingsley Adjartey",              title:"Installer",                      dept:"Installation",          phone:"0539434938",                  status:"Probation", doj:"19/12/2025", nokName:"Henry Adjartey",            nokPhone:"0502385931", dob:"13/05/2000", emergencyContact:"0240922292", relationship:"Father",  ssnit:"" },
  { id:"DM051", name:"Richmond",                       title:"Installer",                      dept:"Installation",          phone:"",                            status:"Probation", doj:"",           nokName:"",                          nokPhone:"",           dob:"",           emergencyContact:"",           relationship:"",        ssnit:"" },
  { id:"AM001", name:"Dorcas Acquah",                  title:"Cleaner",                        dept:"Facility Management",   phone:"0538980608",                  status:"Contract",  doj:"30/10/2024", nokName:"Bright Yeboah",             nokPhone:"0246614867", dob:"20/08/2003", emergencyContact:"0246614867", relationship:"Brother", ssnit:"B290308200028" },
  { id:"AM002", name:"Pierette Zida",                  title:"Cleaner",                        dept:"Facility Management",   phone:"0556304651",                  status:"Full Time", doj:"30/10/2024", nokName:"George Zida",               nokPhone:"0531765135", dob:"29/06/2000", emergencyContact:"0242815770", relationship:"Brother", ssnit:"D209806290028" },
  { id:"AM003", name:"Elizabeth Pobi",                 title:"Cleaner",                        dept:"Facility Management",   phone:"0558691227",                  status:"Full Time", doj:"30/10/2024", nokName:"Lydia Oforiwaa Pobi",       nokPhone:"0503506069", dob:"04/07/2000", emergencyContact:"0542835939", relationship:"Mother",  ssnit:"E029707040026" },
  { id:"AM004", name:"Jessica Kpogo",                  title:"Cleaner",                        dept:"Facility Management",   phone:"0596907065",                  status:"Full Time", doj:"25/03/2024", nokName:"Stacy Frimpomaa",           nokPhone:"0550400620", dob:"28/02/2002", emergencyContact:"0550400620", relationship:"Mother",  ssnit:"C010202280229" },
  { id:"AM005", name:"Hannah Akua Osei",               title:"Cleaner",                        dept:"Facility Management",   phone:"0257951682",                  status:"Full Time", doj:"25/03/2024", nokName:"Anthony Mintah",            nokPhone:"0543569603", dob:"24/04/2002", emergencyContact:"0543569603", relationship:"Mother",  ssnit:"C120204240025" },
  { id:"AM007", name:"Clinton Brown (FM)",             title:"Cleaner / Installer",            dept:"Facility Management",   phone:"0504463338",                  status:"Full Time", doj:"01/08/2025", nokName:"Gloria Takyi",              nokPhone:"0244982096", dob:"18/04/2005", emergencyContact:"0244982096", relationship:"Mother",  ssnit:"" },
  { id:"AM008", name:"Mariam Alhassan",                title:"Cleaner",                        dept:"Facility Management",   phone:"0596474418",                  status:"Full Time", doj:"22/08/2025", nokName:"Nadia Fatawu",              nokPhone:"0596474418", dob:"15/06/2001", emergencyContact:"0551422795", relationship:"Brother", ssnit:"L130106150020" },
  { id:"AM009", name:"Priscilla Amonquandor",          title:"Cleaner",                        dept:"Facility Management",   phone:"0554476347",                  status:"Full Time", doj:"15/05/2025", nokName:"Sk Amonquandor",            nokPhone:"0552418797", dob:"15/04/1991", emergencyContact:"0552418797", relationship:"Father",  ssnit:"" },
  { id:"AM010", name:"Helena Kissi Kumiwaa",           title:"Cleaner",                        dept:"Facility Management",   phone:"0591528605",                  status:"Full Time", doj:"15/02/2025", nokName:"Dominic Ampedu",            nokPhone:"0599158952", dob:"13/07/2002", emergencyContact:"0543233713", relationship:"Mother",  ssnit:"B200207130026" },
  { id:"AM011", name:"Grace Bawah",                    title:"Cleaner",                        dept:"Facility Management",   phone:"0548342010",                  status:"Probation", doj:"27/12/2025", nokName:"Gifty Onyedi",              nokPhone:"0243183270", dob:"13/08/2005", emergencyContact:"0243183270", relationship:"Mother",  ssnit:"" },
  { id:"AM012", name:"Emmanuella Agyeiwaa Dankwah",    title:"Cleaner",                        dept:"Facility Management",   phone:"0536432335",                  status:"Probation", doj:"23/12/2025", nokName:"Frimpong Samuel",           nokPhone:"0530182009", dob:"24/10/2002", emergencyContact:"0541623912", relationship:"Mother",  ssnit:"" },
  { id:"AM013", name:"Wendy Aryee",                    title:"Cleaner",                        dept:"Facility Management",   phone:"0530182009",                  status:"Probation", doj:"07/01/2026", nokName:"Percy Sackey",              nokPhone:"0530182009", dob:"26/09/2007", emergencyContact:"0532683314", relationship:"Mother",  ssnit:"" },
  { id:"AM015a",name:"Precious Gyamfua Acheampong",    title:"Cleaner",                        dept:"Facility Management",   phone:"0257809705",                  status:"Probation", doj:"15/10/2025", nokName:"Linda Ama Acquah",          nokPhone:"0257620860", dob:"08/07/2007", emergencyContact:"0538814049", relationship:"Sister",  ssnit:"" },
  { id:"AM015b",name:"Gladys Apaati Nti",              title:"Cleaner",                        dept:"Facility Management",   phone:"0599990665",                  status:"Probation", doj:"04/11/2025", nokName:"Suzanne Mcintyre Appiah",   nokPhone:"0246888287", dob:"06/09/1997", emergencyContact:"0559842488", relationship:"Sister",  ssnit:"" },
  { id:"AM016", name:"Emmanuel Ofori",                 title:"Cleaner",                        dept:"Facility Management",   phone:"",                            status:"Probation", doj:"07/02/2026", nokName:"Elizabeth Sany",            nokPhone:"0538814049", dob:"22/12/2005", emergencyContact:"0538814049", relationship:"Sister",  ssnit:"" },
  { id:"DM0029",name:"Adusei Opoku",                   title:"Administrative Assistant",       dept:"Administration",        phone:"0242008547",                  status:"Probation", doj:"01/09/2025", nokName:"Wendy Yeboah",              nokPhone:"0539676378", dob:"10/09/1997", emergencyContact:"",           relationship:"",        ssnit:"GHA-713314283-8" },
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

const EMPTY = { id:"", name:"", title:"", dept:"Administration", phone:"", status:"Full Time", doj:"", nokName:"", nokPhone:"", dob:"", emergencyContact:"", relationship:"", ssnit:"", image:"" };

// ─────────────────────────────────────────────────────────────────────────────
//  UTILS
// ─────────────────────────────────────────────────────────────────────────────
function getInitials(name) {
  return name.split(" ").slice(0, 2).map(n => n[0] ?? "").join("").toUpperCase();
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

function exportCSV(employees) {
  const HEADERS = ["ID","Name","Title","Department","Phone","Status","Date of Employment","Date of Birth","NOK Name","NOK Phone","Relationship","Emergency Contact","SSNIT"];
  const rows = employees.map(e => [e.id,e.name,e.title,e.dept,e.phone,e.status,e.doj,e.dob,e.nokName,e.nokPhone,e.relationship,e.emergencyContact,e.ssnit]);
  const csv  = [HEADERS,...rows].map(r => r.map(c => `"${(c||"").replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const url  = URL.createObjectURL(new Blob([csv], { type:"text/csv" }));
  const a    = Object.assign(document.createElement("a"), { href:url, download:"demargo_employees.csv" });
  a.click(); URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
//  ICONS
// ─────────────────────────────────────────────────────────────────────────────
const Ico = {
  Search:   ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Plus:     ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 5v14M5 12h14"/></svg>,
  Edit:     ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Eye:      ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Close:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  Users:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Chart:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  Download: ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Phone:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Calendar: ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Grid:     ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  List:     ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Alert:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Check:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
  ID:       ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8L2 7"/><circle cx="9" cy="14" r="2"/><path d="M13 14h4M13 18h4M9 18v-2"/></svg>,
};

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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0c0f1a] shadow-2xl animate-scale-in" onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const InputField = ({ label, k, form, set, errors, placeholder="" }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-widest text-white/45 mb-1.5">{label}</label>
    <input value={form[k] || ""} onChange={e=>set(k,e.target.value)} placeholder={placeholder}
      className={`w-full rounded-xl border bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:bg-white/8 focus:border-indigo-500 ${errors[k]?"border-red-500":"border-white/10"}`} />
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

function EmployeeForm({ initial, onSave, onCancel, mode }) {
  const [form, setForm] = useState({ ...initial });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

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
            <InputField label="Employee ID" k="id" placeholder="DM001" form={form} set={set} errors={errors} />
            <InputField label="Full Name"   k="name" placeholder="John Doe" form={form} set={set} errors={errors} />
            <InputField label="Job Title"   k="title" placeholder="Senior Designer" form={form} set={set} errors={errors} />
            <SelectField label="Department" k="dept" options={ALL_DEPTS.filter(d=>d!=="All")} form={form} set={set} />
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
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Additional Details</p>
          <InputField label="SSNIT Number" k="ssnit" placeholder="B000000000000" form={form} set={set} errors={errors} />
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
  const age   = calcAge(emp.dob);
  const color = DEPT_COLORS[emp.dept] || "#6366f1";

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm py-1.5 border-b border-white/5 last:border-0">
      <span className="text-white/45 shrink-0 mr-4">{label}</span>
      <span className="text-white font-medium text-right">{value || "—"}</span>
    </div>
  );

  return (
    <div>
      {/* Hero */}
      <div className="relative p-6 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0" style={{ background:`radial-gradient(ellipse at 0% 50%,${color}15 0%,transparent 65%)` }} />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={emp.name} dept={emp.dept} size="lg" image={emp.image} />
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
        <div className="grid grid-cols-2 gap-3">
          {[
            { label:"Phone",          value:emp.phone,    icon:<Ico.Phone /> },
            { label:"Date Joined",    value:emp.doj,      icon:<Ico.Calendar /> },
            { label:"Date of Birth",  value:emp.dob ? `${emp.dob}${age ? ` (${age} yrs)`:""}`:"", icon:<Ico.Calendar /> },
            { label:"Employment",     value:emp.status },
          ].map(({ label, value, icon })=>(
            <div key={label} className="rounded-xl border border-white/8 bg-white/4 p-3">
              <p className="text-xs text-white/35 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-sm font-semibold text-white flex items-center gap-1.5">{icon}{value||"—"}</p>
            </div>
          ))}
        </div>

        {/* SSNIT */}
        {emp.ssnit && (
          <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/8 p-3">
            <p className="text-xs text-indigo-400 uppercase tracking-wider mb-1">SSNIT Number</p>
            <p className="text-sm font-mono font-semibold text-white">{emp.ssnit}</p>
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
  const [viewMode,     setViewMode]     = useState("grid");
  const [tab,          setTab]          = useState("employees");
  const [modal,        setModal]        = useState(null);
  const [confirm,      setConfirm]      = useState(null);
  const [toast,        setToast]        = useState(null);

  // Firebase Listener
  useEffect(() => {
    const empsRef = ref(db, 'employees');
    const unsubscribe = onValue(empsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([key, value]) => ({
          ...value,
          firebaseId: key
        }));
        setEmployees(list);
      } else {
        INITIAL_EMPLOYEES.forEach(emp => {
          push(ref(db, 'employees'), emp);
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(()=>setToast(null), 3200);
  };

  const filtered = useMemo(()=>employees.filter(e=>{
    const q = search.toLowerCase();
    return (
      (!q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.title.toLowerCase().includes(q) || e.dept.toLowerCase().includes(q) || e.phone.includes(q)) &&
      (deptFilter   === "All" || e.dept   === deptFilter) &&
      (statusFilter === "All" || e.status === statusFilter)
    );
  }), [employees, search, deptFilter, statusFilter]);

  const stats = useMemo(()=>({
    total:     employees.length,
    fullTime:  employees.filter(e=>e.status==="Full Time").length,
    contract:  employees.filter(e=>e.status==="Contract").length,
    probation: employees.filter(e=>e.status==="Probation").length,
  }), [employees]); 

  // Handlers
  const handleSave = async (form) => {
    try {
      if (modal.type === "add") {
        if (employees.find(e=>e.id===form.id)) { showToast("Employee ID already exists","error"); return; }
        await push(ref(db, 'employees'), form);
        showToast("Employee added successfully");
      } else {
        const { firebaseId, ...cleanForm } = form;
        await update(ref(db, `employees/${firebaseId}`), cleanForm);
        showToast("Employee updated");
      }
      setModal(null);
    } catch (err) {
      showToast("Operation failed", "error");
    }
  };

  const handleDelete = (emp) => setConfirm({ id: emp.id, firebaseId: emp.firebaseId });

  const confirmDelete = async () => {
    try {
      await remove(ref(db, `employees/${confirm.firebaseId}`));
      setModal(null); setConfirm(null);
      showToast("Employee removed");
    } catch (err) {
      showToast("Delete failed", "error");
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
              <button onClick={()=>setModal({ type:"add", emp:{ ...EMPTY } })}
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
            <div className="flex gap-1 p-1 rounded-xl w-fit border border-white/10 bg-white/5">
              {[{ id:"employees", label:"Employees", icon:<Ico.Users /> },{ id:"analytics", label:"Analytics", icon:<Ico.Chart /> }].map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab===t.id?"text-white shadow-lg":"text-white/45 hover:text-white"}`}
                  style={tab===t.id ? { background:"linear-gradient(135deg,#6366f1,#8b5cf6)" } : {}}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {tab === "analytics" ? <Analytics employees={employees} /> : (
              <>
                {/* STAT CARDS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard label="Total Employees" value={stats.total}     color="#6366f1" />
                  <StatCard label="Full Time"        value={stats.fullTime}  color="#10b981" />
                  <StatCard label="Contract"         value={stats.contract}  color="#f59e0b" />
                  <StatCard label="Probation"        value={stats.probation} color="#3b82f6" />
                </div>

                {/* FILTER BAR */}
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="relative flex-1 min-w-[200px]">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none"><Ico.Search /></div>
                    <input value={search} onChange={e=>setSearch(e.target.value)}
                      placeholder="Search by name, ID, role, department�"
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

                {filtered.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-6xl mb-4">??</p>
                    <p className="text-lg font-bold text-white/60">No employees found</p>
                    <p className="text-sm text-white/30 mt-1">Try adjusting your search or filters</p>
                  </div>
                )}

                {filtered.length > 0 && viewMode === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((emp, i)=>{
                      const color = DEPT_COLORS[emp.dept] || "#6366f1";
                      return (
                        <div key={emp.id}
                          className="card-anim group relative rounded-2xl border border-white/8 bg-white/4 hover:border-white/18 hover:bg-white/6 transition-all duration-200 cursor-pointer overflow-hidden"
                          style={{ animationDelay:`${Math.min(i,15)*25}ms` }}
                          onClick={()=>setModal({ type:"view", emp })}>
                          <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background:color }} />
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
                                  className="p-1.5 rounded-lg hover:bg-white/12 text-white/45 hover:text-white transition-colors"><Ico.Edit /></button>
                                <button onClick={()=>handleDelete(emp)}
                                  className="p-1.5 rounded-lg hover:bg-red-500/15 text-white/45 hover:text-red-400 transition-colors"><Ico.Trash /></button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <StatusBadge status={emp.status} />
                              <span className="text-xs text-white/30 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:color }} />{emp.dept}
                              </span>
                            </div>
                            <div className="mt-2.5 space-y-1">
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
                      <div className="col-span-4">Employee</div>
                      <div className="col-span-2">Department</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Phone</div>
                      <div className="col-span-1">Actions</div>
                    </div>
                    {filtered.map(emp=>(
                      <div key={emp.id}
                        className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-white/5 hover:bg-white/4 transition-colors cursor-pointer items-center"
                        onClick={()=>setModal({ type:"view", emp })}>
                        <div className="col-span-1 text-xs font-mono text-white/35 truncate">{emp.id}</div>
                        <div className="col-span-4 flex items-center gap-2 min-w-0">
                          <Avatar name={emp.name} dept={emp.dept} size="sm" image={emp.image} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{emp.name}</p>
                            <p className="text-xs text-white/40 truncate">{emp.title}</p>
                          </div>
                        </div>
                        <div className="col-span-2 hidden md:flex items-center gap-1.5 text-xs text-white/50">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:DEPT_COLORS[emp.dept]||"#6366f1" }} />
                          <span className="truncate">{emp.dept}</span>
                        </div>
                        <div className="col-span-2 hidden md:block"><StatusBadge status={emp.status} /></div>
                        <div className="col-span-2 hidden md:block text-xs text-white/40 truncate">{emp.phone||"�"}</div>
                        <div className="col-span-1 flex gap-1" onClick={e=>e.stopPropagation()}>
                          <button onClick={()=>setModal({ type:"edit", emp })}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-white/38 hover:text-white transition-colors"><Ico.Edit /></button>
                          <button onClick={()=>handleDelete(emp)}
                            className="p-1.5 rounded-lg hover:bg-red-500/15 text-white/38 hover:text-red-400 transition-colors"><Ico.Trash /></button>
                        </div>
                      </div>
                    ))}
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
          <EmployeeForm initial={modal.emp} onSave={handleSave} onCancel={()=>setModal(null)} mode={modal.type} />
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























