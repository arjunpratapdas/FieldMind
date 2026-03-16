"""
Cloud Function to send escalation emails via SendGrid
Triggered by Pub/Sub field-escalations topic
"""
import base64
import json
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


def send_escalation_email(event, context):
    """
    Triggered by Pub/Sub message
    Args:
        event: Pub/Sub message data
        context: Metadata for the event
    """
    # Decode Pub/Sub message
    pubsub_message = base64.b64decode(event['data']).decode('utf-8')
    case_data = json.loads(pubsub_message)
    
    # Extract case details
    case_id = case_data.get('case_id', 'UNKNOWN')
    summary = case_data.get('summary', 'No summary provided')
    severity = case_data.get('severity', 'medium')
    technician_id = case_data.get('technician_id', 'UNKNOWN')
    unit_id = case_data.get('unit_id', 'N/A')
    
    # Create email content
    subject = f"🚨 ESCALATION: {severity.upper()} - Case {case_id}"
    
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif;">
        <h2 style="color: #d32f2f;">Field Escalation Alert</h2>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
            <p><strong>Case ID:</strong> {case_id}</p>
            <p><strong>Severity:</strong> <span style="color: #d32f2f;">{severity.upper()}</span></p>
            <p><strong>Technician:</strong> {technician_id}</p>
            <p><strong>Unit ID:</strong> {unit_id}</p>
        </div>
        
        <h3>Summary:</h3>
        <p>{summary}</p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">
            This is an automated message from FieldMind AI Assistant.
        </p>
    </body>
    </html>
    """
    
    # Send email via SendGrid
    try:
        message = Mail(
            from_email=os.environ.get('SENDGRID_FROM_EMAIL'),
            to_emails=os.environ.get('DISPATCH_EMAIL'),
            subject=subject,
            html_content=html_content
        )
        
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        
        print(f"✅ Email sent successfully: {response.status_code}")
        print(f"   Case ID: {case_id}")
        print(f"   Severity: {severity}")
        
        return {'status': 'success', 'case_id': case_id}
        
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        return {'status': 'error', 'message': str(e)}
