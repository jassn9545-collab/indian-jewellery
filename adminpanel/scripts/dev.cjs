/* eslint-disable @typescript-eslint/no-require-imports */
// Start the local dependencies before Next.js so its API proxy has a live target.
const { spawn } = require('node:child_process');
const { existsSync, readdirSync, readFileSync } = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const root = path.resolve(__dirname, '..');
const backend = path.resolve(root, '../backend');
const dotenv = require(path.join(backend, 'node_modules/dotenv'));
const readEnv = file => existsSync(file) ? dotenv.parse(readFileSync(file)) : {};
const backendEnv = readEnv(path.join(backend, '.env'));
const frontendEnv = readEnv(path.join(root, '.env.local'));
const origin = process.env.ADMIN_API_ORIGIN || frontendEnv.ADMIN_API_ORIGIN || `http://127.0.0.1:${backendEnv.PORT || 5000}`;
const children = [];
const local = host => ['localhost', '127.0.0.1', '[::1]'].includes(host);
function listening(host, port) {
  return new Promise(resolve => {
    const socket = net.createConnection({ host, port });
    const done = result => { socket.destroy(); resolve(result); };
    socket.setTimeout(1000);
    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
    socket.once('timeout', () => done(false));
  });
}
function run(file, args, cwd, env = process.env) {
  const child = spawn(file, args, { cwd, env, stdio: 'inherit', windowsHide: true });
  children.push(child);
  child.on('error', error => { console.error(error.message); stop(1); });
  return child;
}
async function waitFor(host, port, child) {
  for (let i = 0; i < 60; i++) {
    if (await listening(host, port)) return;
    if (child.exitCode !== null) throw new Error(`Service on port ${port} stopped during startup.`);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error(`Service on port ${port} did not become ready. Check the service logs.`);
}
function stop(code = 0) {
  for (const child of children) child.kill();
  process.exit(code);
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
async function main() {
  const target = new URL(origin);
  const port = Number(target.port || (target.protocol === 'https:' ? 443 : 80));
  if (local(target.hostname) && !await listening(target.hostname, port)) {
    if (port !== Number(backendEnv.PORT || 5000)) throw new Error('ADMIN_API_ORIGIN port must match backend PORT.');
    if (!backendEnv.DATABASE_URL) throw new Error('Configure backend/.env DATABASE_URL first.');
    const db = new URL(backendEnv.DATABASE_URL);
    const dbPort = Number(db.port || 3306);
    if (local(db.hostname) && !await listening(db.hostname, dbPort)) {
      const runtime = path.join(backend, '.local-runtime');
      const mysqlRoot = path.join(runtime, 'mysql');
      const installed = existsSync(mysqlRoot) && readdirSync(mysqlRoot).find(name => existsSync(path.join(mysqlRoot, name, 'bin/mysqld.exe')));
      if (process.platform !== 'win32' || !installed || !existsSync(path.join(runtime, 'my.ini'))) {
        throw new Error('Start your configured MySQL service before running the admin panel.');
      }
      const mysql = run(path.join(mysqlRoot, installed, 'bin/mysqld.exe'), [`--defaults-file=${path.join(runtime, 'my.ini')}`], backend);
      await waitFor(db.hostname, dbPort, mysql);
    }
    const env = { ...process.env, ...backendEnv };
    const migration = run(process.execPath, [path.join(backend, 'node_modules/prisma/build/index.js'), 'migrate', 'deploy', '--schema', 'prisma/mysql/schema.prisma'], backend, env);
    const code = await new Promise(resolve => migration.once('exit', resolve));
    if (code !== 0) throw new Error('Database migrations failed. Check backend/.env and MySQL.');
    const server = run(process.execPath, ['-r', 'ts-node/register', 'src/app.ts'], backend, env);
    await waitFor(target.hostname, port, server);
    server.once('exit', code => stop(code || 1));
  }
  const response = await fetch(`${origin}/admin-api/session`, { signal: AbortSignal.timeout(10000) });
  if (![200, 401].includes(response.status)) throw new Error(`Admin API is unavailable (HTTP ${response.status}).`);
  console.log(`Admin API ready at ${origin}`);
  if (process.argv.includes('--check')) return stop();
  const next = run(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'dev', '-p', '3001'], root, { ...process.env, ADMIN_API_ORIGIN: origin });
  next.once('exit', code => stop(code || 0));
}
main().catch(error => { console.error(error.message); stop(1); });
