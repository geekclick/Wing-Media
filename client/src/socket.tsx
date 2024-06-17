import React, { createContext, useMemo, useContext, ReactNode } from "react";
import io, { Socket } from "socket.io-client";
import { SERVER_URL } from "./constants";
import { generateAuthHeader } from "./helpers/helper";

// Define the context type
interface SocketContextType {
  socket: Socket | null;
}

// Create a context with an initial value of null
const SocketContext = createContext<SocketContextType | null>(null);
// Custom hook to consume the SocketContext
export const useSocket = (): Socket | null => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context.socket;
};

interface SocketProviderProps {
  children: ReactNode;
}

// SocketProvider component
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const headers = useMemo(() => generateAuthHeader(), []);
  const socket =
    localStorage.getItem("token") != null
      ? useMemo<Socket>(() => {
          const s = io(SERVER_URL, {
            extraHeaders: headers,
          });

          s.on("connect", () => {
            console.log("Connected to server");
          });

          s.on("connect_error", (error) => {
            console.error("Connection error:", error);
          });

          s.on("disconnect", (reason) => {
            socket?.disconnect();
            console.log("Disconnected from server:", reason);
          });

          return s;
        }, [])
      : null;
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
