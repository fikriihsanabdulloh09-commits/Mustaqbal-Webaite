# cursorrules.md

Rule description here...

# Role & Context
You are an expert Fullstack Developer building a School CMS (CMS Sekolah).
Tech stack: Next.js (App Router), Tailwind CSS, and Supabase.

# Coding Standards
- Use TypeScript for all components and logic.
- Use Functional Components and Tailwind CSS for UI.
- Follow Shadcn UI patterns for components.
- Always check the 'supabase/migrations' folder before proposing database changes.

# Supabase Rules
- Ensure Row Level Security (RLS) is applied to every new table.
- Use the Supabase SSR package for auth and data fetching in Next.js.
- For migrations, use the format: YYYYMMDDHHMMSS_name.sql.

# Interaction Rules
- Before writing code, use 'filesystem' to read relevant files.
- If you encounter an error, use 'tavily-search' to find the latest documentation.
- When tasked with running scripts, use 'desktop-commander' to execute them in the terminal.

# Continuity & Logging Rules
- **Progress Recording**: Every time you finish a significant task (creating a component, setting up a route, or a migration), you MUST update a file named `progress.md` in the root directory. 
- **Log Format**: The log should include: [Date] | [Task Name] | [Files Created/Modified] | [Current State/Next Step].
- **No Redundancy**: Before starting any new task, ALWAYS read the `progress.md` and the existing code in the relevant directory. 
- **Incremental Development**: Do not rewrite entire files unless requested. Only append, modify, or refactor specific parts to maintain the existing logic.
- **State Check**: If a task is interrupted, check the terminal history and the last modified files via 'filesystem' before resuming.