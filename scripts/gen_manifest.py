"""
Generate app/lib/editable.json (all editable prose) and app/lib/photos.json
(swappable photo slots) from the static Lamplight build.

Extraction pulls strings straight from the source file, so injection sources
always match. Locked on purpose, never emitted here:
  - testimonials (must stay verbatim), the creed, the ledger numbers
  - attorney-advertising disclaimer, form legal line, F24 sobriety line
  - the say/never-say card lines (legally engineered crisis language)
  - the prescription + drawer tool copy (hedged deadline language)
  - FAQ answers that carry legal armor (no-guarantee, contingency, deadline)
  - NAP: phone, address, hours

Run:  python scripts/gen_manifest.py   (then scripts/port.py)
"""

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(r"C:/Users/trevo/OneDrive/Desktop/AI Websites/higgins/index.html")
src = SRC.read_text(encoding="utf-8")

fields = []

def add(key, label, group, s, hint=""):
    s = s.strip()
    if not s or "<" in s:
        raise SystemExit(f"refusing field with markup or empty: {key} -> {s[:60]!r}")
    if ">" + s + "<" not in src:
        raise SystemExit(f"src not found for {key}: {s[:60]!r}")
    fields.append({
        "key": key,
        "label": label,
        "group": group,
        "hint": hint,
        "src": s,
        "default": html.unescape(s),
    })

def grab(pattern, expect=None):
    found = re.findall(pattern, src, re.S)
    if expect is not None and len(found) != expect:
        raise SystemExit(f"pattern {pattern[:50]!r} matched {len(found)}, expected {expect}")
    return found

# ---------- Hero ----------
add("hero.sub", "Subheadline", "Hero",
    grab(r'<p class="hero-sub">(.*?)</p>', 1)[0],
    "One or two short sentences under the big title.")
add("hero.emergency", "Emergency link", "Hero",
    grab(r'<a class="hero-emergency" href="#first24">(.*?)</a>', 1)[0],
    "The italic line that leads to The First 24 Hours.")

# ---------- Section headings (plain ones only) ----------
for key, hid, label in [
    ("f24.h", "f24-title", "First 24 Hours: title"),
    ("pr.h", "pr-title", "Practice areas: title"),
    ("ts.h", "ts-title", "Testimonials: title"),
    ("faq.h", "faq-title", "Questions: title"),
]:
    text = grab(rf'id="{hid}">(.*?)</h2>', 1)[0]
    add(key, label, "Section titles", text)

# ---------- Intro lines ----------
subs = grab(r'<p class="sec-sub">(.*?)</p>')
add("f24.lede", "Intro line", "First 24 Hours", subs[0], "Sits under the title.")
add("pr.sub", "Intro line", "Practice areas", subs[1], "Sits under the title.")
add("faq.sub", "Intro line", "Questions", subs[2], "Sits under the title.")
add("call.lede", "Intro paragraph", "Contact", grab(r'<p class="call-lede">(.*?)</p>', 1)[0])

# ---------- First 24 Hours steps ----------
steps = grab(r'<li class="f24-step">.*?<h3>(.*?)</h3>\s*<p>(.*?)</p>', 5)
for i, (title, bodytext) in enumerate(steps, 1):
    add(f"f24.s{i}.t", f"Step {i} title", "First 24 Hours", title)
    if "<" not in bodytext:
        add(f"f24.s{i}.b", f"Step {i} text", "First 24 Hours", bodytext)
add("f24.say.h", "Say-card title", "First 24 Hours",
    grab(r'<h3 id="f24-say-title">(.*?)</h3>', 1)[0])
add("f24.say.foot", "Say-card closing line", "First 24 Hours",
    grab(r'<p class="f24-say-foot">(.*?)</p>', 1)[0])

# ---------- Two Generations ----------
add("gen.lede", "Intro paragraph", "Two Generations",
    grab(r'<p class="gen-lede">(.*?)</p>', 1)[0])
bodies = grab(r'<p class="gene-body">(.*?)</p>', 2)
add("gen.george", "George's bio", "Two Generations", bodies[0])
add("gen.alex", "Alex's bio", "Two Generations", bodies[1])

# ---------- Practice rows ----------
lines = grab(r'<span class="pr-line">(.*?)</span>', 4)
for key, label, text in zip(
    ["pr.criminal", "pr.estate", "pr.injury", "pr.juvenile"],
    ["Criminal Defense: one-liner", "Estate Planning: one-liner",
     "Personal Injury: one-liner", "Juvenile Law: one-liner"],
    lines,
):
    add(key, label, "Practice areas", text, "The italic line on the closed row.")

AREA_BY_PANEL = {"pa-1": "Criminal Defense", "pa-2": "Estate Planning",
                 "pa-3": "Personal Injury", "pa-4": "Juvenile Law"}
panels = re.findall(r'<div class="pr-panel" id="(pa-\d)".*?</div>\n</div>\n</div>', src, re.S)
for pid in ["pa-1", "pa-2", "pa-3", "pa-4"]:
    block = re.search(rf'id="{pid}".*?(?=<div class="pr">|</div>\n\n</div>\n<p class="prac-foot")', src, re.S).group(0)
    clauses = re.findall(r'<div class="pst"><h4>(.*?)</h4><p>(.*?)</p></div>', block)
    area = AREA_BY_PANEL[pid]
    for j, (h, p) in enumerate(clauses, 1):
        add(f"{pid}.c{j}.t", f"Point {j} title", f"Practice: {area}", h)
        if "<" not in p:
            add(f"{pid}.c{j}.b", f"Point {j} text", f"Practice: {area}", p)

