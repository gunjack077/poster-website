import OpenAI from "openai";
import sharp from "sharp";

export const runtime = "nodejs";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type Mode = "daraz" | "whatsapp" | "facebook";

function promptFor(mode: Mode, variant: string) {
  const base =
    `Create a premium e-commerce cosmetic advertisement poster. ` +
    `Use the uploaded product image as the main hero (centered, large). ` +
    `Lighting: glossy studio lighting, clean shadow, subtle reflection. ` +
    `Background: sun-kissed gradient (gold/orange/pink), soft rays, subtle sparkles. ` +
    `Design: modern, high-contrast, marketplace-ready, clean icons. ` +
    `Use clear English only. No random or distorted text. ` +
    `Keep text bold and minimal. `;

  const variantText: Record<string, string> = {
    bestseller:
      `Headline: "SPF 45+ SUNSCREEN". Subhead: "Ultimate Skin Protection". ` +
      `3 icon bullets: "UVA/UVB Broad Spectrum", "No White Cast", "Lightweight". CTA: "SHOP NOW".`,
    discount:
      `Headline: "LIMITED OFFER". Add a discount badge area (no currency). ` +
      `3 bullets: "SPF 45+", "PA+++ Defense", "Daily Wear". CTA: "BUY NOW".`,
    benefits:
      `Headline: "PROTECT YOUR SKIN EVERY DAY". ` +
      `4 ticks: "SPF 45+", "PA+++", "Fast Absorbing", "Non-Greasy". CTA: "ADD TO CART".`,
    lifestyle:
      `Lifestyle sun/beach vibe background but product remains dominant foreground. ` +
      `Headline: "READY FOR THE SUN?". ` +
      `3 bullets: "Under Makeup", "No White Cast", "Comfort Wear". CTA: "SHOP NOW".`,
  };

  const platformHints: Record<Mode, string> = {
    daraz: `Square marketplace banner style (1:1). No platform logos.`,
    whatsapp: `Vertical status style (9:16). Minimal text.`,
    facebook: `Facebook feed ad style (4:5). Clean and premium.`,
  };

  return `${base} ${platformHints[mode]} ${variantText[variant] ?? variantText.bestseller}`;
}

async function resizeToPng(b64: string, width: number, height: number) {
  const input = Buffer.from(b64, "base64");
  const out = await sharp(input)
    .resize(width, height, { fit: "cover", position: "center" })
    .png({ quality: 95 })
    .toBuffer();
  return out.toString("base64");
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("image") as File | null;
    const mode = (form.get("mode") as Mode) || "daraz";

    if (!file) return Response.json({ error: "No image uploaded" }, { status: 400 });

    // We accept upload mainly for future "image-conditioned" workflows.
    // Current version generates posters from prompt templates.
    const variants = ["bestseller", "discount", "benefits", "lifestyle"];

    const targets: Record<Mode, { w: number; h: number }> = {
      daraz: { w: 1080, h: 1080 },
      whatsapp: { w: 1080, h: 1920 },
      facebook: { w: 1080, h: 1350 },
    };

    const { w, h } = targets[mode];
    const results: { variant: string; b64: string }[] = [];

    for (const v of variants) {
      const prompt = promptFor(mode, v);

      const img = await client.images.generate({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024"
      });

      const b64 = img.data?.[0]?.b64_json;
      if (!b64) continue;

      const resized = await resizeToPng(b64, w, h);
      results.push({ variant: v, b64: resized });
    }

    return Response.json({ mode, results });
  } catch (e: any) {
    return Response.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
