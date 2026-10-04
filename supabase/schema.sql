-- PostgreSQL Database Schema for Societal Innovation Collaboration Portal
-- Government of Jharkhand | JSRIP-2025 & NEP 2020 Integration

-- 1. Profiles & Role Management
CREATE TYPE user_role AS ENUM ('citizen', 'university', 'csr', 'admin');

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'citizen',
  full_name TEXT NOT NULL,
  phone TEXT,
  aadhaar_last4 VARCHAR(4),
  organization_name TEXT,
  district TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Citizen Grievances / Societal Problems
CREATE TYPE grievance_status AS ENUM (
  'LODGED',
  'VERIFIED',
  'ASSIGNED',
  'PROTOTYPING',
  'FIELD_TESTED',
  'CITIZEN_VERIFYING',
  'RESOLVED_CLOSED',
  'ESCALATED'
);

CREATE TABLE IF NOT EXISTS grievances (
  id VARCHAR(32) PRIMARY KEY,
  citizen_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  district TEXT NOT NULL,
  block TEXT NOT NULL,
  panchayat TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  urgency VARCHAR(16) DEFAULT 'Normal',
  affected_count INT DEFAULT 100,
  status grievance_status DEFAULT 'LODGED',
  media_urls TEXT[] DEFAULT '{}',
  ai_diagnostic_qa JSONB DEFAULT '[]'::jsonb,
  assigned_university_id UUID,
  resolution_summary TEXT,
  resolution_proof_url TEXT,
  citizen_rating INT CHECK (citizen_rating >= 1 AND citizen_rating <= 5),
  citizen_feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 3. University Proposals & Academic Teams
CREATE TABLE IF NOT EXISTS proposals (
  id VARCHAR(32) PRIMARY KEY,
  grievance_id VARCHAR(32) REFERENCES grievances(id) ON DELETE CASCADE,
  university_id UUID REFERENCES profiles(id),
  institution_name TEXT NOT NULL,
  lead_student_name TEXT NOT NULL,
  lead_student_email TEXT,
  faculty_mentor_name TEXT NOT NULL,
  faculty_mentor_email TEXT NOT NULL,
  faculty_department TEXT NOT NULL,
  trl_level INT CHECK (trl_level BETWEEN 1 AND 9),
  proposed_solution TEXT NOT NULL,
  estimated_duration_months INT DEFAULT 6,
  total_budget NUMERIC(12, 2) NOT NULL,
  nep_credits_awarded INT DEFAULT 12,
  status VARCHAR(24) DEFAULT 'SUBMITTED',
  matched_csr_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bill of Materials (BOM)
CREATE TABLE IF NOT EXISTS proposal_bom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id VARCHAR(32) REFERENCES proposals(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity INT NOT NULL,
  unit_cost NUMERIC(10, 2) NOT NULL,
  total_cost NUMERIC(10, 2) NOT NULL,
  supplier_type VARCHAR(64) NOT NULL
);

-- 5. CSR Escrow & Funded Projects
CREATE TABLE IF NOT EXISTS csr_funded_projects (
  id VARCHAR(32) PRIMARY KEY,
  proposal_id VARCHAR(32) REFERENCES proposals(id),
  grievance_id VARCHAR(32) REFERENCES grievances(id),
  company_id UUID REFERENCES profiles(id),
  company_name TEXT NOT NULL,
  committed_amount NUMERIC(12, 2) NOT NULL,
  escrow_account_id TEXT NOT NULL,
  disbursed_amount NUMERIC(12, 2) DEFAULT 0,
  beneficiaries_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Escrow Milestone Tranches
CREATE TABLE IF NOT EXISTS escrow_tranches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id VARCHAR(32) REFERENCES csr_funded_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  percentage INT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  condition TEXT NOT NULL,
  status VARCHAR(24) DEFAULT 'Locked',
  released_at TIMESTAMPTZ
);

-- Row-Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE csr_funded_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Grievances are viewable by everyone" ON grievances FOR SELECT USING (true);
CREATE POLICY "Anyone can insert grievances" ON grievances FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update grievances" ON grievances FOR UPDATE USING (true);

CREATE POLICY "Proposals viewable by universities and CSR" ON proposals FOR SELECT USING (true);
CREATE POLICY "Proposals insertable by university" ON proposals FOR INSERT WITH CHECK (true);
CREATE POLICY "Escrow projects viewable by all authenticated" ON csr_funded_projects FOR SELECT USING (true);

-- Supabase Storage Setup for media & attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('grievance-media', 'grievance-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access to grievance media" ON storage.objects FOR SELECT USING (bucket_id = 'grievance-media');
CREATE POLICY "Public Upload to grievance media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'grievance-media');
