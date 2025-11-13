// railway-fix.js - Minimal working server
import express, { json, urlencoded } from 'express';
const app = express();
const PORT = 3000;

// Add basic middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// SIMPLE health check (always works)
app.get('/health', (req, res) => {
  console.log('✅ Health check called');
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Server is healthy'
  });
});

app.get('/ping', (req, res) => {
  res.json({
    greeting: 'Hello from Railway',
    date: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🏥 Health: http://0.0.0.0:${PORT}/health`);
  console.log(`📡 Ping: http://0.0.0.0:${PORT}/ping`);
});

// Try to start LoopBack in background (optional)
setTimeout(() => {
  try {
    const { TetraApplication } = require('./dist/application');
    const lbApp = new TetraApplication({
      rest: { port: 3001, host: '0.0.0.0' }
    });
    lbApp.boot().then(() => {
      lbApp.start();
      console.log('🔧 LoopBack running on port 3001');
    });
  } catch (error) {
    console.log('⚠️ LoopBack failed but Express server is running');
  }
}, 1000);
