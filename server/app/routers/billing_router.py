import os
import stripe
from fastapi import APIRouter, HTTPException, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import User, CreditTransaction
from app.auth import get_current_user_id
from app.utils.credits import get_or_create_user

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

CREDIT_PACKS = {
    "starter": {"credits": 100,  "price_id": os.getenv("STRIPE_PRICE_STARTER", "")},
    "pro":     {"credits": 500,  "price_id": os.getenv("STRIPE_PRICE_PRO", "")},
    "studio":  {"credits": 1500, "price_id": os.getenv("STRIPE_PRICE_STUDIO", "")},
}

router = APIRouter()


@router.post("/checkout")
async def create_checkout(
    request: Request,
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    payload = await request.json()
    pack = payload.get("pack")

    if pack not in CREDIT_PACKS:
        raise HTTPException(status_code=400, detail="Invalid credit pack")

    pack_info = CREDIT_PACKS[pack]
    await get_or_create_user(clerk_id, db)

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{"price": pack_info["price_id"], "quantity": 1}],
        mode="payment",
        success_url=f"{FRONTEND_URL}/billing?success=true",
        cancel_url=f"{FRONTEND_URL}/billing",
        metadata={
            "clerk_id": clerk_id,
            "credits": str(pack_info["credits"]),
            "pack": pack,
        },
    )
    return {"url": session.url}


@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(payload, sig, STRIPE_WEBHOOK_SECRET)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    if event["type"] == "checkout.session.completed":
        session_data = event["data"]["object"]
        clerk_id = session_data["metadata"]["clerk_id"]
        credits = int(session_data["metadata"]["credits"])
        pack = session_data["metadata"]["pack"]

        result = await db.execute(select(User).where(User.clerk_id == clerk_id))
        user = result.scalar_one_or_none()
        if user:
            user.credits += credits
            tx = CreditTransaction(
                user_id=user.id,
                amount=credits,
                type="purchase",
                description=f"{pack.capitalize()} pack — {credits} credits",
                stripe_session_id=session_data["id"],
            )
            db.add(tx)
            await db.commit()

    return {"status": "ok"}
