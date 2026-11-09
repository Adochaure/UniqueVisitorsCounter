-- Preliminary PostgreSQL schema for the planned counter service.
-- No migrations or query execution are included in this foundation.

CREATE TABLE websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT visitors_website_visitor_unique UNIQUE (website_id, visitor_id)
);

CREATE INDEX visitors_website_id_idx ON visitors (website_id);
