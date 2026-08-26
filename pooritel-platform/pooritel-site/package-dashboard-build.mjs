import { execFileSync } from 'node:child_process';

execFileSync('npm', ['install', '--prefix', 'dashboard-app'], { stdio: 'inherit' });
execFileSync('npm', ['run', 'build', '--prefix', 'dashboard-app'], { stdio: 'inherit' });