# ---------- FAQ -> faq-seed.json (managed as a list, not flat fields) ----------
LOCKED_ANSWER_MARKS = [
    "No honest lawyer promises an outcome",   # no-guarantee armor
    "We handle injury cases on contingency",  # fee/costs armor
    "as little as one year",                  # prescription armor
]
faq_groups = re.findall('<div class="fqg"><h3 class="fqgl">(.*?)</h3>(.*?)</div>\n\n', src, re.S)
if len(faq_groups) != 5:
    raise SystemExit(f"expected 5 faq groups, got {len(faq_groups)}")
faq_seed = []
for gname, gblock in faq_groups:
    items = re.findall(r'aria-controls="(fa-\w+)">(.*?)<span class="fqi".*?<div class="fai">(.*?)</div>', gblock, re.S)
    for fid, q, a in items:
        locked = "<" in a or any(m in a for m in LOCKED_ANSWER_MARKS)
        if fid == "fa-c1":
            # plain-text version of the linked answer; stays locked (crisis instructions)
            a = ("Stay calm and stay respectful. Ask for a lawyer immediately, then stop "
                 "answering questions and sign nothing. The full guide is The First 24 Hours, "
                 "above on this page. Then call us as soon as you can.")
        faq_seed.append({
            "id": fid,
            "grp": html.unescape(gname),
            "q": html.unescape(q.strip()),
            "a": html.unescape(a.strip()),
            "locked": locked,
        })
(ROOT / "app/lib/faq-seed.json").write_text(
    json.dumps(faq_seed, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"faq-seed.json: {len(faq_seed)} items")

# ---------- Contact / call band ----------
add("call.steps.h", "Steps heading", "Contact",
    grab(r'<div class="steps">\s*<h3>(.*?)</h3>', 1)[0])
add("call.steps.sub", "Steps subtitle", "Contact",
    grab(r'<p class="steps-sub">(.*?)</p>', 1)[0])
rows = grab(r'<div class="step-row">.*?<h4>(.*?)</h4><p>(.*?)</p>', 3)
for i, (h, p) in enumerate(rows, 1):
    add(f"call.step{i}.t", f"Step {i} title", "Contact", h)
    add(f"call.step{i}.b", f"Step {i} text", "Contact", p)
add("form.h", "Form title", "Contact", grab(r'<div class="cfb"[^>]*>\s*<h3>(.*?)</h3>', 1)[0])
add("form.sub", "Form subtitle", "Contact", grab(r'<p class="cfs">(.*?)</p>', 1)[0])

# ---------- sanity: unique keys, unique srcs ----------
keys = [f["key"] for f in fields]
if len(keys) != len(set(keys)):
    raise SystemExit("duplicate keys")
srcs = [f["src"] for f in fields]
dupes = {s for s in srcs if srcs.count(s) > 1}
if dupes:
    raise SystemExit(f"duplicate src strings (injection would be ambiguous): {list(dupes)[:3]}")

(ROOT / "app/lib/editable.json").write_text(
    json.dumps(fields, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"editable.json: {len(fields)} fields")

# ---------- Photo slots ----------
photos = [
    {"key": "img.hero",   "label": "Hero photograph",            "hint": "The big opening photo. Wide images work best.",          "src": "/assets/lawroom.jpeg"},
    {"key": "img.george", "label": "George's portrait",          "hint": "Tall portrait, roughly 4 by 5.",                          "src": "/assets/george-hd.jpeg"},
    {"key": "img.alex",   "label": "Alex's portrait",            "hint": "Tall portrait, roughly 4 by 5.",                          "src": "/assets/alex-hd.jpeg"},
    {"key": "img.creed",  "label": "Creed section photograph",   "hint": "The full-width photo behind the firm's creed.",           "src": "/assets/george-and-alex-meeting.webp"},
    {"key": "img.pr1",    "label": "Criminal Defense row photo", "hint": "Appears behind the row when it lights up.",               "src": "/assets/alexhigginswithclient.webp"},
    {"key": "img.pr2",    "label": "Estate Planning row photo",  "hint": "Appears behind the row when it lights up.",               "src": "/assets/higginslawheropic.webp"},
    {"key": "img.pr3",    "label": "Personal Injury row photo",  "hint": "Appears behind the row when it lights up.",               "src": "/assets/hero.webp"},
    {"key": "img.pr4",    "label": "Juvenile Law row photo",     "hint": "Appears behind the row when it lights up.",               "src": "/assets/george-higgins-meeting.webp"},
]
for p in photos:
    needle = 'src="' + p["src"].replace("/assets/", "assets/") + '"'
    if needle not in src:
        raise SystemExit(f"photo src not found in static build: {p['src']}")
(ROOT / "app/lib/photos.json").write_text(
    json.dumps(photos, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"photos.json: {len(photos)} slots")
