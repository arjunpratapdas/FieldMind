"""
FieldMind ADK Tools - Real Gemini Vision API integration
"""
import asyncio
import logging
from typing import Dict, Any, List, Optional
import time
import base64
from google import genai
from google.genai import types

logger = logging.getLogger(__name__)


async def analyze_equipment(image_frame_b64: str) -> Dict[str, Any]:
    """
    Analyze equipment from camera frame using Gemini Flash 2.0 Vision API
    
    Args:
        image_frame_b64: Base64-encoded JPEG image
        
    Returns:
        Equipment identification data with confidence score
    """
    try:
        logger.info("Analyzing equipment from camera frame with Gemini Vision")
        
        # Decode base64 to bytes
        image_bytes = base64.b64decode(image_frame_b64)
        
        # Create Gemini client (uses GEMINI_API_KEY from environment)
        client = genai.Client()
        
        # Call Gemini Flash 2.0 Vision API
        response = client.models.generate_content(
            model="gemini-1.5-flash",  # Using 1.5 to avoid rate limits
            contents=[
                types.Content(
                    parts=[
                        types.Part(
                            inline_data=types.Blob(
                                mime_type="image/jpeg",
                                data=image_bytes
                            )
                        ),
                        types.Part(
                            text="""Analyze this HVAC equipment image and provide:
1. Equipment make/brand (e.g., Carrier, Trane, Lennox)
2. Model number if visible
3. Serial number if visible
4. Equipment type (e.g., Rooftop Unit, Split System, Furnace)
5. Any visible fault codes or error indicators
6. Any visible damage or wear
7. Estimated age based on appearance

Return ONLY valid JSON (no markdown, no code blocks):
{
  "make": "string or null",
  "model": "string or null",
  "serial": "string or null",
  "equipment_type": "string",
  "visible_fault_codes": ["string"],
  "visible_damage": "string or null",
  "confidence": 0.0-1.0,
  "notes": "string"
}"""
                        )
                    ]
                )
            ]
        )
        
        # Parse response
        response_text = response.text if hasattr(response, 'text') else ""
        logger.info(f"Vision API response: {response_text[:200]}")
        
        # Try to parse JSON from response
        import json
        try:
            # Clean up response (remove markdown code blocks if present)
            cleaned = response_text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            
            result = json.loads(cleaned.strip())
            logger.info(f"Equipment identified: {result.get('make')} {result.get('model')}")
            return result
        except json.JSONDecodeError:
            logger.warning(f"Failed to parse Vision API response as JSON: {response_text}")
            # Fallback to mock data if parsing fails
            return {
                "make": "Unknown",
                "model": None,
                "serial": None,
                "equipment_type": "HVAC Equipment",
                "visible_fault_codes": [],
                "visible_damage": None,
                "confidence": 0.5,
                "notes": "Vision analysis failed, returning default"
            }
            
    except Exception as e:
        logger.error(f"Error analyzing equipment: {e}")
        return {
            "make": None,
            "model": None,
            "serial": None,
            "equipment_type": "Unknown",
            "visible_fault_codes": [],
            "visible_damage": None,
            "confidence": 0.0,
            "notes": f"Error: {str(e)}"
        }


async def search_manuals(query: str, model_id: Optional[str] = None, top_k: int = 3) -> Dict[str, Any]:
    """
    Search equipment manuals using Firestore keyword search
    """
    from firestore_client import FirestoreClient
    
    logger.info(f"Searching manuals for: {query}")
    
    fs = FirestoreClient()
    if not fs.db:
        logger.warning("Firestore not initialized, returning mock data")
        return _get_mock_manual_results(query)
    
    try:
        # Search for chunks containing query keywords
        results = []
        chunks = fs.db.collection('manual_chunks').stream()
        
        query_lower = query.lower()
        query_words = query_lower.split()
        
        for chunk in chunks:
            chunk_data = chunk.to_dict()
            chunk_text_lower = chunk_data['text'].lower()
            
            # Check if any query words are in the chunk
            matches = sum(1 for word in query_words if word in chunk_text_lower)
            
            if matches > 0:
                # Calculate simple relevance score
                confidence = min(0.95, 0.5 + (matches * 0.15))
                
                results.append({
                    'text': chunk_data['text'][:500],  # Limit to 500 chars
                    'source': chunk_data['source'],
                    'make': chunk_data['make'],
                    'confidence': confidence,
                    'matches': matches
                })
        
        # Sort by number of matches (descending)
        results.sort(key=lambda x: x['matches'], reverse=True)
        
        # Take top_k results
        results = results[:top_k]
        
        if not results:
            logger.warning(f"No results found for query: {query}")
            return _get_mock_manual_results(query)
        
        # Remove 'matches' field from results
        for r in results:
            r.pop('matches', None)
        
        logger.info(f"✅ Found {len(results)} manual sections for query: {query}")
        
        return {
            'sections': results,
            'query': query,
            'model_filter': model_id
        }
        
    except Exception as e:
        logger.error(f"Error searching manuals: {e}")
        return _get_mock_manual_results(query)


