// railway-start.js - Force specific port
const { TetraApplication } = require('./dist/application');

async function start() {
  const app = new TetraApplication({
    rest: {
      port: 3000,
      host: '0.0.0.0'  // Critical for external access
    }
  });

  await app.boot();
  await app.start();
  console.log('✅ Running on port 3000');
}

start().catch(console.error);
