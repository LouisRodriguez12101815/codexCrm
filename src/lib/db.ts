import { Pool, QueryResultRow } from 'pg';

const connectionString = process.env.DATABASE_URL;
export const pool = new Pool({ connectionString, ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined });
export async function q<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) { const res = await pool.query<T>(text, params); return res; }
export async function ensureSchema() { await q(`
CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS leads (id SERIAL PRIMARY KEY,name TEXT NOT NULL,company TEXT,phone TEXT,email TEXT,source TEXT,status TEXT DEFAULT 'new',created_at TIMESTAMPTZ DEFAULT now(),updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS activities (id SERIAL PRIMARY KEY,lead_id INT REFERENCES leads(id) ON DELETE CASCADE,type TEXT NOT NULL,body TEXT NOT NULL,created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY,lead_id INT REFERENCES leads(id) ON DELETE SET NULL,sid TEXT,from_number TEXT,to_number TEXT NOT NULL,body TEXT NOT NULL,status TEXT NOT NULL,blocked_reason TEXT,created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS calls (id SERIAL PRIMARY KEY,lead_id INT REFERENCES leads(id) ON DELETE SET NULL,sid TEXT,from_number TEXT,to_number TEXT NOT NULL,status TEXT NOT NULL,duration INT,recording_url TEXT,blocked_reason TEXT,created_at TIMESTAMPTZ DEFAULT now());
ALTER TABLE calls ADD COLUMN IF NOT EXISTS blocked_reason TEXT;
CREATE TABLE IF NOT EXISTS scrape_runs (id SERIAL PRIMARY KEY,source TEXT NOT NULL,status TEXT NOT NULL,records_found INT DEFAULT 0,error TEXT,created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS rate_limits (scope TEXT PRIMARY KEY,last_sms_at TIMESTAMPTZ,last_call_at TIMESTAMPTZ);`); }
