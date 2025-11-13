// debug.js - Check if your app starts properly
console.log('🔧 DEBUG: Starting application check...');
console.log('📊 PORT:', process.env.PORT);
console.log('📊 NODE_ENV:', process.env.NODE_ENV);

try {
  const { TetraApplication } = require('./dist/application');
  console.log('✅ Application module loaded successfully');

  const app = new TetraApplication({
    rest: {
      port: process.env.PORT || 3000,
      host: '0.0.0.0'
    }
  });

  app.boot().then(() => {
    app.start();
    console.log('🚀 Application started successfully');
  }).catch(err => {
    console.error('❌ Boot failed:', err);
  });

} catch (error) {
  console.error('❌ Failed to load application:', error);
}
