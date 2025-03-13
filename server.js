const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// We'll use this to track active rooms and their messages
const rooms = new Map();

async function callAIMediatorAPI(messages, topic) {
  try {
    const response = await fetch('http://localhost:3000/api/mediator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, topic }),
    });
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling AI mediator API:', error);
    return "I'm experiencing technical difficulties. Let's try again in a moment.";
  }
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room: ${roomId}`);
      
      if (!rooms.has(roomId)) {
        rooms.set(roomId, {
          users: new Set([userId]),
          messages: []
        });
        
        // Send AI welcome message
        setTimeout(() => {
          const welcomeMessage = {
            sender: 'ai',
            content: 'Hello! I am your AI mediator. I'm here to help facilitate a constructive conversation. Could you both briefly explain what brought you here today?',
            timestamp: new Date()
          };
          
          rooms.get(roomId).messages.push(welcomeMessage);
          io.to(roomId).emit('new-message', welcomeMessage);
        }, 1000);
      } else {
        // Add user to existing room
        rooms.get(roomId).users.add(userId);
        
        // Send conversation history to new user
        socket.emit('conversation-history', rooms.get(roomId).messages);
      }
    });

    socket.on('leave-room', (roomId, userId) => {
      socket.leave(roomId);
      console.log(`User ${userId} left room: ${roomId}`);
      
      if (rooms.has(roomId)) {
        rooms.get(roomId).users.delete(userId);
        
        // If room is empty, remove it
        if (rooms.get(roomId).users.size === 0) {
          rooms.delete(roomId);
        }
      }
    });

    socket.on('send-message', async (data) => {
      const { roomId, message, sender, topic } = data;
      
      if (!rooms.has(roomId)) return;
      
      const newMessage = {
        sender,
        content: message,
        timestamp: new Date()
      };
      
      // Store message in room history
      rooms.get(roomId).messages.push(newMessage);
      
      // Emit message to all users in the room
      io.to(roomId).emit('new-message', newMessage);
      
      // Only respond with AI if the sender is not the AI
      if (sender !== 'ai') {
        // Give the AI a small delay to feel more natural
        setTimeout(async () => {
          try {
            // Get all messages in the conversation for context
            const allMessages = rooms.get(roomId).messages.map(msg => ({
              role: msg.sender === 'ai' ? 'assistant' : 'user',
              content: msg.content
            }));
            
            // Call AI mediator with conversation history
            const aiResponseContent = await callAIMediatorAPI(allMessages, topic || 'mediation');
            
            const aiResponse = {
              sender: 'ai',
              content: aiResponseContent,
              timestamp: new Date()
            };
            
            // Store AI response in room history
            rooms.get(roomId).messages.push(aiResponse);
            
            // Emit AI response to all users in the room
            io.to(roomId).emit('new-message', aiResponse);
          } catch (error) {
            console.error('Error generating AI response:', error);
            
            // Send error message to room
            const errorMessage = {
              sender: 'ai',
              content: "I'm experiencing technical difficulties. Let's try again in a moment.",
              timestamp: new Date()
            };
            
            rooms.get(roomId).messages.push(errorMessage);
            io.to(roomId).emit('new-message', errorMessage);
          }
        }, 1500);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});