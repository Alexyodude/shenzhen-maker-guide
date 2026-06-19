# SZ // maker — Shenzhen Maker Field Guide

A single-page, password-gated guide to Shenzhen's maker scene: **making spaces**, **materials**,
**sleeping**, and a **packing list**. Hosted on GitHub Pages.

## 🔒 How the password works

The page content is **encrypted at build time** (AES-256-GCM, key derived from the passphrase with
PBKDF2-SHA-256, 250k iterations). The published `index.html` contains only the encrypted blob — no
plaintext content. The browser decrypts it client-side via the Web Crypto API after you enter the
passphrase.

- The passphrase is supplied at build time via the `SZ_PW` environment variable and is
  **intentionally never committed to this repo** — otherwise anyone could read it and decrypt
  the page, defeating the gate. (The repo is public so GitHub Pages can serve it on a free plan.)
- This is genuine encryption (content is not readable via "View Source"), **but** a short
  dictionary passphrase is brute-forceable offline. It keeps the page from casual eyes, not determined attackers.

## ✏️ Editing & rebuilding

1. Edit **`content.html`** — that's the plaintext source for the three+one sections.
2. (Optional) tweak the shell/styles in **`index.template.html`**.
3. Rebuild the encrypted page:

   ```bash
   SZ_PW="your passphrase" node build.mjs         # bash / git-bash
   ```
   ```powershell
   $env:SZ_PW="your passphrase"; node build.mjs   # PowerShell
   ```
   The build fails fast if `SZ_PW` is unset, so the passphrase never gets hardcoded.

   This regenerates `index.html`.
4. Commit & push — GitHub Pages serves the new `index.html`.

## 📁 Files

| File | Purpose |
|------|---------|
| `index.html` | **Built output** served by Pages (encrypted). Do not edit by hand. |
| `content.html` | Plaintext content source (sections). **Kept local — gitignored so it never reaches GitHub.** |
| `index.template.html` | Page shell: styles, login gate, decryption JS. |
| `build.mjs` | Encrypts `content.html` into `index.html`. |
| `.nojekyll` | Tells GitHub Pages to serve files as-is. |

## ⚠️ Disclaimer

Costs, registration rules, and accommodation prices change often and were compiled best-effort.
**Confirm directly** with each space/hotel before you travel or pay.
