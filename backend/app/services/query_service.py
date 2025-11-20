from sqlalchemy.orm import Session
from pgvector.sqlalchemy import Vector
from sqlalchemy import select
from uuid import UUID

from app.schemas.query_schema import QueryRequest, QueryResponse, RetrievedChunk
from app.models.doc_chunk import DocChunk

def fake_embed_query(text: str) -> list[float]:
    return [0.0] * 1536

def answer_query(db: Session, data: QueryRequest) -> QueryResponse:
    query_vec = fake_embed_query(data.question)

    stmt = (
        select(DocChunk)
        .order_by(DocChunk.embedding.l2_distance(query_vec))
        .limit(data.top_k)
    )
    rows = db.execute(stmt).scalars().all()

    combined_text = "\n\n".join(chunk.text for chunk in rows)
    answer_text = f"(stubbed) I used {len(rows)} chunks. First chunk:\n\n{rows[0].text if rows else 'no chunks found'}"

    return QueryResponse(
        answer=answer_text,
        chunks=[
            RetrievedChunk(
                document_id=chunk.document_id,
                chunk_id=chunk.id,
                text=chunk.text,
            )
            for chunk in rows
        ],
    )
