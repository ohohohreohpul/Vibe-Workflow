import uuid
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clerk_id = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, nullable=False, default="")
    credits = Column(Integer, default=25, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CreditTransaction(Base):
    __tablename__ = "credit_transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    amount = Column(Integer, nullable=False)  # positive = added, negative = spent
    type = Column(String, nullable=False)     # signup_bonus | purchase | usage
    description = Column(Text)
    stripe_session_id = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class UserWorkflow(Base):
    __tablename__ = "user_workflows"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    workflow_id = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, default="Untitled Workflow")
    thumbnail = Column(Text)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
