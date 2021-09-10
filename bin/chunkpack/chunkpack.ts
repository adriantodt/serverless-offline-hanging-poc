import * as fs from 'fs-extra';

/*
 * [ ChunkPack | Automatic Webpack Chunking ]
 */

const basePackage = './src/handlers';
const entrypointName = 'handler.ts';
const chunkSize = 12;
const webpackFolder = './webpack';

const { log } = console;

async function findHandlers(path: string) {

  const result: string[] = [];

  for (const child of (await fs.readdir(path))) {
    const stat = await fs.stat(`${path}/${child}`);
    if (!stat.isDirectory()) {
      continue;
    }
    if (await fs.pathExists(`${path}/${child}/.webpackignore`)) {
      continue;
    }
    result.push(`${child}`);
  }

  return result;
}

function rangeArray(n: number) {
  return Array.from(Array(n).keys());
}

function chunkArray<T>(array: T[], n: number) {
  return rangeArray(Math.ceil(array.length / n)).map((x, i) => array.slice(i * n, i * n + n));
}

function generateWebpackFile(entries: string[]) {
  return `import webpackConfig from '../config.base';

export default webpackConfig({
  basePackage: '${basePackage}',
  entrypointName: '${entrypointName}',
  entries: ${JSON.stringify(entries)},
});
`;
}

function generateBashFile(n: number) {
  return `#!/bin/bash
# This file is generated!
rm -rf dist
run_entry () {
  echo "[ChunkPack-Runner] Processing: $1"
  if ! yarn webpack --config "$1";
  then
    echo "[ChunkPack-Runner] Packaging for file $1 failed :("
    exit 1
  fi
}
${rangeArray(n).map(i => `run_entry "${webpackFolder}/.entries/${i}.ts"`).join('\n')}
echo "[ChunkPack-Runner] Packaging done!"
`;
}

async function generateFiles(chunks: string[][]) {
  const generatedFolder = `${webpackFolder}/.entries`;
  await fs.rmdir(generatedFolder, { recursive: true });
  await fs.mkdirs(generatedFolder);

  const chunkPromises = chunks.map(async (entries, index) => {
    await fs.writeFile(`${generatedFolder}/${index}.ts`, generateWebpackFile(entries));
  });

  const scriptPromise = fs.writeFile(`${generatedFolder}/run.sh`, generateBashFile(chunks.length))

  return Promise.all([...chunkPromises, scriptPromise]);
}

function smartChunkSize(handlerCount: number, chunkSize: number) {
  return Math.ceil(handlerCount / Math.ceil(handlerCount / chunkSize));
}

(async () => {
  const handlers = await findHandlers(basePackage);
  log(`${handlers.length} handlers found.`)
  const chunks = chunkArray(handlers, smartChunkSize(handlers.length, chunkSize));
  log(`Handlers will be split in ${chunks.length} chunks.`)
  await generateFiles(chunks);
})();
