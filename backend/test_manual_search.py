import asyncio
from tools import search_manuals

async def test():
    print("🔍 Testing manual search...\n")
    
    # Test 1: Search for fault code
    print("Test 1: Searching for 'fault code'")
    results = await search_manuals("fault code", top_k=3)
    print(f"✅ Found {len(results['sections'])} results\n")
    for i, section in enumerate(results['sections'], 1):
        print(f"Result {i}:")
        print(f"  Source: {section['source']}")
        print(f"  Make: {section['make']}")
        print(f"  Confidence: {section['confidence']}")
        print(f"  Text: {section['text'][:150]}...\n")
    
    print("="*60 + "\n")
    
    # Test 2: Search for compressor
    print("Test 2: Searching for 'compressor'")
    results = await search_manuals("compressor", top_k=2)
    print(f"✅ Found {len(results['sections'])} results\n")
    for i, section in enumerate(results['sections'], 1):
        print(f"Result {i}:")
        print(f"  Source: {section['source']}")
        print(f"  Text: {section['text'][:150]}...\n")

asyncio.run(test())
