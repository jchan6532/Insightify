from pydantic import BaseModel
from uuid import UUID

class QueryRequest(BaseModel):
    user_id: UUID
    question: str
    top_k: int = 5  # optional override

class RetrievedChunk(BaseModel):
    document_id: UUID
    chunk_id: UUID
    text: str

class QueryResponse(BaseModel):
    answer: str
    chunks: list[RetrievedChunk]
