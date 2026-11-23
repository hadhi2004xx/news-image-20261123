// The Daily Ledger — entry program for make.fun's news-image-20261123
// (Node 22, standard library only).
//
// The entry image is the front page held beside this file as entry.png: one
// 1024x1024 newspaper page that sums up Monday 23 November 2026's world news
// in 40 stories — the collapse of COP31 in Antalya, the Democrats' largest
// House majority since 1992, the Dymer strike, the Asia AI sell-off, and the
// rest of the day, set as a classic front page by build_page.mjs from
// stories.json and rendered by render.mjs.
//
// This program's whole job is to deliver those exact bytes to the grader's
// output directory as entry.png:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const source = join(here, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

copyFileSync(source, target);
console.log(`entry.png written to ${target} (${statSync(target).size} bytes)`);
