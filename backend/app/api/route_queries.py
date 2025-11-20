from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.query_schema import QueryRequest, QueryResponse
from app.services.query_service import answer_query

router = APIRouter(
    prefix="/query", 
    tags=["query"]
)

@router.post("/", response_model=QueryResponse, status_code=status.HTTP_201_CREATED)
def query_endpoint(
    payload: QueryRequest,
    db: Session = Depends(get_db),
):

    answer = answer_query(db=db, data=payload)
    return answer