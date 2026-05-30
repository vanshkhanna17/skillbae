import { config } from "@/config/config.ts";
import { wsManager } from "@/lib/wsManager";
import { useEffect } from "react";
import useWebSocket from "react-use-websocket";

const WS_URL = config.wsURL;

type MessageHanlder = (data: unknown) => void;

const listeners = new Map<string, Set<MessageHanlder>>();

const useWS = () => {
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    share: true,
    shouldReconnect: (_closeEvent) => {
      if (_closeEvent.code === 4001){
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
    if (!lastJsonMessage) return;

    const { topic, payload } = lastJsonMessage as { topic: string; payload: unknown };
    const handlers = listeners.get(topic);
    if (!handlers) return;

    handlers.forEach((handler) => handler(payload));
  }, [lastJsonMessage]);

  const subscribe = (topic: string, handler: MessageHanlder) => {
    if (!listeners.has(topic)) {
      listeners.set(topic, new Set());
    }
    listeners.get(topic)!.add(handler);

    return () => {
      const set = listeners.get(topic);
      if (set) {
        set.delete(handler);
        if (set.size === 0) listeners.delete(topic);
      }
    };
  };

  const publish = (topic: string, payload: unknown) => {
    sendJsonMessage({ topic, payload });
  };

  return { subscribe, publish, readyState };
};

export default useWS;
