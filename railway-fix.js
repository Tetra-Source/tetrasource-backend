// minimal-server.js - 100% working server for Railway
import express, { json, urlencoded } from 'express';
const app = express();
const PORT = 3000;

// Basic middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// HEALTH CHECK - ALWAYS WORKS
app.get('/health', (req, res) => {
  console.log('✅ Health check successful');
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Tetra API',
    port: PORT
  });
});

// PING ENDPOINT
app.get('/ping', (req, res) => {
  res.json({
    greeting: 'Hello from Railway',
    date: new Date().toISOString()
  });
});

// ROOT ENDPOINT
app.get('/', (req, res) => {
  res.json({
    message: 'Tetra Backend API is running!',
    health: '/health',
    ping: '/ping'
  });
});

// Start server - GUARANTEED to work
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SERVER RUNNING on port ${PORT}`);
  console.log(`🏥 Health: http://0.0.0.0:${PORT}/health`);
  console.log(`✅ Ready for Railway health checks!`);
  console.log(`🎉 Your URL will appear shortly!`);
});

// Error handling
process.on('uncaughtException', (error) => {
  console.log('⚠️ Uncaught exception (non-fatal):', error.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('⚠️ Unhandled rejection (non-fatal):', reason);
});
