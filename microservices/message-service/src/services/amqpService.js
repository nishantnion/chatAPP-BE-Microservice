const amqp = require("amqplib");
const rabbitmqUrl = "amqp://localhost";

// Function to publish message data to the message queue
async function publishMessageToQueue(message) {
  try {
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();

    const queue = "message-queue";
    await channel.assertQueue(queue, { durable: true });

    const messageData = JSON.stringify(message);
    channel.sendToQueue(queue, Buffer.from(messageData), { persistent: true });

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error publishing message to the queue:", error.message);
  }
}


module.exports = {
  publishMessageToQueue,
};
