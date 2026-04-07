# Stakeholder Update Generator

A micro SaaS tool for Product Managers to instantly generate stakeholder
updates in three formats — Slack message, email, and executive summary —
from a simple form input.

---

## What It Does

PMs waste time writing the same update in multiple formats for different
audiences. This tool solves that: fill in three fields, click generate,
and get three ready-to-copy outputs in seconds.

**Inputs**
- What shipped
- Key metrics
- Risks & blockers

**Outputs**
- Slack message (emoji, bullet points, concise)
- Email (subject line, structured sections, sign-off)
- Executive summary (3-sentence TL;DR in confident language)

---

## Tech Stack

| Layer     | Technology          | Why                                              |
|-----------|---------------------|--------------------------------------------------|
| Backend   | Node.js + Express   | Minimal, no-config HTTP server                   |
| Frontend  | React + Vite        | Component-based UI with instant hot reload       |
| Styling   | Plain CSS           | No framework overhead, full control              |
| Templates | Pure JS strings     | No AI needed — fast, free, and deterministic     |

---

## Architecture

┌─────────────────────────────────────────────────┐
│                   Browser                        │
│                                                  │
│   React App (Vite)                               │
│   ┌──────────┐  ┌─────────────┐  ┌───────────┐  │
│   │InputForm │  │OutputSection│  │ErrorMessage│  │
│   └────┬─────┘  └──────┬──────┘  └─────┬─────┘  │
│        │               │               │          │
│        └───────────────┴───────────────┘          │
│                        │                          │
│                   App.jsx (state)                 │
└────────────────────────┼──────────────────────────┘
│ fetch POST /api/generate
▼
┌─────────────────────────────────────────────────-┐
│              Express Server (port 3000)          │
│                                                  │
│  server.js                                       │
│  ├── serves frontend/dist/ (static files)        │
│  ├── GET  /api/health                            │
│  └── POST /api/generate                          │
│            │                                     │
│            ▼                                     │
│  backend/routes/generate.js                      │
│  ├── validates input (400 if missing fields)     │
│  └── calls generateUpdates()                     │
│            │                                     │
│            ▼                                     │
│  backend/templates/generator.js                  │
│  └── returns { slack, email, executive_summary } │
└─────────────────────────────────────────────────-┘

### Key Design Decisions

**Monorepo structure** — the Express backend and the React frontend live
in the same repository. Express serves the Vite build output in production,
so there is only one process to run and one port to expose.

**Template-based generation** — outputs are built from plain JS string
templates, not an AI API. This keeps the tool free to run, fast to
respond, and fully predictable. AI generation can be added later as an
enhancement without changing the architecture.

**Vite proxy in development** — during local development, Vite runs on
port 5173 with hot reload. All `/api/*` requests are proxied to Express
on port 3000, so the two servers work together transparently.

---

## Project Structure
stakeholder-update-generator/
├── server.js                        # Express entry point
├── package.json                     # Root scripts
├── .gitignore
│
├── backend/
│   ├── routes/
│   │   └── generate.js              # POST /api/generate handler
│   ├── templates/
│   │   └── generator.js             # Core output generation logic
│   └── test.js                      # Manual API test script
│
└── frontend/                        # React + Vite app
├── index.html
├── vite.config.js               # Vite config + dev proxy
├── package.json                 # Frontend dependencies
└── src/
├── main.jsx                 # React entry point
├── App.jsx                  # Root component + state
├── App.css                  # Global styles
└── components/
├── InputForm.jsx        # Controlled form with validation
├── InputForm.css
├── OutputSection.jsx    # Single output card + copy button
├── OutputSection.css
├── ErrorMessage.jsx     # Error banner
└── LoadingSpinner.jsx   # Animated loading indicator

---

## Local Development

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Setup
```bash
# 1. Clone the repo
git clone https://github.com/your-username/stakeholder-update-generator.git
cd stakeholder-update-generator

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd frontend && npm install && cd ..
```

### Running in Development

Open two terminals:
```bash
# Terminal 1 — Express backend (port 3000)
npm start

# Terminal 2 — Vite dev server (port 5173, hot reload)
npm run client:dev
```

Then open **http://localhost:5173**

> API calls made from the Vite dev server are automatically proxied to
> Express on port 3000 — no CORS issues, no extra config needed.

### Running the Production Build
```bash
# Build the React app into frontend/dist/
npm run client:build

# Start Express — serves both the API and the built frontend
npm start
```

Then open **http://localhost:3000**

---

## API Reference

### `GET /api/health`

Health check.

**Response**
```json
{ "status": "ok" }
```

---

### `POST /api/generate`

Generate stakeholder updates from form input.

**Request body**
```json
{
  "shipped": "Launched onboarding redesign and fixed 3 critical bugs",
  "metrics": "Activation rate up 12%, support tickets down 20%",
  "risks":   "Payment integration delayed 1 week due to third-party API issues"
}
```

**Success response — 200**
```json
{
  "slack": "...",
  "email": "...",
  "executive_summary": "..."
}
```

**Validation error — 400**
```json
{ "error": "Missing or empty required fields: metrics" }
```

**Server error — 500**
```json
{ "error": "Something went wrong. Please try again." }
```

---

### Testing the API manually

Make sure the server is running, then in a second terminal:
```bash
node backend/test.js
```

This runs 3 automated tests: a happy path, a single missing field, and
all fields empty. Results are printed to the console.

---