from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Set
import asyncio
import json

connected_sockets: Set[WebSocket] = set()
message_queue: asyncio.Queue = asyncio.Queue()

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_sockets.add(websocket)
    
    try:
        await broadcast_clients_total()
        
        while True:
            data = await websocket.receive_text()
            await message_queue.put((websocket, data))
    except WebSocketDisconnect:
        connected_sockets.remove(websocket)
        await broadcast_clients_total()
    finally:
        connected_sockets.discard(websocket)

async def broadcast_clients_total():
    for socket in connected_sockets:
        await socket.send_json({"type": "clients-total", "total": len(connected_sockets)})

async def handle_messages():
    while True: 
        sender, message = await message_queue.get()
        try:
            data = json.loads(message)
            message_type = data.get("type")

            if message_type == "chat-message":
                for socket in connected_sockets:
                    if socket != sender:
                        await socket.send_json({"type": "chat-message", "data": data["data"]})
            elif message_type == "feedback":
                for socket in connected_sockets:
                    if socket != sender:
                        await socket.send_json({"type": "feedback", "data": data["data"]})
        
        except json.JSONDecodeError:
            print(f"Invalid JSON received: {message}")
        except Exception as exception:
            print(f"Error handling message: {str(exception)}")
        finally:
            message_queue.task_done()
