#!/bin/sh
# Build a work folder for 1.14d Game.exe / DS1 / txt analysis (see tools/README.md).
# usage (run inside a kolbot clone): sh <path>/setup.sh <workdir> <Game.exe> [git ref, default origin/d2reference]
set -e
W=$1; EXE=$2; REF=${3:-origin/d2reference}
[ -n "$W" ] && [ -f "$EXE" ] || { echo "usage: setup.sh <workdir> <Game.exe> [ref]"; exit 1; }
mkdir -p "$W/exe" "$W/tools" "$W/ds1"
cp "$EXE" "$W/exe/Game.exe"
git archive "$REF" tools | tar -x -C "$W"
x() { git show "$REF:mpqdata/excel/$1" | tr -d '\r' > "$W/$2"; }
x treasureclassex.txt tcx.txt
x monstats.txt monstats.txt
x levels.txt levels.txt
cp "$W/levels.txt" "$W/lv.txt"
x superuniques.txt su.txt
cp "$W/su.txt" "$W/su2.txt"
x lvlprest.txt lvlprest.txt
x monpreset.txt monpreset.txt
x monlvl.txt monlvl.txt
x objects.txt objects.txt
x weapons.txt weapons.txt
x experience.txt experience.txt
git archive "$REF" mpqdata/tiles | tar -x -C "$W/ds1"
python3 -m pip install -q capstone pefile
python3 -I "$W/tools/full.py" "$W/tools"
echo "ready: $W (text.asm = full .text disassembly)"
