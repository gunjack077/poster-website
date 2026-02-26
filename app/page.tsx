"use client";

import { useState } from "react";

type Mode = "daraz" | "whatsapp" | "facebook";

export default function Home() {
  const [mode, setMode] = useState<Mode>("daraz");
  const [prompt, setPrompt] = useState("");

  function generatePrompt() {
    const base =
      `Create a premium cosmetic advertisement poster using the uploaded sunscreen product image as the main hero. ` +
      `Use glossy studio lighting, realistic shadow, premium cosmetic branding, clean typography, high contrast. ` +
      `Avoid distorted or random text. Keep headlines bold and minimal. `;

    const platformPrompts = {
      daraz:
        `Format: Square 1:1 (1080x1080). Marketplace style. ` +
        `Headline: "SPF 45+ SUNSCREEN". ` +
        `Add 3 benefit icons: "UVA/UVB Protection", "No White Cast", "Lightweight & Non-Greasy". ` +
        `Add bold CTA button: "BUY NOW". ` +
        `Bright sun-kissed orange/golden background.`,

      whatsapp:
        `Format: Vertical 9:16 (1080x1920). WhatsApp Status style. ` +
        `Minimal text. Big product focus. ` +
        `Headline: "Protect Your Skin Every Day". ` +
        `2 benefits only. Big glowing CTA: "ORDER NOW". ` +
        `Luxury summer vibe background.`,

      facebook:
        `Format: 4:5 (1080x1350). Facebook feed ad style. ` +
        `Headline: "Ready for the Sun?". ` +
        `Add clean benefit list with check icons. ` +
        `CTA button: "SHOP NOW". ` +
        `Premium cosmetic lighting with beach/sun theme.`
    };

    setPrompt(base + platformPrompts[mode]);
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 20, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28 }}>Free Poster Prompt Generator</h1>
      <p>Create high-converting prompts for Daraz, WhatsApp & Facebook ads.</p>

      <div style={{ marginTop: 20 }}>
        <label style={{ fontWeight: 600 }}>Select Platform:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          style={{ marginLeft: 10, padding: 8 }}
        >
          <option value="daraz">Daraz (1080x1080)</option>
          <option value="whatsapp">WhatsApp Status</option>
          <option value="facebook">Facebook Feed</option>
        </select>
      </div>

      <button
        onClick={generatePrompt}
        style={{
          marginTop: 20,
          padding: 12,
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Generate Prompt
      </button>

      {prompt && (
        <div style={{ marginTop: 30 }}>
          <h3>Copy This Prompt:</h3>
          <textarea
            value={prompt}
            readOnly
            rows={10}
            style={{ width: "100%", padding: 10 }}
          />
          <button
            onClick={() => navigator.clipboard.writeText(prompt)}
            style={{ marginTop: 10, padding: 10 }}
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </main>
  );
}
