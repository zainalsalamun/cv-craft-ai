-- 1. Buat tabel profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Buat policy agar user bisa membaca profilnya sendiri
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- 4. Buat policy agar admin bisa membaca semua profil
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 5. Trigger otomatis untuk membuat profile saat user baru mendaftar
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ====================================================
-- CARA MENJADIKAN AKUN ANDA SEBAGAI ADMIN:
-- Jalankan kode di bawah ini SETELAH Anda mendaftar di aplikasi
-- Ganti 'email_anda@gmail.com' dengan email yang Anda gunakan
-- ====================================================
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'email_anda@gmail.com';

-- ====================================================
-- CV DATA TABLE
-- Jalankan migration: supabase/migrations/001_create_cv_data.sql
-- untuk membuat tabel cv_data (multi-CV management)
-- ====================================================
