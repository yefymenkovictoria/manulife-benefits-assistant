# Deploy to Vercel in 3 Minutes

## Step 1: Push to GitHub
```bash
cd benefits-assistant
git init
git add .
git commit -m "Manulife benefits assistant"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/manulife-benefits-assistant.git
git push -u origin main
```

## Step 2: Connect to Vercel
1. Go to **[vercel.com](https://vercel.com)**
2. Sign in or create account (free tier works great)
3. Click **"Add New..."** → **"Project"**
4. Select **"Import Git Repository"**
5. Paste your GitHub URL and click **Import**

## Step 3: Add Environment Variable
1. In Vercel project settings, go to **"Environment Variables"**
2. Add new variable:
   - Name: `GEMINI_API_KEY`
   - Value: Your key from [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Click "Save"

## Step 4: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Click the live URL when ready
4. Done! ✅

## Get Your API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign up or log in
3. Create an API key
4. Paste it into Vercel as `GEMINI_API_KEY`

## Testing Locally First (Optional)
```bash
npm install
cp .env.local.example .env.local
# Add your API key to .env.local
npm run dev
# Visit http://localhost:3000
```

## Free Tier Limits

**Vercel:**
- Free deployments included
- Auto-rebuilds on push to GitHub
- 1 free custom domain

**Gemini API:**
- Check current quotas and pricing in Google AI Studio

## What to Do After Deploy

1. **Test the live app** - Ask questions about benefits
2. **Get the live URL** - Share with hiring manager
3. **Add to cover letter** - Link to the deployed app
4. **Share on GitHub** - Link to source code

Example GitHub URL: `github.com/your-username/manulife-benefits-assistant`  
Example Live URL: `manulife-benefits-assistant.vercel.app`

## Share With Hiring Manager

In your thank-you email, include:
- **Live demo link**: `https://your-app.vercel.app`
- **GitHub source**: `https://github.com/your-username/your-repo`
- Brief explanation: "I built an AI-powered benefits assistant that uses Gemini to answer questions about sample insurance policies with source-backed explanations."

## Troubleshooting

**App won't load after deploy:**
- Check "Deployments" tab in Vercel for build errors
- Verify `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) is set in Environment Variables
- Try redeploying: click the latest deployment → "Redeploy"

**Getting API errors:**
- Verify the API key is valid in Google AI Studio
- Check you're not out of free credits
- Open DevTools (F12) → Console tab for error details

**Want to modify the app?**
- Make changes locally
- Commit and push to GitHub
- Vercel auto-deploys within 1-2 minutes
- No manual deployment needed!

---

That's it! You now have a production-ready AI benefits assistant deployed and ready to impress. 🎉
