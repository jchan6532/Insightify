def embed_chunks(chunks: list[str]):
    vectors = []
    for chunk in chunks:
        vectors.append([1.0]*1536)
    
    return vectors