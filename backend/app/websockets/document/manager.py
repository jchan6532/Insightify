from fastapi import WebSocket
from typing import Dict, List
from functools import lru_cache

class Document_WebSocket_Manager:
    def __init__(self):
        self.connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.connections:
            self.connections.remove(websocket)

    async def notify(self, message: dict):
        dead: list[WebSocket] = []
        for ws in self.connections:
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
                
        for ws in dead:
            self.disconnect()


manager = Document_WebSocket_Manager()
