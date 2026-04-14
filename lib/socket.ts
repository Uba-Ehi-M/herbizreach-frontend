import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(token?: string | null): Socket {
  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";
  if (!socket) {
    socket = io(`${base}/chat`, {
      auth: token ? { token } : undefined,
      transports: ["websocket", "polling"],
      autoConnect: false,
    });
  } else if (token) {
    socket.auth = { token };
  }
  return socket;
}

export function resetSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
