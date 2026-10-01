# Architecture & Design Decisions

## Project Overview

Manulife Benefits Assistant is a full-stack AI application designed to make insurance policies more accessible through natural conversation. Employees ask questions in plain language, and the system provides accurate answers backed by policy documents.

**Core components:**
- React frontend for chat interface
- Next.js API routes for server-side AI integration
- Google Gemini API for intelligent policy interpretation
- Vercel for serverless deployment

---

## Why These Technology Choices?

### Next.js 14 (Backend Framework)

**Why:** Single codebase for frontend + backend, built-in optimizations, Vercel-native deployment

**Alternatives considered:**
- Express.js: Would require separate frontend build process
- FastAPI: Python ecosystem, but TypeScript is better for full-stack JS

**Decision:** Next.js lets me handle frontend and API in one repository with shared TypeScript types. Easy deployment path.

### React 18 + TypeScript (Frontend)

**Why:** Component-based UI, type safety, large ecosystem

**Key design:** I used client-side state management (useState) for chat flow because:
- Real-time message updates without page reloads
- Responsive loading indicators
- Chat history only in browser (acceptable for demo)

**Alternative:** Server-side rendering would require page reloads between messages.

### Tailwind CSS (Styling)

**Why:** Utility-first CSS reduces cognitive load, smaller bundle size

**Design decision:** No custom CSS files. All styling is in `className` attributes:
- Easier to see styling while reading code
- Self-documenting design tokens
- Smaller final bundle

**Alternative:** CSS modules would require separate files and more context switching.

### Gemini API (AI Model)

**Why:** Strong reasoning, a generous context window, and an accessible API

**Model selection: Gemini 2.5 Flash**
- Fast responses for FAQ-style questions
- Suitable reasoning for interpreting sample policies

**Context window:** Supports long policy documents and conversation context

The API key is read server-side from `GEMINI_API_KEY` or `GOOGLE_API_KEY`.

---

## Data Flow

```
User Interface
     ↓
User types question + selects plan
     ↓
React state updates
     ↓
handleSubmit() sends to /api/ask
     ↓
API Route (/app/api/ask/route.ts)
     ↓
Loads matching policy document from code
     ↓
Sends to Gemini with system instructions:
  - Loads policy as context
  - Instructs Claude on response format
  - Specifies citation requirements
     ↓
Gemini processes and responds
     ↓
Response returned to frontend
     ↓
React renders message in chat
     ↓
User sees answer with citations
```

---

## API Design: Why /api/ask?

I chose a single endpoint (`/api/ask`) instead of REST-style `/api/health`, `/api/disability`, etc.

**Why:**
1. **Simpler for MVP** - One endpoint to understand and maintain
2. **Extensible** - Adding features (caching, analytics) doesn't require new routes
3. **Query-based filtering** - Plan selection is a parameter, not part of the URL structure

**How it works:**
```typescript
// Frontend sends
POST /api/ask
{
  "question": "What's my deductible?",
  "selectedPlan": "health"
}

// API uses selectedPlan to load correct policy document
// Then calls Gemini with that context
```

**Future improvement:** If adding authentication, this single endpoint makes it easier to add middleware (role checking, audit logging) in one place.

---

## Error Handling Strategy

I wrapped API calls in try-catch blocks because:
1. Gemini API can timeout (network issues)
2. Invalid plans should fail gracefully
3. Users shouldn't see raw error messages

**User experience:**
- Network error → "Sorry, I encountered an error. Please try again."
- Invalid plan → 400 error caught before Claude call
- Invalid API key → 500 with logging for debugging

**Production improvement:** Add structured logging to see which errors are most common.

---

## Security Considerations

### API Key Management

**Current approach:** 
- `.env.local` for local development (never committed to git)
- `.env.local` in `.gitignore` (prevents accidental push)
- Vercel environment variables for production

**Why this works:**
- API key is never in code
- Different keys for local vs. production
- Vercel's env var encryption

**Future improvement:** Implement API key rotation strategy for production.

