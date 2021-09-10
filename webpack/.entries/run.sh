#!/bin/bash
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
run_entry "./webpack/.entries/0.ts"
echo "[ChunkPack-Runner] Packaging done!"
