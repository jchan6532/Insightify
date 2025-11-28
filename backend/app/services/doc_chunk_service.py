import os
from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.doc_chunk import DocChunk
from app.services.embedding_service import embed_chunks
from app.services.storage_service import get_object
from app.enums.document_mime import DocumentMime
from app.services.text_extraction import extract_from_pdf, extract_from_word
from app.core.config import get_settings

settings = get_settings()
CHUNK_SIZE = settings.DOC_CHUNK_SIZE

def load_document_text(document: Document) -> str:
    obj = get_object(key=document.storage_uri)
    raw = obj["Body"].read()

    document.byte_size = obj["ContentLength"]

    if document.mime_type == DocumentMime.TEXT:
        return raw.decode("utf-8", errors="ignore")
    
    elif document.mime_type == DocumentMime.PDF:
        return extract_from_pdf(raw)
    
    elif document.mime_type == DocumentMime.WORD:
        return extract_from_word(raw)
    
    else:
        return raw.decode("utf-8", errors="ignore")

def split_into_chunks(text: str, chunk_size: int = CHUNK_SIZE) -> list[str]:
    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end
    return chunks

def process_document_chunks(db: Session, document: Document) -> None:
    text = load_document_text(document)
    chunks = split_into_chunks(text)
    vectors = embed_chunks(chunks)

    for idx, (chunk_text, vec) in enumerate(zip(chunks, vectors)):
        chunk = DocChunk(
            document_id=document.id,
            seq=idx,
            text=chunk_text,
            embedding=vec,
        )
        db.add(chunk)