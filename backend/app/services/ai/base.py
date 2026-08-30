from __future__ import annotations
from dataclasses import dataclass
from typing import Protocol, Sequence, runtime_checkable

from app.models.doc_chunk import DocChunk


@dataclass
class LLMAnswer:
    text: str
    model_name: str


@runtime_checkable
class EmbeddingProvider(Protocol):
    """Turns text into vectors for storage/search. Anthropic has no embeddings API,
    so this is currently always backed by OpenAI regardless of LLM_PROVIDER."""

    def embed_query(self, text: str) -> list[float]: ...
    def embed_chunks(self, chunks: list[str]) -> list[list[float]]: ...


@runtime_checkable
class LLMProvider(Protocol):
    """Generates a grounded answer from a question + retrieved chunks."""

    def generate_answer(self, question: str, context: Sequence[DocChunk]) -> LLMAnswer: ...
