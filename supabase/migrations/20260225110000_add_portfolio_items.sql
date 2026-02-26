-- Add portfolio_items table for student portfolio management
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  category VARCHAR(100),
  student_name VARCHAR(255),
  year INTEGER,
  is_featured BOOLEAN DEFAULT false,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for ordering
CREATE INDEX IF NOT EXISTS idx_portfolio_items_order ON portfolio_items(order_position);

-- Add RLS policies
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Portfolio items are viewable by everyone" ON portfolio_items
  FOR SELECT USING (true);

-- Policy for admin write access (using has_admin_permission to avoid circular dependency)
CREATE POLICY "Admins can manage portfolio items" ON portfolio_items
  FOR ALL USING (public.has_admin_permission('editor'));

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