### No User Authentication (Current)

This demo doesn't require auth because:
- It's a sample project for portfolio
- No real employee data
- Rate limiting would be better than auth at this stage

**If Manulife deployed this:**
- Add SSO (Single Sign-On) with company directory
- Rate limit per user (prevent API abuse)
- Log all questions for compliance
- Restrict to company network or VPN

---

## Scaling Considerations

### What works now (small scale)
- Policies hardcoded in code
- No database
- Stateless API (each request is independent)
- No caching

### What would break at scale
- Adding 1000 policies to code is impractical
- No user authentication = can't track who asks what
- No rate limiting = expensive if viral
- No caching = repeated questions cost money

### Path to production
1. **Database:** Move policies from code to database
2. **Authentication:** Add employee login (Manulife SSO)
3. **Caching:** Store common Q&A to reduce API calls
4. **Analytics:** Track what questions employees ask most
5. **Rate limiting:** Prevent API abuse per user

---

## Why I Made Certain Trade-offs

### 1. Client-Side Chat State (vs. Server-Side)

**Decision:** Keep messages in browser state

**Pros:**
- Simpler code
- No database needed
- Chat history never leaves user's browser

**Cons:**
- Chat history lost on page refresh
- Can't access history from another device

**Why it's OK for now:** Demo project. Real system would use database.

---

### 2. Sample Policies in Code (vs. Database)

**Decision:** Hardcoded policy text

**Pros:**
- Zero database setup
- Shows concept works
- Easy to demo locally

**Cons:**
- Doesn't scale
- Hard to update policies
- Real policies would be massive

**Why it's OK:** This is a prototype. In production, connect to actual policy database.

---

### 3. Synchronous API Calls (vs. WebSocket)

**Decision:** One request = one response

**Pros:**
- Simple to implement
- Easy to debug
- Works reliably

**Cons:**
- User waits for full response
- No streaming (longer perceived wait)

**Why:** For typical responses (1-2 seconds), synchronous is fine. WebSocket would add complexity without much UX gain here.

---

## Testing Approach

**Currently:** Manual testing during development

**Tested:**
- Different questions on same plan
- Switching between plans mid-chat
- Sending empty questions (blocked)
- API errors (missing key, invalid plan)

**What I didn't test:** Load testing with 1000s of concurrent users

**Why:** Solo developer on short timeline. Load testing matters for production.

---

## Future Improvements (Priority Order)

1. **Database** - Move policies from code to real data
2. **Authentication** - Know who's asking questions
3. **Better UX** - Streaming responses (show answer as it's generated)
4. **Analytics** - What questions do employees ask most?
5. **Multi-language** - Support for French, Spanish, etc.
6. **Voice input** - Ask questions aloud for accessibility
7. **Export** - Save policy answers as PDF

---

## Code Quality Notes

**TypeScript throughout:**
- Prevents runtime errors with type checking
- Self-documenting code (interfaces show expected shapes)
- Better IDE support (autocomplete, refactoring)

**No external UI library:**
- Only React + Tailwind
- Smaller bundle
- Full control over styling

**Environment variable validation:**
- Check for API key at startup
- Fail fast if configuration is wrong

**Meaningful comments:**
- Explain WHY not what
- Point out design decisions
- Note trade-offs

---

## Lessons Learned

1. **Planning > Coding** - Sketched the flow before writing code
2. **Constraints drive innovation** - Single endpoint was simpler than REST
3. **TypeScript saves time** - Fewer runtime errors during development
4. **System prompts matter** - How you instruct Claude greatly affects output quality

---

## Questions for Real Implementation

If Manulife decides to use this as a foundation:

1. Where should policies live? (Database? Document store? CMS?)
2. What compliance/audit requirements exist?
3. Should answers be reviewed by HR before showing to employees?
4. Do employees expect multi-language support?
5. Should this integrate with benefits portal/payroll system?

---

Built with attention to clarity, correctness, and scalability.

— Victoria Yefymenko
