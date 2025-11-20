"""add lowercase status values to documentstatus

Revision ID: 6e9170ed4644
Revises: 5d7d396b7b04
Create Date: 2025-11-19 20:05:30.616570

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6e9170ed4644'
down_revision: Union[str, Sequence[str], None] = '5d7d396b7b04'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "ALTER TYPE documentstatus ADD VALUE IF NOT EXISTS 'pending';"
    )
    op.execute(
        "ALTER TYPE documentstatus ADD VALUE IF NOT EXISTS 'processing';"
    )
    op.execute(
        "ALTER TYPE documentstatus ADD VALUE IF NOT EXISTS 'complete';"
    )
    op.execute(
        "ALTER TYPE documentstatus ADD VALUE IF NOT EXISTS 'failed';"
    )


def downgrade() -> None:
    pass
