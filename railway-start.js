// railway-start.js - COMPLETELY override the port for Railway
console.log('🚀 FORCING PORT 3000 for Railway deployment...');

const { TetraApplication } = require('./dist/application');

async function startApp() {
  try {
    // Create app with EXPLICIT port configuration
    const app = new TetraApplication({
      rest: {
        port: 3000,
        host: '0.0.0.0',
        openApiSpec: {
          disabled: true
        }
      }
    });

    await app.boot();
    await app.start();

    console.log('✅ Server successfully running on port 3000');
    console.log('🎉 Your Railway URL should appear in the dashboard now!');

  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

// Start the application
startApp();
