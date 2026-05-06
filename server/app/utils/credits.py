from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from app.models import User, CreditTransaction

CREDIT_COSTS = {
    "workflow_run": 10,
    "node_run": 5,
    "api_execute": 10,
}

SIGNUP_BONUS = 25


async def get_or_create_user(clerk_id: str, db: AsyncSession) -> User:
    result = await db.execute(select(User).where(User.clerk_id == clerk_id))
    user = result.scalar_one_or_none()

    if not user:
        user = User(clerk_id=clerk_id, credits=SIGNUP_BONUS)
        db.add(user)
        await db.flush()
        tx = CreditTransaction(
            user_id=user.id,
            amount=SIGNUP_BONUS,
            type="signup_bonus",
            description=f"Welcome! {SIGNUP_BONUS} free credits to get started.",
        )
        db.add(tx)
        await db.commit()
        await db.refresh(user)

    return user


async def check_and_deduct(clerk_id: str, operation: str, db: AsyncSession) -> int:
    cost = CREDIT_COSTS.get(operation, 5)

    result = await db.execute(select(User).where(User.clerk_id == clerk_id))
    user = result.scalar_one_or_none()

    if not user:
        user = await get_or_create_user(clerk_id, db)
        result = await db.execute(select(User).where(User.clerk_id == clerk_id))
        user = result.scalar_one_or_none()

    if user.credits < cost:
        raise HTTPException(
            status_code=402,
            detail=f"Not enough credits. This costs {cost} credits — you have {user.credits}.",
        )

    user.credits -= cost
    tx = CreditTransaction(
        user_id=user.id,
        amount=-cost,
        type="usage",
        description=f"{operation.replace('_', ' ').title()}",
    )
    db.add(tx)
    await db.commit()
    return user.credits
