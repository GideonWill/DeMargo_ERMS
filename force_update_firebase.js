const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');

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
  // ADMINISTRATION
  { id:"AD001", name:"Christabel Marcel Quayson", title:"Procurement officer", dept:"Administration", phone:"0241991903", status:"Full Time", doj:"02/02/2024", nokName:"Michelle Marcel", nokPhone:"0249684448", dob:"18/12/2004", emergencyContact:"0249684448", relationship:"Sister", ssnit:"", bankAccount:"1400010882787" },
  { id:"AD002", name:"Michael Nana Kwame Danso Boateng", title:"Personal Assistant", dept:"Administration", phone:"0548970301", status:"Full Time", doj:"30/09/2025", nokName:"Prince kwaku Boateng", nokPhone:"0541900918", dob:"02/03/2002", emergencyContact:"0541900918", relationship:"Brother", ssnit:"", bankAccount:"1400010885568" },
  { id:"AD003", name:"Luqman Aryeetey", title:"Administrative Assistant", dept:"Administration", phone:"", status:"Probation", doj:"", nokName:"", nokPhone:"", dob:"", emergencyContact:"", relationship:"", ssnit:"", bankAccount:"" },
  { id:"AD004", name:"Vasco Nyansah", title:"Administrative Assistant", dept:"Administration", phone:"", status:"Probation", doj:"", nokName:"", nokPhone:"", dob:"", emergencyContact:"", relationship:"", ssnit:"", bankAccount:"" },
  
  // MEDIA
  { id:"DM004", name:"George Nettey", title:"Head of Media", dept:"Media", phone:"0598463535 / 0501897636", status:"Full Time", doj:"10/2021", nokName:"Samuel Nettey", nokPhone:"0204743704", dob:"29/11/2000", emergencyContact:"0204743704", relationship:"Brother", ssnit:"", bankAccount:"" },
  { id:"DM005", name:"Robert Quaye", title:"Installer / Photographer", dept:"Media", phone:"", status:"Contract", doj:"05/08/2024", nokName:"Ebenezer Quaye", nokPhone:"0530601784", dob:"24/01/2002", emergencyContact:"", relationship:"", ssnit:"", bankAccount:"" },
  { id:"ME001", name:"Gideon William Ogunu", title:"Media Assistant", dept:"Media", phone:"", status:"Probation", doj:"", nokName:"", nokPhone:"", dob:"", emergencyContact:"", relationship:"", ssnit:"", bankAccount:"" },

  // PRODUCTION
  { id:"PD001", name:"Tuah Vida", title:"Production Manager", dept:"Production", phone:"0577753329", status:"Full Time", doj:"19/06/2026", nokName:"Juliana Tuah", nokPhone:"0549805635", dob:"01/05/1994", emergencyContact:"0244308677", relationship:"Sister", ssnit:"B039405010028", bankAccount:"1400007854333" },
  { id:"PD002", name:"Otu Charles", title:"Tailoring Head", dept:"Production", phone:"0531427829", status:"Full Time", doj:"02/04/2024", nokName:"Otu Ebenezer", nokPhone:"0544421839", dob:"23/02/2003", emergencyContact:"0544421839", relationship:"Brother", ssnit:"1400008807746", bankAccount:"" },
  { id:"PD003", name:"Asiedu Larbi Cynthia", title:"Deputy Production Manager", dept:"Production", phone:"0244821287", status:"Full Time", doj:"03/09/2024", nokName:"Wilfreda N.S Wilson", nokPhone:"0531638118", dob:"19/11/1977", emergencyContact:"0244481212", relationship:"Daughter", ssnit:"1400009535607", bankAccount:"" },
  { id:"PD004", name:"Ocloo Princess Charity", title:"Deputy Tailoring Head", dept:"Production", phone:"0535324956", status:"Full Time", doj:"09/09/2024", nokName:"Ocloo Pascaline Etornam", nokPhone:"0531383382", dob:"24/03/1999", emergencyContact:"0535386255", relationship:"Sister", ssnit:"1400009538005", bankAccount:"" },
  { id:"PD005", name:"Sarpong Esther", title:"Tailor", dept:"Production", phone:"0596221194", status:"Full Time", doj:"06/04/2025", nokName:"Kojo Asante", nokPhone:"0531335521", dob:"01/01/2005", emergencyContact:"0532640085", relationship:"Brother", ssnit:"F230501010022", bankAccount:"1400006761528" },
  { id:"PD006", name:"Osae Mary Afful", title:"Tailor", dept:"Production", phone:"0535303732", status:"Full Time", doj:"01/09/2025", nokName:"Issabel Osei Banahene", nokPhone:"0545013171", dob:"06/11/2000", emergencyContact:"0248219483", relationship:"Sister", ssnit:"", bankAccount:"" },
  { id:"PD007", name:"Opokua Mavis", title:"Tailor", dept:"Production", phone:"0256870984", status:"Full Time", doj:"10/09/2024", nokName:"Solomon Opoku", nokPhone:"0535497824", dob:"05/01/2002", emergencyContact:"0594474041", relationship:"Brother", ssnit:"E070201050061", bankAccount:"1400009537599" },
  { id:"PD008", name:"Boakye Joel Atuahene", title:"Tailor", dept:"Production", phone:"0551362771", status:"Full Time", doj:"20/08/2025", nokName:"Boakye Hagar", nokPhone:"0542375312", dob:"28/06/2003", emergencyContact:"0593369296", relationship:"Sister", ssnit:"1400010862711", bankAccount:"" },
  { id:"PD009", name:"Iddrisu Abass", title:"Tailor", dept:"Production", phone:"0553907260", status:"Full Time", doj:"08/05/2025", nokName:"Iddrisu Abu", nokPhone:"0554092253", dob:"09/05/2002", emergencyContact:"0554092253", relationship:"Brother", ssnit:"1400009655354", bankAccount:"" },
  { id:"PD010", name:"Donkoh Thomas", title:"Tailor", dept:"Production", phone:"0591627374", status:"Full Time", doj:"08/05/2025", nokName:"Ofori Evelyn", nokPhone:"0243579250", dob:"17/11/2005", emergencyContact:"0243579250", relationship:"Sister", ssnit:"1400009983987", bankAccount:"" },
  { id:"PD011", name:"Bondzie Kwesi Theophilus", title:"Tailor", dept:"Production", phone:"0533822154", status:"Full Time", doj:"20/08/2025", nokName:"Ishmael Bondzie", nokPhone:"0547771413", dob:"20/08/1989", emergencyContact:"0547771413", relationship:"Brother", ssnit:"A168908200099", bankAccount:"1400010863777" },
  { id:"PD012", name:"Quayson Samuel", title:"Tailor", dept:"Production", phone:"0544360599", status:"Probation", doj:"08/03/2026", nokName:"Quayson Betty", nokPhone:"0540896656", dob:"04/09/2004", emergencyContact:"0540896656", relationship:"Sister", ssnit:"1400010882593", bankAccount:"" },
  { id:"PD013", name:"Godson Adiglah", title:"Tailor", dept:"Production", phone:"0592288875", status:"Full Time", doj:"04/10/2025", nokName:"Melody Adiglah", nokPhone:"0545974996", dob:"24/04/2004", emergencyContact:"0545974996", relationship:"Sister", ssnit:"1400010882698", bankAccount:"" },
  { id:"PD014", name:"Danyo Emmanuel", title:"Tailor", dept:"Production", phone:"0599537826", status:"Probation", doj:"28/02/2026", nokName:"Danyo Francisca", nokPhone:"0554513182", dob:"20/11/2006", emergencyContact:"0554513182", relationship:"Sister", ssnit:"", bankAccount:"" },
  { id:"PD015", name:"Asare Emelia Pokua", title:"Pulling", dept:"Production", phone:"0594124180", status:"Full Time", doj:"29/05/2024", nokName:"Peprah Augustus", nokPhone:"0558489335", dob:"15/06/2001", emergencyContact:"0247052875", relationship:"Son", ssnit:"1400009537718", bankAccount:"" },
  { id:"PD016", name:"Dzotepe Yayra", title:"Pulling", dept:"Production", phone:"0531610054", status:"Full Time", doj:"27/04/2025", nokName:"Dzotepe Maxwell", nokPhone:"0249966574", dob:"04/05/2002", emergencyContact:"0547029768", relationship:"Brother", ssnit:"1400009579078", bankAccount:"" },
  { id:"PD017", name:"Konadu Eunice", title:"Pulling", dept:"Production", phone:"0532790104", status:"Full Time", doj:"20/08/2025", nokName:"Michael Asante", nokPhone:"0544107388", dob:"02/04/2005", emergencyContact:"0546422503", relationship:"Brother", ssnit:"1400010868434", bankAccount:"" },
  { id:"PD018", name:"Awunor Beatrice", title:"Pulling", dept:"Production", phone:"0535681563", status:"Full Time", doj:"09/01/2026", nokName:"Awunor Eliana", nokPhone:"0595465312", dob:"16/11/2004", emergencyContact:"0595465312", relationship:"Daughter", ssnit:"", bankAccount:"" },
  { id:"PD019", name:"Nartey Victoria", title:"Pulling", dept:"Production", phone:"0256403633", status:"Probation", doj:"02/02/2026", nokName:"Nartey Bridget", nokPhone:"0542497738", dob:"27/11/2005", emergencyContact:"0547613388", relationship:"Sister", ssnit:"1400010870811", bankAccount:"" },
  { id:"PD020", name:"Mensah Lydia Vashti", title:"Pulling", dept:"Production", phone:"0591516222", status:"Probation", doj:"13/03/2026", nokName:"Mandela Agyemang Mensah", nokPhone:"0591516222", dob:"05/10/2005", emergencyContact:"0596210108", relationship:"Son", ssnit:"1400010872188", bankAccount:"" },
  { id:"PD021", name:"Abayi Yayra Bernice", title:"Pulling", dept:"Production", phone:"0537964573", status:"Probation", doj:"13/03/2026", nokName:"Abayi William", nokPhone:"0244431809", dob:"19/08/2006", emergencyContact:"0244431809", relationship:"Father", ssnit:"", bankAccount:"" },
  { id:"PD022", name:"Helena Kissi Kumiwaa", title:"Pulling / Cleaning", dept:"Production", phone:"0591528605", status:"Full Time", doj:"14/02/2025", nokName:"Dominic Amperdu", nokPhone:"0599537826", dob:"13/07/2002", emergencyContact:"0543233713", relationship:"Brother", ssnit:"1400009623053", bankAccount:"" },
  { id:"PD023", name:"Precious Ama Gyamfua", title:"Pulling / Cleaning", dept:"Production", phone:"0257809705", status:"Full Time", doj:"15/10/2025", nokName:"Isaac N. B Acheampong", nokPhone:"0207794819", dob:"08/07/2007", emergencyContact:"0257620860", relationship:"Brother", ssnit:"", bankAccount:"" },
  { id:"PD024", name:"Amonquandor Priscilla", title:"Pulling / Cleaning", dept:"Production", phone:"0554476347", status:"Full Time", doj:"", nokName:"", nokPhone:"", dob:"", emergencyContact:"", relationship:"", ssnit:"1400009659589", bankAccount:"" },

  // FACILITY MANAGEMENT (AMB360 Cleaning — updated from spreadsheet 15/04/2026)
  { id:"AM001", name:"Dorcas Acquah", title:"Cleaner", dept:"Facility Management", phone:"0538980608", status:"Full Time", doj:"30/09/2024", nokName:"Michealle Kpedo", nokPhone:"0246614867", dob:"20/08/2003", emergencyContact:"0246614867", relationship:"Sister", ssnit:"B290308200028", bankAccount:"" },
  { id:"AM002", name:"Pierrette Zida", title:"Cleaner", dept:"Facility Management", phone:"0556304651", status:"Full Time", doj:"30/09/2024", nokName:"Pascal Zida", nokPhone:"0531765135", dob:"29/06/1998", emergencyContact:"0242815770", relationship:"Brother", ssnit:"D209806290028", bankAccount:"" },
  { id:"AM003", name:"Elizabeth Pobi", title:"Cleaner", dept:"Facility Management", phone:"0558691227", status:"Full Time", doj:"30/09/2024", nokName:"Lydia Pobi", nokPhone:"0503506069", dob:"04/07/2000", emergencyContact:"0542835939", relationship:"Sister", ssnit:"E029707040026", bankAccount:"1400009576257" },
  { id:"AM004", name:"Jessica Kpogo", title:"Cleaner", dept:"Facility Management", phone:"0596907065", status:"Full Time", doj:"25/03/2024", nokName:"Stacy Frimpongmaa", nokPhone:"0550400620", dob:"28/02/2002", emergencyContact:"0550400620", relationship:"Sister", ssnit:"C010202280229", bankAccount:"1400009578872" },
  { id:"AM005", name:"Hannah Akua Osei", title:"Cleaner", dept:"Facility Management", phone:"0550623703", status:"Full Time", doj:"25/03/2024", nokName:"Antonia Mintah", nokPhone:"0543569603", dob:"24/04/2002", emergencyContact:"0555579954", relationship:"Sister", ssnit:"C120204240025", bankAccount:"1400009654617" },
  { id:"AM006", name:"Abigail Ketu", title:"Cleaner", dept:"Facility Management", phone:"0591772524", status:"Full Time", doj:"02/03/2024", nokName:"Emmanuella Danso", nokPhone:"0591772524", dob:"09/05/2001", emergencyContact:"0554629916", relationship:"Daughter", ssnit:"", bankAccount:"" },
  { id:"AM007", name:"Clinton Brown (FM)", title:"Cleaner / Installer", dept:"Facility Management", phone:"0504463338", status:"Full Time", doj:"01/08/2025", nokName:"Gloria Takyi", nokPhone:"0244982096", dob:"18/04/2005", emergencyContact:"0244982096", relationship:"Mother", ssnit:"", bankAccount:"" },
  { id:"AM008", name:"Mariam Alhassan", title:"Cleaner", dept:"Facility Management", phone:"0508469035", status:"Full Time", doj:"21/08/2025", nokName:"Nadia Fatawu", nokPhone:"0245809456", dob:"15/06/2001", emergencyContact:"0551422795", relationship:"Daughter", ssnit:"L130106150020", bankAccount:"" },
  { id:"AM009", name:"Priscilla Amonquandor", title:"Cleaner", dept:"Facility Management", phone:"0554476347", status:"Full Time", doj:"15/05/2025", nokName:"Sk Amonquandor", nokPhone:"0552418797", dob:"15/04/1991", emergencyContact:"0552418797", relationship:"Father", ssnit:"", bankAccount:"" },
  { id:"AM010", name:"Helena Kissi Kumiwaa", title:"Cleaner", dept:"Facility Management", phone:"0591528605", status:"Full Time", doj:"14/02/2025", nokName:"Dominic Ampedu", nokPhone:"0599537826", dob:"13/07/2002", emergencyContact:"0543233713", relationship:"Brother", ssnit:"B200207130026", bankAccount:"1400009623053" },
  { id:"AM011", name:"Grace Bawah", title:"Cleaner", dept:"Facility Management", phone:"0548342010", status:"Probation", doj:"24/12/2025", nokName:"Gifty Hoenydzi", nokPhone:"0535229382", dob:"13/08/2005", emergencyContact:"0535229382", relationship:"Mother", ssnit:"", bankAccount:"" },
  { id:"AM012", name:"Emmanuella Agyeiwaa Dankwah", title:"Cleaner", dept:"Facility Management", phone:"0536432335", status:"Probation", doj:"23/12/2025", nokName:"Dorinda A. Dankwah", nokPhone:"0248597258", dob:"24/10/2002", emergencyContact:"0541623912", relationship:"Sister", ssnit:"", bankAccount:"1400010885867" },
  { id:"AM013", name:"Wendy Aryee", title:"Cleaner", dept:"Facility Management", phone:"0530182009", status:"Probation", doj:"06/01/2026", nokName:"Percy Sackey", nokPhone:"0502300424", dob:"26/09/2007", emergencyContact:"0554961052", relationship:"Brother", ssnit:"", bankAccount:"" },
  { id:"AM014", name:"Pascal Tetteh", title:"Cleaner", dept:"Facility Management", phone:"", status:"Full Time", doj:"04/10/2025", nokName:"Eunice Brown", nokPhone:"0599620130", dob:"15/08/2002", emergencyContact:"0504463338", relationship:"Sister", ssnit:"", bankAccount:"" },
  { id:"AM015a", name:"Precious Gyamfua Acheampong", title:"Cleaner", dept:"Facility Management", phone:"0257809705", status:"Probation", doj:"15/10/2025", nokName:"Isaac B. Acheampong", nokPhone:"0207794819", dob:"08/07/2007", emergencyContact:"0257620860", relationship:"Brother", ssnit:"", bankAccount:"" },
  { id:"AM015b", name:"Gladys Apaati Nti", title:"Cleaner", dept:"Facility Management", phone:"0599990665", status:"Probation", doj:"04/11/2025", nokName:"Suzanne Mcintyre Appiah", nokPhone:"0246888287", dob:"06/09/1997", emergencyContact:"0559842488", relationship:"Sister", ssnit:"", bankAccount:"" },
  { id:"AM016", name:"Emmanuel Ofori", title:"Cleaner", dept:"Facility Management", phone:"0594164425", status:"Probation", doj:"07/01/2026", nokName:"Roland Ofori", nokPhone:"0538814049", dob:"22/12/2005", emergencyContact:"0538814049", relationship:"Brother", ssnit:"", bankAccount:"" },
  { id:"AM018", name:"Regina Alawotey", title:"Cleaner", dept:"Facility Management", phone:"0248621384", status:"Probation", doj:"03/04/2026", nokName:"Bernard Alawotey", nokPhone:"0248621384", dob:"07/07/2005", emergencyContact:"0245962341", relationship:"Brother", ssnit:"", bankAccount:"" },
  { id:"AM019", name:"Christabel Acheampongmaa", title:"Cleaner", dept:"Facility Management", phone:"0557733588", status:"Probation", doj:"06/04/2026", nokName:"Stephen Osei Amoah", nokPhone:"0249448078", dob:"17/01/2006", emergencyContact:"0548157012", relationship:"Brother", ssnit:"", bankAccount:"" },

  // OTHERS (TRANSPORT, INSTALLATION, MEASUREMENT)
  { id:"DM007", name:"Julius Mensah", title:"Head of Transport", dept:"Transport", phone:"0598733647", status:"Full Time", doj:"31/01/2024", nokName:"Juliana Mensah", nokPhone:"0545808994", dob:"23/03/2003", emergencyContact:"0249338950", relationship:"", ssnit:"", bankAccount:"" },
  { id:"DM046", name:"Elijah Andah", title:"Driver", dept:"Transport", phone:"0545119937", status:"Probation", doj:"16/06/2025", nokName:"Jeff Ansah", nokPhone:"0593699050", dob:"", emergencyContact:"", relationship:"", ssnit:"", bankAccount:"" },
  { id:"DM017", name:"Michael Mantey", title:"Head of Installation", dept:"Installation", phone:"0531984299", status:"Full Time", doj:"12/01/2020", nokName:"Robert Apenteng", nokPhone:"+48791206373", dob:"19/12/1999", emergencyContact:"0546478040", relationship:"", ssnit:"", bankAccount:"" },
  { id:"DM018", name:"Samuel Nettey", title:"Assistant Head of Installation", dept:"Installation", phone:"0204743704", status:"Full Time", doj:"04/2022", nokName:"George Nettey", nokPhone:"0598463535", dob:"19/08/1998", emergencyContact:"0598463535", relationship:"Brother", ssnit:"", bankAccount:"" },
  { id:"DM020", name:"Desmond Agobia", title:"Installer", dept:"Installation", phone:"0544157305", status:"Full Time", doj:"24/01/2024", nokName:"Honey Life Int. Church", nokPhone:"0550811098", dob:"03/04/1999", emergencyContact:"0540207768", relationship:"Sister", ssnit:"", bankAccount:"" },
  { id:"DM021", name:"Joseph Allotey", title:"Installer", dept:"Installation", phone:"0538756886", status:"Full Time", doj:"24/01/2024", nokName:"Edith Adoley Mills", nokPhone:"0537567555", dob:"26/09/2005", emergencyContact:"0557517321", relationship:"Mother", ssnit:"", bankAccount:"" },
  { id:"DM022", name:"Sheriff Mborowi", title:"Installer", dept:"Installation", phone:"0597554680", status:"Full Time", doj:"05/08/2024", nokName:"Kwabena Nkombe", nokPhone:"0247625822", dob:"10/11/2001", emergencyContact:"", relationship:"", ssnit:"", bankAccount:"" },
  { id:"DM023", name:"David Nii Obodai", title:"Installer", dept:"Installation", phone:"0598348375", status:"Probation", doj:"05/05/2025", nokName:"Lydia Addy", nokPhone:"0597223954", dob:"", emergencyContact:"", relationship:"", ssnit:"", bankAccount:"" },
  { id:"DM024", name:"Gideon Asante", title:"Installer", dept:"Installation", phone:"0555200376", status:"Probation", doj:"05/05/2025", nokName:"Kwame Asante", nokPhone:"0557549942", dob:"", emergencyContact:"", relationship:"", ssnit:"", bankAccount:"" },
  { id:"DM025", name:"Christian Tetteh", title:"Installer", dept:"Installation", phone:"0535344215", status:"Probation", doj:"17/02/2025", nokName:"Isaac Tetteh", nokPhone:"0547670191", dob:"", emergencyContact:"", relationship:"", ssnit:"", bankAccount:"" },
  { id:"DM039", name:"Evans Kyei", title:"Installer", dept:"Installation", phone:"0539309358", status:"Probation", doj:"06/09/2025", nokName:"Esther Kyei", nokPhone:"0596221194", dob:"25/09/2002", emergencyContact:"0532640085", relationship:"", ssnit:"", bankAccount:"" },
  { id:"DM040", name:"Clinton Brown", title:"Installer", dept:"Installation", phone:"0504463338", status:"Probation", doj:"", nokName:"Gloria Takyi", nokPhone:"0244982096", dob:"18/04/2005", emergencyContact:"0244982096", relationship:"Mother", ssnit:"", bankAccount:"" },
  { id:"DM044", name:"Jeremiah Quayson", title:"Installer", dept:"Installation", phone:"0244543146", status:"Probation", doj:"01/10/2025", nokName:"Dorcas Mensah", nokPhone:"0552833855", dob:"18/02/2005", emergencyContact:"0244543146", relationship:"Mother", ssnit:"", bankAccount:"" },
  { id:"DM045", name:"Pascal Tetter", title:"Installer / Cleaner", dept:"Installation", phone:"0596903186", status:"Probation", doj:"04/10/2025", nokName:"Eunice Brown", nokPhone:"0599620130", dob:"15/08/2002", emergencyContact:"0599620130", relationship:"Sister", ssnit:"", bankAccount:"" },
  { id:"DM047", name:"Prince Kwesi Kyei", title:"Installer", dept:"Installation", phone:"0209800691", status:"Probation", doj:"11/09/2025", nokName:"Gifty Arhin", nokPhone:"0538321601", dob:"20/05/2001", emergencyContact:"0275655998", relationship:"Mother", ssnit:"", bankAccount:"" },
  { id:"DM048", name:"Habib Abdul Rahman Yussif", title:"Installer", dept:"Installation", phone:"0248124461", status:"Probation", doj:"19/12/2025", nokName:"Dennis Okrah", nokPhone:"0557896087", dob:"09/02/2002", emergencyContact:"0593887858", relationship:"Wife", ssnit:"C340202090015", bankAccount:"" },
  { id:"DM049", name:"Emmanuel Asare Akoto", title:"Installer", dept:"Installation", phone:"0536851350", status:"Probation", doj:"12/01/2026", nokName:"Velma Asare Akoto", nokPhone:"0598183339", dob:"22/09/2007", emergencyContact:"0545186121", relationship:"Uncle", ssnit:"", bankAccount:"" },
  { id:"DM050", name:"Kingsley Adjartey", title:"Installer", dept:"Installation", phone:"0539434938", status:"Probation", doj:"19/12/2025", nokName:"Henry Adjartey", nokPhone:"0502385931", dob:"13/05/2000", emergencyContact:"0240922292", relationship:"Father", ssnit:"", bankAccount:"" },
  { id:"DM027", name:"Samuel Amartey Otu", title:"Head of Measurement", dept:"Measurement", phone:"0597470343", status:"Full Time", doj:"19/02/2022", nokName:"Gladys Mensah Otu", nokPhone:"0243127514", dob:"12/09/1985", emergencyContact:"0245127514", relationship:"Sister", ssnit:"", bankAccount:"" },
];

async function updateFirebase() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const dataObj = {};
    EMPLOYEES.forEach((emp, index) => {
        dataObj[`emp_${index}`] = emp;
    });
    console.log('Updating Firebase with', EMPLOYEES.length, 'employees...');
    await set(ref(db, 'employees'), dataObj);
    console.log('✅ Firebase updated successfully!');
  } catch (err) {
    console.error('❌ Error updating Firebase:', err);
  }
  process.exit(0);
}

updateFirebase();
