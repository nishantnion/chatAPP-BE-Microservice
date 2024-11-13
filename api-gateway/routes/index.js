// api-gateway.js

const gateway = require('fast-gateway');
const cors = require('cors');

const PORT = process.env.PORT || 9001;

const server = gateway({
  middlewares: [cors()],
  routes: [
    {
      prefix: '/user',
      target: 'http://localhost:3001',
    },
    {
      prefix: '/message',
      target: 'http://localhost:3002',
    },
  ],
});

server.start(PORT).then(() => {
  console.log(`API Gateway is running at http://localhost:${PORT}`);
});
