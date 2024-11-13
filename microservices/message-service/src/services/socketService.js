// socket.js
const socketIO = require('socket.io');
const Message = require('../models/message'); // Import the Message model

let io;

exports.initializeIO = (server) => {
  io = socketIO(server);

  // Handle socket.io events here, if any.
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    //Handle Joining a group chat
    socket.on('joinGroup' , (groupId)=>{
      socket.join(groupId);
      console.log('User joined group : ' , groupId);
    })

    //Handle leaving a group chat
    socket.on('leaveGroup' , (groupId)=>{
      socket.leave(groupId);
      console.log('User left Group :' , groupId);
    })


    socket.on('sendGroupMessage' , async (data)=>{
      try {
        const {groupId , message , sender} = data;

        //save the message to the database
        const newMessage = new Message({ sender , content : message , group : groupId});
        await newMessage.save()
        io.to(groupId).emit('receiveGroupMessage' , newMessage)
      } catch (error) {
        console.error('Error handling group message' , error.message)
      }
    })


    // Handle incoming messages
    socket.on('message', async (data) => {
      try {
        const { sender, recipient, content } = data;
        const newMessage = new Message({ sender, recipient, content });
        await newMessage.save();

        // Emit the message to the recipient
        socket.to(recipient).emit('message', data);
      } catch (error) {
        console.error('Error handling incoming message:', error.message);
      }
    })

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

exports.getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized.');
  }
  return io;
};
