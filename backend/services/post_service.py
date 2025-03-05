import os
import uuid

from dotenv import load_dotenv
from fastapi import UploadFile, HTTPException
from fastapi import status
from sqlalchemy.orm import Session
from supabase import create_client, Client

from backend.models import schemas
from backend.models.models import *
from backend.models.models import Post

load_dotenv()

supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))


def get_all_posts(db: Session):
    try:
        # Query all posts from the database
        return db.query(Post).all()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving posts: {str(e)}"
        )


def get_post_by_id(db: Session, post_id: int):
    try:
        # Query the database for the post with the given ID
        db_post = db.query(Post).filter(Post.id == post_id).first()

        # Check if the post exists
        if not db_post:
            return None

        return db_post
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving post: {str(e)}"
        )


async def create_post(db: Session, post: schemas.PostCreate, image: UploadFile, current_user: AppUser):
    try:
        # Validate file type (e.g., allow only images)
        allowed_extensions = {"jpg", "jpeg", "png", "gif"}
        file_extension = image.filename.split(".")[-1].lower()
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file type. Only images are allowed.",
            )

        # Generate a unique filename
        unique_filename = f"{uuid.uuid4()}.{file_extension}"

        # Upload the file to Supabase Storage
        file_path = f"images/{unique_filename}"
        supabase.storage.from_(os.getenv("BUCKET_NAME")).upload(file_path, await image.read())

        # Get the public URL of the uploaded file
        image_url = supabase.storage.from_(os.getenv("BUCKET_NAME")).get_public_url(file_path)

        # Save the post in the database
        db_post = Post(
            caption=post.caption,
            description=post.description,
            image_url=image_url,
            stadium_id=post.stadium_id,
            user_id=current_user.id,
        )
        db.add(db_post)
        db.commit()
        db.refresh(db_post)

        return db_post
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating post: {str(e)}",
        )
    finally:
        await image.close()


def update_post(
        db: Session,
        post_id: int,
        post: schemas.PostUpdate,
        image: UploadFile = None,
):
    try:
        # Fetch the post from the database
        db_post = db.query(Post).filter(Post.id == post_id).first()
        if not db_post:
            return None

        # Update the post fields if provided
        if post.caption:
            db_post.caption = post.caption
        if post.description:
            db_post.description = post.description
        if post.stadium_id:
            db_post.stadium_id = post.stadium_id

        # Handle image update if provided
        if image:
            # Validate file type (e.g., allow only images)
            allowed_extensions = {"jpg", "jpeg", "png", "gif"}
            file_extension = image.filename.split(".")[-1].lower()
            if file_extension not in allowed_extensions:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid file type. Only images are allowed.",
                )

            # Generate a unique filename
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            file_path = f"images/{unique_filename}"

            # Upload the new image to Supabase Storage
            supabase.storage.from_(os.getenv("BUCKET_NAME")).upload(file_path, image.file.read())

            # Get the public URL of the uploaded file
            image_url = supabase.storage.from_(os.getenv("BUCKET_NAME")).get_public_url(file_path)

            # Update the image URL in the database
            db_post.image_url = image_url

        # Commit changes to the database
        db.commit()
        db.refresh(db_post)

        return db_post
    except HTTPException:
        raise  # Re-raise HTTPException
    except Exception as e:
        db.rollback()  # Rollback the transaction in case of an error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating post: {str(e)}",
        )
    finally:
        if image:
            image.file.close()  # Ensure the file is closed


def delete_post(
        db: Session,
        post_id: int,
):
    try:
        # Fetch the post from the database
        db_post = db.query(Post).filter(Post.id == post_id).first()
        if not db_post:
            return None

        # Delete the post from the database
        db.delete(db_post)
        db.commit()

        # Optionally, delete the associated image from Supabase Storage
        if db_post.image_url:
            file_path = db_post.image_url.split(os.getenv("BUCKET_NAME") + "/")[-1]
            supabase.storage.from_(os.getenv("BUCKET_NAME")).remove([file_path])

        return True
    except Exception as e:
        db.rollback()  # Rollback the transaction in case of an error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting post: {str(e)}",
        )
