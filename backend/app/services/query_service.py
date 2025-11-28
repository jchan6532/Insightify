from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.schemas.query_schema import QueryRequest, QueryResponse, RetrievedChunk
from app.models.doc_chunk import DocChunk
from app.models.user import User
from app.models.query import Query
from app.services.embedding_service import embed_query
from app.services.llm_service import build_answer

def fake_embed_query(text: str) -> list[float]:
    return [0.0] * 1536

def answer_query(
    db: Session, 
    data: QueryRequest, 
    user: User
) -> QueryResponse:
    
    try:
        query_vec = embed_query(data.question)
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Failed to embed query. Please try again later"
        )

    rows = (
        db.execute(
            select(DocChunk)
            .order_by(DocChunk.embedding.l2_distance(query_vec))
            .limit(data.top_k)
        )
        .scalars()
        .all()
    )

    all_chunks = rows
    visible_chunks = [c for c in rows if c.document.user_id == user.id]

    try:
        answer_text = build_answer(
            question=data.question, 
            context=all_chunks
        )
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Failed to generate answer. Please try again later."
        )

    q = Query(
        user_id=user.id,
        question=data.question,
        answer = answer_text,
        top_k=data.top_k,
        metadata={"chunk_ids": [str(c.id) for c in rows]}
    )
    db.add(q)
    db.commit()
    db.refresh(q)

    return QueryResponse(
        answer=answer_text,
        chunks=[
            RetrievedChunk(
                document_id=chunk.document_id,
                chunk_id=chunk.id,
                text=chunk.text,
            )
            for chunk in visible_chunks
        ],
    )
