from fastapi import APIRouter
from .home import router as home_router
from .discord import router as discord_router
from .websockets import router as websockets_router

api_router = APIRouter()
api_router.include_router(home_router, tags=["home"])
api_router.include_router(discord_router, tags=["discord"])
api_router.include_router(websockets_router, tags=["websockets"])


__all__ = ["api_router"]
