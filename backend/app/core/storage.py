import boto3
from botocore.client import Config
from app.core.config import get_settings

settings = get_settings()

s3 = boto3.client(
    "s3",
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    config=Config(signature_version="s3v4"),
)

BUCKET_NAME = settings.AWS_S3_BUCKET_NAME
