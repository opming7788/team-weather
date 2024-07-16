from fastapi import APIRouter, Request
from fastapi.responses import FileResponse

router = APIRouter()

@router.get("/discord", include_in_schema=False)
async def index(request: Request):
    return FileResponse("./static/discord.html", media_type="text/html")
