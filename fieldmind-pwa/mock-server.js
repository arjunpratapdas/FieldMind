const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on('connection', (ws, req) => {
  const sessionId = req.url.split('/').pop();
  console.log(`[Mock Server] Client connected: ${sessionId}`);
  clients.set(sessionId, ws);

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      console.log(`[Mock Server] Received ${msg.type} from ${sessionId}`);

      // Simulate responses based on message type
      if (msg.type === 'session_start') {
        ws.send(JSON.stringify({
          type: 'status_update',
          session_id: sessionId,
          timestamp: Date.now(),
          data: { agent_status: 'idle' },
        }));
      }

      if (msg.type === 'audio_chunk') {
        // Simulate transcript response
        setTimeout(() => {
          ws.send(JSON.stringify({
            type: 'transcript',
            session_id: sessionId,
            timestamp: Date.now(),
            data: {
              text: 'Technician is speaking...',
              is_final: false,
              speaker: 'technician',
            },
          }));
        }, 500);

        // Simulate agent response
        setTimeout(() => {
          ws.send(JSON.stringify({
            type: 'agent_response',
            session_id: sessionId,
            timestamp: Date.now(),
            data: {
              text: 'I detected an HVAC unit. Running diagnostics...',
              is_final: true,
            },
          }));
        }, 2000);
      }

      if (msg.type === 'camera_frame') {
        // Simulate equipment identification
        setTimeout(() => {
          ws.send(JSON.stringify({
            type: 'equipment_identified',
            session_id: sessionId,
            timestamp: Date.now(),
            data: {
              make: 'Carrier',
              model: '25HNH648A003',
              serial: 'SN-2024-001',
              lastServiceDate: '2024-02-15',
              faultCodes: ['E001', 'E002'],
              confidence: 0.92,
            },
          }));
        }, 1500);
      }

      if (msg.type === 'ping') {
        ws.send(JSON.stringify({
          type: 'pong',
          session_id: sessionId,
          timestamp: Date.now(),
          data: {},
        }));
      }
    } catch (err) {
      console.error('[Mock Server] Error:', err);
    }
  });

  ws.on('close', () => {
    console.log(`[Mock Server] Client disconnected: ${sessionId}`);
    clients.delete(sessionId);
  });

  ws.on('error', (err) => {
    console.error(`[Mock Server] Error for ${sessionId}:`, err);
  });
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`[Mock Server] Running on ws://localhost:${PORT}/ws`);
});
