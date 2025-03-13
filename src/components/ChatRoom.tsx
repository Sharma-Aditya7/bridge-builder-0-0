"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

interface ChatRoomProps {
  roomId: string;
  userId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, userId }) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (socket && isConnected) {
      // Join the room
      socket.emit('join-room', roomId, userId);

      // Listen for new messages
      socket.on('new-message', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Listen for conversation history
      socket.on('conversation-history', (history: Message[]) => {
        setMessages(history);
      });

      return () => {
        socket.emit('leave-room', roomId, userId);
        socket.off('new-message');
        socket.off('conversation-history');
      };
    }
  }, [socket, isConnected, roomId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && socket && isConnected) {
      socket.emit('send-message', {
        roomId,
        message: messageInput,
        sender: userId
      });
      setMessageInput('');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] border rounded-lg overflow-hidden bg-white shadow">
      <div className="bg-indigo-600 text-white p-4">
        <h2 className="text-xl font-bold">Conflict Resolution Session</h2>
        <p className="text-sm">Room ID: {roomId}</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.sender === 'ai'
                ? 'bg-gray-100 rounded-lg p-3'
                : message.sender === userId
                ? 'bg-indigo-100 rounded-lg p-3 ml-auto'
                : 'bg-blue-100 rounded-lg p-3'
            } max-w-[75%]`}
          >
            <div className="font-bold">
              {message.sender === 'ai'
                ? 'AI Mediator'
                : message.sender === userId
                ? 'You'
                : 'Other Participant'}
            </div>
            <div>{message.content}</div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t p-4 bg-gray-50">
        <div className="flex">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
            disabled={!isConnected}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;