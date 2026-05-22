import fs from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const localDefaults = {
  FRONTEND_API_BASE_URL: 'http://localhost:4000/api',
  FRONTEND_ASSET_BASE_URL: 'http://localhost:4000'
};

const withDefaults = (overrides = {}) => {
  const env = {
    ...process.env,
    ...overrides
  };

  for (const [key, value] of Object.entries(localDefaults)) {
    if (!env[key]) {
      env[key] = value;
    }
  }

  return env;
};

const children = [];

const createBackendLocalEnv = () => {
  const backendRoot = path.join(projectRoot, 'backend');
  const exampleEnvPath = path.join(backendRoot, '.env.example');
  const localEnvPath = path.join(backendRoot, '.env.local');

  if (fs.existsSync(localEnvPath) || !fs.existsSync(exampleEnvPath)) {
    return;
  }

  fs.copyFileSync(exampleEnvPath, localEnvPath);
  console.log('Created backend/.env.local from backend/.env.example');
};

const spawnProcess = (name, args, env) => {
  const command =
    process.platform === 'win32'
      ? {
          file: process.env.ComSpec || 'cmd.exe',
          args: ['/d', '/s', '/c', `${npmCommand} ${args.join(' ')}`]
        }
      : {
          file: npmCommand,
          args
        };

  const child = spawn(command.file, command.args, {
    cwd: projectRoot,
    env,
    stdio: 'inherit'
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`${name} stopped with signal ${signal}`);
    } else if (code !== 0) {
      console.error(`${name} exited with code ${code}`);
      shutdown(code ?? 1);
    }
  });

  child.on('error', (error) => {
    console.error(`Failed to start ${name}`, error);
    shutdown(1);
  });

  children.push(child);
  return child;
};

let shuttingDown = false;

const shutdown = (exitCode = 0) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGINT');
    }
  }

  setTimeout(() => {
    for (const child of children) {
      if (!child.killed) {
        child.kill('SIGTERM');
      }
    }

    process.exit(exitCode);
  }, 500);
};

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

createBackendLocalEnv();

spawnProcess('backend', ['--prefix', 'backend', 'run', 'dev'], withDefaults());
spawnProcess(
  'frontend',
  ['--prefix', 'frontend', 'run', 'start'],
  withDefaults({
    FRONTEND_API_BASE_URL:
      process.env.FRONTEND_API_BASE_URL || localDefaults.FRONTEND_API_BASE_URL,
    FRONTEND_ASSET_BASE_URL:
      process.env.FRONTEND_ASSET_BASE_URL || localDefaults.FRONTEND_ASSET_BASE_URL
  })
);
