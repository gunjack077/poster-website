"use client";

import { useMemo, useState } from "react";

type Result = { variant: string; b64: string };
type Mode = "daraz" | "whatsapp" | "facebook";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<Mode>("daraz");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  async function generate() {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const form = new FormData();
      form.append("image", file);
      form.append("mode", mode);

      const res = await fetch("/api/generate", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed");

      setResults(json.results || []);
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  function download(b64: string, name: string) {
    const a = document.createElement("a");
    a.href = `data:image/png;base64,${b64}`;
    a.download = name;
    a.click();
  }

  return (
    <main style={{ maxWidth: 1040, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>Poster Maker (Daraz / WhatsApp / Facebook)</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Upload product image → generate posters automatically.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 16 }}>
          <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>1) Upload image</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />

          {previewUrl && (
            <div style={{ marginTop: 12 }}>
              <img src={previewUrl} alt="preview" style={{ width: "100%", borderRadius: 12 }} />
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>2) Platform</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            >
              <option value="daraz">Daraz (Square 1080×1080)</option>
              <option value="whatsapp">WhatsApp Status (1080×1920)</option>
              <option value="facebook">Facebook Feed (1080×1350)</option>
            </select>
          </div>

          <button
            onClick={generate}
            disabled={!file || loading}
            style={{
              marginTop: 16,
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 800,
            }}
          >
            {loading ? "Generating..." : "Generate Posters"}
          </button>

          {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 16 }}>
          <div style={{ fontWeight: 800 }}>3) Results ({results.length})</div>

          {results.length === 0 ? (
            <p style={{ opacity: 0.7 }}>Generated posters will appear here.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
              {results.map((r) => (
                <div key={r.variant} style={{ border: "1px solid #eee", borderRadius: 12, padding: 10 }}>
                  <div style={{ fontWeight: 800, marginBottom: 6, textTransform: "capitalize" }}>{r.variant}</div>
                  <img
                    src={`data:image/png;base64,${r.b64}`}
                    alt={r.variant}
                    style={{ width: "100%", borderRadius: 10 }}
                  />
                  <button
                    onClick={() => download(r.b64, `${mode}-${r.variant}.png`)}
                    style={{
                      marginTop: 10,
                      width: "100%",
                      padding: 10,
                      borderRadius: 10,
                      border: "1px solid #ddd",
                      background: "white",
                      cursor: "pointer",
                      fontWeight: 800,
                    }}
                  >
                    Download PNG
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
