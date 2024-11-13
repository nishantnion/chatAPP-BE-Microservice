// // user-service.js
// const amqp = require('amqplib');
// const rabbitmqUrl = 'amqp://localhost'; // Replace with your RabbitMQ URL
// const User = require('../models/user')



// async function publishAllUsersToQueue() {
//   try {
//     const connection = await amqp.connect(rabbitmqUrl);
//     const channel = await connection.createChannel();
//     const eventQueue = 'user-registration-events' + Math.random();

//     // Fetch all users from the database
//     const users = await User.find();

//     // Create an array of user details without passwords
//     const usersData = users.map((user) => ({
//       userId: user._id,
//       username: user.username, 
//       email: user.email,
//       name : user.name,
//       profile : user.profilePicture,
//       bio: user.bio,
//     }));
//     console.log(usersData);

//     // Create a temporary response queue for the server to reply to
//     const responseQueue = await channel.assertQueue(eventQueue, { exclusive: true });

//     // Publish the user details array to the queue with reply-to
//     channel.sendToQueue(
//       eventQueue,
//       Buffer.from(JSON.stringify(usersData)),
//       {
//         persistent: true,
//         replyTo: responseQueue.queue,
//       }
//     );

//     console.log('All user details published to queue.');

//     connection.close();
//   } catch (error) {
//     console.error('Error publishing all users to queue:', error.message);
//   }
// }

// module.exports = { publishAllUsersToQueue };
