import { config } from "@/config/config.ts";
import { wsManager } from "@/lib/wsManager";
import { useCallback, useEffect } from "react";
import useWebSocket from "react-use-websocket";

const WS_URL = config.wsURL;

type MessageHanlder<T = object> = (data: T) => void;

const listeners = new Map<string, Set<MessageHanlder>>();
let lastDispatched: unknown = null; // add this

const useWS = () => {
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
    share: true,
    shouldReconnect: (_closeEvent) => {
      if (_closeEvent.code === 4001) {
        wsManager.blockReconnect();
        window.location.href = "/login";
        return false;
      }
      return wsManager.getShouldReconnect();
    },
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (!lastMessage || lastMessage === lastDispatched) return;
    lastDispatched = lastMessage;
    try {
      const { topic, payload } = JSON.parse(lastMessage.data) as { topic: string; payload: object };
      const handlers = listeners.get(topic);
      if (!handlers) return;
      handlers.forEach((handler) => handler(payload));
    } catch {
      /* ignore */
    }
  }, [lastMessage]);

  const subscribe = useCallback(<T = object>(topic: string, handler: MessageHanlder<T>) => {
    const wrappedHandler: MessageHanlder = (data) => handler(data as T);

    if (!listeners.has(topic)) {
      listeners.set(topic, new Set());
    }
    listeners.get(topic)!.add(wrappedHandler);

    return () => {
      const set = listeners.get(topic);
      if (set) {
        set.delete(wrappedHandler);
        if (set.size === 0) listeners.delete(topic);
      }
    };
  }, []);

  const publish = (topic: string, payload: unknown) => {
    sendJsonMessage({ topic, payload });
  };

  return { subscribe, publish, readyState };
};

export default useWS;
