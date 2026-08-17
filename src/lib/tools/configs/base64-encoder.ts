import type { ToolConfig } from "../types";

function encodeBase64(str: string): string {
  if (typeof btoa === "function") return btoa(unescape(encodeURIComponent(str)));
  return Buffer.from(str, "utf-8").toString("base64");
}
function decodeBase64(str: string): string {
  if (typeof atob === "function") return decodeURIComponent(escape(atob(str)));
  return Buffer.from(str, "base64").toString("utf-8");
}

const tool: ToolConfig = {
  slug: "base64-encoder-decoder",
  updatedAt: "2026-07-16",
  title: "Base64 Encoder / Decoder",
  description:
    "Encode text to Base64 or decode Base64 back to text — instant, client-side, nothing leaves your browser.",
  category: "dev",
  noindex: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "base64 encoder",
      "base64 decoder",
      "base64 encode online",
      "base64 decode online",
      "base64 converter",
    ],
    description:
      "Free online Base64 encoder and decoder. Convert text to Base64 and back instantly in your browser.",
  },
  inputs: [
    {
      name: "mode",
      label: "Mode",
      type: "select",
      default: "encode",
      options: [
        { label: "Encode → Base64", value: "encode" },
        { label: "Decode → Text", value: "decode" },
      ],
    },
    { name: "text", label: "Input", type: "text", default: "Hello, TheCryptoTools!", placeholder: "Text or Base64…" },
  ],
  resultLabel: "Output",
  compute: (i) => {
    const mode = String(i.mode);
    const text = String(i.text ?? "");
    try {
      return mode === "decode" ? decodeBase64(text) : encodeBase64(text);
    } catch {
      return "Invalid input for the selected mode.";
    }
  },
  faq: [
    { q: "What is Base64?", a: "Base64 is an encoding that represents binary data as ASCII text, commonly used in data URIs, JWTs and email attachments." },
    { q: "Is my data sent anywhere?", a: "No. Encoding and decoding run entirely in your browser — nothing is uploaded to a server." },
    { q: "Why does decoding fail?", a: "The input isn't valid Base64. Check for missing padding (=) or characters outside the Base64 alphabet." },
  ],
};

export default tool;
