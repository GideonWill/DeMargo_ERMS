import sys
from pypdf import PdfReader

def read_pdf(file_path):
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        with open(file_path + ".txt", "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Saved to {file_path}.txt")
    except Exception as e:
        print(f"Error reading {file_path}: {e}")

read_pdf("public/Employees_Data Production Team.pdf")
read_pdf("public/Employees_Data_(_Administration).pdf")
