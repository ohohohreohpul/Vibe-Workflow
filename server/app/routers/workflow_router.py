from fastapi import APIRouter, HTTPException, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.database import get_db
from app.auth import get_current_user_id
from app.models import UserWorkflow
from app.utils.credits import get_or_create_user, check_and_deduct
from app.utils.workflow_helper import (
    create_or_update_workflow,
    get_node_schemas_helper,
    get_api_node_schemas_helper,
    get_workflow_def_helper,
    run_workflow_helper,
    get_run_status_helper,
    run_node_helper,
    publish_workflow_helper,
    template_workflow_helper,
    cloudfront_signed_url_helper,
    generate_thumbnail_helper,
    delete_workflow_def_by_id,
    update_workflow_name_helper,
    get_workflow_last_run,
    architect_workflow_helper,
    poll_architect_result_helper,
    delete_node_run_by_id_helper,
    update_workflow_category_helper,
    get_workflow_api_inputs_helper,
    execute_workflow_via_api_helper,
    get_workflow_api_outputs_helper,
)

router = APIRouter()


# ── Workflow CRUD ────────────────────────────────────────────────────────────

@router.post("/create")
async def create_workflow(
    request: Request,
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    payload = await request.json()
    user = await get_or_create_user(clerk_id, db)
    result = await create_or_update_workflow(payload)

    workflow_id = result.get("workflow_id")
    if workflow_id:
        wf = UserWorkflow(
            user_id=user.id,
            workflow_id=workflow_id,
            name=payload.get("name", "Untitled Workflow"),
        )
        db.add(wf)
        await db.commit()

    return result


@router.get("/get-workflow-defs")
async def get_workflow_defs(
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    user = await get_or_create_user(clerk_id, db)
    result = await db.execute(
        select(UserWorkflow)
        .where(UserWorkflow.user_id == user.id)
        .order_by(UserWorkflow.updated_at.desc())
    )
    rows = result.scalars().all()
    return [
        {
            "id": str(row.workflow_id),
            "workflow_id": row.workflow_id,
            "name": row.name,
            "thumbnail": row.thumbnail,
            "updated_at": row.updated_at,
            "created_at": row.created_at,
        }
        for row in rows
    ]


@router.get("/get-workflow-def/{workflow_id}")
async def get_workflow_def(
    workflow_id: str,
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _assert_owns(workflow_id, clerk_id, db)
    return await get_workflow_def_helper(workflow_id)


@router.delete("/delete-workflow-def/{workflow_id}")
async def delete_workflow_def(
    workflow_id: str,
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _assert_owns(workflow_id, clerk_id, db)
    result = await delete_workflow_def_by_id(workflow_id)
    await db.execute(delete(UserWorkflow).where(UserWorkflow.workflow_id == workflow_id))
    await db.commit()
    return result


@router.post("/update-name/{workflow_id}")
async def update_workflow_name(
    workflow_id: str,
    request: Request,
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _assert_owns(workflow_id, clerk_id, db)
    payload = await request.json()
    result = await db.execute(select(UserWorkflow).where(UserWorkflow.workflow_id == workflow_id))
    wf = result.scalar_one_or_none()
    if wf:
        wf.name = payload.get("name", wf.name)
        await db.commit()
    return await update_workflow_name_helper(workflow_id, payload)


@router.post("/{workflow_id}/thumbnail")
async def generate_thumbnail(
    workflow_id: str,
    request: Request,
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _assert_owns(workflow_id, clerk_id, db)
    payload = await request.json()
    result_data = await generate_thumbnail_helper(workflow_id, payload)
    thumbnail_url = result_data.get("thumbnail_url") or result_data.get("url")
    if thumbnail_url:
        res = await db.execute(select(UserWorkflow).where(UserWorkflow.workflow_id == workflow_id))
        wf = res.scalar_one_or_none()
        if wf:
            wf.thumbnail = thumbnail_url
            await db.commit()
    return result_data


# ── Schemas (free, no credits) ───────────────────────────────────────────────

@router.get("/{workflow_id}/node-schemas")
async def get_node_schemas(
    workflow_id: str,
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _assert_owns(workflow_id, clerk_id, db)
    return await get_node_schemas_helper(workflow_id)


@router.get("/{workflow_id}/api-node-schemas")
async def get_api_node_schemas(
    workflow_id: str,
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _assert_owns(workflow_id, clerk_id, db)
    return await get_api_node_schemas_helper(workflow_id)


# ── Execution (costs credits) ────────────────────────────────────────────────

@router.post("/{workflow_id}/run")
async def run_workflow(
    workflow_id: str,
    request: Request,
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _assert_owns(workflow_id, clerk_id, db)
    await check_and_deduct(clerk_id, "workflow_run", db)
    payload = await request.json()
    return await run_workflow_helper(workflow_id, payload)


@router.get("/run/{run_id}/status")
async def get_run_status(
    run_id: str,
    clerk_id: str = Depends(get_current_user_id),
):
    return await get_run_status_helper(run_id)


@router.post("/{workflow_id}/node/{node_id}/run")
async def run_node(
    workflow_id: str,
    node_id: str,
    request: Request,
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _assert_owns(workflow_id, clerk_id, db)
    await check_and_deduct(clerk_id, "node_run", db)
    payload = await request.json()
    return await run_node_helper(workflow_id, node_id, payload)


@router.post("/{workflow_id}/api-execute")
async def execute_workflow_via_api(
    workflow_id: str,
    request: Request,
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _assert_owns(workflow_id, clerk_id, db)
    await check_and_deduct(clerk_id, "api_execute", db)
    payload = await request.json()
    return await execute_workflow_via_api_helper(workflow_id, payload)


@router.get("/run/{run_id}/api-outputs")
async def get_workflow_api_outputs(
    run_id: str,
    clerk_id: str = Depends(get_current_user_id),
):
    return await get_workflow_api_outputs_helper(run_id)


# ── Misc (free) ──────────────────────────────────────────────────────────────

@router.post("/workflow/{workflow_id}/publish")
async def publish_workflow(
    workflow_id: str,
    request: Request,
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _assert_owns(workflow_id, clerk_id, db)
    payload = await request.json()
    return await publish_workflow_helper(workflow_id, payload)


@router.post("/workflow/{workflow_id}/template")
async def template_workflow(
    workflow_id: str,
    request: Request,
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _assert_owns(workflow_id, clerk_id, db)
    payload = await request.json()
    return await template_workflow_helper(workflow_id, payload)


@router.post("/cloudfront-signed-url")
async def cloudfront_signed_url(
    request: Request,
    clerk_id: str = Depends(get_current_user_id),
):
    payload = await request.json()
    return await cloudfront_signed_url_helper(payload)


@router.get("/get-workflow-last-run/{workflow_id}")
async def get_workflow_last_run_endpoint(
    workflow_id: str,
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _assert_owns(workflow_id, clerk_id, db)
    return await get_workflow_last_run(workflow_id)


@router.post("/architect")
async def architect_workflow_endpoint(
    request: Request,
    clerk_id: str = Depends(get_current_user_id),
):
    payload = await request.json()
    return await architect_workflow_helper(payload)


@router.get("/poll-architect/{id}/result")
async def poll_architect_result(
    id: str,
    clerk_id: str = Depends(get_current_user_id),
):
    return await poll_architect_result_helper(id)


@router.delete("/node-run/{node_run_id}")
async def delete_node_run(
    node_run_id: str,
    clerk_id: str = Depends(get_current_user_id),
):
    return await delete_node_run_by_id_helper(node_run_id)


@router.post("/update-category/{workflow_id}")
async def update_workflow_category(
    workflow_id: str,
    request: Request,
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _assert_owns(workflow_id, clerk_id, db)
    payload = await request.json()
    return await update_workflow_category_helper(workflow_id, payload)


@router.get("/{workflow_id}/api-inputs")
async def get_workflow_api_inputs(
    workflow_id: str,
    clerk_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _assert_owns(workflow_id, clerk_id, db)
    return await get_workflow_api_inputs_helper(workflow_id)


# ── Helper ───────────────────────────────────────────────────────────────────

async def _assert_owns(workflow_id: str, clerk_id: str, db: AsyncSession):
    from app.models import User
    user_result = await db.execute(select(User).where(User.clerk_id == clerk_id))
    user = user_result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    wf_result = await db.execute(
        select(UserWorkflow).where(
            UserWorkflow.workflow_id == workflow_id,
            UserWorkflow.user_id == user.id,
        )
    )
    if not wf_result.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Access denied")
