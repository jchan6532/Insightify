"""create doc_chunks table with embedding

Revision ID: 56a7c7a51220
Revises: fa0b4775885c
Create Date: 2025-11-18 01:53:55.522314

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '56a7c7a51220'
down_revision: Union[str, Sequence[str], None] = 'fa0b4775885c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1) enable pgvector extension
    op.execute("CREATE EXTENSION IF NOT EXISTS vector;")

    # 2) create doc_chunks table
    op.create_table(
        "doc_chunks",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "document_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("documents.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("seq", sa.Integer, nullable=False),
        sa.Column("text", sa.Text, nullable=False),
        sa.Column(
            "embedding",
            sa.dialects.postgresql.ARRAY(sa.Float),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
            nullable=False,
        ),
    )

    op.create_index(
        "ix_doc_chunks_document_id",
        "doc_chunks",
        ["document_id"],
    )


def downgrade() -> None:
    op.drop_index("ix_doc_chunks_document_id", table_name="doc_chunks")
    op.drop_table("doc_chunks")

