#!/usr/bin/env python3
"""Assemble index.html à partir des fragments de src/.

Usage : python3 build.py   (node est utilisé, s'il est installé, pour vérifier la syntaxe JS)
"""
import pathlib, shutil, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / "src"

def read(name):
    return (SRC / name).read_text(encoding="utf-8")

head = read("head.part")
# En-tête autonome (doctype, langue, description) à la place des métadonnées d'aperçu.
head = head.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', "")
head = head.replace(
    "<title>Simulateur des programmes 2027</title>\n",
    '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
    '<meta name="description" content="Simulation des programmes de la présidentielle 2027, avec les mêmes règles pour tous : '
    'dette, emploi, inégalités, climat, services publics, avec sources Insee et instituts.">\n'
    "<title>Simulateur des programmes 2027</title>\n",
    1,
)

body = read("body.part")
if 'id="h-src"' not in body:
    idx = body.rindex("</div>")
    body = body[:idx] + read("sources.part") + body[idx:]

def strip_node_export(code):
    return code.split("if(typeof module")[0]

js = strip_node_export(read("model.js")) + strip_node_export(read("microsim.js")) + read("ui.part") + read("retro.js") + read("atlas_data.js") + read("atlas.js")

if shutil.which("node"):
    r = subprocess.run(["node", "--check", "-"], input=js, capture_output=True, text=True)
    if r.returncode:
        sys.exit("Erreur de syntaxe JS :\n" + r.stderr)

html = head + "</head>\n<body>\n" + body + "\n<script>\n" + js + "</script>\n</body>\n</html>\n"
(ROOT / "index.html").write_text(html, encoding="utf-8")
print("index.html :", len(html.encode("utf-8")), "octets")
