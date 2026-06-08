# 🎯 CV Craft AI (BuatCVAI)

> AI-powered CV/Resume Builder — Buat, edit, dan optimalkan CV kamu dengan bantuan AI dalam hitungan menit.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [AI Integration](#-ai-integration)
- [Pages & Routes](#-pages--routes)
- [CV Templates](#-cv-templates)
- [Data Model](#-data-model)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Overview

**CV Craft AI** (BuatCVAI) adalah aplikasi web yang memungkinkan pengguna untuk membuat CV profesional dengan bantuan artificial intelligence. Pengguna bisa mengunggah CV lama, mendapatkan optimasi berdasarkan job description, memilih dari 9 template premium, dan mengunduh hasilnya sebagai PDF.

### Alur Utama (User Flow)

```
Landing Page → Login/Register → Build CV (4-Step Wizard)
  ├─ Step 1: Input Job Description
  ├─ Step 2: Upload CV (PDF parsing)
  ├─ Step 3: AI Optimization Result
  └─ Step 4: Inline Editor
       ├─ Edit semua section CV
       ├─ Pilih template & kustomisasi
       ├─ Preview real-time
       └─ Export PDF
```

---

## ✨ Features

### 🤖 AI-Powered
- **AI Summary Generator** — 3 varian ringkasan profesional (Standard, Impact-focused, Friendly)
- **AI CV Optimizer** — Analisis match score, missing skills, keyword extraction, dan rewrite bullet points
- **Multi-language** — Support Bahasa Indonesia dan English

### 📝 CV Editor
- **Split-panel editor** — Form input di kiri, live preview di kanan
- **Auto-save** — Data tersimpan otomatis ke localStorage
- **Import/Export JSON** — Backup dan restore data CV
- **8 Sections** — Personal Info, Summary, Experience, Education, Skills, Projects, Certificates, Languages, Hobbies, Achievements

### 🎨 Templates
9 template CV profesional dengan kustomisasi:
- Classic, Modern, Creative, Professional, Minimalist, Executive, Tech, Harvard, Startup
- Accent color picker
- Font size control
- Toggle sections (photo, projects, certificates)

### 📤 Export
- **PDF Download** — High-quality PDF export via `react-to-print`
- **Print-ready** — Optimized untuk A4 printing

### 🔐 Authentication
- Email/Password registration & login
- Google OAuth
- Role-based access (User & Admin)

### 🛡️ Admin Dashboard
- User management (CRUD)
- Content & template management
- AI usage limits configuration
- System statistics

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | UI Framework |
| **Build Tool** | Vite 6 | Development & bundling |
| **Styling** | Tailwind CSS 3 | Utility-first CSS |
| **UI Components** | shadcn/ui + Radix UI | Accessible component library |
| **Routing** | React Router DOM v6 | Client-side routing |
| **Forms** | React Hook Form + Zod | Form management & validation |
| **Backend** | Supabase | Auth, Database, Edge Functions |
| **AI Engine** | Lovable AI Gateway (Gemini 2.5 Flash) | AI text generation |
| **PDF** | pdfjs-dist + react-to-print | PDF parsing & export |
| **Charts** | Recharts | Admin dashboard charts |
| **Icons** | Lucide React | Icon library |

---

## 📂 Project Structure

```
cv-craft-ai/
├── public/                          # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── editor/                  # CV editor form components
│   │   │   ├── PersonalInfoForm.tsx # Personal information form
│   │   │   ├── SummaryForm.tsx      # Summary with AI generator
│   │   │   ├── ExperienceForm.tsx   # Work experience form
│   │   │   ├── EducationForm.tsx    # Education form
│   │   │   ├── SkillsForm.tsx       # Skills management
│   │   │   ├── ProjectsForm.tsx     # Projects form
│   │   │   ├── AdditionalForm.tsx   # Certificates, languages, hobbies, achievements
│   │   │   ├── SettingsPanel.tsx    # Template, color, font settings
│   │   │   └── CVPreview.tsx        # Real-time CV preview renderer
│   │   ├── landing/                 # Landing page sections
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Templates.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/                      # shadcn/ui components (50+ components)
│   │   └── NavLink.tsx              # Navigation link component
│   ├── hooks/
│   │   ├── use-mobile.tsx           # Mobile detection hook
│   │   ├── use-toast.ts             # Toast notification hook
│   │   └── useLocalStorage.ts       # LocalStorage persistence hook
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts            # Supabase client configuration
│   │       └── types.ts             # Database type definitions
│   ├── lib/
│   │   └── utils.ts                 # Utility functions (cn, etc.)
│   ├── pages/
│   │   ├── Index.tsx                # Landing page
│   │   ├── Auth.tsx                 # Login/Register page
│   │   ├── Builder.tsx              # CV builder wizard container
│   │   ├── Editor.tsx               # Full CV editor page
│   │   ├── AdminDashboard.tsx       # Admin panel
│   │   ├── NotFound.tsx             # 404 page
│   │   └── builder/
│   │       ├── Step1JobDescription.tsx  # Job description input
│   │       ├── Step2UploadCV.tsx        # CV upload & PDF parsing
│   │       ├── Step3Result.tsx          # AI optimization result
│   │       └── Step4Editor.tsx          # Inline editor
│   ├── types/
│   │   └── cv.ts                    # CV data type definitions
│   ├── utils/
│   │   └── pdfParser.ts             # PDF text extraction utility
│   ├── App.tsx                      # Main app with routing
│   ├── App.css                      # Global styles
│   ├── index.css                    # Tailwind imports & CSS variables
│   ├── main.tsx                     # App entry point
│   └── vite-env.d.ts               # Vite type declarations
├── supabase/
│   ├── config.toml                  # Supabase configuration
│   ├── setup_roles.sql              # Database schema & RLS policies
│   └── functions/
│       ├── generate-summary/        # AI summary generation edge function
│       │   └── index.ts
│       └── optimize-cv/             # AI CV optimization edge function
│           └── index.ts
├── index.html                       # HTML entry point
├── package.json                     # Dependencies & scripts
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── components.json                  # shadcn/ui configuration
└── eslint.config.js                 # ESLint configuration
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **bun** (project uses `bun.lockb`)
- **Supabase** project (for backend)

### Installation

```bash
# Clone repository
git clone https://github.com/zainalsalamun/cv-craft-ai.git
cd cv-craft-ai

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

Aplikasi akan berjalan di `http://localhost:5173`

---

## 🔧 Environment Variables

Buat file `.env` di root project:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# AI API Key (configured in Supabase Edge Functions)
LOVABLE_API_KEY=your-lovable-api-key
# Atau gunakan OpenAI:
OPENAI_API_KEY=your-openai-key
```

> **Note:** `LOVABLE_API_KEY` dan `OPENAI_API_KEY` dikonfigurasi di environment Supabase Edge Functions, bukan di `.env` frontend.

---

## 🗄️ Database Setup

### 1. Jalankan SQL Setup

Buka Supabase Dashboard → SQL Editor, jalankan isi file `supabase/setup_roles.sql`:

```sql
-- Buat tabel profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Aktifkan Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies & Trigger (lihat file lengkap)
```

### 2. Jadikan Akun sebagai Admin

Setelah mendaftar, jalankan di SQL Editor:

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'email_anda@gmail.com';
```

---

## 🤖 AI Integration

### Edge Functions

| Function | Endpoint | Description |
|----------|----------|-------------|
| `generate-summary` | `/functions/v1/generate-summary` | Generate 3 variants of professional summary |
| `optimize-cv` | `/functions/v1/optimize-cv` | Analyze CV vs job description & optimize |

### AI Gateway

Menggunakan **Lovable AI Gateway** dengan model **Google Gemini 2.5 Flash**:
- Endpoint: `https://ai.gateway.lovable.dev/v1/chat/completions`
- Fallback: OpenAI API (configurable)

### generate-summary

**Input:**
```json
{
  "cvData": { "personalInfo": {...}, "skills": [...], "workExperience": [...] },
  "language": "id" // atau "en"
}
```

**Output:**
```json
{
  "variants": [
    {"tone": "Standard", "summary": "..."},
    {"tone": "Impact-focused", "summary": "..."},
    {"tone": "Friendly", "summary": "..."}
  ]
}
```

### optimize-cv

**Input:**
```json
{
  "cvData": { /* full CV data */ },
  "jobDescription": "Job description text...",
  "language": "id"
}
```

**Output:**
```json
{
  "matchScore": 75,
  "missingSkills": ["REST API", "Docker"],
  "topKeywords": ["Flutter", "Dart", "Firebase"],
  "improvements": ["Gunakan metrik pada pencapaian", "Tambahkan keyword Docker"],
  "optimizedCvData": { /* rewritten CV data */ }
}
```

---

## 📄 Pages & Routes

| Route | Page | Auth Required | Description |
|-------|------|:---:|-------------|
| `/` | Landing | ❌ | Marketing page with features, templates, FAQ |
| `/auth` | Auth | ❌ | Login & Register |
| `/build` | Builder | ✅ | 4-step CV creation wizard |
| `/editor` | Editor | ❌ | Full CV editor with preview |
| `/admin` | Admin Dashboard | ✅ (Admin) | Admin panel for user & content management |
| `*` | NotFound | ❌ | 404 page |

---

## 🎨 CV Templates

| # | Template | Style |
|---|----------|-------|
| 1 | **Classic** | Traditional single-column layout |
| 2 | **Modern** | Contemporary design with sidebar |
| 3 | **Creative** | Bold & colorful for creative roles |
| 4 | **Professional** | Clean corporate style |
| 5 | **Minimalist** | Simple & elegant |
| 6 | **Executive** | Premium look for senior roles |
| 7 | **Tech** | Developer-focused layout |
| 8 | **Harvard** | Academic-style CV |
| 9 | **Startup** | Dynamic & energetic |

### Kustomisasi Template

```typescript
{
  template: 'modern',          // Pilihan template
  accentColor: '#2563eb',      // Warna aksen (hex)
  fontSize: 'medium',          // small | medium | large
  showPhoto: true,             // Tampilkan foto
  showProjects: true,          // Tampilkan section projects
  showCertificates: true       // Tampilkan section sertifikat
}
```

---

## 📊 Data Model

### CVData

```typescript
interface CVData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
    photo: string;           // Base64 or URL
  };
  summary: string;
  workExperience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;
  skills: Array<{
    name: string;
    level?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    url?: string;
  }>;
  certificates: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  languages: Array<{
    name: string;
    level: string;
  }>;
  hobbies: string;
  achievements: string;
}
```

### CVSettings

```typescript
interface CVSettings {
  template: 'classic' | 'modern' | 'creative' | 'professional' 
          | 'minimalist' | 'executive' | 'tech' | 'harvard' | 'startup';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  showPhoto: boolean;
  showProjects: boolean;
  showCertificates: boolean;
}
```

---

## 📜 Available Scripts

```bash
npm run dev          # Start development server (Vite)
npm run build        # Build for production (TypeScript check + Vite build)
npm run lint         # Run ESLint
npm run preview      # Preview production build locally
```

---

## 🚢 Deployment

### Vercel / Netlify

```bash
npm run build
# Upload dist/ folder
```

### Supabase Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Deploy edge functions
supabase functions deploy generate-summary
supabase functions deploy optimize-cv

# Set secrets
supabase secrets set LOVABLE_API_KEY=your-key
```

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

Private project — All rights reserved.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/zainalsalamun">Naltech</a>
</p>