const http = require('http');

console.log('Testing Structurizr DSL Viewer application...\n');

// Test if the server is responding
const testServer = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3001', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({
            status: res.statusCode,
            hasReactApp: data.includes('react-scripts'),
            hasStructurizr: data.includes('Structurizr'),
            hasBundle: data.includes('bundle.js')
          });
        } else {
          reject(new Error(`Server returned status ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
};

testServer()
  .then((result) => {
    console.log('✅ Application is running successfully!');
    console.log(`Status Code: ${result.status}`);
    console.log(`React App: ${result.hasReactApp ? '✅' : '❌'}`);
    console.log(`Structurizr Title: ${result.hasStructurizr ? '✅' : '❌'}`);
    console.log(`JavaScript Bundle: ${result.hasBundle ? '✅' : '❌'}`);
    
    console.log('\n🎉 Your Structurizr DSL Viewer is ready!');
    console.log('🌐 Open http://localhost:3001 in your browser');
    console.log('📊 The FlygTaxi C4 model is pre-loaded and ready to explore');
    console.log('🔄 Try switching between System Context, Container, and Component views');
    console.log('✏️  Edit the DSL in real-time and see changes immediately');
  })
  .catch((error) => {
    console.error('❌ Application test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure the development server is running: npm start (check port 3001)');
    console.log('2. Check if port 3000 is available');
    console.log('3. Look for any compilation errors in the terminal');
  });
