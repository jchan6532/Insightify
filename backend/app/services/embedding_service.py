from openai import OpenAI

client = OpenAI()

def embed_query(text: str) -> list[float]:
    resp = client.embeddings.create(
        model="text-embedding-3-small",
        input=[text]
    )
    return resp.data[0].embedding

def embed_chunks(chunks: list[str]) -> list[list[float]]:
    if not chunks:
        return []

    resp = client.embeddings.create(
        model="text-embedding-3-small",   # or "text-embedding-3-large"
        input=chunks                      # batch embed all chunks at once
    )

    return [item.embedding for item in resp.data]
