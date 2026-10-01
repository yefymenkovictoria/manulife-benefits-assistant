# Quick Start Guide

## 🚀 Get This Running in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```
Wait for npm to finish (first time takes ~30 seconds)

### Step 2: Get Gemini API Key
1. Go to https://aistudio.google.com/app/apikey
2. Sign up or log in
3. Create an API key
4. Copy the key

### Step 3: Create .env.local File
```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and paste your key:
```
GEMINI_API_KEY=paste-your-key-here
```

### Step 4: Run Locally
```bash
npm run dev
```

Visit: `http://localhost:3000`

Try asking: "What's the maximum out-of-pocket cost for health insurance?"

### Step 5: Push to GitHub
When you're ready:
```bash
chmod +x PUSH_TO_GITHUB.sh
./PUSH_TO_GITHUB.sh
```

Follow the prompts. Done!

---

## 📊 What to Expect

**Response time:** 1-3 seconds (Gemini API processing)

**Good test questions:**
- "What's the annual deductible?"
- "How long until disability payments start?"
- "Can I contribute to my 401k right away?"
- "What's not covered?"

**Features to notice:**
- Real-time typing indicator
- Plan selector changes context
- Citations from policy documents
- Error handling on network issues

---

## 🐛 Troubleshooting

**"API key not found"**
- Check `.env.local` file exists
- Make sure it has `GEMINI_API_KEY=...` (or `GOOGLE_API_KEY=...`)
- Restart dev server (`Ctrl+C`, then `npm run dev`)

**"npm ERR! Cannot find module"**
- Run `npm install` again
- Delete `node_modules/` folder and reinstall

**"Response is blank"**
- Check browser console (F12) for errors
- Verify API key is correct
- Check your Gemini API quota in Google AI Studio

**"Deployment fails on Vercel"**
- Check Node.js version: `node --version` (need 18+)
- Verify `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) in Vercel environment variables
- Try redeploying

---

## 📝 Next Steps

1. **Customize the UI** - Update colors in `tailwind.config.ts`
2. **Add more policies** - Edit sample policies in `app/api/ask/route.ts`
3. **Adjust AI behavior** - Change system prompt in same file
4. **Deploy to Vercel** - See DEPLOYMENT.md

---

That's it! You've got a working AI benefits assistant.
