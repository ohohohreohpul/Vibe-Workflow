from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routers import workflow_router, app_router
from app.routers import user_router, billing_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="0123 API", version="1.0.0", lifespan=lifespan)

app.include_router(workflow_router.router, prefix="/api/workflow", tags=["workflow"])
app.include_router(app_router.router, prefix="/api/app", tags=["app"])
app.include_router(user_router.router, prefix="/api/user", tags=["user"])
app.include_router(billing_router.router, prefix="/api/billing", tags=["billing"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Welcome to 0123 API"}


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
