"""change embedding to vector type

Revision ID: be285f08ab14
Revises: 56a7c7a51220
Create Date: 2025-11-18 02:18:16.125232

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'be285f08ab14'
down_revision: Union[str, Sequence[str], None] = '56a7c7a51220'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # make sure pgvector extension exists (safe if already created)
    op.execute("CREATE EXTENSION IF NOT EXISTS vector;")

    # change embedding from double precision[] to vector(1536)
    op.execute(
        """
        ALTER TABLE doc_chunks
        ALTER COLUMN embedding
        TYPE vector(1536)
        USING embedding::vector;
        """
    )


def downgrade() -> None:
    # change embedding back to double precision[] (simple downgrade)
    op.execute(
        """
        ALTER TABLE doc_chunks
        ALTER COLUMN embedding
        TYPE double precision[];
        """
    )
