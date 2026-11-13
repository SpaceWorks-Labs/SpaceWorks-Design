import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
export const version = readFileSync(resolve(process.cwd(), '../VERSION'), 'utf8').trim();
export const tag = `v${version}`;
export const repository = 'https://github.com/SpaceWorks-Labs/SpaceWorks-Design-System';
export const releaseUrl = `${repository}/releases/tag/${tag}`;
export const archiveUrl = `${repository}/archive/refs/tags/${tag}.zip`;
