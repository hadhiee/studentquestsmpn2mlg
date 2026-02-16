-- 1. Tambahkan kolom is_guest dan class_name
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS class_name TEXT;

-- 2. Matikan sementara constraint FK jika ingin mendukung ID non-auth (Opsional, tapi direkomendasikan jika ingin menyimpan Tamu)
-- ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 3. Kebijakan agar Admin (hadhiee@gmail.com) bisa melihat SEMUA data
CREATE POLICY "Admin can view everything" ON public.profiles
  FOR SELECT USING (
    auth.jwt() ->> 'email' = 'hadhiee@gmail.com'
  );

-- 4. Ijinkan publik (Guest) untuk insert data mereka sendiri (dengan ID random)
CREATE POLICY "Allow public inserts for guests" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- 5. Ijinkan update jika email cocok (untuk Guest yang update skor)
CREATE POLICY "Allow updates by id" ON public.profiles
  FOR UPDATE USING (true);
