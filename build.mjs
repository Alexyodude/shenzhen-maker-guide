// build.mjs — encrypt content.html into a static, password-gated index.html
// Browser decrypts with Web Crypto (PBKDF2 -> AES-GCM). Params here MUST match the template.
import { readFile, writeFile } from "node:fs/promises";

const PASSWORD = process.env.SZ_PW;
if (!PASSWORD) {
  console.error('Passphrase required (kept out of source). Run:  SZ_PW="your passphrase" node build.mjs');
  process.exit(1);
}
const ITER = 250000;
const subtle = globalThis.crypto.subtle;

const b64 = (bytes) => Buffer.from(bytes).toString("base64");

const content = await readFile(new URL("./content.html", import.meta.url), "utf8");
let template = await readFile(new URL("./index.template.html", import.meta.url), "utf8");

const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));

const km = await subtle.importKey("raw", new TextEncoder().encode(PASSWORD), "PBKDF2", false, ["deriveKey"]);
const key = await subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" },
  km, { name: "AES-GCM", length: 256 }, false, ["encrypt"]
);
const ctBuf = await subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(content));

const payload = JSON.stringify({ salt: b64(salt), iv: b64(iv), ct: b64(new Uint8Array(ctBuf)) });

template = template.replace("/*__PAYLOAD__*/ null", payload);
template = template.replace("/*__ITER__*/ 250000", String(ITER));

if (template.includes("/*__PAYLOAD__*/") || template.includes("/*__ITER__*/")) {
  throw new Error("Placeholder not replaced — check template markers.");
}

await writeFile(new URL("./index.html", import.meta.url), template, "utf8");
console.log(`OK: index.html built (${content.length} chars content -> ${new Uint8Array(ctBuf).length} bytes ciphertext)`);
