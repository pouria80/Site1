import { writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const local = resolve(process.cwd(), '../../codenew.txt');
const target = resolve(process.cwd(), 'src/pages/SourceCustomerHub.tsx');
const urls = [
  'https://cdn.jsdelivr.net/gh/pouria80/Site1@main/code/codenew.txt',
  'https://raw.githubusercontent.com/pouria80/Site1/main/code/codenew.txt',
];

function download(url) {
  return execFileSync(
    'curl.exe',
    ['-4', '-L', '--fail', '--silent', '--show-error', '--connect-timeout', '20', '--max-time', '60', url],
    { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
  );
}

let source = null;
try {
  source = readFileSync(local, 'utf8');
} catch {
  // Use the hosted source when the project was downloaded without the TXT file.
}

if (!source) {
  let lastError;
  for (const url of urls) {
    try {
      source = download(url);
      break;
    } catch (err) {
      lastError = err;
    }
  }
  if (!source) {
    throw new Error(`Could not obtain codenew.txt. Put codenew.txt beside the project or check GitHub/CDN connectivity. ${lastError ?? ''}`);
  }
}

if (!source.includes('PooriTel Hub') || !source.includes('CustomerHub')) {
  throw new Error('The source does not look like the expected PooriTel codenew build.');
}

await writeFile(target, source, 'utf8');
console.log(`Prepared exact source: ${target}`);
