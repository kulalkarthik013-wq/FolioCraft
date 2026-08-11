import fitz  # PyMuPDF
from docx import Document


def extract_pdf_text(file_path: str) -> str:
    text = ""

    pdf = fitz.open(file_path)

    for page in pdf:
        text += page.get_text()

    pdf.close()

    return text.strip()


def extract_docx_text(file_path: str) -> str:
    doc = Document(file_path)

    text = "\n".join(
        paragraph.text
        for paragraph in doc.paragraphs
    )

    return text.strip()


def extract_resume_text(file_path: str) -> str:
    if file_path.lower().endswith(".pdf"):
        return extract_pdf_text(file_path)

    if file_path.lower().endswith(".docx"):
        return extract_docx_text(file_path)

    raise ValueError("Unsupported file type")