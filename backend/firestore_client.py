"""
Firestore Client for FieldMind
Handles equipment records, service history, and case management
"""
import logging
from typing import Dict, Any, List, Optional
from google.cloud import firestore
import os

logger = logging.getLogger(__name__)


class FirestoreClient:
    """Client for Firestore database operations"""
    
    def __init__(self):
        """Initialize Firestore client with credentials from environment"""
        try:
            # Firestore uses Application Default Credentials
            # Set GOOGLE_APPLICATION_CREDENTIALS environment variable to service account JSON path
            self.db = firestore.Client()
            logger.info("✅ Firestore client initialized successfully")
        except Exception as e:
            logger.error(f"❌ Failed to initialize Firestore: {e}")
            logger.warning("⚠️  Firestore operations will fail. Ensure GOOGLE_APPLICATION_CREDENTIALS is set.")
            self.db = None
    
    async def get_equipment(self, unit_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve equipment record by unit ID"""
        if not self.db:
            logger.warning("Firestore not initialized")
            return None
            
        try:
            logger.info(f"Fetching equipment: {unit_id}")
            doc = self.db.collection('equipment').document(unit_id).get()
            
            if doc.exists:
                logger.info(f"✅ Equipment found: {doc.id}")
                return doc.to_dict()
            else:
                logger.warning(f"⚠️  Equipment not found: {unit_id}")
                return None
                
        except Exception as e:
            logger.error(f"Error fetching equipment: {e}")
            return None
    
    async def get_service_history(self, unit_id: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Retrieve service history for equipment"""
        if not self.db:
            logger.warning("Firestore not initialized")
            return []
            
        try:
            logger.info(f"Fetching service history for: {unit_id}")
            docs = (
                self.db.collection('service_records')
                .where('unit_id', '==', unit_id)
                .order_by('date', direction=firestore.Query.DESCENDING)
                .limit(limit)
                .stream()
            )
            
            records = [doc.to_dict() for doc in docs]
            logger.info(f"✅ Found {len(records)} service records")
            return records
            
        except Exception as e:
            logger.error(f"Error fetching service history: {e}")
            return []
    
    async def create_case(self, case_data: Dict[str, Any]) -> str:
        """Create escalation case record"""
        if not self.db:
            logger.warning("Firestore not initialized")
            return "ERROR"
            
        try:
            logger.info(f"Creating case with severity: {case_data.get('severity')}")
            
            # Add timestamp
            import time
            case_data['created_at'] = int(time.time())
            case_data['status'] = 'open'
            
            # Generate case ID
            case_id = f"CASE-{case_data['created_at']}"
            case_data['case_id'] = case_id
            
            # Write to Firestore
            self.db.collection('cases').document(case_id).set(case_data)
            logger.info(f"✅ Case created: {case_id}")
            return case_id
            
        except Exception as e:
            logger.error(f"Error creating case: {e}")
            return "ERROR"
    
    async def get_fault_codes(self, make: str) -> Dict[str, Any]:
        """Retrieve fault code definitions for equipment make"""
        if not self.db:
            logger.warning("Firestore not initialized")
            return {}
            
        try:
            logger.info(f"Fetching fault codes for: {make}")
            doc = self.db.collection('fault_codes').document(make).get()
            
            if doc.exists:
                logger.info(f"✅ Fault codes found for {make}")
                return doc.to_dict()
            else:
                logger.warning(f"⚠️  No fault codes found for {make}")
                return {}
                
        except Exception as e:
            logger.error(f"Error fetching fault codes: {e}")
            return {}
