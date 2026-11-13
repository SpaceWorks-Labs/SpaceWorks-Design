import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = dirname(fileURLToPath(import.meta.url));
// Default: locally installed pinned dependencies. Optional validation-only path avoids installing a second copy.
const requireFrom = createRequire(process.env.SW_STARTER_MODULES ? resolve(process.env.SW_STARTER_MODULES, '../package.json') : resolve(root, 'package.json'));
const load = async name => import(pathToFileURL(requireFrom.resolve(name)).href);
const { build } = await load('vite');
const tailwind = (await load('@tailwindcss/postcss')).default;
const alias = [
  { find: /^react-dom\/(.*)$/, replacement: resolve(dirname(requireFrom.resolve('react-dom/package.json')), '$1') },
  { find: /^react\/(.*)$/, replacement: resolve(dirname(requireFrom.resolve('react/package.json')), '$1') },
  { find: 'react-dom', replacement: dirname(requireFrom.resolve('react-dom/package.json')) },
  { find: 'react', replacement: dirname(requireFrom.resolve('react/package.json')) },
  { find: 'tailwindcss', replacement: requireFrom.resolve('tailwindcss/index.css') },
];
await build({ root, base:'./', configFile:false, publicDir:false, resolve:{alias}, css:{postcss:{plugins:[tailwind({base:root})]}}, build:{outDir:'dist', emptyOutDir:false} });
