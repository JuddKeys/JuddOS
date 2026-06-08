# Judd OS — Automation Setup

---

## Part 1: Revolut Auto-Sync

This uses GoCardless Bank Account Data — free for personal use, no FCA registration needed. You authenticate with Revolut once, then tap "Sync now" in the app whenever you want (or it syncs automatically on load).

### Step 1: Create a GoCardless account

1. Go to **bankaccountdata.gocardless.com**
2. Click **Sign Up** → create a free account
3. After logging in, go to **User Secrets** (in the left sidebar)
4. Click **Create new secret**
5. Copy your **Secret ID** and **Secret Key** — you'll need both

### Step 2: Add your credentials to Judd OS

1. Open Judd OS → tap ⚙ (top right)
2. Paste your **Secret ID** into the GoCardless Secret ID field
3. Paste your **Secret Key** into the GoCardless Secret Key field
4. Tap **Connect** next to Revolut
5. You'll be redirected to Revolut's login page — sign in with your Revolut credentials
6. After approving, you'll be sent back to Judd OS automatically
7. Your transactions and Revolut balance will import immediately

**After that:** tap "Sync now" in the Finance tab anytime to pull the latest data. GoCardless access lasts 90 days — after that you'll need to tap Connect once more.

---

## Part 2: Apple Health / Amazfit Auto-Sync

The Zepp app (Amazfit) syncs your sleep, steps, and weight to Apple Health automatically. We use an Apple Shortcut to read that data each morning and push it into Judd OS — completely hands-free.

### Step 1: Make sure Zepp syncs to Apple Health

1. Open the **Zepp** app → Profile → Apps → Health
2. Enable: **Sleep**, **Body Weight**, **Steps**, **Heart Rate**

### Step 2: Create the Apple Shortcut

1. Open the **Shortcuts** app on your iPhone
2. Tap **+** (top right) → **Add Action**

Add these actions in order:

**Action 1 — Get sleep duration:**
- Search: `Find Health Samples`
- Type: `Sleep Analysis` → Sort by `Start Date` descending → Limit: 1
- Add: `Get Details of Health Sample` → Detail: `Duration`
- Add: `Calculate` → divide result by `3600` (converts seconds to hours)
- Add: `Round` → to 1 decimal place
- Set variable: name it `SleepHours`

**Action 2 — Get steps:**
- Search: `Find Health Samples`
- Type: `Steps` → Date: `Yesterday`
- Add: `Calculate Statistics` → Sum
- Set variable: name it `Steps`

**Action 3 — Get weight:**
- Search: `Find Health Samples`
- Type: `Body Mass` → Sort by `Start Date` descending → Limit: 1
- Add: `Get Details of Health Sample` → Detail: `Value`
- Set variable: name it `WeightKG`

**Action 4 — Open Judd OS with the data:**
- Search: `Open URL`
- URL: `https://YOUR-APP-URL.netlify.app/?health=1&sleep=[SleepHours]&weight=[WeightKG]&steps=[Steps]`
  - Replace `YOUR-APP-URL` with your actual Netlify URL
  - Tap each `[variable]` and insert the variable from the list

**Name the Shortcut:** `Judd OS Health Sync`

### Step 3: Automate it to run every morning

1. In Shortcuts → tap **Automation** (bottom nav)
2. Tap **+** → **Time of Day**
3. Set time: **7:00 AM** → Daily
4. Tap **Next** → search for your shortcut → select **Judd OS Health Sync**
5. Turn OFF "Ask Before Running" → tap **Done**

That's it. Every morning at 7am your sleep, weight, and steps from Amazfit will appear in Judd OS automatically — and you'll see a "✓ Apple Health synced" banner when you open the app.

---

## Folder structure reminder

Your app folder should look like this before dragging to Netlify:

```
JuddOS/
├── index.html
├── manifest.json
├── sw.js
├── netlify.toml
└── netlify/
    └── functions/
        ├── gc-token.js
        ├── gc-link.js
        ├── gc-accounts.js
        ├── gc-balance.js
        └── gc-transactions.js
```
