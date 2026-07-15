"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { login, checkAuth } from "../../actions/auth";
import {
  getEditableFields,
  saveSiteContent,
  aiProposeEdits,
  type EditableField,
  type ProposedEdit,
} from "../../actions/content";
import { getIntakes, markIntakeSeen, type Intake } from "../../actions/intake";

type FieldRow = EditableField & { current: string; overridden: boolean };

export default function SiteEditorPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [tab, setTab] = useState<"editor" | "intake">("editor");
  const [fields, setFields] = useState<FieldRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const [instruction, setInstruction] = useState("");
  const [proposing, setProposing] = useState(false);
  const [proposals, setProposals] = useState<ProposedEdit[]>([]);
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [aiNote, setAiNote] = useState("");

  const [intakes, setIntakes] = useState<Intake[]>([]);

  async function loadAll() {
    const { fields } = await getEditableFields();
    setFields(fields);
    setDrafts(Object.fromEntries(fields.map((f) => [f.key, f.current])));
    setIntakes(await getIntakes());
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

  const dirtyKeys = fields
    .filter((f) => (drafts[f.key] ?? f.current) !== f.current)
    .map((f) => f.key);

  const saveDrafts = async () => {
    setSaving(true);
    setStatus("");
    const res = await saveSiteContent(
      dirtyKeys.map((key) => ({ key, value: drafts[key] ?? "" }))
    );
    setStatus(res.ok ? "Saved. The live site updates within a few seconds." : res.error || "Save failed.");
    if (res.ok) await loadAll();
    setSaving(false);
  };

  const resetField = async (key: string) => {
    setSaving(true);
    const res = await saveSiteContent([{ key, value: "" }]);
    if (res.ok) await loadAll();
    setStatus(res.ok ? "Restored the original wording." : res.error || "Reset failed.");
    setSaving(false);
  };

  const propose = async () => {
    setProposing(true);
    setStatus("");
    setProposals([]);
    setAiNote("");
    const res = await aiProposeEdits(instruction);
    if (res.ok) {
      setProposals(res.edits ?? []);
      setAccepted(Object.fromEntries((res.edits ?? []).map((e) => [e.key, true])));
      setAiNote(res.note || "");
      if ((res.edits ?? []).length === 0 && !res.note)
        setStatus("No changes proposed. Try being more specific.");
    } else setStatus(res.error || "Could not propose edits.");
    setProposing(false);
  };

  const applyAccepted = async () => {
    const chosen = proposals.filter((p) => accepted[p.key]);
    if (!chosen.length) return;
    setSaving(true);
    const res = await saveSiteContent(chosen.map((p) => ({ key: p.key, value: p.value })));
    setStatus(res.ok ? "Applied. The live site updates within a few seconds." : res.error || "Apply failed.");
    if (res.ok) {
      setProposals([]);
      setInstruction("");
      await loadAll();
    }
    setSaving(false);
  };

  const labelOf = (key: string) => fields.find((f) => f.key === key)?.label ?? key;
  const currentOf = (key: string) => fields.find((f) => f.key === key)?.current ?? "";
  const unseen = intakes.filter((i) => !i.seen).length;

  if (loading) return <div style={S.shell}><p style={S.mut}>Loading the editor…</p></div>;

  if (!authed)
    return (
      <div style={S.shell}>
        <div style={S.card}>
          <h1 style={S.h1}>Higgins Law · Site Editor</h1>
          <p style={S.mut}>Sign in with the office password.</p>
          <form onSubmit={handleLogin} style={{ marginTop: 16 }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={S.input}
            />
            {loginError && <p style={{ color: "#b3542e", marginTop: 8 }}>{loginError}</p>}
            <button type="submit" style={S.btn}>Sign in</button>
          </form>
          <p style={{ ...S.mut, marginTop: 14 }}>
            <Link href="/admin" style={S.link}>Go to News &amp; Updates admin</Link>
          </p>
        </div>
      </div>
    );

  return (
    <div style={S.shell}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <header style={{ marginBottom: 20 }}>
          <h1 style={S.h1}>Higgins Law · Site Editor</h1>
          <p style={S.mut}>
            Change the words on the homepage yourself, or describe the change and let the
            editor draft it. Nothing goes live until you save.
          </p>
          <nav style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <button onClick={() => setTab("editor")} style={tab === "editor" ? S.tabOn : S.tabOff}>
              Site copy
            </button>
            <button onClick={() => setTab("intake")} style={tab === "intake" ? S.tabOn : S.tabOff}>
              Consultation requests{unseen ? ` (${unseen} new)` : ""}
            </button>
            <Link href="/admin" style={{ ...S.tabOff, textDecoration: "none" }}>News &amp; Updates</Link>
            <Link href="/" style={{ ...S.tabOff, textDecoration: "none" }}>View site</Link>
          </nav>
        </header>

        {status && <p style={S.status} role="status">{status}</p>}

        {tab === "editor" && (
          <>
            <section style={S.card}>
              <h2 style={S.h2}>Ask for a change</h2>
              <p style={S.mut}>
                Plain English is fine: &ldquo;Make the estate planning line warmer&rdquo; or
                &ldquo;Mention that we sit down in person.&rdquo; The editor follows the firm&rsquo;s
                rules: no promises, no invented numbers, your voice.
              </p>
              <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                rows={3}
                placeholder="Describe the change you want…"
                style={{ ...S.input, resize: "vertical" }}
              />
              <button onClick={propose} disabled={proposing || !instruction.trim()} style={S.btn}>
                {proposing ? "Drafting…" : "Propose edits"}
              </button>

              {aiNote && <p style={{ ...S.mut, marginTop: 12 }}>Note from the editor: {aiNote}</p>}

              {proposals.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  {proposals.map((p) => (
                    <div key={p.key} style={S.proposal}>
                      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={!!accepted[p.key]}
                          onChange={(e) => setAccepted({ ...accepted, [p.key]: e.target.checked })}
                          style={{ marginTop: 4 }}
                        />
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
              {fields.map((f) => (
                <div key={f.key} style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                    <label htmlFor={f.key} style={S.label}>
                      {f.label}
                      {f.overridden && <em style={{ color: "#96733a", fontStyle: "normal" }}> · edited</em>}
                    </label>
                    {f.overridden && (
                      <button onClick={() => resetField(f.key)} style={S.mini} disabled={saving}>
                        Restore original
                      </button>
                    )}
                  </div>
                  <textarea
                    id={f.key}
                    value={drafts[f.key] ?? f.current}
                    onChange={(e) => setDrafts({ ...drafts, [f.key]: e.target.value })}
                    rows={Math.min(6, Math.max(2, Math.ceil((drafts[f.key] ?? f.current).length / 90)))}
                    style={{ ...S.input, resize: "vertical" }}
                  />
                  <p style={{ ...S.mut, fontSize: 12, marginTop: 2 }}>{f.hint}</p>
                </div>
              ))}
              <button onClick={saveDrafts} disabled={saving || dirtyKeys.length === 0} style={S.btn}>
                {saving ? "Saving…" : dirtyKeys.length ? `Save ${dirtyKeys.length} change${dirtyKeys.length > 1 ? "s" : ""}` : "Nothing to save"}
              </button>
            </section>
          </>
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
  card: { background: "#1d1710", border: "1px solid rgba(201,161,95,.2)", padding: 24, marginBottom: 20, maxWidth: 860 },
  h1: { fontSize: 26, color: "#f3ead8", fontWeight: 400, letterSpacing: ".02em" },
  h2: { fontSize: 19, color: "#f3ead8", fontWeight: 400, marginBottom: 8 },
  mut: { color: "#a89877", fontSize: 14 },
  label: { color: "#f3ead8", fontSize: 14, display: "block", marginBottom: 4 },
  input: { width: "100%", background: "#171209", border: "1px solid rgba(201,161,95,.3)", color: "#f3ead8", padding: "10px 12px", fontSize: 15, fontFamily: "inherit", marginTop: 6 },
  btn: { background: "#c9a15f", color: "#171209", border: "1px solid #96733a", padding: "10px 22px", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", cursor: "pointer", marginTop: 12, fontFamily: "inherit" },
  mini: { background: "transparent", color: "#c9a15f", border: "1px solid rgba(201,161,95,.35)", padding: "4px 10px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
  tabOn: { background: "#c9a15f", color: "#171209", border: "1px solid #96733a", padding: "8px 16px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  tabOff: { background: "transparent", color: "#d9cbb0", border: "1px solid rgba(201,161,95,.3)", padding: "8px 16px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  status: { background: "rgba(201,161,95,.12)", border: "1px solid rgba(201,161,95,.3)", padding: "10px 14px", marginBottom: 16, color: "#e6c88d" },
  proposal: { border: "1px solid rgba(201,161,95,.2)", padding: 14, marginBottom: 12, background: "#171209" },
  diffOld: { display: "block", marginTop: 6, color: "#a89877", textDecoration: "line-through", fontSize: 14 },
  diffNew: { display: "block", marginTop: 4, color: "#e6c88d", fontSize: 15 },
  link: { color: "#c9a15f" },
};
