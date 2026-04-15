import xml.etree.ElementTree as ET
import json

def parse_excel_xml():
    # Load shared strings
    tree_strings = ET.parse('tmp_excel/xl/sharedStrings.xml')
    root_strings = tree_strings.getroot()
    namespace = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    
    shared_strings = []
    for si in root_strings.findall('ns:si', namespace):
        t = si.find('ns:t', namespace)
        if t is not None:
            shared_strings.append(t.text)
        else:
            # Handle cases where <t> might be inside <r> (rich text)
            full_text = ""
            for r in si.findall('ns:r', namespace):
                rt = r.find('ns:t', namespace)
                if rt is not None:
                    full_text += rt.text
            shared_strings.append(full_text)

    # Load sheet data
    tree_sheet = ET.parse('tmp_excel/xl/worksheets/sheet1.xml')
    root_sheet = tree_sheet.getroot()
    
    rows = []
    for row in root_sheet.findall('.//ns:row', namespace):
        row_data = {}
        for cell in row.findall('ns:c', namespace):
            ref = cell.get('r')
            col = "".join(filter(str.isalpha, ref))
            # row_num = "".join(filter(str.isdigit, ref))
            
            t = cell.get('t')
            v_elem = cell.find('ns:v', namespace)
            if v_elem is not None:
                val = v_elem.text
                if t == 's':
                    val = shared_strings[int(val)]
                else:
                    # Handle numbers that might be scientific notation
                    try:
                        if '.' in val or 'E' in val or 'e' in val:
                            f_val = float(val)
                            if f_val == int(f_val):
                                val = str(int(f_val))
                            else:
                                val = "{:.0f}".format(f_val)
                    except:
                        pass
                
                # Special handling for phone numbers (adding leading zero if needed)
                if col in ['D', 'I', 'K'] and val and len(val) == 9:
                    val = '0' + val
                
                row_data[col] = val
        rows.append(row_data)

    # Columns mapping based on header
    # A: Fullname, B: Job Title, C: Dept, D: Phone, E: Status, F: DOJ, G: DOB, H: NOK, I: NOKPhone, J: Rel, K: Emergency, L: SSNIT, M: Bank
    
    employees = []
    for r in rows[1:]: # Skip header
        emp = {
            "name": r.get('A', '').strip(),
            "title": r.get('B', '').strip(),
            "dept": r.get('C', '').strip(),
            "phone": r.get('D', '').strip(),
            "status": r.get('E', '').strip(),
            "doj": r.get('F', '').strip(),
            "dob": r.get('G', '').strip(),
            "nokName": r.get('H', '').strip(),
            "nokPhone": r.get('I', '').strip(),
            "relationship": r.get('J', '').strip(),
            "emergencyContact": r.get('K', '').strip(),
            "ssnit": r.get('L', '').strip(),
            "bank": r.get('M', '').strip()
        }
        employees.append(emp)
    
    with open('extracted_production_team.json', 'w', encoding='utf-8') as f:
        json.dump(employees, f, indent=2)
    print(f"Extracted {len(employees)} employees.")

if __name__ == "__main__":
    parse_excel_xml()
