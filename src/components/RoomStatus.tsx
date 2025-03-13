"use client";

import React from 'react';
import { useSocket } from '../contexts/SocketContext';

interface RoomStatusProps {
  roomId: string;
  participants: number;
}

const RoomStatus: React.FC<RoomStatusProps> = ({ roomId, participants }) => {
  const { isConnected } = useSocket();
  
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
      <div className="flex items-center">
        <div className={`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-sm font-medium">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      <div className="text-sm">
        Room ID: <span className="font-mono">{roomId}</span>
      </div>
      <div className="text-sm">
        Participants: {participants}
      </div>
    </div>
  );
};

export default RoomStatus;