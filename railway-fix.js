// force-port.js - COMPLETELY override port configuration
console.log('🚀 FORCING PORT 3000 for Railway...');

// Set the port BEFORE loading anything else
process.env.PORT = '3000';

const { TetraApplication } = require('./dist/application');

async function startApp() {
  console.log('🔧 Creating app with EXPLICIT port 3000...');

  const app = new TetraApplication({
    rest: {
      port: 3000,           // EXPLICITLY set port
      host: '0.0.0.0',      // EXPLICITLY set host
      openApiSpec: {
        disabled: true
      }
    }
  });

  await app.boot();
  await app.start();

  console.log('✅ SUCCESS: Server running on port 3000');
  console.log('🎉 Railway URL should appear now!');
}

startApp().catch(error => {
  console.error('❌ FAILED:', error);
  process.exit(1);
});
