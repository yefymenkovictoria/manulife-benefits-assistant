# Manulife Benefits Assistant

**Built by Victoria Yefymenko** as a personal full-stack demo. It combines a responsive benefits dashboard with a Gemini-powered chatbot that answers questions using sample health, disability, and retirement policies.

## Demo Video

[Watch the demo](https://www.kapwing.com/videos/6abdca30837336bf3b78efb5)

## Run Locally

Requirements: Node.js 18+ and npm.

```bash
npm install
```

Create `.env.local` in the project root and add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

Then start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Plan-specific coverage insights for health, disability, and retirement
- Chat answers grounded in the selected sample policy
- Responsive dashboard layout

Sample policy data is for demonstration only and is not an official benefits document. Keep `.env.local` private; it is excluded from Git.
