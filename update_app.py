import json
import re

# Read current App.jsx
with open("src/App.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Read new data
with open("new_employees.json", "r", encoding="utf-8") as f:
    new_data = json.load(f)

# Extract existing INITIAL_EMPLOYEES to preserve other departments
# We look for the array between [ and ];
match = re.search(r"const INITIAL_EMPLOYEES = \[(.*?)\];", content, re.DOTALL)
if not match:
    print("Could not find INITIAL_EMPLOYEES")
    exit(1)

# Instead of parsing the JS (which is hard), I'll just filter the new data
# and the old data manually.
# Actually, I'll just generate the whole new array.

# Existing employees from App.jsx (approximate list to preserve)
# I'll keep everything except Production and Administration from the old list.
# Wait, the user said "use PDF for administration". 
# So PD and AD departments come from PDF. All others from old App.jsx.

# Let's extract the old list from the view_file output I had earlier.
# This is a bit manual but safer.

existing_others = [
    { "id":"DM004", "name":"George Nettey",                  "title":"Head of Media",                  "dept":"Media",                 "phone":"0598463535 / 0501897636",     "status":"Full Time", "doj":"10/2021",    "nokName":"Samuel Nettey",             "nokPhone":"0204743704", "dob":"29/11/2000", "emergencyContact":"0204743704", "relationship":"Brother", "ssnit":"" },
    { "id":"DM005", "name":"Robert Quaye",                   "title":"Installer / Photographer",       "dept":"Media",                 "phone":"",                            "status":"Contract",  "doj":"05/08/2024", "nokName":"Ebenezer Quaye",            "nokPhone":"0530601784", "dob":"24/01/2002", "emergencyContact":"",           "relationship":"",        "ssnit":"" },
    { "id":"DM007", "name":"Julius Mensah",                  "title":"Head of Transport",              "dept":"Transport",             "phone":"0598733647",                  "status":"Full Time", "doj":"31/01/2024", "nokName":"Juliana Mensah",            "nokPhone":"0545808994", "dob":"23/03/2003", "emergencyContact":"0249338950", "relationship":"",        "ssnit":"" },
    { "id":"DM017", "name":"Michael Mantey",                 "title":"Head of Installation",           "dept":"Installation",          "phone":"0531984299",                  "status":"Full Time", "doj":"12/01/2020", "nokName":"Robert Apenteng",           "nokPhone":"+48791206373","dob":"19/12/1999", "emergencyContact":"0546478040", "relationship":"",        "ssnit":"" },
    { "id":"DM018", "name":"Samuel Nettey",                  "title":"Assistant Head of Installation", "dept":"Installation",          "phone":"0204743704",                  "status":"Full Time", "doj":"04/2022",    "nokName":"George Nettey",             "nokPhone":"0598463535", "dob":"19/08/1998", "emergencyContact":"0598463535", "relationship":"Brother", "ssnit":"" },
    { "id":"DM020", "name":"Desmond Agobia",                 "title":"Installer",                      "dept":"Installation",          "phone":"0544157305",                  "status":"Full Time", "doj":"24/01/2024", "nokName":"Honey Life Int. Church",    "nokPhone":"0550811098", "dob":"03/04/1999", "emergencyContact":"0540207768", "relationship":"Sister",  "ssnit":"" },
    { "id":"DM021", "name":"Joseph Allotey",                 "title":"Installer",                      "dept":"Installation",          "phone":"0538756886",                  "status":"Full Time", "doj":"24/01/2024", "nokName":"Edith Adoley Mills",        "nokPhone":"0537567555", "dob":"26/09/2005", "emergencyContact":"0557517321", "relationship":"Mother",  "ssnit":"" },
    { "id":"DM022", "name":"Sheriff Mborowi",                "title":"Installer",                      "dept":"Installation",          "phone":"0597554680",                  "status":"Full Time", "doj":"05/08/2024", "nokName":"Kwabena Nkombe",            "nokPhone":"0247625822", "dob":"10/11/2001", "emergencyContact":"",           "relationship":"",        "ssnit":"" },
    { "id":"DM023", "name":"David Nii Obodai",               "title":"Installer",                      "dept":"Installation",          "phone":"0598348375",                  "status":"Probation", "doj":"05/05/2025", "nokName":"Lydia Addy",                "nokPhone":"0597223954", "dob":"",           "emergencyContact":"",           "relationship":"",        "ssnit":"" },
    { "id":"DM024", "name":"Gideon Asante",                  "title":"Installer",                      "dept":"Installation",          "phone":"0555200376",                  "status":"Probation", "doj":"05/05/2025", "nokName":"Kwame Asante",              "nokPhone":"0557549942", "dob":"",           "emergencyContact":"",           "relationship":"",        "ssnit":"" },
    { "id":"DM025", "name":"Christian Tetteh",               "title":"Installer",                      "dept":"Installation",          "phone":"0535344215",                  "status":"Probation", "doj":"17/02/2025", "nokName":"Isaac Tetteh",              "nokPhone":"0547670191", "dob":"",           "emergencyContact":"",           "relationship":"",        "ssnit":"" },
    { "id":"DM027", "name":"Samuel Amartey Otu",             "title":"Head of Measurement",            "dept":"Measurement",           "phone":"0597470343",                  "status":"Full Time", "doj":"19/02/2022", "nokName":"Gladys Mensah Otu",         "nokPhone":"0243127514", "dob":"12/09/1985", "emergencyContact":"0245127514", "relationship":"Sister",  "ssnit":"" },
    { "id":"DM039", "name":"Evans Kyei",                     "title":"Installer",                      "dept":"Installation",          "phone":"0539309358",                  "status":"Probation", "doj":"06/09/2025", "nokName":"Esther Kyei",               "nokPhone":"0596221194", "dob":"25/09/2002", "emergencyContact":"0532640085", "relationship":"",        "ssnit":"" },
    { "id":"DM040", "name":"Clinton Brown",                  "title":"Installer",                      "dept":"Installation",          "phone":"0504463338",                  "status":"Probation", "doj":"",           "nokName":"Gloria Takyi",              "nokPhone":"0244982096", "dob":"18/04/2005", "emergencyContact":"0244982096", "relationship":"Mother",  "ssnit":"" },
    { "id":"DM044", "name":"Jeremiah Quayson",               "title":"Installer",                      "dept":"Installation",          "phone":"0244543146",                  "status":"Probation", "doj":"01/10/2025", "nokName":"Dorcas Mensah",             "nokPhone":"0552833855", "dob":"18/02/2005", "emergencyContact":"0244543146", "relationship":"Mother",  "ssnit":"" },
    { "id":"DM045", "name":"Pascal Tetter",                  "title":"Installer / Cleaner",            "dept":"Installation",          "phone":"0596903186",                  "status":"Probation", "doj":"04/10/2025", "nokName":"Eunice Brown",              "nokPhone":"0599620130", "dob":"15/08/2002", "emergencyContact":"0599620130", "relationship":"Sister",  "ssnit":"" },
    { "id":"DM046", "name":"Elijah Andah",                   "title":"Driver",                         "dept":"Transport",             "phone":"0545119937",                  "status":"Probation", "doj":"16/06/2025", "nokName":"Jeff Ansah",                "nokPhone":"0593699050", "dob":"",           "emergencyContact":"",           "relationship":"",        "ssnit":"" },
    { "id":"DM047", "name":"Prince Kwesi Kyei",              "title":"Installer",                      "dept":"Installation",          "phone":"0209800691",                  "status":"Probation", "doj":"11/09/2025", "nokName":"Gifty Arhin",               "nokPhone":"0538321601", "dob":"20/05/2001", "emergencyContact":"0275655998", "relationship":"Mother",  "ssnit":"" },
    { "id":"DM048", "name":"Habib Abdul Rahman Yussif",      "title":"Installer",                      "dept":"Installation",          "phone":"0248124461",                  "status":"Probation", "doj":"19/12/2025", "nokName":"Dennis Okrah",              "nokPhone":"0557896087", "dob":"09/02/2002", "emergencyContact":"0593887858", "relationship":"Wife",    "ssnit":"C340202090015" },
    { "id":"DM049", "name":"Emmanuel Asare Akoto",           "title":"Installer",                      "dept":"Installation",          "phone":"0536851350",                  "status":"Probation", "doj":"12/01/2026", "nokName":"Velma Asare Akoto",         "nokPhone":"0598183339", "dob":"22/09/2007", "emergencyContact":"0545186121", "relationship":"Uncle",   "ssnit":"" },
    { "id":"DM050", "name":"Kingsley Adjartey",              "title":"Installer",                      "dept":"Installation",          "phone":"0539434938",                  "status":"Probation", "doj":"19/12/2025", "nokName":"Henry Adjartey",            "nokPhone":"0502385931", "dob":"13/05/2000", "emergencyContact":"0240922292", "relationship":"Father",  "ssnit":"" },
    { "id":"AM001", "name":"Dorcas Acquah",                  "title":"Cleaner",                        "dept":"Facility Management",   "phone":"0538980608",                  "status":"Contract",  "doj":"30/10/2024", "nokName":"Bright Yeboah",             "nokPhone":"0246614867", "dob":"20/08/2003", "emergencyContact":"0246614867", "relationship":"Brother", "ssnit":"B290308200028" },
    { "id":"AM002", "name":"Pierette Zida",                  "title":"Cleaner",                        "dept":"Facility Management",   "phone":"0556304651",                  "status":"Full Time", "doj":"30/10/2024", "nokName":"George Zida",               "nokPhone":"0531765135", "dob":"29/06/2000", "emergencyContact":"0242815770", "relationship":"Brother", "ssnit":"D209806290028" },
    { "id":"AM003", "name":"Elizabeth Pobi",                 "title":"Cleaner",                        "dept":"Facility Management",   "phone":"0558691227",                  "status":"Full Time", "doj":"30/10/2024", "nokName":"Lydia Oforiwaa Pobi",       "nokPhone":"0503506069", "dob":"04/07/2000", "emergencyContact":"0542835939", "relationship":"Mother",  "ssnit":"E029707040026" },
    { "id":"AM004", "name":"Jessica Kpogo",                  "title":"Cleaner",                        "dept":"Facility Management",   "phone":"0596907065",                  "status":"Full Time", "doj":"25/03/2024", "nokName":"Stacy Frimpomaa",           "nokPhone":"0550400620", "dob":"28/02/2002", "emergencyContact":"0550400620", "relationship":"Mother",  "ssnit":"C010202280229" },
    { "id":"AM005", "name":"Hannah Akua Osei",               "title":"Cleaner",                        "dept":"Facility Management",   "phone":"0257951682",                  "status":"Full Time", "doj":"25/03/2024", "nokName":"Anthony Mintah",            "nokPhone":"0543569603", "dob":"24/04/2002", "emergencyContact":"0543569603", "relationship":"Mother",  "ssnit":"C120204240025" },
    { "id":"AM007", "name":"Clinton Brown (FM)",             "title":"Cleaner / Installer",            "dept":"Facility Management",   "phone":"0504463338",                  "status":"Full Time", "doj":"01/08/2025", "nokName":"Gloria Takyi",              "nokPhone":"0244982096", "dob":"18/04/2005", "emergencyContact":"0244982096", "relationship":"Mother",  "ssnit":"" },
    { "id":"AM008", "name":"Mariam Alhassan",                "title":"Cleaner",                        "dept":"Facility Management",   "phone":"0596474418",                  "status":"Full Time", "doj":"22/08/2025", "nokName":"Nadia Fatawu",              "nokPhone":"0596474418", "dob":"15/06/2001", "emergencyContact":"0551422795", "relationship":"Brother", "ssnit":"L130106150020" },
    { "id":"AM009", "name":"Priscilla Amonquandor",          "title":"Cleaner",                        "dept":"Facility Management",   "phone":"0554476347",                  "status":"Full Time", "doj":"15/05/2025", "nokName":"Sk Amonquandor",            "nokPhone":"0552418797", "dob":"15/04/1991", "emergencyContact":"0552418797", "relationship":"Father",  "ssnit":"" },
    { "id":"AM010", "name":"Helena Kissi Kumiwaa",           "title":"Cleaner",                        "dept":"Facility Management",   "phone":"0591528605",                  "status":"Full Time", "doj":"15/02/2025", "nokName":"Dominic Ampedu",            "nokPhone":"0599158952", "dob":"13/07/2002", "emergencyContact":"0543233713", "relationship":"Mother",  "ssnit":"B200207130026" },
    { "id":"AM011", "name":"Grace Bawah",                    "title":"Cleaner",                        "dept":"Facility Management",   "phone":"0548342010",                  "status":"Probation", "doj":"27/12/2025", "nokName":"Gifty Onyedi",              "nokPhone":"0243183270", "dob":"13/08/2005", "emergencyContact":"0243183270", "relationship":"Mother",  "ssnit":"" },
    { "id":"AM012", "name":"Emmanuella Agyeiwaa Dankwah",    "title":"Cleaner",                        "dept":"Facility Management",   "phone":"0536432335",                  "status":"Probation", "doj":"23/12/2025", "nokName":"Frimpong Samuel",           "nokPhone":"0530182009", "dob":"24/10/2002", "emergencyContact":"0541623912", "relationship":"Mother",  "ssnit":"" },
    { "id":"AM013", "name":"Wendy Aryee",                    "title":"Cleaner",                        "dept":"Facility Management",   "phone":"0530182009",                  "status":"Probation", "doj":"07/01/2026", "nokName":"Percy Sackey",              "nokPhone":"0530182009", "dob":"26/09/2007", "emergencyContact":"0532683314", "relationship":"Mother",  "ssnit":"" },
    { "id":"AM015a","name":"Precious Gyamfua Acheampong",    "title":"Cleaner",                        "dept":"Facility Management",   "phone":"0257809705",                  "status":"Probation", "doj":"15/10/2025", "nokName":"Linda Ama Acquah",          "nokPhone":"0257620860", "dob":"08/07/2007", "emergencyContact":"0538814049", "relationship":"Sister",  "ssnit":"" },
    { "id":"AM015b","name":"Gladys Apaati Nti",              "title":"Cleaner",                        "dept":"Facility Management",   "phone":"0599990665",                  "status":"Probation", "doj":"04/11/2025", "nokName":"Suzanne Mcintyre Appiah",   "nokPhone":"0246888287", "dob":"06/09/1997", "emergencyContact":"0559842488", "relationship":"Sister",  "ssnit":"" },
    { "id":"AM016", "name":"Emmanuel Ofori",                 "title":"Cleaner",                        "dept":"Facility Management",   "phone":"",                            "status":"Probation", "doj":"07/02/2026", "nokName":"Elizabeth Sany",            "nokPhone":"0538814049", "dob":"22/12/2005", "emergencyContact":"0538814049", "relationship":"Sister",  "ssnit":"" },
]

# Combined list: Others + New Data (Prod + Admin)
final_list = existing_others + new_data

# Sort by ID to keep it somewhat organized
final_list.sort(key=lambda x: x['id'])

def format_emp(e):
    return json.dumps(e, ensure_ascii=False)

# Reconstruct the INITIAL_EMPLOYEES array string
new_array_str = "const INITIAL_EMPLOYEES = [\n"
for e in final_list:
    # Convert to Javascript object literal style (simple version)
    line = f"  {{ id:\"{e['id']}\", name:\"{e['name']}\", title:\"{e['title']}\", dept:\"{e['dept']}\", phone:\"{e['phone']}\", status:\"{e['status']}\", doj:\"{e['doj']}\", nokName:\"{e['nokName']}\", nokPhone:\"{e['nokPhone']}\", dob:\"{e['dob']}\", emergencyContact:\"{e['emergencyContact']}\", relationship:\"{e['relationship']}\", ssnit:\"{e.get('ssnit','')}\" }},"
    new_array_str += line + "\n"
new_array_str += "];"

# Replace in content
new_content = re.sub(r"const INITIAL_EMPLOYEES = \[.*?\];", new_array_str, content, flags=re.DOTALL)

with open("src/App.jsx", "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Updated App.jsx with {len(final_list)} employees.")
