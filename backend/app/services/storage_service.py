import uuid
from app.core.storage import s3, BUCKET_NAME


def generate_object_key(user_id: str, filename: str) -> str:
    ext = filename.rsplit(".", 1)[-1] if "." in filename else ""
    return f"{user_id}/{uuid.uuid4()}.{ext}" if ext else f"{user_id}/{uuid.uuid4()}"


def create_presigned_url(
    key: str, 
    content_type: str, 
    expires_in: int = 3600
    ) -> str:
    return s3.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": BUCKET_NAME, 
            "Key": key,
            "ContentType": content_type
        },
        ExpiresIn=expires_in,
    )

def delete_file(key: str) -> None:
    s3.delete_object(Bucket=BUCKET_NAME, Key=key)
