# Deploying to Vercel

## Quick checklist

The 404 (`NOT_FOUND`) error you saw is almost always caused by **one of**:

1. **Missing environment variables** in Vercel project settings.
   Without `NEXT_PUBLIC_FIREBASE_*` the Firebase client SDK can't initialise, and
   any page that imports the Firestore module crashes during SSR → Next.js
   returns a generic 404. (This is what was happening in our build.)
2. Wrong **Root Directory** in the Vercel project settings.
3. A **stale build cache** — fix by redeploying with the cache cleared.

We have already hardened the app so that **missing env vars no longer cause 404s** —
routes render with seed-data fallback. But to get *live* data and admin features,
follow the steps below.

## Steps

### 1. Push the code
```bash
git init
git add .
git commit -m "Initial GauBharath deployment"
git branch -M main
git remote add origin https://github.com/<you>/gau-bharath.git
git push -u origin main
```

### 2. Import into Vercel
- Go to https://vercel.com/new
- Select the GitHub repo
- **Root Directory:** leave as `.` (the repo root contains `package.json`)
- **Framework Preset:** Next.js (auto-detected from `package.json`)
- Click **Deploy** — first deploy will likely fail because env vars aren't set yet (that's OK).

### 3. Add Environment Variables
In **Project Settings → Environment Variables**, add (for **Production**, **Preview**, and **Development**):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDBI0AcAvD8rZU-yfTkCIq_k25_STo3DUI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=breathe-ac7e9.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=breathe-ac7e9
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=breathe-ac7e9.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=533720563405
NEXT_PUBLIC_FIREBASE_APP_ID=1:533720563405:web:7830486cbe0366ee177384
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_SkFUwVayTq7DGq
NEXT_PUBLIC_ADMIN_EMAILS=modaksha@gaubharath.org

RAZORPAY_KEY_ID=rzp_live_SkFUwVayTq7DGq
RAZORPAY_KEY_SECRET=tEhkJkIUy8M33tCSkRwodQtT

FIREBASE_ADMIN_PROJECT_ID=breathe-ac7e9
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@breathe-ac7e9.iam.gserviceaccount.com
# IMPORTANT: paste the raw private key here, keeping newlines. Vercel accepts
# multi-line values; you can paste the entire "-----BEGIN PRIVATE KEY-----" block.
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADAN...REPLACE_ME...==\n-----END PRIVATE KEY-----

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=hemathehealer@tattvamniramaya.com
SMTP_PASS=qwbz mgyk tpjo rytd
EMAIL_FROM=GauBharath <hemathehealer@tattvamniramaya.com>
BUSINESS_NOTIFICATION_EMAIL=hemathehealer@tattvamniramaya.com
APP_BASE_URL=https://<your-app>.vercel.app
```

> ⚠️ The `FIREBASE_ADMIN_PRIVATE_KEY` must contain `\n` (literal backslash-n)
> between lines. If Vercel strips them, the build will fail with
> `Invalid PEM formatted message`.

### 4. Redeploy
After saving env vars, go to **Deployments → ⋯ → Redeploy**. Vercel will rebuild with the new config.

### 5. (Optional) Custom domain
In **Settings → Domains**, add your domain and follow the DNS instructions.

## Troubleshooting

| Error | Fix |
| --- | --- |
| `404: NOT_FOUND` on every route | Ensure **Output Directory** in Vercel Project Settings (and `vercel.json`) is **NOT** set to `.next` (leave empty/default). Also verify required environment variables (`NEXT_PUBLIC_FIREBASE_*`) are set. |
| Build fails: `Invalid PEM formatted message` | Your `FIREBASE_ADMIN_PRIVATE_KEY` lost its `\n` escapes. Re-paste it preserving the escaped newlines. |
| `payment failed` in checkout | Confirm `RAZORPAY_KEY_SECRET` is set; the public key alone isn't enough for order creation/verification. |
| Admin login redirects back to login | Make sure the email you log in with is in `NEXT_PUBLIC_ADMIN_EMAILS` (comma-separated) and that user exists in Firebase Auth. |
| Audio file 404 | The `public/assets/audio/` folder must be in the Git tree. `git ls-files public/assets/audio/` should list it. |
