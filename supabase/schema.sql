-- ============================================================
-- TENIS COUDER — Schema completo
-- Ejecutar en: Supabase > SQL Editor
-- ============================================================


-- ============================================================
-- 1. TABLA: profesores
-- ============================================================
CREATE TABLE IF NOT EXISTS profesores (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  color       TEXT NOT NULL DEFAULT '#3B82F6',  -- color hex para la cuadrícula
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. TABLA: pistas
-- ============================================================
CREATE TABLE IF NOT EXISTS pistas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL,
  tipo        TEXT NOT NULL CHECK (tipo IN ('tenis', 'padel')),
  numero      SMALLINT NOT NULL,
  activa      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tipo, numero)
);

-- ============================================================
-- 3. TABLA: reservas
-- ============================================================
CREATE TABLE IF NOT EXISTS reservas (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pista_id       UUID NOT NULL REFERENCES pistas(id) ON DELETE CASCADE,
  profesor_id    UUID REFERENCES profesores(id) ON DELETE SET NULL,
  fecha          DATE NOT NULL,
  hora_inicio    TIME NOT NULL,
  hora_fin       TIME NOT NULL,
  tipo           TEXT NOT NULL CHECK (tipo IN ('grupal', 'particular', 'alquiler')),
  nombre_cliente TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- La hora de fin debe ser posterior a la de inicio
  CONSTRAINT hora_valida CHECK (hora_fin > hora_inicio)
);

-- Índices para consultas frecuentes (filtrar por fecha y pista)
CREATE INDEX IF NOT EXISTS idx_reservas_fecha     ON reservas (fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_pista_id  ON reservas (pista_id);
CREATE INDEX IF NOT EXISTS idx_reservas_profesor  ON reservas (profesor_id);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_reservas_updated_at
  BEFORE UPDATE ON reservas
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- 4. TABLA: notificaciones
-- ============================================================
CREATE TABLE IF NOT EXISTS notificaciones (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id UUID REFERENCES reservas(id) ON DELETE CASCADE,
  mensaje    TEXT NOT NULL,
  leida      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON notificaciones (leida);


-- ============================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profesores     ENABLE ROW LEVEL SECURITY;
ALTER TABLE pistas         ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas       ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

-- Política: acceso total para usuarios autenticados (profesores logueados)
CREATE POLICY "auth_all_profesores" ON profesores
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_pistas" ON pistas
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_reservas" ON reservas
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_notificaciones" ON notificaciones
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ============================================================
-- 6. DATOS INICIALES: 8 pistas
-- ============================================================

INSERT INTO pistas (nombre, tipo, numero) VALUES
  ('Pista de Tenis 1', 'tenis', 1),
  ('Pista de Tenis 2', 'tenis', 2),
  ('Pista de Tenis 3', 'tenis', 3),
  ('Pista de Tenis 4', 'tenis', 4),
  ('Pista de Tenis 5', 'tenis', 5),
  ('Pista de Tenis 6', 'tenis', 6),
  ('Pista de Pádel 1', 'padel', 1),
  ('Pista de Pádel 2', 'padel', 2)
ON CONFLICT (tipo, numero) DO NOTHING;
