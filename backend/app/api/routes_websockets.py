from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websockets.document.manager import manager

router = APIRouter(    
    prefix="/websockets", 
    tags=["websockets"]
)

@router.websocket("/documents")
async def document_websocket(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)