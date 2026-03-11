# ✦ Wealthmind
### Your Private Financial Intelligence Layer

> A premium AI-powered personal chartered accountant. Built for individuals who want institutional-grade financial analysis — tax liability, transaction insights, P&L generation, and document processing — in a private, secure, and beautifully designed interface.

---

## What This Is

Wealthmind is a conversational AI finance platform. Users can chat with an AI that understands their financial documents, generates formal reports, analyzes portfolios, and provides tax guidance — all within a premium dark-mode interface designed to feel like a private wealth management portal.

This is a bootstrapped solo MVP. Every decision in this codebase prioritizes simplicity, speed, and zero unnecessary cost.

---

## The Five Screens

| Screen | Purpose |
|---|---|
| **Homepage** | Entry point — greeting, feature cards, prompt chips, input bar |
| **Chat View** | The core experience — AI conversation with financial figure rendering |
| **Report / Export** | Institutional document view — generated reports, PDF export |
| **Document Intake** | File upload — receipts, K-1s, bank statements, invoices |
| **Settings** | Profile, billing, security, connected accounts |

---

## Tech Stack

```
Frontend        Next.js 14 (App Router) + TypeScript
Styling         Tailwind CSS
Fonts           Cormorant Garamond (headings) · Inter (UI) · Geist Mono (figures)
Database        MongoDB Atlas (free tier) via Mongoose
Authentication  NextAuth.js
File Storage    Cloudinary (free tier)
AI Engine       DeepSeek API or Gemini Flash (free tier to start)
PDF Generation  @react-pdf/renderer
Hosting         Vercel (free tier)
Version Control Git + GitHub
Editor          VS Code + GitHub Copilot
```

---

## Folder Structure

```
wealthmind/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── chat/
│   ├── report/
│   ├── upload/
│   ├── settings/
│   └── page.tsx               → Homepage
│
├── components/
│   ├── ui/                    → Chips, buttons, inputs, badges
│   ├── chat/                  → Message bubbles, streaming, tables
│   ├── report/                → Document layout, financial tables, figures
│   └── sidebar/               → Nav, session history, user profile
│
├── lib/
│   ├── mongodb.ts             → MongoDB connection
│   ├── ai.ts                  → AI API calls (DeepSeek / Gemini)
│   └── pdf.ts                 → Report PDF generation
│
├── models/
│   ├── User.ts                → User schema
│   ├── Session.ts             → Chat session schema
│   └── Document.ts            → Uploaded document schema
│
├── types/
│   └── index.ts               → Shared TypeScript types
│
└── public/
    └── fonts/                 → Cormorant Garamond files
```

---

## Design System — Quick Reference

### Colors
```css
--background:        #0d0d0d
--surface:           rgba(255,255,255,0.03)
--border-rest:       rgba(255,255,255,0.08)
--border-hover:      rgba(255,255,255,0.18)
--text-primary:      #f0ece4
--text-muted:        rgba(240,236,228,0.5)
--accent-emerald:    #1a5c45   /* positive figures, active states, PRO badge */
--accent-amber:      #c4773a   /* negative figures, warnings, cautions */
```

### Typography Rules
- `Cormorant Garamond` → All headings and report titles only
- `Inter` → All UI text, body copy, labels
- `Geist Mono` → Every financial figure, number, percentage, dollar amount
- Category labels → Always `uppercase`, `0.2em` letter-spacing, `11px`, `0.5` opacity

### Recurring Signature Elements
- `✦` spark icon — beside wordmark and above every AI response
- Ghost pill chips — every action button across all screens
- Small-caps letterspaced labels — every section and category label
- `INSTITUTIONAL ACCESS · END-TO-END ENCRYPTION ENABLED` — footer on every screen
- Borderless tables — all financial data, never grid lines
- No drop shadows — ever. Use border + background shift instead

---

## Environment Variables

Create a `.env.local` file in the root:

```env
# MongoDB
MONGODB_URI=your_mongodb_atlas_connection_string

# NextAuth
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000

# AI Engine (pick one to start)
DEEPSEEK_API_KEY=your_deepseek_api_key
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/YOURUSERNAME/wealthmind.git

# Move into the project
cd wealthmind

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your keys in .env.local

# Run the development server
npm run dev
```

## Status

🟡 **In Development — MVP Phase 1**

---

*Wealthmind is bootstrapped and solo-built. Questions, ideas, or contributions — open an issue.*