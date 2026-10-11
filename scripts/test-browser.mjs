import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

const ownedServers = [];
function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${args.join(' ')} exited ${code}`)));
  });
}
async function reachable(url) {
  try { return (await fetch(url, { signal: AbortSignal.timeout(1000) })).ok; }
  catch { return false; }
}
async function server(command, port) {
  const url = `http://127.0.0.1:${port}/`;
  if (await reachable(url)) return;
  const child = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', command, '--host', '127.0.0.1', '--port', String(port)], { stdio: 'inherit' });
  ownedServers.push(child);
  for (let attempt = 0; attempt < 120; attempt++) {
    if (await reachable(url)) return;
    if (child.exitCode !== null) throw new Error(`${command} server exited before becoming ready`);
    await setTimeout(250);
  }
  throw new Error(`${command} server did not become ready at ${url}`);
}

try {
  await server('dev', 4322);
  await run(['--test', 'tests/content.browser.ts', 'tests/travel.browser.ts', 'tests/gallery.browser.ts']);
  // Fixture after-hooks finish before any production build can include them.
  await run(['node_modules/astro/bin/astro.mjs', 'build']);
  await server('preview', 4321);
  await run(['--test', 'tests/hero-motion.browser.ts']);
} finally {
  for (const child of ownedServers) child.kill();
}
