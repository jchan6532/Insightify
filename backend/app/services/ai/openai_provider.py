from typing import Sequence

from openai import OpenAI

from app.core.config import get_settings
from app.models.doc_chunk import DocChunk
from app.services.ai.base import LLMAnswer

EMBEDDING_MODEL = "text-embedding-3-small"

PROMPT_TEMPLATE = """You are a helpful assistant.

Use ONLY the following context to answer the question.
If the context is not enough, say you don't know.

Context:
{context}

Question: {question}
Answer:"""


class OpenAIEmbeddingProvider:
    def __init__(self) -> None:
        settings = get_settings()
        self._client = OpenAI(api_key=settings.OPEN_AI_API_KEY)

    def embed_query(self, text: str) -> list[float]:
        resp = self._client.embeddings.create(model=EMBEDDING_MODEL, input=[text])
        return resp.data[0].embedding

    def embed_chunks(self, chunks: list[str]) -> list[list[float]]:
        if not chunks:
            return []
        resp = self._client.embeddings.create(model=EMBEDDING_MODEL, input=chunks)
        return [item.embedding for item in resp.data]


class OpenAILLMProvider:
    def __init__(self) -> None:
        settings = get_settings()
        self._client = OpenAI(api_key=settings.OPEN_AI_API_KEY)
        self._model = settings.OPENAI_LLM_MODEL

    def generate_answer(self, question: str, context: Sequence[DocChunk]) -> LLMAnswer:
        ctx_text = "\n\n".join(f"- {c.text}" for c in context)
        prompt = PROMPT_TEMPLATE.format(context=ctx_text, question=question)

        resp = self._client.chat.completions.create(
            model=self._model,
            messages=[{"role": "user", "content": prompt}],
        )
        return LLMAnswer(text=resp.choices[0].message.content or "", model_name=self._model)
