const Message = require("../models/message");
const mongoose = require("mongoose");
const { publishMessageToQueue } = require('../services/amqpService');
const axios = require('axios');


//=============================>>>>>>>>> TO SAVE NEW MESSAGE <<<<<<<<<<=====================================


exports.saveMessage = async (sender, recipient, content) => {
  // Check if a conversation between sender and recipient already exists
  const existingConversation = await Message.findOne({
    sender: sender,
    recipient: recipient
  });

  if (existingConversation) {
    // If a conversation exists, append the new message to the existing conversation
    console.log(existingConversation);
    existingConversation.messages.push({
      content: content,
      createdAt: Date.now()
    });
    await existingConversation.save();
    return existingConversation;
  }

  // If no existing conversation, create a new message document
  const newMessage = new Message({
    sender: sender,
    recipient: recipient,
    content: content
  });
  await newMessage.save();
  return newMessage;
};


//=============================>>>>>>>>> TO SEND MESSSAGE 1V1 <<<<<<<<<<=====================================


exports.sendMessage = async (req, res) => {
  try {
    const { sender, recipient, content } = req.body;

    if (!sender || !recipient || !content) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    console.log("Sending message...");
    const newMessage = await exports.saveMessage(sender, recipient, content);

    // Publish message data to RabbitMQ queue
    await publishMessageToQueue(newMessage);
    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ error: "Error sending message." });
  }
};



//=============================>>>>>>>>> TO GET MESSAGE <<<<<<<<<<=====================================


exports.getMessagesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    }).sort({ createdAt: 1 });

    // Fetch sender and recipient details concurrently using Promise.all
    const fetchUserDetails = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:9001/user/${userId}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching user details:", error.message);
        return null;
      }
    };

    const myMessages = await Promise.all(
      messages.map(async (message) => {
        const [senderDetails, recipientDetails] = await Promise.all([
          fetchUserDetails(message.sender),
          fetchUserDetails(message.recipient),
        ]);

        return {
          _id: message._id,
          messages: message.messages,
          createdAt: message.createdAt,
          sender: senderDetails,
          recipient: recipientDetails,
        };
      })
    );

    res.status(200).json(myMessages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ error: "Error fetching messages." });
  }
};