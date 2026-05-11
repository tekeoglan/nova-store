const http = require('http');
const { spawn } = require('child_process');

const server = spawn('node', ['../server.js'], { cwd: __dirname, stdio: 'pipe' });

server.stdout.on('data', async (d) => {
  if (d.toString().includes('Server is running')) {
    console.log('Server started, testing auth flow...\n');

    const req = (opts, data) => new Promise((res, rej) => {
      const r = http.request(opts, (resp) => {
        let b = '';
        resp.on('data', c => b += c);
        resp.on('end', () => {
          try { res({ s: resp.statusCode, b: JSON.parse(b || '{}') }); }
          catch { res({ s: resp.statusCode, b: b }); }
        });
      });
      r.on('error', rej);
      if (data) r.write(JSON.stringify(data));
      r.end();
    });

    try {
      const reg = await req(
        { hostname: 'localhost', port: 8080, path: '/api/auth/signup', method: 'POST', headers: { 'Content-Type': 'application/json' } },
        { username: 'testuser4', password: 'pass123', fullName: 'Test User', email: 'testuser4@example.com' }
      );
      console.log('Register:', reg.s === 201 ? '✅ PASS' : '❌ FAIL', reg.b);

      const login = await req(
        { hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
        { username: 'testuser4', password: 'pass123' }
      );
      console.log('Login:', login.s === 200 ? '✅ PASS' : '❌ FAIL', login.b.token ? '(token received)' : login.b);
    } catch (e) {
      console.error('Test Error:', e.message);
    } finally {
      server.kill();
      process.exit(0);
    }
  }
});

server.stderr.on('data', d => console.error('SERVER ERR:', d.toString()));