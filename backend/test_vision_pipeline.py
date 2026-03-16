import asyncio
import base64
from agent import FieldMindAgent

async def test():
    print("📷 Testing vision pipeline...")
    
    # Create agent
    agent = FieldMindAgent(session_id="test-vision")
    
    # Create a simple test image (1x1 pixel JPEG)
    # In real use, you'd load an actual HVAC equipment image
    test_image_b64 = "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
    
    # Process frame
    result = await agent.process_frame(test_image_b64)
    print(f"✅ Frame processed: {result['type']}")
    print(f"   Equipment: {result['data'].get('make')} {result['data'].get('model')}")
    print(f"   Confidence: {result['data'].get('confidence')}")

asyncio.run(test())
