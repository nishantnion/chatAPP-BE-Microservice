const amqp = require("amqplib");

async function consumeMessageFromQueue() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "message-queue";
    await channel.assertQueue(queue, { durable: true });

    channel.consume(
      queue,
      (message) => {
        const content = message.content.toString();
        const parsedMessage = JSON.parse(content);
        console.log("Received message from the queue:", parsedMessage);

        channel.ack(message);
      },
      { noAck: false }
    );

    console.log("Waiting for messages...");
  } catch (error) {
    console.error("Error consuming messages from the queue:", error.message);
  }
}
consumeMessageFromQueue();

async function startUserDetailQueue() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const requestQueue = "user-detail-request-queue";
    const responseQueue = "user-detail-response-queue";

    // Create request queue
    await channel.assertQueue(requestQueue, { durable: true });

    // Consume user detail requests
    channel.consume(requestQueue, async (msg) => {
      if (msg) {
        const userId = msg.content.toString();
        const userDetails = await getUserDetailsById(userId);

        // Publish the user detail response to the response queue
        channel.sendToQueue(
          responseQueue,
          Buffer.from(JSON.stringify(userDetails)),
          {
            persistent: true,
            correlationId: msg.properties.correlationId,
          }
        );

        // Acknowledge the message
        channel.ack(msg);
      }
    });

    console.log("User detail queue is running");
  } catch (error) {
    console.error("Error starting user detail queue:", error.message);
  }
}

startUserDetailQueue();