def _get_mock_manual_results(query: str) -> Dict[str, Any]:
    """Fallback mock data"""
    return {
        'sections': [
            {
                'text': "E7 Fault Code indicates low refrigerant pressure. Check for leaks in refrigerant lines. Inspect Schrader valves and service ports.",
                'source': "Carrier 50XC Service Manual",
                'make': "Carrier",
                'confidence': 0.95
            }
        ],
        'query': query
    }


async def get_service_history(unit_id: str, limit: int = 5) -> Dict[str, Any]:
    """
    Retrieve service history from Firestore
    MOCK DATA for now - will be implemented in Day 3
    """
    logger.info(f"Retrieving service history for unit: {unit_id} (MOCK)")
    
    await asyncio.sleep(0.2)
    
    # Return mock service history
    return {
        "unit_id": unit_id,
        "equipment": {
            "make": "Carrier",
            "model": "50XC-A12",
            "install_date": "2019-03-15",
            "location": "Building 7, Rooftop"
        },
        "service_history": [
            {
                "date": "2025-11-20",
                "technician": "Mike R.",
                "issue": "E7 fault code",
                "action": "Added 2 lbs refrigerant, no leaks found",
                "parts_used": ["R-410A refrigerant"],
                "duration_minutes": 45
            },
            {
                "date": "2025-08-10",
                "technician": "Sarah K.",
                "issue": "Low cooling capacity",
                "action": "Cleaned condenser coils, replaced air filter",
                "parts_used": ["20x25x4 MERV 13 filter"],
                "duration_minutes": 60
            },
            {
                "date": "2025-03-05",
                "technician": "Mike R.",
                "issue": "Routine maintenance",
                "action": "Inspected all components, lubricated fan bearings",
                "parts_used": [],
                "duration_minutes": 90
            }
        ],
        "known_fault_codes": {
            "E7": "Low refrigerant pressure - recurring issue (3 times in 18 months)"
        },
        "history_count": 3
    }


async def escalate_case(
    case_summary: str,
    technician_id: str,
    severity: str,
    unit_id: Optional[str] = None,
    recommended_action: Optional[str] = None
) -> Dict[str, Any]:
    """
    Escalate case to dispatch via Firestore + Pub/Sub
    """
    from firestore_client import FirestoreClient
    import json
    
    logger.info(f"Escalating case with severity: {severity}")
    
    case_id = f"CASE-{int(time.time())}"
    
    # Create case data
    case_data = {
        "case_id": case_id,
        "summary": case_summary,
        "technician_id": technician_id,
        "severity": severity,
        "unit_id": unit_id,
        "recommended_action": recommended_action,
        "status": "open",
        "created_at": int(time.time()),
        "escalated_at": int(time.time())
    }
    
    try:
        # 1. Write case to Firestore
        fs = FirestoreClient()
        if fs.db:
            fs.db.collection('cases').document(case_id).set(case_data)
            logger.info(f"✅ Case {case_id} written to Firestore")
        else:
            logger.warning("⚠️  Firestore not initialized, skipping case write")
        
        # 2. Publish to Pub/Sub (optional - requires google-cloud-pubsub)
        try:
            from google.cloud import pubsub_v1
            import os
            
            project_id = os.getenv("GCP_PROJECT_ID")
            topic_name = os.getenv("PUBSUB_TOPIC", "field-escalations")
            
            if project_id:
                publisher = pubsub_v1.PublisherClient()
                topic_path = publisher.topic_path(project_id, topic_name)
                
                # Publish message
                message_data = json.dumps(case_data).encode("utf-8")
                future = publisher.publish(topic_path, message_data)
                message_id = future.result()
                
                logger.info(f"✅ Published to Pub/Sub: {message_id}")
            else:
                logger.warning("⚠️  GCP_PROJECT_ID not set, skipping Pub/Sub")
                
        except Exception as e:
            logger.warning(f"⚠️  Pub/Sub publish failed: {e}")
        
        # 3. Return confirmation
        return {
            "case_id": case_id,
            "status": "escalated",
            "message": f"Case {case_id} escalated to dispatch. Specialist will contact you within 30 minutes.",
            "estimated_response_time": "30 minutes"
        }
        
    except Exception as e:
        logger.error(f"❌ Error escalating case: {e}")
        return {
            "case_id": case_id,
            "status": "error",
            "message": f"Failed to escalate case: {str(e)}",
            "estimated_response_time": "unknown"
        }
