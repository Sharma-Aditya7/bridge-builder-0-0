"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Layout from '../../../components/Layout';
import ChatRoom from '../../../components/ChatRoom';
import RoomStatus from '../../../components/RoomStatus';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { SocketProvider } from '../../../contexts/SocketContext';

export default function MediationRoom() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [participants, setParticipants] = useState<number>(1);
  const roomId = params.roomId as string;

  useEffect(() => {
    // Get user name from session storage
    const userName = sessionStorage.getItem('userName') || `User-${Date.now().toString().slice(-4)}`;
    setUserId(userName);
    
    // Get topic from URL query parameter
    const topicParam = searchParams.get('topic');
    setTopic(topicParam || 'Workplace Conflict');
  }, [searchParams]);

  // Listen for participant updates from socket.io
  useEffect(() => {
    const handleParticipantUpdate = (count: number) => {
      setParticipants(count);
    };
    
    // This would be implemented in your socket.io server
    // socket.on('participant-count', handleParticipantUpdate);
    
    // For now, just simulate one other participant
    const timer = setTimeout(() => {
      setParticipants(2);
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      // socket.off('participant-count', handleParticipantUpdate);
    };
  }, []);

  if (!userId) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <SocketProvider>
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Mediation Session: {topic}</h1>
            <p className="text-sm text-gray-600 mb-2">
              Share this URL with the other participant to invite them to this mediation session.
            </p>
            <div className="bg-gray-100 p-2 rounded-md font-mono text-sm">
              {typeof window !== 'undefined' ? window.location.href : ''}
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden shadow-md">
            <RoomStatus roomId={roomId} participants={participants} />
            
            {userId && (
              <ChatRoom roomId={roomId} userId={userId} />
            )}
          </div>
        </div>
      </Layout>
    </SocketProvider>
  );
}