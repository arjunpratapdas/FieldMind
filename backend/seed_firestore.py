"""
Seed Firestore with test data for FieldMind
Run with: python seed_firestore.py
"""
import asyncio
import logging
from datetime import datetime, timedelta
from firestore_client import FirestoreClient

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_firestore():
    """Seed Firestore with test data"""
    
    client = FirestoreClient()
    
    if not client.db:
        logger.error("❌ Firestore not initialized. Set GOOGLE_APPLICATION_CREDENTIALS environment variable.")
        return
    
    logger.info("🌱 Starting Firestore seeding...")
    
    # 1. Seed Equipment Records
    logger.info("\n📦 Seeding equipment records...")
    equipment_data = [
        {
            "unit_id": "UNIT-001",
            "make": "Carrier",
            "model": "50XC-A12",
            "serial": "CAR-2019-001234",
            "equipment_type": "Rooftop Unit",
            "install_date": "2019-03-15",
            "location": "Building 7, Rooftop",
            "capacity_tons": 5,
            "refrigerant": "R-410A",
            "last_service": "2025-11-20",
            "status": "active"
        },
        {
            "unit_id": "UNIT-002",
            "make": "Trane",
            "model": "XR15",
            "serial": "TRN-2020-005678",
            "equipment_type": "Split System",
            "install_date": "2020-06-10",
            "location": "Building 3, Floor 2",
            "capacity_tons": 3,
            "refrigerant": "R-410A",
            "last_service": "2025-10-15",
            "status": "active"
        },
        {
            "unit_id": "UNIT-003",
            "make": "Lennox",
            "model": "XC21",
            "serial": "LNX-2021-009012",
            "equipment_type": "Furnace",
            "install_date": "2021-01-20",
            "location": "Building 5, Basement",
            "capacity_tons": 4,
            "refrigerant": "R-410A",
            "last_service": "2025-09-05",
            "status": "active"
        }
    ]
    
    for equipment in equipment_data:
        try:
            client.db.collection('equipment').document(equipment['unit_id']).set(equipment)
            logger.info(f"✅ Equipment created: {equipment['unit_id']} ({equipment['make']} {equipment['model']})")
        except Exception as e:
            logger.error(f"❌ Error creating equipment {equipment['unit_id']}: {e}")
    
    # 2. Seed Service Records
    logger.info("\n🔧 Seeding service records...")
    service_records = [
        {
            "unit_id": "UNIT-001",
            "date": int((datetime.now() - timedelta(days=117)).timestamp()),
            "technician": "Mike R.",
            "issue": "E7 fault code",
            "action": "Added 2 lbs refrigerant, no leaks found",
            "parts_used": ["R-410A refrigerant"],
            "duration_minutes": 45,
            "notes": "Low pressure detected. Checked all connections."
        },
        {
            "unit_id": "UNIT-001",
            "date": int((datetime.now() - timedelta(days=163)).timestamp()),
            "technician": "Sarah K.",
            "issue": "Low cooling capacity",
            "action": "Cleaned condenser coils, replaced air filter",
            "parts_used": ["20x25x4 MERV 13 filter"],
            "duration_minutes": 60,
            "notes": "Coils were heavily fouled. Airflow improved significantly."
        },
        {
            "unit_id": "UNIT-001",
            "date": int((datetime.now() - timedelta(days=377)).timestamp()),
            "technician": "Mike R.",
            "issue": "Routine maintenance",
            "action": "Inspected all components, lubricated fan bearings",
            "parts_used": [],
            "duration_minutes": 90,
            "notes": "All components in good condition. No issues found."
        },
        {
            "unit_id": "UNIT-002",
            "date": int((datetime.now() - timedelta(days=153)).timestamp()),
            "technician": "John D.",
            "issue": "Compressor not starting",
            "action": "Replaced capacitor, verified electrical connections",
            "parts_used": ["Run capacitor 45µF"],
            "duration_minutes": 75,
            "notes": "Capacitor was faulty. Compressor now running smoothly."
        },
        {
            "unit_id": "UNIT-003",
            "date": int((datetime.now() - timedelta(days=193)).timestamp()),
            "technician": "Sarah K.",
            "issue": "Blower motor noise",
            "action": "Replaced blower motor bearings",
            "parts_used": ["Blower motor bearing kit"],
            "duration_minutes": 120,
            "notes": "Motor was making grinding noise. New bearings installed."
        }
    ]
    
    for record in service_records:
        try:
            client.db.collection('service_records').add(record)
            logger.info(f"✅ Service record created for {record['unit_id']}: {record['issue']}")
        except Exception as e:
            logger.error(f"❌ Error creating service record: {e}")
    
    # 3. Seed Fault Codes
    logger.info("\n⚠️  Seeding fault codes...")
    fault_codes = {
        "Carrier": {
            "E7": {
                "code": "E7",
                "description": "Low refrigerant pressure",
                "severity": "high",
                "common_causes": ["Refrigerant leak", "Blocked expansion valve", "Dirty evaporator coil"],
                "troubleshooting": [
                    "Check for visible leaks in refrigerant lines",
                    "Inspect Schrader valves and service ports",
                    "Clean evaporator coils if dirty",
                    "Verify compressor operation"
                ]
            },
            "E8": {
                "code": "E8",
                "description": "High refrigerant pressure",
                "severity": "high",
                "common_causes": ["Condenser fan failure", "Blocked condenser", "Overcharge"],
                "troubleshooting": [
                    "Check condenser fan operation",
                    "Clean condenser coils",
                    "Verify refrigerant charge level"
                ]
            },
            "E9": {
                "code": "E9",
                "description": "Compressor overload",
                "severity": "medium",
                "common_causes": ["High head pressure", "Compressor failure", "Electrical issue"],
                "troubleshooting": [
                    "Check head pressure",
                    "Verify electrical connections",
                    "Test compressor windings"
                ]
            }
        },
        "Trane": {
            "F1": {
                "code": "F1",
                "description": "Outdoor temperature sensor failure",
                "severity": "medium",
                "common_causes": ["Sensor malfunction", "Wiring issue", "Control board failure"],
                "troubleshooting": [
                    "Check sensor resistance",
                    "Verify wiring connections",
                    "Test control board"
                ]
            },
            "F2": {
                "code": "F2",
                "description": "Indoor temperature sensor failure",
                "severity": "medium",
                "common_causes": ["Sensor malfunction", "Wiring issue", "Control board failure"],
                "troubleshooting": [
                    "Check sensor resistance",
                    "Verify wiring connections",
                    "Test control board"
                ]
            },
            "F3": {
                "code": "F3",
                "description": "Compressor discharge temperature high",
                "severity": "high",
                "common_causes": ["High head pressure", "Refrigerant overcharge", "Compressor failure"],
                "troubleshooting": [
                    "Check head pressure",
                    "Verify refrigerant charge",
                    "Inspect compressor"
                ]
            }
        },
        "Lennox": {
            "L1": {
                "code": "L1",
                "description": "Flame sensor failure",
                "severity": "high",
                "common_causes": ["Dirty sensor", "Wiring issue", "Control board failure"],
                "troubleshooting": [
                    "Clean flame sensor",
                    "Check wiring connections",
                    "Test control board"
                ]
            },
            "L2": {
                "code": "L2",
                "description": "Ignition failure",
                "severity": "high",
                "common_causes": ["Igniter failure", "Gas supply issue", "Control board failure"],
                "troubleshooting": [
                    "Check igniter resistance",
                    "Verify gas supply",
                    "Test control board"
                ]
            },
            "L3": {
                "code": "L3",
                "description": "Pressure switch failure",
                "severity": "medium",
                "common_causes": ["Switch malfunction", "Wiring issue", "Ductwork blockage"],
                "troubleshooting": [
                    "Check switch operation",
                    "Verify wiring connections",
                    "Inspect ductwork for blockages"
                ]
            }
        }
    }
    
    for make, codes in fault_codes.items():
        try:
            client.db.collection('fault_codes').document(make).set(codes)
            logger.info(f"✅ Fault codes created for {make} ({len(codes)} codes)")
        except Exception as e:
            logger.error(f"❌ Error creating fault codes for {make}: {e}")
    
    logger.info("\n✅ Firestore seeding complete!")
    logger.info("📊 Summary:")
    logger.info(f"   - Equipment records: {len(equipment_data)}")
    logger.info(f"   - Service records: {len(service_records)}")
    logger.info(f"   - Fault code sets: {len(fault_codes)}")
    logger.info(f"   - Total fault codes: {sum(len(codes) for codes in fault_codes.values())}")


if __name__ == "__main__":
    asyncio.run(seed_firestore())
