-- Migration: Add CMS Look tables for version control/revision history
-- Date: 2026-02-28
-- Purpose: Store CMS look configurations and their revision history

-- Create cms_looks table
CREATE TABLE IF NOT EXISTS cms_looks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);

-- Create cms_look_revisions table
CREATE TABLE IF NOT EXISTS cms_look_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    look_id UUID NOT NULL REFERENCES cms_looks(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_cms_looks_name ON cms_looks(name);
CREATE INDEX IF NOT EXISTS idx_cms_looks_is_active ON cms_looks(is_active);
CREATE INDEX IF NOT EXISTS idx_cms_look_revisions_look_id ON cms_look_revisions(look_id);
CREATE INDEX IF NOT EXISTS idx_cms_look_revisions_version ON cms_look_revisions(look_id, version DESC);
CREATE INDEX IF NOT EXISTS idx_cms_look_revisions_status ON cms_look_revisions(status);

-- Enable RLS
ALTER TABLE cms_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_look_revisions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cms_looks
CREATE POLICY "Allow authenticated users to select cms_looks"
    ON cms_looks FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert cms_looks"
    ON cms_looks FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update cms_looks"
    ON cms_looks FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow service role full access to cms_looks"
    ON cms_looks FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- RLS Policies for cms_look_revisions
CREATE POLICY "Allow authenticated users to select cms_look_revisions"
    ON cms_look_revisions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert cms_look_revisions"
    ON cms_look_revisions FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update cms_look_revisions"
    ON cms_look_revisions FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow service role full access to cms_look_revisions"
    ON cms_look_revisions FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Add updated_at trigger function for cms_looks
CREATE TRIGGER update_cms_looks_updated_at
    BEFORE UPDATE ON cms_looks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create revision on look update
CREATE OR REPLACE FUNCTION create_look_revision()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert a new revision record before updating
    INSERT INTO cms_look_revisions (look_id, version, content, status, created_by)
    VALUES (
        NEW.id,
        COALESCE(
            (SELECT MAX(version) FROM cms_look_revisions WHERE look_id = NEW.id) + 1,
            1
        ),
        NEW.content,
        'draft',
        NEW.created_by
    );
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger for auto-revision creation
CREATE TRIGGER auto_create_look_revision
    AFTER UPDATE ON cms_looks
    FOR EACH ROW
    WHEN (OLD.content IS DISTINCT FROM NEW.content)
    EXECUTE FUNCTION create_look_revision();

-- Insert default cms_look if not exists
INSERT INTO cms_looks (name, description, content, is_active, created_by)
VALUES (
    'Default Look',
    'Default CMS look configuration',
    '{
        "theme": "default",
        "colors": {
            "primary": "#000000",
            "secondary": "#ffffff"
        },
        "fonts": {
            "heading": "Inter",
            "body": "Inter"
        }
    }'::jsonb,
    true,
    'system'
) ON CONFLICT DO NOTHING;

COMMENT ON TABLE cms_looks IS 'Stores CMS look/template configurations with version control';
COMMENT ON TABLE cms_look_revisions IS 'Stores revision history for CMS looks';
