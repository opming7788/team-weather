from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Set, Dict
import asyncio
import json

router = APIRouter()

connected_sockets: Set[WebSocket] = set()
message_queue: asyncio.Queue = asyncio.Queue()
typing_users: Set[str] = set()

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
            elif message_type == "typing":
                await handle_typing_status(data["data"])
        
        except json.JSONDecodeError:
            print(f"Invalid JSON received: {message}")
        except Exception as exception:
            print(f"Error handling message: {str(exception)}")
        finally:
            message_queue.task_done()

async def handle_typing_status(data: Dict):
    name = data["name"]
    # print(name)
    is_typing = data["isTyping"]
    # print(is_typing)
    if is_typing:
        typing_users.add(name)
    else:
        typing_users.discard(name)
    
    await broadcast_typing_feedback()

async def broadcast_typing_feedback():
    if len(typing_users) == 0:
        feedback = ""
    elif len(typing_users) == 1:
        feedback = f"{list(typing_users)[0]} 正在輸入..."
    else:
        feedback = "多人輸入中..."
    # print(feedback)
    for socket in connected_sockets:
        await socket.send_json({
            "type": "feedback",
            "data": {"feedback": feedback},
            "name": list(typing_users)[0] if typing_users else ""
        })