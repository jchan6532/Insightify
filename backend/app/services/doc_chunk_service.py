from pathlib import Path
from sqlalchemy.orm import Session
from app.models.document import Document
from app.models.doc_chunk import DocChunk
from app.services.embedding_service import embed_chunks
import os

CHUNK_SIZE = int(os.getenv("DOC_CHUNK_SIZE", 800))

def load_document_text(document: Document) -> str:
    path = Path(document.storage_uri) 
    full_path = Path(__file__).resolve().parents[2] / path
    return full_path.read_text(encoding="utf-8")

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

    db.commit()