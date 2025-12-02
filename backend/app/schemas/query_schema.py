from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class QueryRequest(BaseModel):
    question: str
    top_k: int = 5

class RetrievedChunk(BaseModel):
    document_id: UUID
    chunk_id: UUID
    text: str

class QueryResponse(BaseModel):
    query_id: UUID
    answer: str
    chunks: list[RetrievedChunk]

class QueryOut(BaseModel):
    id: UUID
    question: str
    answer: str
    top_k: int
    model_name: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True

class QueryListOut(BaseModel):
    queries: list[QueryOut]
    total: int
