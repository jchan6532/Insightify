from openai import OpenAI

from app.models.doc_chunk import DocChunk
from app.core.config import get_settings

settings = get_settings()
llm_client = OpenAI(api_key=settings.OPEN_AI_API_KEY)

def build_answer(question: str, context: list[DocChunk]) -> str:
    context = "\n\n".join(f"- {c.text}" for c in context)

    prompt = f"""You are a helpful assistant.

Use ONLY the following context to answer the question.
If the context is not enough, say you don't know.

Context:
{context}

Question: {question}
Answer:"""

    resp = llm_client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
    )
    return resp.choices[0].message.content or ""
