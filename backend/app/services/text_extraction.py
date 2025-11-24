from io import BytesIO
import pdfpulmber
from docx import Document as DocxDocument

def extract_from_pdf(raw: bytes) -> str:
    text = ""
    with pdfpulmber.open(BytesIO(raw)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
            text += "\n"
    return text.strip()

def extract_from_word(raw: bytes) -> str:
    doc = DocxDocument(BytesIO(raw))
    lines = []
    for para in doc.paragraphs:
        if para.text:
            lines.append(para.text)
    return "\n".join(lines)