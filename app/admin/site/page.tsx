"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { login, checkAuth } from "../../actions/auth";
import {
  getEditableFields,
  getPhotoSlots,
  getSettings,
  getHistory,
  revertChange,
  saveSiteContent,
  aiProposeEdits,
  type EditableField,
  type PhotoSlot,
  type ProposedEdit,
  type HistoryEntry,
} from "../../actions/content";
import { uploadFile } from "../../actions/upload";
import { getIntakes, markIntakeSeen, type Intake } from "../../actions/intake";
import {
  getFaqs,
  addFaq,
  updateFaq,
  deleteFaq,
  moveFaq,
  type FaqGroup,
} from "../../actions/faq";

type FieldRow = EditableField & { current: string; overridden: boolean };
type SlotRow = PhotoSlot & { current: string; overridden: boolean };
type Tab = "editor" | "photos" | "faq" | "settings" | "history" | "intake";

const FAQ_GROUPS = [
  "General",
  "Criminal Defense",
  "Estate Planning & Successions",
  "Juvenile Law",
  "Personal Injury",
];

export default function SiteEditorPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [tab, setTab] = useState<Tab>("editor");
  const [fields, setFields] = useState<FieldRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [slots, setSlots] = useState<SlotRow[]>([]);
  const [faq, setFaq] = useState<FaqGroup[]>([]);
  const [faqDrafts, setFaqDrafts] = useState<Record<string, { q: string; a: string }>>({});
  const [newFaq, setNewFaq] = useState({ grp: FAQ_GROUPS[0], q: "", a: "" });
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);

  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const [instruction, setInstruction] = useState("");
  const [proposing, setProposing] = useState(false);
  const [proposals, setProposals] = useState<ProposedEdit[]>([]);
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [aiNote, setAiNote] = useState("");

  async function loadAll() {
    const [{ fields }, { slots }, faqGroups, settingsMap, historyRows, intakeRows] =
      await Promise.all([
        getEditableFields(),
        getPhotoSlots(),
        getFaqs(),
        getSettings(),
        getHistory(),
        getIntakes(),
      ]);
    setFields(fields);
    setDrafts(Object.fromEntries(fields.map((f) => [f.key, f.current])));
    setSlots(slots);
    setFaq(faqGroups);
    setFaqDrafts(
      Object.fromEntries(
        faqGroups.flatMap((g) => g.items.map((it) => [it.id, { q: it.q, a: it.a }]))
      )
    );
    setSettings(settingsMap as Record<string, string>);
    setHistory(historyRows);
    setIntakes(intakeRows);
  }

  useEffect(() => {
    (async () => {
      const ok = await checkAuth();
      setAuthed(ok);
      if (ok) await loadAll();
      setLoading(false);
    })();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await login(password);
    if (res.success) {
      setAuthed(true);
      setLoading(true);
      await loadAll();
      setLoading(false);
    } else setLoginError(res.error || "Login failed");
  };

  const flash = (msg: string) => setStatus(msg);

  // ----- copy -----
  const dirtyKeys = fields
    .filter((f) => (drafts[f.key] ?? f.current) !== f.current)
    .map((f) => f.key);

  const saveDrafts = async () => {
    setSaving(true);
    const res = await saveSiteContent(dirtyKeys.map((key) => ({ key, value: drafts[key] ?? "" })));
    flash(res.ok ? "Saved. The live site updates within a few seconds." : res.error || "Save failed.");
    if (res.ok) await loadAll();
    setSaving(false);
  };

  const resetKey = async (key: string, kind: "field" | "photo") => {
    setSaving(true);
    const res = await saveSiteContent([{ key, value: "" }]);
    if (res.ok) await loadAll();
    flash(res.ok ? (kind === "photo" ? "Restored the original photograph." : "Restored the original wording.") : res.error || "Reset failed.");
    setSaving(false);
  };

  // ----- photos -----
  const handlePhotoPick = async (slot: SlotRow, file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return flash("That file is not an image.");
    if (file.size > 15 * 1024 * 1024) return flash("That image is over 15 MB. Use a smaller one.");
    setUploadingKey(slot.key);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const up = await uploadFile(fd);
      if (!up.success || !up.url) return flash(up.error || "Upload failed.");
      const res = await saveSiteContent([{ key: slot.key, value: up.url }]);
      flash(res.ok ? "Photo swapped. The live site updates within a few seconds." : res.error || "Could not save the photo.");
      if (res.ok) await loadAll();
    } finally {
      setUploadingKey(null);
      const input = fileInputs.current[slot.key];
      if (input) input.value = "";
    }
  };

  // ----- FAQ -----
  const saveFaqItem = async (id: string) => {
    setSaving(true);
    const d = faqDrafts[id];
    const res = await updateFaq({ id, q: d.q, a: d.a });
    flash(res.ok ? "Saved." : res.error || "Save failed.");
    if (res.ok) await loadAll();
    setSaving(false);
  };

  const removeFaqItem = async (id: string, q: string) => {
    if (!confirm(`Remove this question?\n\n"${q}"`)) return;
    setSaving(true);
    const res = await deleteFaq(id);
    flash(res.ok ? "Removed." : res.error || "Could not remove it.");
    if (res.ok) await loadAll();
    setSaving(false);
  };

  const nudgeFaq = async (id: string, dir: "up" | "down") => {
    setSaving(true);
    const res = await moveFaq(id, dir);
    if (res.ok) await loadAll();
    else flash(res.error || "Could not reorder.");
    setSaving(false);
  };

  const createFaq = async () => {
    setSaving(true);
    const res = await addFaq(newFaq);
    flash(res.ok ? "Added. It is live in that section now." : res.error || "Could not add it.");
    if (res.ok) {
      setNewFaq({ grp: newFaq.grp, q: "", a: "" });
      await loadAll();
    }
    setSaving(false);
  };

  // ----- settings -----
  const saveSettings = async () => {
    setSaving(true);
    const res = await saveSiteContent([
      { key: "bar.enabled", value: settings["bar.enabled"] === "1" ? "1" : "" },
      { key: "bar.text", value: settings["bar.text"] ?? "" },
      { key: "bar.link", value: settings["bar.link"] ?? "" },
      { key: "meta.title", value: settings["meta.title"] ?? "" },
      { key: "meta.desc", value: settings["meta.desc"] ?? "" },
    ]);
    flash(res.ok ? "Saved. The live site updates within a few seconds." : res.error || "Save failed.");
    if (res.ok) await loadAll();
    setSaving(false);
  };

  // ----- AI -----
  const propose = async () => {
    setProposing(true);
    setProposals([]);
    setAiNote("");
    const res = await aiProposeEdits(instruction);
    if (res.ok) {
      setProposals(res.edits ?? []);
      setAccepted(Object.fromEntries((res.edits ?? []).map((e) => [e.key, true])));
      setAiNote(res.note || "");
      if ((res.edits ?? []).length === 0 && !res.note) flash("No changes proposed. Try being more specific.");
    } else flash(res.error || "Could not propose edits.");
    setProposing(false);
  };

  const applyAccepted = async () => {
    const chosen = proposals.filter((p) => accepted[p.key]);
    if (!chosen.length) return;
    setSaving(true);
    const res = await saveSiteContent(chosen.map((p) => ({ key: p.key, value: p.value })));
    flash(res.ok ? "Applied. The live site updates within a few seconds." : res.error || "Apply failed.");
    if (res.ok) {
      setProposals([]);
      setInstruction("");
      await loadAll();
    }
    setSaving(false);
  };

  const labelOf = (key: string) => {
    const f = fields.find((f) => f.key === key);
    return f ? `${f.group}: ${f.label}` : key;
  };
  const currentOf = (key: string) => fields.find((f) => f.key === key)?.current ?? "";
  const unseen = intakes.filter((i) => !i.seen).length;

  const groups: { name: string; items: FieldRow[] }[] = [];
  for (const f of fields) {
    const g = groups.find((g) => g.name === f.group);
    if (g) g.items.push(f);
    else groups.push({ name: f.group, items: [f] });
  }

  if (loading) return <div style={S.shell}><p style={S.mut}>Loading the editor…</p></div>;

  if (!authed)
    return (
      <div style={S.shell}>
        <div style={S.card}>
          <h1 style={S.h1}>Higgins Law · Site Editor</h1>
          <p style={S.mut}>Sign in with the office password.</p>
          <form onSubmit={handleLogin} style={{ marginTop: 16 }}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={S.input} />
            {loginError && <p style={{ color: "#b3542e", marginTop: 8 }}>{loginError}</p>}
            <button type="submit" style={S.btn}>Sign in</button>
          </form>
          <p style={{ ...S.mut, marginTop: 14 }}>
            <Link href="/admin" style={S.link}>Go to News &amp; Updates admin</Link>
          </p>
        </div>
      </div>
    );

  const tabs: { id: Tab; label: string }[] = [
    { id: "editor", label: "Site copy" },
    { id: "photos", label: "Photos" },
    { id: "faq", label: "Questions & answers" },
    { id: "settings", label: "Announcement & search" },
    { id: "history", label: "History" },
    { id: "intake", label: `Requests${unseen ? ` (${unseen} new)` : ""}` },
  ];

  return (
    <div style={S.shell}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <header style={{ marginBottom: 20 }}>
          <h1 style={S.h1}>Higgins Law · Site Editor</h1>
          <p style={S.mut}>
            Every word, photograph, and question below is yours to change. Nothing goes live
            until you save, and every change can be undone from History.
          </p>
          <nav style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} style={tab === t.id ? S.tabOn : S.tabOff}>
                {t.label}
              </button>
            ))}
            <Link href="/admin" style={{ ...S.tabOff, textDecoration: "none" }}>News</Link>
            <Link href="/" style={{ ...S.tabOff, textDecoration: "none" }}>View site</Link>
          </nav>
        </header>

        {status && <p style={S.status} role="status">{status}</p>}

        {tab === "editor" && (
          <>
            <section style={S.card}>
              <h2 style={S.h2}>Ask for a change</h2>
              <p style={S.mut}>
                Plain English is fine: &ldquo;Make the estate planning section warmer&rdquo; or
                &ldquo;Mention that we sit down in person.&rdquo; The editor follows the firm&rsquo;s
                rules: no promises, no invented numbers, your voice.
              </p>
              <textarea value={instruction} onChange={(e) => setInstruction(e.target.value)} rows={3}
                placeholder="Describe the change you want…" style={{ ...S.input, resize: "vertical" }} />
              <button onClick={propose} disabled={proposing || !instruction.trim()} style={S.btn}>
                {proposing ? "Drafting…" : "Propose edits"}
              </button>
              {aiNote && <p style={{ ...S.mut, marginTop: 12 }}>Note from the editor: {aiNote}</p>}
              {proposals.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  {proposals.map((p) => (
                    <div key={p.key} style={S.proposal}>
                      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
                        <input type="checkbox" checked={!!accepted[p.key]}
                          onChange={(e) => setAccepted({ ...accepted, [p.key]: e.target.checked })} style={{ marginTop: 4 }} />
                        <span>
                          <b>{labelOf(p.key)}</b>
                          <span style={S.diffOld}>{currentOf(p.key)}</span>
                          <span style={S.diffNew}>{p.value}</span>
                          <span style={{ ...S.mut, display: "block", marginTop: 4 }}>{p.reason}</span>
                        </span>
                      </label>
                    </div>
                  ))}
                  <button onClick={applyAccepted} disabled={saving} style={S.btn}>
                    {saving ? "Applying…" : "Apply selected edits"}
                  </button>
                </div>
              )}
            </section>

            <section style={S.card}>
              <h2 style={S.h2}>Edit directly</h2>
              <p style={S.mut}>
                Grouped the way the page reads. Testimonials, the creed, legal notices, and the
                office details are protected and stay as written.
              </p>
              {groups.map((g, gi) => (
                <details key={g.name} open={gi === 0} style={S.group}>
                  <summary style={S.groupHead}>
                    {g.name}
                    <span style={S.mut}> · {g.items.length} item{g.items.length > 1 ? "s" : ""}</span>
                    {g.items.some((f) => f.overridden) && <em style={{ color: "#96733a", fontStyle: "normal" }}> · edited</em>}
                  </summary>
                  <div style={{ padding: "10px 2px 4px" }}>
                    {g.items.map((f) => (
                      <div key={f.key} style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                          <label htmlFor={f.key} style={S.label}>
                            {f.label}
                            {f.overridden && <em style={{ color: "#96733a", fontStyle: "normal" }}> · edited</em>}
                          </label>
                          {f.overridden && (
                            <button onClick={() => resetKey(f.key, "field")} style={S.mini} disabled={saving}>Restore original</button>
                          )}
                        </div>
                        <textarea id={f.key} value={drafts[f.key] ?? f.current}
                          onChange={(e) => setDrafts({ ...drafts, [f.key]: e.target.value })}
                          rows={Math.min(6, Math.max(2, Math.ceil((drafts[f.key] ?? f.current).length / 90)))}
                          style={{ ...S.input, resize: "vertical" }} />
                        {f.hint && <p style={{ ...S.mut, fontSize: 12, marginTop: 2 }}>{f.hint}</p>}
                      </div>
                    ))}
                  </div>
                </details>
              ))}
              <button onClick={saveDrafts} disabled={saving || dirtyKeys.length === 0} style={S.btn}>
                {saving ? "Saving…" : dirtyKeys.length ? `Save ${dirtyKeys.length} change${dirtyKeys.length > 1 ? "s" : ""}` : "Nothing to save"}
              </button>
            </section>
          </>
        )}

        {tab === "photos" && (
          <section style={S.card}>
            <h2 style={S.h2}>Photographs</h2>
            <p style={S.mut}>
              Upload a replacement and it takes the slot; the site&rsquo;s warm film treatment is
              applied automatically. Restore brings back the original at any time.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginTop: 16 }}>
              {slots.map((slot) => (
                <div key={slot.key} style={S.proposal}>
                  <div style={{ aspectRatio: "4 / 3", overflow: "hidden", background: "#0e0b06", marginBottom: 10 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slot.current} alt={slot.label}
                      style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(.25) saturate(.9) contrast(1.08) brightness(.85)" }} />
                  </div>
                  <b style={{ color: "#f3ead8", display: "block" }}>
                    {slot.label}
                    {slot.overridden && <em style={{ color: "#96733a", fontStyle: "normal", fontWeight: 400 }}> · swapped</em>}
                  </b>
                  <p style={{ ...S.mut, fontSize: 12, margin: "4px 0 10px" }}>{slot.hint}</p>
                  <input ref={(el) => { fileInputs.current[slot.key] = el; }} type="file" accept="image/*" style={{ display: "none" }}
                    onChange={(e) => handlePhotoPick(slot, e.target.files?.[0] ?? null)} />
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => fileInputs.current[slot.key]?.click()} style={S.mini} disabled={uploadingKey !== null}>
                      {uploadingKey === slot.key ? "Uploading…" : "Upload new photo"}
                    </button>
                    {slot.overridden && (
                      <button onClick={() => resetKey(slot.key, "photo")} style={S.mini} disabled={saving || uploadingKey !== null}>
                        Restore original
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "faq" && (
          <>
            <section style={S.card}>
              <h2 style={S.h2}>Add a question</h2>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
                <select value={newFaq.grp} onChange={(e) => setNewFaq({ ...newFaq, grp: e.target.value })}
                  style={{ ...S.input, width: "auto", marginTop: 0 }}>
                  {FAQ_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <input value={newFaq.q} onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
                placeholder="The question, as a client would ask it" style={S.input} />
              <textarea value={newFaq.a} onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
                placeholder="The answer, plain and short" rows={3} style={{ ...S.input, resize: "vertical" }} />
              <button onClick={createFaq} disabled={saving || !newFaq.q.trim() || !newFaq.a.trim()} style={S.btn}>
                Add to the site
              </button>
            </section>

            <section style={S.card}>
              <h2 style={S.h2}>Questions on the site</h2>
              <p style={S.mut}>
                A few answers carry required legal wording and are protected; everything else is
                yours. Order here is the order on the page.
              </p>
              {faq.map((g) => (
                <details key={g.grp} open style={S.group}>
                  <summary style={S.groupHead}>{g.grp}<span style={S.mut}> · {g.items.length}</span></summary>
                  <div style={{ padding: "10px 2px 4px" }}>
                    {g.items.map((it) => (
                      <div key={it.id} style={S.proposal}>
                        <input value={faqDrafts[it.id]?.q ?? it.q} disabled={it.locked}
                          onChange={(e) => setFaqDrafts({ ...faqDrafts, [it.id]: { ...(faqDrafts[it.id] ?? { q: it.q, a: it.a }), q: e.target.value } })}
                          style={{ ...S.input, marginTop: 0, fontWeight: 600 }} />
                        <textarea value={faqDrafts[it.id]?.a ?? it.a} disabled={it.locked} rows={3}
                          onChange={(e) => setFaqDrafts({ ...faqDrafts, [it.id]: { ...(faqDrafts[it.id] ?? { q: it.q, a: it.a }), a: e.target.value } })}
                          style={{ ...S.input, resize: "vertical" }} />
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8, alignItems: "center" }}>
                          {it.locked ? (
                            <span style={{ ...S.mut, fontSize: 12 }}>Protected legal wording · can be reordered, not edited</span>
                          ) : (
                            <>
                              <button style={S.mini} disabled={saving || (faqDrafts[it.id]?.q === it.q && faqDrafts[it.id]?.a === it.a)}
                                onClick={() => saveFaqItem(it.id)}>Save</button>
                              <button style={S.mini} disabled={saving} onClick={() => removeFaqItem(it.id, it.q)}>Remove</button>
                            </>
                          )}
                          <button style={S.mini} disabled={saving} onClick={() => nudgeFaq(it.id, "up")}>Move up</button>
                          <button style={S.mini} disabled={saving} onClick={() => nudgeFaq(it.id, "down")}>Move down</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </section>
          </>
        )}

        {tab === "settings" && (
          <>
            <section style={S.card}>
              <h2 style={S.h2}>Announcement bar</h2>
              <p style={S.mut}>
                A short notice across the top of the site: holiday closures, weather, court
                schedule changes. Switch it off and it disappears.
              </p>
              <label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12, cursor: "pointer", color: "#f3ead8" }}>
                <input type="checkbox" checked={settings["bar.enabled"] === "1"}
                  onChange={(e) => setSettings({ ...settings, "bar.enabled": e.target.checked ? "1" : "" })} />
                Show the announcement bar
              </label>
              <input value={settings["bar.text"] ?? ""} maxLength={120}
                onChange={(e) => setSettings({ ...settings, "bar.text": e.target.value })}
                placeholder="The office is closed Friday, July 3 for Independence Day." style={S.input} />
              <input value={settings["bar.link"] ?? ""}
                onChange={(e) => setSettings({ ...settings, "bar.link": e.target.value })}
                placeholder="Optional link (a page address or tel:3184734250)" style={S.input} />
            </section>

            <section style={S.card}>
              <h2 style={S.h2}>Search listing</h2>
              <p style={S.mut}>
                How the firm appears in Google results. Leave blank to use the defaults we tuned
                at launch.
              </p>
              <label style={{ ...S.label, marginTop: 12 }}>Title ({(settings["meta.title"] ?? "").length}/60 recommended)</label>
              <input value={settings["meta.title"] ?? ""} maxLength={90}
                onChange={(e) => setSettings({ ...settings, "meta.title": e.target.value })}
                placeholder="Higgins Law | Trial Attorneys in Pineville, Louisiana" style={{ ...S.input, marginTop: 4 }} />
              <label style={{ ...S.label, marginTop: 12 }}>Description ({(settings["meta.desc"] ?? "").length}/160 recommended)</label>
              <textarea value={settings["meta.desc"] ?? ""} maxLength={220} rows={3}
                onChange={(e) => setSettings({ ...settings, "meta.desc": e.target.value })}
                placeholder="A father and son trial firm in Pineville, Louisiana…" style={{ ...S.input, marginTop: 4, resize: "vertical" }} />
            </section>
            <button onClick={saveSettings} disabled={saving} style={S.btn}>
              {saving ? "Saving…" : "Save announcement & search settings"}
            </button>
          </>
        )}

        {tab === "history" && (
          <section style={S.card}>
            <h2 style={S.h2}>Recent changes</h2>
            <p style={S.mut}>Every save is recorded. Revert puts the earlier version back (and records that too).</p>
            {history.length === 0 && <p style={{ ...S.mut, marginTop: 10 }}>No changes recorded yet.</p>}
            {history.map((h) => (
              <div key={h.id} style={S.proposal}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <b style={{ color: "#f3ead8" }}>{h.label}</b>
                  <span style={S.mut}>{new Date(h.changedAt).toLocaleString()}</span>
                </div>
                {h.oldValue && <span style={S.diffOld}>{h.oldValue.slice(0, 220)}</span>}
                <span style={S.diffNew}>{h.newValue ? h.newValue.slice(0, 220) : "(restored to original)"}</span>
                {h.revertable && (
                  <button style={{ ...S.mini, marginTop: 8 }} disabled={saving}
                    onClick={async () => { setSaving(true); const r = await revertChange(h.id); flash(r.ok ? "Reverted." : r.error || "Could not revert."); if (r.ok) await loadAll(); setSaving(false); }}>
                    Revert to the earlier version
                  </button>
                )}
              </div>
            ))}
          </section>
        )}

        {tab === "intake" && (
          <section style={S.card}>
            <h2 style={S.h2}>Consultation requests</h2>
            {intakes.length === 0 && (
              <p style={S.mut}>None yet. Requests from the website form will appear here the moment they are sent.</p>
            )}
            {intakes.map((i) => (
              <div key={i.id} style={{ ...S.proposal, opacity: i.seen ? 0.65 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <b>{i.name}</b>
                  <span style={S.mut}>{new Date(i.createdAt).toLocaleString()}</span>
                </div>
                <p style={{ margin: "6px 0" }}>
                  <a href={`tel:${i.tel}`} style={S.link}>{i.tel}</a>
                  {i.email ? <> · <a href={`mailto:${i.email}`} style={S.link}>{i.email}</a></> : null}
                </p>
                {i.message && <p style={{ whiteSpace: "pre-wrap" }}>{i.message}</p>}
                <button onClick={async () => { await markIntakeSeen(i.id, !i.seen); setIntakes(await getIntakes()); }} style={S.mini}>
                  {i.seen ? "Mark as new" : "Mark as handled"}
                </button>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  shell: { minHeight: "100vh", background: "#171209", color: "#d9cbb0", fontFamily: "Georgia, serif", padding: "40px 20px", lineHeight: 1.6 },
  card: { background: "#1d1710", border: "1px solid rgba(201,161,95,.2)", padding: 24, marginBottom: 20, maxWidth: 880 },
  h1: { fontSize: 26, color: "#f3ead8", fontWeight: 400, letterSpacing: ".02em" },
  h2: { fontSize: 19, color: "#f3ead8", fontWeight: 400, marginBottom: 8 },
  mut: { color: "#a89877", fontSize: 14 },
  label: { color: "#f3ead8", fontSize: 14, display: "block", marginBottom: 4 },
  input: { width: "100%", background: "#171209", border: "1px solid rgba(201,161,95,.3)", color: "#f3ead8", padding: "10px 12px", fontSize: 15, fontFamily: "inherit", marginTop: 6 },
  btn: { background: "#c9a15f", color: "#171209", border: "1px solid #96733a", padding: "10px 22px", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", cursor: "pointer", marginTop: 12, fontFamily: "inherit" },
  mini: { background: "transparent", color: "#c9a15f", border: "1px solid rgba(201,161,95,.35)", padding: "4px 10px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
  tabOn: { background: "#c9a15f", color: "#171209", border: "1px solid #96733a", padding: "8px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  tabOff: { background: "transparent", color: "#d9cbb0", border: "1px solid rgba(201,161,95,.3)", padding: "8px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  status: { background: "rgba(201,161,95,.12)", border: "1px solid rgba(201,161,95,.3)", padding: "10px 14px", marginBottom: 16, color: "#e6c88d" },
  proposal: { border: "1px solid rgba(201,161,95,.2)", padding: 14, marginBottom: 12, background: "#171209" },
  group: { border: "1px solid rgba(201,161,95,.18)", marginBottom: 10, padding: "10px 14px", background: "#171209" },
  groupHead: { cursor: "pointer", color: "#f3ead8", fontSize: 15 },
  diffOld: { display: "block", marginTop: 6, color: "#a89877", textDecoration: "line-through", fontSize: 14 },
  diffNew: { display: "block", marginTop: 4, color: "#e6c88d", fontSize: 15 },
  link: { color: "#c9a15f" },
};
