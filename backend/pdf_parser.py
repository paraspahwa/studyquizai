"""
PDF text extraction and chunking.
(Preserved from original QuizAPP — compatible with StudyQuizAI)
"""

import io
import pdfplumber


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract all text from a PDF file."""
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n\n"
    return text.strip()


def chunk_text(text: str, max_chunk_size: int = 3000, overlap: int = 200) -> list[str]:
    """
    Split large text into overlapping chunks for better quiz generation.
    Handles 100+ page PDFs by breaking content into manageable pieces.
    """
    if len(text) <= max_chunk_size:
        return [text]

    chunks = []
    start = 0

    while start < len(text):
        end = start + max_chunk_size

        # Try to break at a paragraph or sentence boundary
        if end < len(text):
            # Look for paragraph break
            para_break = text.rfind("\n\n", start, end)
            if para_break > start + max_chunk_size // 2:
                end = para_break
            else:
                # Look for sentence break
                sentence_break = text.rfind(". ", start, end)
                if sentence_break > start + max_chunk_size // 2:
                    end = sentence_break + 1

        chunks.append(text[start:end].strip())
        start = end - overlap  # Overlap for context continuity

    return chunks
