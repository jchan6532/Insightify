"""add error_message to documents

Revision ID: 130e737a89f5
Revises: c5d8a1d3c24d
Create Date: 2025-12-02 17:41:18.984647

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '130e737a89f5'
down_revision: Union[str, Sequence[str], None] = 'c5d8a1d3c24d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "documents",
        sa.Column("error_message", sa.String(), nullable=True)
    )

def downgrade() -> None:
    op.drop_column("documents", "error_message")
