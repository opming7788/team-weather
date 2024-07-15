from fastapi import APIRouter, Request
from fastapi.responses import FileResponse

router = APIRouter()

@router.get("/", include_in_schema=False)
async def index(request: Request):
    return FileResponse("./static/index.html", media_type="text/html")