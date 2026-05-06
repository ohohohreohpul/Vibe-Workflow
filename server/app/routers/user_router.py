from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.auth import get_current_user_id
from app.utils.credits import get_or_create_user

router = APIRouter()


@router.get("/me")
async def get_me(
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    user = await get_or_create_user(clerk_id, db)
    return {
        "clerk_id": user.clerk_id,
        "credits": user.credits,
        "created_at": user.created_at,
    }
