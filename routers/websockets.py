from fastapi import APIRouter, Request
from fastapi.responses import FileResponse

router = APIRouter()

@router.get("/websockets", include_in_schema=False)
async def index(request: Request):
    return FileResponse("./static/websockets.html", media_type="text/html")