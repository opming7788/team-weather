from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from routers import api_router
from routers.websockets import router as websocket_router, handle_messages
import asyncio


@asynccontextmanager
async def lifespan(app: FastAPI):
    message_handler_task = asyncio.create_task(handle_messages())
    yield
    message_handler_task.cancel()
    try:
        await message_handler_task
    except asyncio.CancelledError:
        pass


app = FastAPI(lifespan=lifespan)
app.include_router(api_router)
app.include_router(websocket_router)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/websockets", include_in_schema=False)
async def websockets(request: Request):
    return FileResponse("./static/websockets.html", media_type="text/html")