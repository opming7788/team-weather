from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/discord")
async def index(request: Request):
    return {"message": "Hello Discord"}
