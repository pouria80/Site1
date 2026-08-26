import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const local = resolve(process.cwd(), '../../codenew.txt');
const target = resolve(process.cwd(), 'src/pages/SourceCustomerHub.tsx');
const remote = 'https://raw.githubusercontent.com/pouria80/Site1/main/code/codenew.txt';

async function load() {
  try {
    return await readFile(local, 'utf8');
  } catch {
    const res = await fetch(remote, { headers: { 'user-agent': 'pooritel-codenew-v1' } });
    if (!res.ok) throw new Error(`Could not download original codenew.txt (${res.status})`);
    return await res.text();
  }
}

const source = await load();
if (!source.includes('PooriTel Hub') || !source.includes('CustomerHub')) {
  throw new Error('The downloaded codenew source does not look like the expected PooriTel Hub source.');
}
await writeFile(target, source, 'utf8');
console.log(`Prepared exact source: ${target}`);
