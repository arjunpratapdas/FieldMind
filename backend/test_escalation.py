"""
Test escalation pipeline
"""
import asyncio
from tools import escalate_case

async def test():
    print("🚨 Testing escalation pipeline...\n")
    
    # Test escalation
    result = await escalate_case(
        case_summary="Compressor failure on Carrier 50XC-A12. Unit not cooling. Requires immediate replacement.",
        technician_id="TECH-001",
        severity="high",
        unit_id="UNIT-001",
        recommended_action="Replace compressor or entire unit"
    )
    
    print(f"✅ Escalation result:")
    print(f"   Case ID: {result['case_id']}")
    print(f"   Status: {result['status']}")
    print(f"   Message: {result['message']}")
    print(f"   Response time: {result['estimated_response_time']}")
    
    print("\n📋 Next steps:")
    print("   1. Check Firestore Console for case record")
    print("   2. Check Pub/Sub Console for message")
    print("   3. Verify case was created successfully")

asyncio.run(test())
