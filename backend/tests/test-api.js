const http = require('http');
const { spawn } = require('child_process');

const endpoints = [
  '/api/reports/low-stock',
  '/api/reports/order-history',
  '/api/reports/customer-purchases/Ahmet',
  '/api/reports/category-stats',
  '/api/reports/revenue-ranking',
  '/api/reports/order-timing',
];

async function runTest() {
  const server = spawn('node', ['server.js'], { cwd: process.cwd() });

  server.stdout.on('data', (data) => {
    if (data.toString().includes('Server is running')) {
      console.log('Server started, running tests...');
      (async () => {
        for (const endpoint of endpoints) {
          await new Promise((resolve) => {
            http.get(`http://localhost:3000${endpoint}`, (res) => {
              let data = '';
              res.on('data', (chunk) => data += chunk);
              res.on('end', () => {
                console.log(`Testing ${endpoint}: ${res.statusCode === 200 ? '✅ PASS' : '❌ FAIL'} (${res.statusCode})`);
                resolve();
              });
            }).on('error', (err) => {
              console.log(`Testing ${endpoint}: ❌ ERROR (${err.message})`);
              resolve();
            });
          });
        }
        console.log('All tests completed. Shutting down server...');
        server.kill();
        process.exit(0);
      })();
    }
  });

  server.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
  });
}

runTest();
