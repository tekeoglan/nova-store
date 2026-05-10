const http = require('http');
const { spawn } = require('child_process');

async function request(options, data = null) {
  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(body || '{}') }));
    });
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTest() {
  const server = spawn('node', ['server.js'], { cwd: process.cwd() });

  server.stdout.on('data', async (data) => {
    if (data.toString().includes('Server is running')) {
      console.log('Server started, testing auth flow...');
      
      try {
        // 1. Register
        const regRes = await request({
          hostname: 'localhost', port: 3000, path: '/api/auth/register', method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }, { username: 'testuser', password: 'password123' });
        console.log(`Register: ${regRes.statusCode === 201 ? '✅' : '❌'}`);

        // 2. Login
        const loginRes = await request({
          hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }, { username: 'testuser', password: 'password123' });
        console.log(`Login: ${loginRes.statusCode === 200 ? '✅' : '❌'}`);
        const token = loginRes.body.token;

        // 3. Access Report without token
        const reportNoToken = await request({
          hostname: 'localhost', port: 3000, path: '/api/reports/low-stock', method: 'GET'
        });
        console.log(`Report (no token): ${reportNoToken.statusCode === 401 ? '✅ (Blocked)' : '❌ (Allowed)'}`);

        // 4. Access Report with token
        const reportWithToken = await request({
          hostname: 'localhost', port: 3000, path: '/api/reports/low-stock', method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`Report (with token): ${reportWithToken.statusCode === 200 ? '✅' : '❌'}`);

      } catch (e) {
        console.error('Test Error:', e);
      } finally {
        console.log('Auth tests completed. Shutting down...');
        server.kill();
        process.exit(0);
      }
    }
  });
}

runTest();
