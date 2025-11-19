from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "add6ab4a2b8d"
down_revision = "be285f08ab14"

document_source_enum = postgresql.ENUM(
    "upload", name="documentsource"
)

def upgrade() -> None:
    bind = op.get_bind()
    document_source_enum.create(bind, checkfirst=True)

    op.alter_column(
        "documents",
        "source",
        existing_type=sa.VARCHAR(length=24),
        type_=document_source_enum,
        existing_nullable=False,
        postgresql_using="source::documentsource",  # <-- key line
    )


def downgrade() -> None:
    bind = op.get_bind()

    op.alter_column(
        "documents",
        "source",
        existing_type=document_source_enum,
        type_=sa.VARCHAR(length=24),
        existing_nullable=False,
        postgresql_using="source::text",
    )

    document_source_enum.drop(bind, checkfirst=True)
