# 🤖 AGENT.md — CV Craft AI

> Dokumen ini dibuat untuk AI coding agent (Cursor, Cline, Copilot, Windsurf, dll) agar dapat memahami dan berkontribusi pada project ini secara efektif.

---

## 🎯 Project Identity

| Key | Value |
|-----|-------|
| **Nama** | CV Craft AI (BuatCVAI) |
| **Domain** | BuatCVAI.com |
| **Tipe** | Single Page Application (SPA) |
| **Tujuan** | AI-powered CV/Resume builder untuk pasar Indonesia & global |
| **Bahasa UI** | Indonesia (default) + English |
| **Repository** | https://github.com/zainalsalamun/cv-craft-ai.git |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────┐
│                   Frontend                   │
│         React 18 + TypeScript + Vite         │
│         Tailwind CSS + shadcn/ui             │
├─────────────────────────────────────────────┤
│              State Management                │
│    React Hooks + useLocalStorage (persist)    │
├─────────────────────────────────────────────┤
│                   Backend                    │
│              Supabase (BaaS)                 │
│  ┌──────────┬──────────┬──────────────────┐  │
│  │   Auth   │ Database │  Edge Functions   │  │
│  │ (GoTrue) │ (Postgres)│  (Deno Runtime)  │  │
│  └──────────┴──────────┴──────────────────┘  │
├─────────────────────────────────────────────┤
│               AI Layer                       │
│  Lovable AI Gateway → Google Gemini 2.5 Flash│
│  (Fallback: OpenAI API)                      │
└─────────────────────────────────────────────┘
```

---

## 📁 File Map & Responsibilities

### Pages (`src/pages/`)

| File | Route | Auth | Purpose |
|------|-------|:---:|---------|
| `Index.tsx` | `/` | ❌ | Landing page — komposisi dari `landing/*` components |
| `Auth.tsx` | `/auth` | ❌ | Login & Register — email/password + Google OAuth |
| `Builder.tsx` | `/build` | ✅ | Wizard container — mengelola state 4-step flow |
| `Editor.tsx` | `/editor` | ❌ | Full CV editor — split panel (form + preview) |
| `AdminDashboard.tsx` | `/admin` | ✅ Admin | Admin panel — user mgmt, content, settings |
| `NotFound.tsx` | `*` | ❌ | 404 halaman |

### Builder Steps (`src/pages/builder/`)

| File | Step | Input → Output |
|------|------|----------------|
| `Step1JobDescription.tsx` | 1 | Job description text → stored in state |
| `Step2UploadCV.tsx` | 2 | PDF upload → parsed text via `pdfjs-dist` |
| `Step3Result.tsx` | 3 | Calls `optimize-cv` edge function → match score + optimized CV |
| `Step4Editor.tsx` | 4 | Inline editor → final CVData |

### Editor Forms (`src/components/editor/`)

| File | Section | Key Features |
|------|---------|--------------|
| `PersonalInfoForm.tsx` | Personal Info | Photo upload (base64), all contact fields |
| `SummaryForm.tsx` | Summary | AI summary generator (3 variants), language toggle |
| `ExperienceForm.tsx` | Work Experience | Dynamic list, bullet points, date ranges |
| `EducationForm.tsx` | Education | Dynamic list, degree & institution |
| `SkillsForm.tsx` | Skills | Tag-based skill input |
| `ProjectsForm.tsx` | Projects | Dynamic list with URLs |
| `AdditionalForm.tsx` | Certificates, Languages, Hobbies, Achievements | Tabbed sub-forms |
| `SettingsPanel.tsx` | CV Settings | Template selector, accent color, font size, section toggles |
| `CVPreview.tsx` | Preview | Real-time CV rendering with template switching, zoom controls |

### Custom Hooks (`src/hooks/`)

| File | Hook | Purpose |
|------|------|---------|
| `useLocalStorage.ts` | `useLocalStorage` | Generic localStorage read/write with JSON serialization |
| `use-mobile.tsx` | `useIsMobile` | Responsive breakpoint detection (`< 768px`) |
| `use-toast.ts` | `useToast` | Toast notification state management |

### Supabase Integration (`src/integrations/supabase/`)

| File | Purpose |
|------|---------|
| `client.ts` | Supabase client initialization using `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY` |
| `types.ts` | Auto-generated database types (currently empty schema — profiles table managed via raw SQL) |

### Edge Functions (`supabase/functions/`)

| Function | Runtime | AI Model | Purpose |
|----------|---------|----------|---------|
| `generate-summary` | Deno | Gemini 2.5 Flash | Generate 3 professional summary variants |
| `optimize-cv` | Deno | Gemini 2.5 Flash | ATS optimization: match score, missing skills, keyword extraction, bullet rewrite |

### Database (`supabase/`)

| File | Purpose |
|------|---------|
| `setup_roles.sql` | Schema: `profiles` table, RLS policies, auto-create trigger |
| `config.toml` | Supabase local dev configuration |

---

## 🔑 Key Patterns & Conventions

### State Management Pattern
```
Editor.tsx (state owner)
  ├─ useLocalStorage<CVData>('cv-data', defaultCVData)
  ├─ useLocalStorage<CVSettings>('cv-settings', defaultSettings)
  │
  ├─ Passes data + setters down to form components via props
  └─ CVPreview.tsx receives data + settings for rendering
```

**Tidak ada global state management (Redux/Zustand).** Semua state di-manage di `Editor.tsx` dan di-pass via props. LocalStorage digunakan untuk persistence.

### Routing Pattern
```typescript
// App.tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/build" element={<Builder />} />      // ProtectedRoute wrapper
    <Route path="/editor" element={<Editor />} />
    <Route path="/admin" element={<AdminDashboard />} /> // Internal auth check
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### Auth Pattern
- **Frontend**: `supabase.auth.getSession()` + `supabase.auth.onAuthStateChange()`
- **Admin check**: Query `profiles` table for `role === 'admin'`
- **OAuth**: `supabase.auth.signInWithOAuth({ provider: 'google' })`

### AI Integration Pattern
```
Frontend → supabase.functions.invoke('function-name', { body })
  → Edge Function (Deno)
    → Lovable AI Gateway (Gemini 2.5 Flash)
    → Parse JSON from AI response (regex extraction)
    → Return structured data
```

### Styling Pattern
- **Tailwind CSS** utility classes — semua styling inline
- **shadcn/ui** components — `src/components/ui/` (auto-generated, jangan edit langsung)
- **CSS Variables** — tema di `index.css` (`:root` block)
- **Responsive** — `useIsMobile` hook + Tailwind breakpoints (`sm:`, `md:`, `lg:`)

---

## ⚠️ Important Notes for AI Agents

### DO ✅
1. **Gunakan TypeScript** untuk semua file baru (`.tsx` / `.ts`)
2. **Ikuti shadcn/ui patterns** — gunakan komponen dari `src/components/ui/`
3. **Perhatikan `useLocalStorage`** — data CV persist di localStorage, bukan Supabase database
4. **Cek mobile responsiveness** — gunakan `useIsMobile` hook dan Tailwind responsive classes
5. **Gunakan `@/` path alias** — import dari `@/components/...`, `@/hooks/...`, dll
6. **Follow existing naming** — PascalCase untuk components, camelCase untuk hooks/functions
7. **Baca `CVPreview.tsx`** sebelum mengubah template — ini file terkompleks (9 template rendering)
8. **Test both languages** — fitur AI support `id` dan `en`, pastikan tidak hardcode satu bahasa

### DON'T ❌
1. **Jangan edit `src/components/ui/`** langsung — gunakan `npx shadcn-ui@latest add <component>` untuk menambah
2. **Jangan hardcode Supabase credentials** — gunakan environment variables
3. **Jangan hapus localStorage keys** — `cv-data` dan `cv-settings` digunakan untuk persistence
4. **Jangan ubah edge function contract** — input/output format harus backward compatible
5. **Jangan asumsi data tersimpan di database** — CV data hanya di localStorage (tidak ada tabel cv_data di Supabase)
6. **Jangan lupa CORS headers** di edge functions

### Common Gotchas
- `CVPreview.tsx` sangat besar — berisi rendering logic untuk 9 template. Hati-hati saat modifikasi.
- `AdminDashboard.tsx` memiliki hardcoded email admin (`zainalsalamun38@gmail.com`) untuk testing — ini harus dihapus di production.
- Edge functions menggunakan **regex** untuk parse JSON dari AI response (bukan structured output) — rawan error jika format AI berubah.
- `setup_roles.sql` harus dijalankan manual di Supabase SQL Editor — tidak ada migration tool.

---

## 🧪 Development Workflow

### Adding a New CV Template

1. Buka `src/components/editor/CVPreview.tsx`
2. Tambah case baru di template switch/render logic
3. Tambah nama template di `SettingsPanel.tsx` (template selector)
4. Update type `CVSettings.template` di `src/types/cv.ts`
5. Tambah entry di `AdminDashboard.tsx` (template list)

### Adding a New Editor Section

1. Buat form component baru di `src/components/editor/`
2. Tambah data field di `CVData` type (`src/types/cv.ts`)
3. Tambah default value di `Editor.tsx`
4. Tambah tab/button di `Editor.tsx` sidebar
5. Render section di `CVPreview.tsx` (semua 9 template)
6. Update `AdditionalForm.tsx` jika section kecil, atau buat tab baru

### Modifying AI Behavior

1. Edit edge function di `supabase/functions/`
2. Perhatikan `systemPrompt` — ini yang menentukan behavior AI
3. Perhatikan model yang digunakan (saat ini `google/gemini-2.5-flash`)
4. Deploy: `supabase functions deploy <function-name>`
5. Test via: `supabase functions invoke <function-name> --body '{"key":"value"}'`

### Adding shadcn/ui Component

```bash
npx shadcn-ui@latest add <component-name>
```

Komponen akan otomatis ditambahkan ke `src/components/ui/`.

---

## 📦 Key Dependencies

```json
{
  "react": "^18.x",                    // UI framework
  "react-router-dom": "^6.x",          // Routing
  "react-hook-form": "^7.x",           // Form management
  "@hookform/resolvers": "^3.x",       // Zod resolver for RHF
  "zod": "^3.x",                       // Schema validation
  "@supabase/supabase-js": "^2.x",     // Supabase client
  "pdfjs-dist": "^3.x",               // PDF parsing (upload CV)
  "react-to-print": "^2.x",           // PDF export (print)
  "recharts": "^2.x",                  // Charts (admin dashboard)
  "lucide-react": "^0.x",             // Icons
  "tailwindcss": "^3.x",              // Utility CSS
  "@radix-ui/*": "various",            // Headless UI primitives
  "class-variance-authority": "^0.x",  // shadcn/ui style variants
  "clsx": "^2.x",                      // Conditional classNames
  "tailwind-merge": "^2.x",           // Tailwind class dedup
  "sonner": "^1.x",                    // Toast notifications
  "vaul": "^0.x"                       // Drawer component
}
```

---

## 🔐 Security Considerations

1. **RLS (Row Level Security)** aktif di tabel `profiles` — user hanya bisa baca profil sendiri
2. **Admin bypass** — hardcoded email `zainalsalamun38@gmail.com` di `AdminDashboard.tsx` (⚠️ TODO: hapus)
3. **API Keys** — `LOVABLE_API_KEY` disimpan di Supabase secrets, bukan di frontend
4. **CV Data** — disimpan di localStorage client-side, TIDAK di database (privacy-first)
5. **CORS** — edge functions mengizinkan `*` origin (⚠️ TODO: restrict ke domain production)

---

## 🗺️ Roadmap / Known TODOs

- [ ] Hapus hardcoded admin email di `AdminDashboard.tsx`
- [ ] Restrict CORS origin di edge functions ke domain production
- [ ] Implementasi database storage untuk CV data (selain localStorage)
- [ ] Tambah template baru
- [ ] Implementasi subscription/payment system
- [ ] Tambah undo/redo di editor
- [ ] Multi-CV management (satu user bisa punya beberapa CV)
- [ ] Collaborative editing
- [ ] AI cover letter generator
- [ ] ATS score checker real-time

---

## 🧠 Quick Reference Commands

```bash
# Development
npm run dev                    # Start Vite dev server
npm run build                  # Production build
npm run lint                   # Run ESLint

# Supabase
supabase start                 # Start local Supabase
supabase functions serve       # Serve edge functions locally
supabase functions deploy <name>  # Deploy edge function
supabase secrets set KEY=val   # Set edge function env var

# shadcn/ui
npx shadcn-ui@latest add <component>  # Add UI component
```

---

> **Untuk AI Agent**: Dokumen ini adalah single source of truth untuk memahami arsitektur dan konvensi project. Selalu rujuk dokumen ini sebelum membuat perubahan besar pada codebase.