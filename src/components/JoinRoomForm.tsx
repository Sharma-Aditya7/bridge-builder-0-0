"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const JoinRoomForm: React.FC = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId && userName) {
      // Store user name in session storage
      sessionStorage.setItem('userName', userName);
      // Navigate to the room
      router.push(`/mediation/${roomId}`);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 my-6">
      <h2 className="text-xl font-semibold mb-4">Join Existing Mediation</h2>
      <form onSubmit={handleJoinRoom}>
        <div className="mb-4">
          <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
            Room ID
          </label>
          <input
            type="text"
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter the room ID"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="joinUserName" className="block text-sm font-medium text-gray-700 mb-1">
            Your name (visible to other participants)
          </label>
          <input
            type="text"
            id="joinUserName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Join Mediation
        </button>
      </form>
    </div>
  );
};

export default JoinRoomForm;