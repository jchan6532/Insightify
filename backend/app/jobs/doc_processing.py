from uuid import UUID
import json
from redis import Redis

from app.core.config import get_settings
from app.db.session import SessionLocal
from app.models.document import Document
from app.enums.document_status import DocumentStatus
from app.services.doc_chunk_service import process_document_chunks

settings = get_settings()
redis = Redis.from_url(settings.REDIS_URL)

def process_document_job(doc_id: UUID):
    db = SessionLocal()
    try:
        document = db.get(Document, doc_id)
        if not document:
            return
        try:
            process_document_chunks(
                db=db, 
                document=document
            )
            document.status = DocumentStatus.READY
            document.error_message = None
            db.commit()

            redis.publish(
                "document_updates",
                json.dumps({
                    "doc_id": str(document.id),
                    "title": document.title,
                    "status": DocumentStatus.READY
                }),
            )

        except Exception as e:
            db.rollback()
            document.status = DocumentStatus.FAILED
            document.error_message = str(e)[:5000]
            db.commit()

            redis.publish(
                "document_update",
                json.dumps({
                    "doc_id": str(document.id),
                    "title": document.title,
                    "status": DocumentStatus.FAILED,
                    "error": document.error_message
                }),
            )

    finally:
        db.close()