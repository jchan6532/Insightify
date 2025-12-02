from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.session import get_db
from app.schemas.query_schema import QueryRequest, QueryResponse, QueryOut, QueryListOut
from app.services.query_service import answer_query
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.query import Query

router = APIRouter(
    prefix="/query", 
    tags=["query"]
)

@router.get("/", response_model=QueryListOut, status_code=status.HTTP_200_OK)
def list_user_queries(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    queries = (
        db.query(Query)
        .filter(Query.user_id == current_user.id)
        .order_by(Query.created_at.desc())
        .all()
    )
    return queries

@router.get("/{query_id}", response_model=QueryOut, status_code=status.HTTP_200_OK)
def get_query_detail(
    query_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = (
        db.query(Query)
        .filter(
            Query.id == query_id,
            Query.user_id == current_user.id,
        )
        .first()
    )

    if not query:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Query not found"
        )
    return query

@router.post("/", response_model=QueryResponse, status_code=status.HTTP_201_CREATED)
def query_endpoint(
    payload: QueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    answer = answer_query(
        db=db, 
        data=payload, 
        user=current_user
    )
    return answer

