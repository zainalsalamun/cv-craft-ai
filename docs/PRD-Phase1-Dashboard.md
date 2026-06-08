# 📋 Product Requirements Document (PRD)
## Phase 1: Database Persistence + Multi-CV Management + CV Dashboard

| Field | Value |
|-------|-------|
| **Project** | CV Craft AI (BuatCVAI) |
| **Phase** | 1 — Foundation |
| **Version** | 1.0 |
| **Date** | 2026-06-07 |
| **Status** | 🟡 In Progress |

---

## 1. Problem Statement

Saat ini, CV data user **hanya tersimpan di `localStorage`** browser. Ini menyebabkan:

- ❌ **Data hilang permanen** jika user clear browser / ganti device / factory reset
- ❌ **Tidak bisa multi-device** — CV hanya ada di satu browser
- ❌ **Tidak bisa multi-CV** — user hanya punya 1 CV
- ❌ **Tidak ada backup/recovery** — zero safety net
- ❌ **Foundation untuk fitur lain terblokir** — Share Link, Version History, Analytics butuh database

## 2. Goals

| # | Goal | Success Metric |
|---|------|----------------|
| G1 | CV data tersimpan di database (Supabase) | Data survive browser clear |
| G2 | User bisa membuat beberapa CV | Min. 3 CV per user |
| G3 | User bisa manage CV dari dashboard | List, buat, rename, duplicate, delete |
| G4 | Offline-first tetap work | Edit tanpa internet, sync saat online |
| G5 | Backward compatible | Data lama di localStorage tetap bisa diakses |

## 3. User Stories

### 3.1 Database Persistence
```
AS A registered user,
I WANT my CV data saved to the cloud,
SO THAT I don't lose my CV when I switch devices or clear my browser.

Acceptance Criteria:
- CV data otomatis tersimpan ke Supabase saat user login
- Data lama di localStorage di-migrate otomatis saat login pertama
- Edit CV → auto-save ke database (debounced 2 detik)
- Jika offline, data tetap tersimpan di localStorage dan sync saat online
```

### 3.2 Multi-CV Management
```
AS A user,
I WANT to create multiple CVs for different job targets,
SO THAT I can have tailored CVs for different positions.

Acceptance Criteria:
- User bisa buat CV baru dari dashboard
- User bisa rename CV
- User bisa duplicate CV (copy ke CV baru)
- User bisa delete CV (dengan konfirmasi)
- User bisa set 1 CV sebagai "primary"
- Default CV baru: "Untitled CV" dengan template default
```

### 3.3 CV Dashboard
```
AS A user,
I WANT a dashboard to see and manage all my CVs,
SO THAT I can easily navigate between them.

Acceptance Criteria:
- Dashboard menampilkan list CV user (card/grid view)
- Setiap card: nama CV, last updated, template preview, action buttons
- Tombol "Create New CV" yang prominent
- Empty state jika belum punya CV
- Loading state saat fetch data
- Responsive di mobile
```

---

## 4. Technical Design

### 4.1 Database Schema

```sql
-- Tabel untuk menyimpan CV data
CREATE TABLE public.cv_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled CV',
  cv_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  cv_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index untuk performa
CREATE INDEX idx_cv_data_user_id ON public.cv_data(user_id);
CREATE INDEX idx_cv_data_updated_at ON public.cv_data(updated_at DESC);

-- RLS Policy
ALTER TABLE public.cv_data ENABLE ROW LEVEL SECURITY;

-- User hanya bisa akses CV sendiri
CREATE POLICY "Users can view own CVs"
  ON public.cv_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CVs"
  ON public.cv_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CVs"
  ON public.cv_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own CVs"
  ON public.cv_data FOR DELETE
  USING (auth.uid() = user_id);

-- Admin bisa akses semua CV
CREATE POLICY "Admins can view all CVs"
  ON public.cv_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_cv_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cv_data_updated_at
  BEFORE UPDATE ON public.cv_data
  FOR EACH ROW
  EXECUTE FUNCTION update_cv_data_updated_at();
```

### 4.2 New Files

| File | Purpose |
|------|---------|
| `src/hooks/useCVStorage.ts` | Hybrid hook: Supabase + localStorage sync |
| `src/pages/Dashboard.tsx` | CV Dashboard page |
| `src/components/dashboard/CVCard.tsx` | Single CV card component |
| `src/components/dashboard/CreateCVDialog.tsx` | Dialog untuk buat CV baru |
| `src/components/dashboard/DeleteCVDialog.tsx` | Konfirmasi delete CV |
| `supabase/migrations/001_create_cv_data.sql` | Database migration |

### 4.3 Modified Files

| File | Changes |
|------|---------|
| `src/App.tsx` | Tambah route `/dashboard`, ProtectedRoute wrapper |
| `src/pages/Editor.tsx` | Ganti `useLocalStorage` → `useCVStorage`, terima `cvId` param |
| `src/components/landing/Header.tsx` | Tambah "Dashboard" nav link |
| `src/integrations/supabase/types.ts` | Update types untuk cv_data table |
| `supabase/setup_roles.sql` | Tambah cv_data table schema |

