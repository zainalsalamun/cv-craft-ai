import pool from './connection.js';

const migration = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) DEFAULT '',
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CV data table
CREATE TABLE IF NOT EXISTS cv_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) DEFAULT 'Untitled CV',
  cv_data JSONB DEFAULT '{}' NOT NULL,
  cv_settings JSONB DEFAULT '{}' NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_cv_data_user_id ON cv_data(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cv_data_updated_at ON cv_data;
CREATE TRIGGER update_cv_data_updated_at
  BEFORE UPDATE ON cv_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
`;

async function migrate() {
  try {
    console.log('Running migrations...');
    await pool.query(migration);
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();