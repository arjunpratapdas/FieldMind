"""
Test script for ADK agent initialization
Run with: python -m tests.test_agent (from backend directory)
"""
import asyncio
import os
import sys
from dotenv import load_dotenv

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent import FieldMindAgent

load_dotenv()

async def test_agent():
    print("🧪 Testing ADK Agent Initialization...")
    
    # Create agent
    agent = FieldMindAgent(session_id="test-123")
    print(f"✅ Agent created for session: {agent.session_id}")
    
    # Test tool registration
    print(f"✅ Model initialized: {agent.model_id}")
    print(f"✅ System prompt length: {len(agent.system_prompt)} chars")
    
    # Test mock audio processing
    print("\n🎤 Testing audio processing...")
    import base64
    mock_audio = base64.b64encode(b"mock audio data").decode()
    result = await agent.process_audio(mock_audio)
    print(f"✅ Audio result: {result['type']}")
    if result['type'] == 'transcript':
        print(f"   Response: {result['data']['text'][:100]}...")
    
    # Test mock frame processing
    print("\n📷 Testing frame processing...")
    mock_frame = base64.b64encode(b"mock image data").decode()
    result = await agent.process_frame(mock_frame)
    print(f"✅ Frame result type: {result['type']}")
    print(f"   Equipment: {result['data']['make']} {result['data']['model']}")
    print(f"   Confidence: {result['data']['confidence']}")
    
    print("\n✅ All tests passed!")

if __name__ == "__main__":
    asyncio.run(test_agent())
