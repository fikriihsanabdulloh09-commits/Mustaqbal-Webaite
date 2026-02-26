/*
  # Update News Articles Table

  1. Additional Columns
    - Add tags column (text array)
    - Add views column (integer)
    - Add meta_description column (text)
    - Add meta_keywords column (text)
  
  2. Safety
    - Use IF NOT EXISTS pattern
    - Add default values
*/

-- Add tags column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news_articles' AND column_name = 'tags'
  ) THEN
    ALTER TABLE news_articles ADD COLUMN tags text[];
  END IF;
END $$;

-- Add views column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news_articles' AND column_name = 'views'
  ) THEN
    ALTER TABLE news_articles ADD COLUMN views integer DEFAULT 0;
  END IF;
END $$;

-- Add meta_description column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news_articles' AND column_name = 'meta_description'
  ) THEN
    ALTER TABLE news_articles ADD COLUMN meta_description text;
  END IF;
END $$;

-- Add meta_keywords column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news_articles' AND column_name = 'meta_keywords'
  ) THEN
    ALTER TABLE news_articles ADD COLUMN meta_keywords text;
  END IF;
END $$;