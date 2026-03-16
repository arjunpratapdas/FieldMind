"""
FieldMind Backend - FastAPI WebSocket Server
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import logging
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FieldMind Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

active_connections = {}
active_agents = {}


@app.get("/")
async def root():
    return {"status": "ok", "service": "FieldMind Backend"}


@app.get("/health")
async def health():
    return {"status": "healthy", "active_sessions": len(active_connections)}


@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    active_connections[session_id] = websocket
    logger.info(f"Client connected: {session_id}")

    # Lazy import agent to avoid startup crash
    agent = None
    try:
        from agent import FieldMindAgent
        agent = FieldMindAgent(session_id=session_id)
        active_agents[session_id] = agent
    except Exception as e:
        logger.error(f"Agent init failed: {e}")
        await websocket.send_json({"type": "error", "message": f"Agent init failed: {str(e)}"})

    try:
        await websocket.send_json({
            "type": "status",
            "data": "ready",
            "session_id": session_id,
            "timestamp": asyncio.get_event_loop().time()
        })

        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            msg_type = message.get("type")

            if msg_type == "ping":
                await websocket.send_json({
                    "type": "pong",
                    "session_id": session_id,
                    "timestamp": asyncio.get_event_loop().time()
                })

            elif msg_type == "audio_chunk":
                if not agent:
                    await websocket.send_json({"type": "error", "message": "Agent not initialized"})
                    continue
                audio_b64 = message.get("data") or message.get("payload")
                if not audio_b64:
                    continue
                response = await agent.process_audio(audio_b64)
                await websocket.send_json(response)

            elif msg_type == "camera_frame":
                if not agent:
                    continue
                frame_b64 = message.get("data") or message.get("payload")
                if not frame_b64:
                    continue
                response = await agent.process_frame(frame_b64)
                if response:
                    await websocket.send_json(response)

            elif msg_type == "session_start":
                await websocket.send_json({
                    "type": "session_ready",
                    "session_id": session_id,
                    "message": "FieldMind agent ready to assist"
                })

    except WebSocketDisconnect:
        logger.info(f"Client disconnected: {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error {session_id}: {e}")
    finally:
        active_connections.pop(session_id, None)
        active_agents.pop(session_id, None)
