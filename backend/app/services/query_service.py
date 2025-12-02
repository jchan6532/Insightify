from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from openai import OpenAIError

from app.schemas.query_schema import QueryRequest, QueryResponse, RetrievedChunk
from app.models.doc_chunk import DocChunk
from app.models.user import User
from app.models.query import Query
from app.services.embedding_service import embed_query
from app.services.llm_service import build_answer

def answer_query(
    db: Session, 
    data: QueryRequest, 
    user: User
) -> QueryResponse:
    try:
        try:
            query_vec = embed_query(data.question)
        except OpenAIError as e:
            raise HTTPException(
                status_code=502,
                detail="Failed to embed query. Please try again later"
            ) from e

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
        except OpenAIError as e:
            raise HTTPException(
                status_code=502,
                detail="Failed to generate answer. AI service may be unavailable."
            ) from e

        q = Query(
            user_id=user.id,
            question=data.question,
            answer = answer_text,
            top_k=data.top_k,
            model_name="gpt-4.1-mini",
            extra={"chunk_ids": [str(c.id) for c in rows]}
        )
        db.add(q)
        db.commit()
        db.refresh(q)

        return QueryResponse(
            query_id=q.id,
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
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unexpected error while answering query"
        ) from e

