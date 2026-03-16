import { useState, useRef, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  ConnectionStatus,
  WsOutboundMessage,
  WsInboundMessage,
  UseWebSocketReturn,
} from '../types';

const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 15000]; // exponential backoff
const PING_INTERVAL = 20000; // 20s keepalive

/**
 * useWebSocket
 * Manages a persistent WebSocket connection to the FieldMind backend.
 * Handles auto-reconnect with exponential backoff, ping/pong keepalive,
 * and message queuing for messages sent while disconnected.
 */
export function useWebSocket(): UseWebSocketReturn {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WsInboundMessage | null>(null);
  const [sessionId] = useState<string>(() => uuidv4());

  const wsRef = useRef<WebSocket | null>(null);
  const urlRef = useRef<string>('');
  const reconnectAttemptRef = useRef<number>(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messageQueueRef = useRef<WsOutboundMessage[]>([]);
  const isIntentionalClose = useRef<boolean>(false);

  const clearTimers = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (pingTimerRef.current) {
      clearInterval(pingTimerRef.current);
      pingTimerRef.current = null;
    }
  }, []);

  const flushQueue = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    while (messageQueueRef.current.length > 0) {
      const msg = messageQueueRef.current.shift();
      if (msg) wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const startPing = useCallback(() => {
    pingTimerRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const ping: WsOutboundMessage = {
          type: 'ping',
          session_id: sessionId,
          timestamp: Date.now(),
          payload: '',
        };
        wsRef.current.send(JSON.stringify(ping));
      }
    }, PING_INTERVAL);
  }, [sessionId]);

  const connectInternal = useCallback(
    (url: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      setStatus(
        reconnectAttemptRef.current > 0 ? 'reconnecting' : 'connecting'
      );

      try {
        const ws = new WebSocket(`${url}/${sessionId}`);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('[FieldMind WS] Connected — session:', sessionId);
          reconnectAttemptRef.current = 0;
          setStatus('connected');
          startPing();
          flushQueue();

          // Send session start
          const sessionStart: WsOutboundMessage = {
            type: 'session_start',
            session_id: sessionId,
            timestamp: Date.now(),
            payload: '',
            metadata: { ua: navigator.userAgent },
          };
          ws.send(JSON.stringify(sessionStart));
        };

        ws.onmessage = (event) => {
          try {
            const msg: WsInboundMessage = JSON.parse(event.data);
            setLastMessage(msg);
          } catch (err) {
            console.warn('[FieldMind WS] Failed to parse message:', err);
          }
        };

        ws.onerror = (err) => {
          console.error('[FieldMind WS] Error:', err);
          setStatus('error');
        };

        ws.onclose = (event) => {
          clearTimers();
          console.log('[FieldMind WS] Closed:', event.code, event.reason);

          if (isIntentionalClose.current) {
            setStatus('disconnected');
            return;
          }

          // Auto-reconnect
          const delay =
            RECONNECT_DELAYS[
              Math.min(
                reconnectAttemptRef.current,
                RECONNECT_DELAYS.length - 1
              )
            ];
          reconnectAttemptRef.current += 1;
          console.log(
            `[FieldMind WS] Reconnecting in ${delay}ms (attempt ${reconnectAttemptRef.current})`
          );
          setStatus('reconnecting');
          reconnectTimerRef.current = setTimeout(() => {
            connectInternal(urlRef.current);
          }, delay);
        };
      } catch (err) {
        console.error('[FieldMind WS] Failed to create WebSocket:', err);
        setStatus('error');
      }
    },
    [sessionId, startPing, flushQueue, clearTimers]
  );

  const connect = useCallback(
    (url: string) => {
      isIntentionalClose.current = false;
      reconnectAttemptRef.current = 0;
      urlRef.current = url;
      connectInternal(url);
    },
    [connectInternal]
  );

  const disconnect = useCallback(() => {
    isIntentionalClose.current = true;
    clearTimers();
    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnected');
      wsRef.current = null;
    }
    setStatus('disconnected');
  }, [clearTimers]);

  const send = useCallback(
    (message: WsOutboundMessage) => {
      const enriched: WsOutboundMessage = {
        ...message,
        session_id: sessionId,
        timestamp: Date.now(),
      };

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(enriched));
      } else {
        // Queue for when we reconnect (cap at 50 messages to avoid memory bloat)
        if (messageQueueRef.current.length < 50) {
          messageQueueRef.current.push(enriched);
        }
      }
    },
    [sessionId]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isIntentionalClose.current = true;
      clearTimers();
      wsRef.current?.close(1000, 'Component unmounted');
    };
  }, [clearTimers]);

  return { status, send, lastMessage, sessionId, connect, disconnect };
}

// ─── Utility: generate a UUID ─────────────────────────────────────────────────
// Using uuid package for v4 UUID generation
