"""add real mime strings to documentmime enum

Revision ID: 5d7d396b7b04
Revises: add6ab4a2b8d
Create Date: 2025-11-19 19:47:30.590915

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5d7d396b7b04'
down_revision: Union[str, Sequence[str], None] = 'add6ab4a2b8d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.alter_column(
        "documents",
        "mime_type",
        existing_type=sa.Enum(name="documentmime"),
        type_=sa.String(length=255),
        existing_nullable=False,
        postgresql_using="mime_type::text",
    )

    op.execute("DROP TYPE IF EXISTS documentmime;")


def downgrade() -> None:
    pass