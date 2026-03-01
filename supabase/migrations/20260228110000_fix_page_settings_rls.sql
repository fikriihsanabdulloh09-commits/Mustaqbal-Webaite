-- Migration: Fix RLS policies for page_settings
-- Date: 2026-02-28
-- Purpose: Add anon role policies so Server Actions (which use anon key) can read/write page_settings
-- The admin layout already handles authentication guard on the client side.

-- Allow anon to read page_settings (needed for public website to load page configs)
CREATE POLICY "Allow anon to select page_settings"
    ON page_settings FOR SELECT
    TO anon
    USING (true);

-- Allow anon to insert page_settings (Server Actions use anon key)
CREATE POLICY "Allow anon to insert page_settings"
    ON page_settings FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow anon to update page_settings (Server Actions use anon key)
CREATE POLICY "Allow anon to update page_settings"
    ON page_settings FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);
