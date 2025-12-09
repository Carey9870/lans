CREATE DATABASE lands;

-- 1) media -center  - for media-center
CREATE TABLE IF NOT EXISTS media_items (
  id            BIGSERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  subtitle       TEXT
  slug          TEXT NOT NULL UNIQUE,
  story         TEXT NOT NULL,
  date          DATE NOT NULL,
  preview_image TEXT NOT NULL,                 -- first image used as card preview
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_files (
  id             BIGSERIAL PRIMARY KEY,
  media_item_id  BIGINT REFERENCES media_items(id) ON DELETE CASCADE,
  file_path      TEXT NOT NULL,                 -- /media/<item_id>/<uuid>.ext
  type           TEXT NOT NULL CHECK (type IN ('image', 'video')),
  "order"        INTEGER NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast ordering inside a gallery
CREATE INDEX idx_media_files_item_order ON media_files(media_item_id, "order");


-- 2) services - e.g., a) Land Registration Services, Land Administration Services

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_items (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  description TEXT,
  requirements JSONB DEFAULT '[]',
  timeline VARCHAR(255),
  fee VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(category_id, number)
);

-- Optional: Indexes for performance
CREATE INDEX idx_service_items_slug ON service_items(slug);
CREATE INDEX idx_service_items_category ON service_items(category_id);


    -- 3) Resources
CREATE TABLE IF NOT EXISTS resource_sections (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES resource_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  pdf_filename TEXT, -- NULL if no PDF
  fallback_content TEXT DEFAULT 'No media uploaded for this resource.'::TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section_id, slug)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_resources_section_id ON resources(section_id);
CREATE INDEX IF NOT EXISTS idx_resource_sections_order ON resource_sections("order");
CREATE INDEX IF NOT EXISTS idx_resources_order ON resources("order");

    -- 4. forms
CREATE TABLE forms (
  id SERIAL PRIMARY KEY,
  sno INTEGER NOT NULL,
  form_number VARCHAR(50) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  pdf_filename VARCHAR(255), -- null if not uploaded
  pdf_size_kb DECIMAL(10,2), -- stored in KB
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: trigger to update updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON forms
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

      -- 5. Management and Leadership
CREATE TABLE IF NOT EXISTS gallery_media (
  id SERIAL PRIMARY KEY,
  type VARCHAR(10) NOT NULL CHECK (type IN ('IMAGE', 'VIDEO')),
  title TEXT,
  file_path TEXT NOT NULL,
  thumbnail_path TEXT,
  duration_seconds INTEGER, -- only for videos
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Index for ordering
CREATE INDEX IF NOT EXISTS idx_gallery_media_order ON gallery_media("order", id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gallery_media_updated_at BEFORE UPDATE
    ON gallery_media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


        ---- 6) land-registries
CREATE TABLE land_registries (
  id SERIAL PRIMARY KEY,
  serial_no INTEGER GENERATED ALWAYS AS IDENTITY,
  county TEXT NOT NULL,
  station TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE registry_locations (
  id SERIAL PRIMARY KEY,
  registry_id INTEGER REFERENCES land_registries(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  departments TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_land_registries_updated_at
  BEFORE UPDATE ON land_registries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

      -- 7) Tenders
CREATE TABLE tenders (
  id SERIAL PRIMARY KEY,
  tender_no TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  start_date DATE NOT NULL CHECK (start_date >= CURRENT_DATE),
  closing_datetime TIMESTAMPTZ NOT NULL,
  document_path TEXT,
  document_size BIGINT,
  document_name TEXT,
  document_mime_type TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast filtering and sorting
CREATE INDEX idx_tenders_active ON tenders(is_active);
CREATE INDEX idx_tenders_closing ON tenders(closing_datetime);

      -- 8- faqs
-- Database Schema (Run this in your PostgreSQL database)
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON faqs
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

      --- 9) Gazette Notices
-- Run this in your PostgreSQL database
CREATE TABLE gazette_notices (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gazette_resources (
  id SERIAL PRIMARY KEY,
  notice_id INTEGER REFERENCES gazette_notices(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'document')),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

  -- trigger
-- Create trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger
CREATE TRIGGER update_gazette_notices_updated_at 
    BEFORE UPDATE ON gazette_notices 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

