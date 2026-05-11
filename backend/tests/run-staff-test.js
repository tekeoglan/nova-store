const http = require('http');
const { spawn } = require('child_process');

const server = spawn('node', ['../server.js'], { cwd: __dirname, stdio: 'pipe' });

server.stdout.on('data', async (d) => {
  if (d.toString().includes('Server is running')) {
    console.log('Server started, testing staff auth flow...\n');

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
      const signup = await req(
        { hostname: 'localhost', port: 8080, path: '/api/auth/signup', method: 'POST', headers: { 'Content-Type': 'application/json' } },
        { username: 'testuser', password: 'pass123', fullName: 'Test User', email: 'testuser@example.com' }
      );
      console.log('User Signup:', signup.s === 201 ? '✅ PASS' : '❌ FAIL', signup.b);

      const login = await req(
        { hostname: 'localhost', port: 8080, path: '/api/staff/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
        { email: 'admin@novastore.com', password: 'admin123' }
      );
      console.log('Staff Login (admin):', login.s === 200 ? '✅ PASS' : '❌ FAIL', login.b.token ? '(token received)' : login.b);

      const adminToken = login.b.token;

      const reports = await req(
        { hostname: 'localhost', port: 8080, path: '/api/reports/low-stock', method: 'GET', headers: { 'Authorization': `Bearer ${adminToken}` } }
      );
      console.log('Reports (admin token):', reports.s === 200 ? '✅ PASS' : '❌ FAIL', reports.b);

      const modLogin = await req(
        { hostname: 'localhost', port: 8080, path: '/api/staff/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
        { email: 'mod@novastore.com', password: 'mod123' }
      );
      const modToken = modLogin.b.token;

      const modReports = await req(
        { hostname: 'localhost', port: 8080, path: '/api/reports/low-stock', method: 'GET', headers: { 'Authorization': `Bearer ${modToken}` } }
      );
      console.log('Reports (moderator token):', modReports.s === 403 ? '✅ PASS (Forbidden)' : '❌ FAIL', modReports.b);

      const userLogin = await req(
        { hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
        { username: 'testuser', password: 'pass123' }
      );
      const userToken = userLogin.b.token;

      const userReports = await req(
        { hostname: 'localhost', port: 8080, path: '/api/reports/low-stock', method: 'GET', headers: { 'Authorization': `Bearer ${userToken}` } }
      );
      console.log('Reports (user token):', userReports.s === 401 ? '✅ PASS (Staff required)' : '❌ FAIL', userReports.b);

      const noTokenReports = await req(
        { hostname: 'localhost', port: 8080, path: '/api/reports/low-stock', method: 'GET' }
      );
      console.log('Reports (no token):', noTokenReports.s === 401 ? '✅ PASS (Auth required)' : '❌ FAIL', noTokenReports.b);

    } catch (e) {
      console.error('Test Error:', e.message);
    } finally {
      server.kill();
      process.exit(0);
    }
  }
});

server.stderr.on('data', d => console.error('SERVER ERR:', d.toString()));