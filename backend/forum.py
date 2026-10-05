from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import math
from bson import ObjectId

from models import ForumPost, ForumPostUpdate, ForumComment, ForumCommentCreate, PaginatedResponse
from database import DatabaseManager

router = APIRouter(prefix="/forum", tags=["forum"])
db_manager = DatabaseManager()

# Posts endpoints
@router.post("/posts", response_model=ForumPost)
async def create_post(post: ForumPost):
    # User ID is now expected to be provided in the post object
    post_data = post.model_dump(exclude={"id", "created_at", "updated_at", "comment_count"})
    
    post_id = await db_manager.create_forum_post(post_data)
    
    if not post_id:
        raise HTTPException(
            status_code=400, 
            detail="A similar post was already created recently. Please wait 24 hours before posting again."
        )
    
    created_post = await db_manager.get_forum_post(post_id)
    return created_post

@router.get("/posts", response_model=PaginatedResponse)
async def list_posts(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=50),
    tag: Optional[str] = None
):
    skip = (page - 1) * size
    posts, total = await db_manager.get_forum_posts(skip=skip, limit=size, tag=tag)
    
    total_pages = math.ceil(total / size)
    
    return {
        "items": posts,
        "total": total,
        "page": page,
        "size": size,
        "pages": total_pages
    }

@router.get("/posts/{post_id}", response_model=ForumPost)
async def get_post(post_id: str):
    post = await db_manager.get_forum_post(post_id)
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return post

@router.put("/posts/{post_id}", response_model=ForumPost)
async def update_post(
    post_id: str,
    post_update: ForumPostUpdate,
    user_id: str
):
    # Filter out None values
    update_data = {k: v for k, v in post_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields to update")
    
    success = await db_manager.update_forum_post(post_id, user_id, update_data)
    
    if not success:
        raise HTTPException(status_code=404, detail="Post not found or you don't have permission to edit it")
    
    updated_post = await db_manager.get_forum_post(post_id)
    return updated_post

@router.delete("/posts/{post_id}")
async def delete_post(
    post_id: str,
    user_id: str
):
    success = await db_manager.delete_forum_post(post_id, user_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Post not found or you don't have permission to delete it")
    
    return {"message": "Post deleted successfully"}


@router.post("/posts/{post_id}/comments", response_model=ForumComment)
async def create_comment(
    post_id: str,
    comment: ForumCommentCreate,
    user_id: str = Query(...)  # This makes it a required query parameter
):
    # Check if post exists
    post = await db_manager.get_forum_post(post_id)
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    comment_data = {
        "post_id": post_id,
        "user_id": user_id,
        "content": comment.content
    }
    
    comment_id = await db_manager.create_forum_comment(comment_data)
    
    # Fetch the created comment
    comments, _ = await db_manager.get_forum_comments(post_id)
    for c in comments:
        if c["_id"] == comment_id:
            return c
    
    raise HTTPException(status_code=500, detail="Error retrieving created comment")

@router.get("/posts/{post_id}/comments", response_model=PaginatedResponse)
async def list_comments(
    post_id: str,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100)
):
    # Check if post exists
    post = await db_manager.get_forum_post(post_id)
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    skip = (page - 1) * size
    comments, total = await db_manager.get_forum_comments(post_id, skip=skip, limit=size)
    
    total_pages = math.ceil(total / size)
    
    return {
        "items": comments,
        "total": total,
        "page": page,
        "size": size,
        "pages": total_pages
    }

@router.delete("/comments/{comment_id}")
async def delete_comment(
    comment_id: str,
    user_id: str
):
    success = await db_manager.delete_forum_comment(comment_id, user_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Comment not found or you don't have permission to delete it")
    
    return {"message": "Comment deleted successfully"}