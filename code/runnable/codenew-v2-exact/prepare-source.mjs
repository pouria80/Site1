import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const local = resolve(process.cwd(), '../../codenewv2.txt');
const target = resolve(process.cwd(), 'src/SourceApp.tsx');
const remote = 'https://raw.githubusercontent.com/pouria80/Site1/main/code/codenewv2.txt';

async function load() {
  try {
    return await readFile(local, 'utf8');
  } catch {
    const res = await fetch(remote, { headers: { 'user-agent': 'pooritel-codenew-v2' } });
    if (!res.ok) throw new Error(`Could not download original codenewv2.txt (${res.status})`);
    return await res.text();
  }
}

const source = await load();
if (!source.includes('PooriTel Hub') || !source.includes('createRoot') && !source.includes('export default function App')) {
  throw new Error('The downloaded codenewv2 source does not look like the expected PooriTel Hub source.');
}
await writeFile(target, source, 'utf8');
console.log(`Prepared exact source: ${target}`);
