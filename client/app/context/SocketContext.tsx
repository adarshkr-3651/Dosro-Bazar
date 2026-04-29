'use client'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (user && user._id) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      // If using Next.js rewrites (like /backend-api), we must connect to the 
      // backend port directly because Next.js rewrites don't support WebSockets.
      let socketUrl = apiUrl;
      if (apiUrl === "/backend-api" || apiUrl.startsWith("/")) {
        socketUrl = "http://localhost:5000";
      } else {
        socketUrl = apiUrl.replace(/\/api\/?$/, "");
      }

      console.log('[Socket] Initializing connection to:', socketUrl);
      const socket = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 10,
        timeout: 30000
      });

      socket.on('connect', () => {
        setIsConnected(true);
        socket.emit('joinUserRoom', user._id);
        console.log('[Socket] Connected! Joined room:', user._id);
      });

      socket.on('connect_error', (error) => {
        console.error('[Socket] Connection error:', error);
      });

      socket.on('disconnect', (reason) => {
        setIsConnected(false);
        console.log('[Socket] Disconnected:', reason);
      });

      socketRef.current = socket;

      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
