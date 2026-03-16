"""
FieldMind AI Agent - ADK Integration with Gemini Live API
"""
from google import genai
from google.genai import types
import os
from typing import Dict, Any, List, Optional
import logging
import base64
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Import your tools
from tools import analyze_equipment, search_manuals, get_service_history, escalate_case


class FieldMindAgent:
    """AI Agent using Gemini Live API with ADK"""
    
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.conversation_history = []
        self.equipment_context = None
        
        # Configure Gemini API with new client
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        
        # System prompt from PRD Section 7.1
        self.system_prompt = """You are FieldMind, an AI assistant for HVAC field technicians.

CORE RULES:
1. ALWAYS cite manual sections when providing technical guidance
2. Format citations as: [Manual: {make} {model}, Section {section}, Page {page}]
3. If no manual data available, say "I don't have manual data for this"
4. Be concise - technicians are in the field
5. Prioritize safety warnings
6. Use service history to inform diagnosis

CAPABILITIES:
- Identify equipment from camera (analyze_equipment tool)
- Search equipment manuals (search_manuals tool)
- Retrieve service history (get_service_history tool)
- Escalate complex cases (escalate_case tool)

WORKFLOW:
1. Greet technician, ask what they're working on
2. If they show equipment, use analyze_equipment
3. Search manuals for relevant troubleshooting steps
4. Check service history for patterns
5. Provide grounded, cited guidance
6. Escalate if beyond field repair scope"""

        # Initialize Gemini model (using stable version)
        self.model_id = "gemini-2.5-flash"
        
        # Create config
        self.config = types.GenerateContentConfig(
            system_instruction=self.system_prompt,
            temperature=0.7
        )
        
        logger.info(f"ADK Agent initialized for session: {session_id}")
    
    async def process_audio(self, audio_chunk_b64: str) -> Dict[str, Any]:
        """
        Process audio chunk from technician
        audio_chunk_b64: Base64-encoded PCM audio (16kHz, 16-bit, mono)
        """
        try:
            # Check if audio data is valid
            if not audio_chunk_b64 or audio_chunk_b64 == "":
                logger.warning(f"Empty audio chunk received for session {self.session_id}")
                return {
                    "type": "error",
                    "session_id": self.session_id,
                    "data": {"message": "Empty audio chunk"}
                }
            
            # Decode base64 audio
            audio_bytes = base64.b64decode(audio_chunk_b64)
            
            # Send to Gemini API
            # Note: For now, we'll use text-based interaction
            # Full audio streaming will be implemented with WebSocket in production
            response = self.client.models.generate_content(
                model=self.model_id,
                contents="Hello, I'm a field technician. Can you help me?",
                config=self.config
            )
            
            # Extract response
            transcript = response.text if hasattr(response, 'text') else "Audio processing ready"
            
            return {
                "type": "transcript",
                "session_id": self.session_id,
                "data": {
                    "text": transcript,
                    "is_final": True,
                    "speaker": "agent",
                    "tool_calls": []
                }
            }
            
        except Exception as e:
            logger.error(f"Error processing audio: {e}")
            return {
                "type": "error",
                "session_id": self.session_id,
                "data": {"message": str(e)}
            }
    
    async def process_frame(self, frame_data_b64: str) -> Optional[Dict[str, Any]]:
        """
        Process camera frame for equipment identification
        frame_data_b64: Base64-encoded JPEG image
        """
        try:
            # Call analyze_equipment tool
            equipment_data = await analyze_equipment(frame_data_b64)
            
            # Update context
            if equipment_data.get("confidence", 0) > 0.7:
                self.equipment_context = equipment_data
                logger.info(f"Equipment identified: {equipment_data.get('make')} {equipment_data.get('model')}")
            
            return {
                "type": "equipment_identified",
                "session_id": self.session_id,
                "data": equipment_data
            }
            
        except Exception as e:
            logger.error(f"Error processing frame: {e}")
            return None
    
    def update_equipment_context(self, equipment: Dict[str, Any]):
        """Update equipment context for the session"""
        self.equipment_context = equipment
        logger.info(f"Equipment context updated: {equipment.get('make')} {equipment.get('model')}")
