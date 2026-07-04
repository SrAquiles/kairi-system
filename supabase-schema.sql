-- Tabla de check-ins diarios
CREATE TABLE IF NOT EXISTS checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  session TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, session)
);

-- Tabla de aseo diario
CREATE TABLE IF NOT EXISTS aseo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  tasks JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS checkins_date_idx ON checkins(date DESC);
CREATE INDEX IF NOT EXISTS aseo_date_idx ON aseo(date DESC);

-- Row Level Security (RLS) - permitir acceso anon
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE aseo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for anon" ON checkins FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON aseo FOR ALL TO anon USING (true) WITH CHECK (true);