### 4.4 Hook Design: `useCVStorage`

```typescript
// Conceptual design
function useCVStorage(cvId: string | null) {
  // State
  const [cvData, setCVData] = useState<CVData>(defaultCVData);
  const [cvSettings, setCVSettings] = useState<CVSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load: Supabase first, fallback to localStorage
  useEffect(() => {
    if (cvId) {
      loadFromSupabase(cvId);
    } else {
      loadFromLocalStorage(); // Legacy mode
    }
  }, [cvId]);

  // Save: Debounced auto-save to Supabase
  const debouncedSave = useMemo(
    () => debounce(async (data, settings) => {
      await saveToSupabase(cvId, data, settings);
    }, 2000),
    [cvId]
  );

  // Update: Set state + trigger save
  const updateCVData = (newData: CVData) => {
    setCVData(newData);
    debouncedSave(newData, cvSettings);
  };

  return { cvData, cvSettings, updateCVData, updateSettings, isLoading, isSaving };
}
```

### 4.5 Route Changes

```
/dashboard              → CV Dashboard (protected)
/editor                 → Editor (no cvId = legacy mode)
/editor/:cvId           → Editor with specific CV (new mode)
```

### 4.6 Data Migration Strategy

```
User Login
  └─ Check localStorage for existing 'cv-data'
     ├─ Found + No CVs in Supabase → Auto-migrate ke Supabase
     ├─ Found + Has CVs in Supabase → Prompt: "Import local data?"
     └─ Not found → Normal flow
```

---

## 5. UI/UX Design

### 5.1 Dashboard Layout

```
┌─────────────────────────────────────────────┐
│  Header (Logo + User Menu + Logout)         │
├─────────────────────────────────────────────┤
│                                             │
│  My CVs                            [+ New]  │
│  ─────────────────────────────────────────  │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ CV Card  │  │ CV Card  │  │ + Create │  │
│  │ ──────── │  │ ──────── │  │   New CV │  │
│  │ Template │  │ Template │  │          │  │
│  │ Preview  │  │ Preview  │  │          │  │
│  │ ──────── │  │ ──────── │  │          │  │
│  │ Name     │  │ Name     │  │          │  │
│  │ Updated  │  │ Updated  │  │          │  │
│  │ ⭐ 📋 🗑 │  │ 📋 🗑    │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

### 5.2 CV Card Actions

| Action | Icon | Behavior |
|--------|------|----------|
| Edit | ✏️ | Navigate ke `/editor/:cvId` |
| Set Primary | ⭐ | Toggle is_primary |
| Duplicate | 📋 | Copy CV → "Name (Copy)" |
| Delete | 🗑 | Confirmation dialog → delete |

### 5.3 Empty State

```
┌─────────────────────────────────────────────┐
│                                             │
│        📄 No CVs yet                        │
│                                             │
│   Create your first CV to get started       │
│                                             │
│           [+ Create New CV]                 │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 6. Implementation Checklist

### Phase 1A: Database Setup
- [ ] Create migration SQL for `cv_data` table
- [ ] Run migration in Supabase
- [ ] Update `setup_roles.sql`
- [ ] Update Supabase types

### Phase 1B: Hook & Logic
- [ ] Create `useCVStorage` hook
- [ ] Implement Supabase CRUD operations
- [ ] Implement localStorage fallback
- [ ] Implement data migration logic
- [ ] Implement auto-save (debounced)

### Phase 1C: Dashboard UI
- [ ] Create `Dashboard.tsx` page
- [ ] Create `CVCard.tsx` component
- [ ] Create `CreateCVDialog.tsx`
- [ ] Create `DeleteCVDialog.tsx`
- [ ] Add route `/dashboard` to `App.tsx`
- [ ] Add "Dashboard" to navigation

### Phase 1D: Editor Integration
- [ ] Modify `Editor.tsx` to accept `cvId` param
- [ ] Replace `useLocalStorage` with `useCVStorage`
- [ ] Handle legacy mode (no cvId)
- [ ] Add back button to Dashboard

### Phase 1E: Testing & Polish
- [ ] Test create, edit, delete CV flow
- [ ] Test offline/online sync
- [ ] Test data migration from localStorage
- [ ] Test mobile responsiveness
- [ ] Test with multiple users

---

## 7. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase downtime | User tidak bisa save | localStorage sebagai fallback |
| Data conflict (offline edit) | Data overwrite | Last-write-wins + localStorage backup |
| Migration data lama corrupt | User kehilangan data | Backup localStorage sebelum migrate |
| RLS misconfiguration | Data leak | Thorough testing dengan multiple users |

---

## 8. Future Phases (Out of Scope)

| Phase | Features |
|-------|----------|
| **Phase 2** | Export DOCX, AI Cover Letter, Additional Sections |
| **Phase 3** | Share Link, ATS Checker, Drag & Drop |
| **Phase 4** | Subscription, PWA, Advanced Templates |

---

> **Next Step**: Implement Phase 1A — Database Setup