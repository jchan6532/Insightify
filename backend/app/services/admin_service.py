from sqlalchemy.orm import Session
from app.db.base import Base

def reset_database(db: Session):
    
    # delete all rows from all tables
    for table in reversed(Base.metadata.sorted_tables):
        db.execute(table.delete())

    db.commit()