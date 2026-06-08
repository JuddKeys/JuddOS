# Judd OS — Deploy to iPhone

## Step 1: Deploy to Netlify (free, ~5 minutes)

1. Go to **netlify.com** and create a free account (use your Google login)
2. After logging in, look for **"Add new site"** → **"Deploy manually"**
3. Open the folder containing your 3 app files:
   - `index.html`
   - `manifest.json`
   - `sw.js`
4. **Drag the entire folder** onto the Netlify drop zone
5. Netlify gives you a URL like `https://amazing-name-123.netlify.app` — this is your app!

---

## Step 2: Add to iPhone Home Screen

1. Open **Safari** on your iPhone (must be Safari, not Chrome)
2. Go to your Netlify URL
3. Tap the **Share button** (box with arrow pointing up, bottom of screen)
4. Scroll down and tap **"Add to Home Screen"**
5. Name it **Judd OS** → tap **Add**

The app icon now lives on your home screen and opens full-screen like a native app.

---

## Step 3: Add your Claude API Key

1. Open Judd OS → tap **⚙** (top right)
2. Paste your API key into the **Claude API Key** field
3. Get a key at **console.anthropic.com** → API Keys → Create key
4. The AI Mentor tab will now be fully active

Cost: Claude Haiku is extremely cheap — personal daily use typically costs < £1/month.

---

## Keeping your data

All your data (workouts, finance, goals, etc.) is saved locally on your device in the browser's storage. It persists between sessions automatically.

If you ever clear Safari's website data, you'll lose your entries — so periodically screenshot your key numbers or export them.

---

## Updating the app

If I make improvements to the app for you, just:
1. Replace the files in your folder with the new versions
2. Drag the folder onto Netlify again — it auto-deploys

---

## Amazfit & Revolut integration (future)

These can be added later:
- **Amazfit/Zepp**: Export health data from the Zepp app and we can build an import feature
- **Revolut**: Revolut has an Open Banking API — we can connect it so transactions sync automatically
