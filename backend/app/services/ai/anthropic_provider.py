from typing import Sequence

from anthropic import Anthropic

from app.core.config import get_settings
from app.models.doc_chunk import DocChunk
from app.services.ai.base import LLMAnswer

PROMPT_TEMPLATE = """Use ONLY the following context to answer the question.
If the context is not enough, say you don't know.

Context:
{context}

Question: {question}"""


class AnthropicLLMProvider:
    def __init__(self) -> None:
        settings = get_settings()
        self._client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self._model = settings.ANTHROPIC_MODEL

    def generate_answer(self, question: str, context: Sequence[DocChunk]) -> LLMAnswer:
        ctx_text = "\n\n".join(f"- {c.text}" for c in context)
        prompt = PROMPT_TEMPLATE.format(context=ctx_text, question=question)

        resp = self._client.messages.create(
            model=self._model,
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}],
        )
        text = "".join(block.text for block in resp.content if block.type == "text")
        return LLMAnswer(text=text, model_name=self._model)
