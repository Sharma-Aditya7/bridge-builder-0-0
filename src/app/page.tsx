"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import JoinRoomForm from '../components/JoinRoomForm';
import { SocketProvider } from '../contexts/SocketContext';

export default function Home() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [userName, setUserName] = useState('');

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic && userName) {
      // Generate a simple room ID
      const roomId = Date.now().toString();
      // Store user name in session storage
      sessionStorage.setItem('userName', userName);
      // Navigate to the room
      router.push(`/mediation/${roomId}?topic=${encodeURIComponent(topic)}`);
    }
  };

  return (
    <SocketProvider>
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">AI-Powered Workplace Conflict Resolution</h1>
            <p className="mt-2 text-lg text-gray-600">Resolve workplace conflicts efficiently with the help of our AI mediator</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">How it works:</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Create a mediation room and share the link with the other person</li>
                <li>Both participants join the conversation</li>
                <li>Our AI mediator facilitates a productive discussion</li>
                <li>Work together toward a resolution with guidance from the AI</li>
              </ol>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Create a Mediation Room</h2>
              <form onSubmit={handleCreateRoom}>
                <div className="mb-4">
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                    What is the conflict about?
                  </label>
                  <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Brief description of the conflict"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                    Your name (visible to the other participant)
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                >
                  Create Mediation Room
                </button>
              </form>
            </div>
          </div>

          <JoinRoomForm />
        </div>
      </Layout>
    </SocketProvider>
  );
}