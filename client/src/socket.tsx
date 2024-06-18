import React, {
  createContext,
  useContext,
  useCallback,
  ReactNode,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import { SERVER_URL } from "./constants";
import { generateAuthHeader } from "./helpers/helper";

// Define the context type
interface SocketContextType {
  socket: Socket | null;
  initializeSocket: () => void;
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

// Custom hook to consume the initializeSocket function
export const useInitializeSocket = (): (() => void) => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useInitializeSocket must be used within a SocketProvider");
  }
  return context.initializeSocket;
};

interface SocketProviderProps {
  children: ReactNode;
}

// SocketProvider component
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const initializeSocket = useCallback(() => {
    const headers = generateAuthHeader();
    if (!socket) {
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
        console.log("Disconnected from server:", reason);
      });

      setSocket(s);
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, initializeSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
