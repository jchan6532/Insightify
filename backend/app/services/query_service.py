from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.schemas.query_schema import QueryRequest, QueryResponse, RetrievedChunk
from app.models.doc_chunk import DocChunk
from app.models.document import Document
from app.models.user import User
from app.models.query import Query
from app.services.ai.base import EmbeddingProvider, LLMProvider

def answer_query(
    db: Session, 
    data: QueryRequest, 
    user: User,
    embedding_provider: EmbeddingProvider,
    llm_provider: LLMProvider,
) -> QueryResponse:
    try:
        try:
            query_vec = embedding_provider.embed_query(data.question)
        except Exception as e:
            raise HTTPException(
                status_code=502,
                detail="Failed to embed query. Please try again later"
            ) from e

        # scope the vector search to the current user's own documents
        rows = (
            db.execute(
                select(DocChunk)
                .join(Document, DocChunk.document_id == Document.id)
                .where(Document.user_id == user.id)
                .order_by(DocChunk.embedding.l2_distance(query_vec))
                .limit(data.top_k)
            )
            .scalars()
            .all()
        )

        try:
            answer = llm_provider.generate_answer(
                question=data.question, 
                context=rows
            )
        except Exception as e:
            raise HTTPException(
                status_code=502,
                detail="Failed to generate answer. AI service may be unavailable."
            ) from e

        q = Query(
            user_id=user.id,
            question=data.question,
            answer=answer.text,
            top_k=data.top_k,
            model_name=answer.model_name,
            extra={"chunk_ids": [str(c.id) for c in rows]}
        )
        db.add(q)
        db.commit()
        db.refresh(q)

        return QueryResponse(
            query_id=q.id,
            answer=answer.text,
            chunks=[
                RetrievedChunk(
                    document_id=chunk.document_id,
                    chunk_id=chunk.id,
                    text=chunk.text,
                )
                for chunk in rows
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

