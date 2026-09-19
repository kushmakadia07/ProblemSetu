<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Requirements & Architectural Rules

1. **AI-Powered Grievance Intake (Google Gemini API)**:
   - When a citizen files a complaint/grievance, the diagnostic/confirmation questions (in Step 2) must be dynamically generated and asked by **Google Gemini** using a Gemini API key (`GEMINI_API_KEY`).
   - The questions should be tailored dynamically to the specific problem domain, title, and ground description provided by the citizen to gather precise technical parameters for university engineers.

2. **Backend Persistence (Supabase)**:
   - Storage for grievances, questions, answers, and attachments must be persisted in **Supabase** (PostgreSQL / Supabase Storage), **NOT** in browser `localStorage`.

