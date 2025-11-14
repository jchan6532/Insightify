from enum import Enum

class DocumentMime(Enum):
    PDF = "application/pdf"
    TEXT = "text/plain"
    MARKDOWN = "text/markdown"
    HTML = "text/html"

    WORD = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    EXCEL = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    POWERPOINT = "application/vnd.openxmlformats-officedocument.presentationml.presentation"

    JSON = "application/json"
