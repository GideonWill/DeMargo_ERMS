import json
import re

def parse_production_team():
    with open("public/Employees_Data Production Team.pdf.txt", "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f if line.strip()]
    
    # Header ends around line 20
    content = lines[20:]
    employees = []
    
    i = 0
    while i < len(content):
        # Look for a number which might be the serial
        if content[i].isdigit() and len(content[i]) <= 2:
            try:
                emp = {}
                # emp['id_num'] = content[i]
                i += 1
                
                # Name
                name = content[i]
                i += 1
                # If next is not department/title-like, maybe name continues?
                # Actually, given the messy PDF, names are usually on 1 line or 2
                
                # Looking at the pattern: Name, Title, Dept, Phone, Status, DOJ, DOB, NOK, NOKPhone, Rel, Emergency, SSNIT, Bank
                # This is hard to parse purely by line index because titles/names can wrap.
                
                # Let's try a heuristic: collect until we see a phone number, then backtracking.
                # Actually, let's just use the known sequence and try to fix splits.
                
                emp['name'] = name
                emp['title'] = content[i]
                i += 1
                emp['dept'] = content[i]
                i += 1
                emp['phone'] = content[i]
                i += 1
                emp['status'] = content[i]
                i += 1
                emp['doj'] = content[i]
                i += 1
                emp['dob'] = content[i]
                i += 1
                emp['nokName'] = content[i]
                i += 1
                emp['nokPhone'] = content[i]
                i += 1
                emp['relationship'] = content[i]
                i += 1
                emp['emergencyContact'] = content[i]
                i += 1
                
                # SSNIT and Bank might be split
                ssnit = content[i]
                i += 1
                if i < len(content) and len(content[i]) == 1: # check if digit split
                    ssnit += content[i]
                    i += 1
                emp['ssnit'] = ssnit
                
                bank = content[i]
                i += 1
                if i < len(content) and len(content[i]) == 1:
                    bank += content[i]
                    i += 1
                emp['bank'] = bank
                
                employees.append(emp)
            except Exception as e:
                print(f"Error at index {i}: {e}")
                break
        else:
            i += 1
    return employees

# That parser is too brittle. Let's do it manually for the first few and see.
# Actually, I can just prompt myself to "fix" the data if it's small enough, but there are 24 production employees.
# I'll try to extract them more carefully.

def clean_data():
    # Manual extraction based on the text for top quality
    # Production Team
    prod = [
        {"id": "PD001", "name": "Tuah Vida", "title": "Production Manager", "dept": "Production", "phone": "0577753329", "status": "Full Time", "doj": "19/06/2026", "dob": "01/05/1994", "nokName": "Juliana Tuah", "nokPhone": "0549805635", "relationship": "Sister", "emergencyContact": "0244308677", "ssnit": "B039405010028", "bank": "1400007854333"},
        {"id": "PD002", "name": "Otu Charles", "title": "Tailoring Head", "dept": "Production", "phone": "0531427829", "status": "Full Time", "doj": "02/04/2024", "dob": "23/02/2003", "nokName": "Otu Ebenezer", "nokPhone": "0544421839", "relationship": "Brother", "emergencyContact": "0544421839", "ssnit": "1400008807746", "bank": ""},
        {"id": "PD003", "name": "Asiedu Larbi Cynthia", "title": "Deputy Production Manager", "dept": "Production", "phone": "0244821287", "status": "Full Time", "doj": "03/09/2024", "dob": "19/11/1977", "nokName": "Wilfreda N.S Wilson", "nokPhone": "0531638118", "relationship": "Daughter", "emergencyContact": "0244481212", "ssnit": "1400009535607", "bank": ""},
        {"id": "PD004", "name": "Ocloo Princess Charity", "title": "Deputy Tailoring Head", "dept": "Production", "phone": "0535324956", "status": "Full Time", "doj": "09/09/2024", "dob": "24/03/1999", "nokName": "Ocloo Pascaline Etornam", "nokPhone": "0531383382", "relationship": "Sister", "emergencyContact": "0535386255", "ssnit": "1400009538005", "bank": ""},
        {"id": "PD005", "name": "Sarpong Esther", "title": "Tailor", "dept": "Production", "phone": "0596221194", "status": "Full Time", "doj": "06/04/2025", "dob": "01/01/2005", "nokName": "Kojo Asante", "nokPhone": "0531335521", "relationship": "Brother", "emergencyContact": "0532640085", "ssnit": "F230501010022", "bank": "1400006761528"},
        {"id": "PD006", "name": "Osae Mary Afful", "title": "Tailor", "dept": "Production", "phone": "0535303732", "status": "Full Time", "doj": "01/09/2025", "dob": "06/11/2000", "nokName": "Issabel Osei Banahene", "nokPhone": "0545013171", "relationship": "Sister", "emergencyContact": "0248219483", "ssnit": "", "bank": ""},
        {"id": "PD007", "name": "Opokua Mavis", "title": "Tailor", "dept": "Production", "phone": "0256870984", "status": "Full Time", "doj": "10/09/2024", "dob": "05/01/2002", "nokName": "Solomon Opoku", "nokPhone": "0535497824", "relationship": "Brother", "emergencyContact": "0594474041", "ssnit": "E070201050061", "bank": "1400009537599"},
        {"id": "PD008", "name": "Boakye Joel Atuahene", "title": "Tailor", "dept": "Production", "phone": "0551362771", "status": "Full Time", "doj": "20/08/2025", "dob": "28/06/2003", "nokName": "Boakye Hagar", "nokPhone": "0542375312", "relationship": "Sister", "emergencyContact": "0593369296", "ssnit": "1400010862711", "bank": ""},
        {"id": "PD009", "name": "Iddrisu Abass", "title": "Tailor", "dept": "Production", "phone": "0553907260", "status": "Full Time", "doj": "08/05/2025", "dob": "09/05/2002", "nokName": "Iddrisu Abu", "nokPhone": "0554092253", "relationship": "Brother", "emergencyContact": "0554092253", "ssnit": "1400009655354", "bank": ""},
        {"id": "PD010", "name": "Donkoh Thomas", "title": "Tailor", "dept": "Production", "phone": "0591627374", "status": "Full Time", "doj": "08/05/2025", "dob": "17/11/2005", "nokName": "Ofori Evelyn", "nokPhone": "0243579250", "relationship": "Sister", "emergencyContact": "0243579250", "ssnit": "1400009983987", "bank": ""},
        {"id": "PD011", "name": "Bondzie Kwesi Theophilus", "title": "Tailor", "dept": "Production", "phone": "0533822154", "status": "Full Time", "doj": "20/08/2025", "dob": "20/08/1989", "nokName": "Bondzie Ishmael", "nokPhone": "0547771413", "relationship": "Brother", "emergencyContact": "0547771413", "ssnit": "A168908200099", "bank": "1400010863777"},
        {"id": "PD012", "name": "Quayson Samuel", "title": "Tailor", "dept": "Production", "phone": "0544360599", "status": "Probation", "doj": "08/03/2026", "dob": "04/09/2004", "nokName": "Quayson Betty", "nokPhone": "0540896656", "relationship": "Sister", "emergencyContact": "0540896656", "ssnit": "1400010882593", "bank": ""},
        {"id": "PD013", "name": "Godson Adiglah", "title": "Tailor", "dept": "Production", "phone": "0592288875", "status": "Full Time", "doj": "04/10/2025", "dob": "24/04/2004", "nokName": "Adiglah Melody", "nokPhone": "0545974996", "relationship": "Sister", "emergencyContact": "0545974996", "ssnit": "1400010882698", "bank": ""},
        {"id": "PD014", "name": "Danyo Emmanuel", "title": "Tailor", "dept": "Production", "phone": "0599537826", "status": "Probation", "doj": "28/02/2026", "dob": "20/11/2006", "nokName": "Danyo Francisca", "nokPhone": "0554513182", "relationship": "Sister", "emergencyContact": "0554513182", "ssnit": "", "bank": ""},
        {"id": "PD015", "name": "Asare Emelia Pokua", "title": "Pulling", "dept": "Production", "phone": "0594124180", "status": "Full Time", "doj": "29/05/2024", "dob": "15/06/2001", "nokName": "Peprah Augustus", "nokPhone": "0558489335", "relationship": "Son", "emergencyContact": "0247052875", "ssnit": "1400009537718", "bank": ""},
        {"id": "PD016", "name": "Dzotepe Yayra", "title": "Pulling", "dept": "Production", "phone": "0531610054", "status": "Full Time", "doj": "27/04/2025", "dob": "04/05/2002", "nokName": "Dzotepe Maxwell", "nokPhone": "0249966574", "relationship": "Brother", "emergencyContact": "0547029768", "ssnit": "1400009579078", "bank": ""},
        {"id": "PD017", "name": "Konadu Eunice", "title": "Pulling", "dept": "Production", "phone": "0532790104", "status": "Full Time", "doj": "20/08/2025", "dob": "02/04/2005", "nokName": "Asante Michael", "nokPhone": "0544107388", "relationship": "Brother", "emergencyContact": "0546422503", "ssnit": "1400010868434", "bank": ""},
        {"id": "PD018", "name": "Awunor Beatrice", "title": "Pulling", "dept": "Production", "phone": "0535681563", "status": "Full Time", "doj": "09/01/2026", "dob": "16/11/2004", "nokName": "Awunor Eliana", "nokPhone": "0595465312", "relationship": "Daughter", "emergencyContact": "0595465312", "ssnit": "", "bank": ""},
        {"id": "PD019", "name": "Nartey Victoria", "title": "Pulling", "dept": "Production", "phone": "0256403633", "status": "Probation", "doj": "02/02/2026", "dob": "27/11/2005", "nokName": "Nartey Bridget", "nokPhone": "0542497738", "relationship": "Sister", "emergencyContact": "0547613388", "ssnit": "1400010870811", "bank": ""},
        {"id": "PD020", "name": "Mensah Lydia Vashti", "title": "Pulling", "dept": "Production", "phone": "0591516222", "status": "Probation", "doj": "13/03/2026", "dob": "05/10/2005", "nokName": "Mandela Agyemang Mensah", "nokPhone": "0591516222", "relationship": "Son", "emergencyContact": "0596210108", "ssnit": "1400010872188", "bank": ""},
        {"id": "PD021", "name": "Abayi Yayra Bernice", "title": "Pulling", "dept": "Production", "phone": "0537964573", "status": "Probation", "doj": "13/03/2026", "dob": "19/08/2006", "nokName": "Abayi William", "nokPhone": "0244431809", "relationship": "Father", "emergencyContact": "0244431809", "ssnit": "", "bank": ""},
        {"id": "PD022", "name": "Helena Kissi Kumiwaa", "title": "Pulling / Cleaning", "dept": "Production", "phone": "0591528605", "status": "Full Time", "doj": "14/02/2025", "dob": "13/07/2002", "nokName": "Amperdu Dominic", "nokPhone": "0599537826", "relationship": "Brother", "emergencyContact": "0543233713", "ssnit": "1400009623053", "bank": ""},
        {"id": "PD023", "name": "Precious Ama Gyamfua", "title": "Pulling / Cleaning", "dept": "Production", "phone": "0257809705", "status": "Full Time", "doj": "15/10/2025", "dob": "08/07/2007", "nokName": "Isaac N. B Acheampong", "nokPhone": "0207794819", "relationship": "Brother", "emergencyContact": "0257620860", "ssnit": "", "bank": ""},
        {"id": "PD024", "name": "Amonquandor Priscilla", "title": "Pulling / Cleaning", "dept": "Production", "phone": "0554476347", "status": "Full Time", "doj": "", "dob": "", "nokName": "", "nokPhone": "", "relationship": "", "emergencyContact": "", "ssnit": "1400009659589", "bank": ""},
    ]

    # Administration
    admin = [
        {"id": "AD001", "name": "Christabel Marcel Quayson", "title": "Procurement officer", "dept": "Administration", "phone": "0241991903", "status": "Full Time", "doj": "02/02/2024", "dob": "18/12/2004", "nokName": "Michelle Marcel", "nokPhone": "0249684448", "relationship": "Sister", "emergencyContact": "0249684448", "ssnit": "1400010882787", "bank": ""},
        {"id": "AD002", "name": "Michael Nana Kwame Danso Boateng", "title": "Personal Assistant", "dept": "Administration", "phone": "0548970301", "status": "Full Time", "doj": "30/09/2025", "dob": "02/03/2002", "nokName": "Prince kwaku Boateng", "nokPhone": "0541900918", "relationship": "Brother", "emergencyContact": "0541900918", "ssnit": "140001088568", "bank": ""},
    ]

    all_data = prod + admin
    with open("new_employees.json", "w", encoding="utf-8") as f:
        json.dump(all_data, f, indent=2)
    print("Exported 26 employees to new_employees.json")

clean_data()
