from functools import lru_cache

from app.core.config import get_settings
from app.services.ai.base import EmbeddingProvider, LLMProvider
from app.services.ai.openai_provider import OpenAIEmbeddingProvider, OpenAILLMProvider
from app.services.ai.anthropic_provider import AnthropicLLMProvider


@lru_cache
def get_embedding_provider() -> EmbeddingProvider:
    # Anthropic has no embeddings API, so this stays on OpenAI regardless of LLM_PROVIDER
    return OpenAIEmbeddingProvider()


@lru_cache
def get_llm_provider() -> LLMProvider:
    settings = get_settings()
    if settings.LLM_PROVIDER == "anthropic":
        return AnthropicLLMProvider()
    elif settings.LLM_PROVIDER == "openai":
        return OpenAILLMProvider()
    return OpenAILLMProvider()
