-- =====================================================================
-- PROBLEMSETU
-- CITIZEN GRIEVANCE & CROWDSOURCING PLATFORM
-- COMPLETE CLEAN DATABASE SETUP
-- =====================================================================

-- =====================================================================
-- 0. UUID EXTENSION
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =====================================================================
-- 1. REMOVE OLD TABLES
-- =====================================================================

DROP TABLE IF EXISTS grievance_logs CASCADE;
DROP TABLE IF EXISTS grievances CASCADE;
DROP TABLE IF EXISTS department_officials CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;


-- =====================================================================
-- 2. REMOVE OLD ENUMS
-- =====================================================================

DROP TYPE IF EXISTS grievance_urgency CASCADE;
DROP TYPE IF EXISTS grievance_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;


-- =====================================================================
-- 3. CREATE ENUMS
-- =====================================================================

CREATE TYPE user_role AS ENUM (
    'citizen',
    'department_official',
    'admin'
);

CREATE TYPE grievance_status AS ENUM (
    'submitted',
    'verified',
    'in_progress',
    'resolved',
    'rejected',
    'escalated'
);

CREATE TYPE grievance_urgency AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);


-- =====================================================================
-- 4. UPDATED_AT FUNCTION
-- =====================================================================

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- =====================================================================
-- 5. PROFILES TABLE
-- =====================================================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    role user_role NOT NULL DEFAULT 'citizen',

    full_name VARCHAR(150) NOT NULL,

    phone VARCHAR(15) NOT NULL UNIQUE,

    email VARCHAR(255) UNIQUE,

    aadhaar_number VARCHAR(12),

    state VARCHAR(100) NOT NULL DEFAULT 'Jharkhand',

    district VARCHAR(100) NOT NULL DEFAULT 'Ranchi',

    address_line TEXT,

    is_verified BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =====================================================================
-- 6. CATEGORIES TABLE
-- =====================================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(120) NOT NULL UNIQUE,

    slug VARCHAR(120) NOT NULL UNIQUE,

    description TEXT,

    sla_days INT NOT NULL DEFAULT 15,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =====================================================================
-- 7. DEPARTMENT OFFICIALS TABLE
-- =====================================================================

CREATE TABLE department_officials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    profile_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    department_name VARCHAR(150) NOT NULL,

    designation VARCHAR(120) NOT NULL,

    assigned_district VARCHAR(100) NOT NULL,

    assigned_category_id UUID
        REFERENCES categories(id)
        ON DELETE SET NULL,

    is_available BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_official_profile UNIQUE (profile_id)
);


-- =====================================================================
-- 8. GRIEVANCES TABLE
-- =====================================================================

CREATE TABLE grievances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tracking_code VARCHAR(32) NOT NULL UNIQUE,

    citizen_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    category_id UUID
        REFERENCES categories(id)
        ON DELETE SET NULL,

    assigned_official_id UUID
        REFERENCES department_officials(id)
        ON DELETE SET NULL,

    title VARCHAR(255) NOT NULL,

    description TEXT NOT NULL,

    urgency grievance_urgency NOT NULL DEFAULT 'medium',

    status grievance_status NOT NULL DEFAULT 'submitted',

    state VARCHAR(100) NOT NULL DEFAULT 'Jharkhand',

    district VARCHAR(100) NOT NULL,

    block VARCHAR(100),

    panchayat VARCHAR(100),

    ward_or_colony VARCHAR(150),

    landmark TEXT,

    latitude DOUBLE PRECISION,

    longitude DOUBLE PRECISION,

    affected_population INT NOT NULL DEFAULT 10,

    media_urls TEXT[] NOT NULL DEFAULT '{}',

    ai_diagnostic_qa JSONB NOT NULL DEFAULT '[]'::jsonb,

    resolution_summary TEXT,

    resolution_proof_url TEXT,

    citizen_rating INT
        CHECK (citizen_rating BETWEEN 1 AND 5),

    citizen_feedback TEXT,

    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    resolved_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =====================================================================
-- 9. GRIEVANCE LOGS TABLE
-- =====================================================================

CREATE TABLE grievance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    grievance_id UUID NOT NULL
        REFERENCES grievances(id)
        ON DELETE CASCADE,

    performed_by UUID
        REFERENCES profiles(id)
        ON DELETE SET NULL,

    previous_status grievance_status,

    new_status grievance_status NOT NULL,

    action_type VARCHAR(60) NOT NULL,

    remarks TEXT NOT NULL,

    attachment_urls TEXT[] NOT NULL DEFAULT '{}',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =====================================================================
-- 10. INDEXES
-- =====================================================================

CREATE INDEX idx_profiles_phone
    ON profiles(phone);

CREATE INDEX idx_profiles_role
    ON profiles(role);

CREATE INDEX idx_officials_district_category
    ON department_officials(
        assigned_district,
        assigned_category_id
    );

CREATE INDEX idx_grievances_citizen_id
    ON grievances(citizen_id);

CREATE INDEX idx_grievances_status
    ON grievances(status);

CREATE INDEX idx_grievances_district_category
    ON grievances(
        district,
        category_id
    );

CREATE INDEX idx_grievances_tracking_code
    ON grievances(tracking_code);

CREATE INDEX idx_grievances_submitted_at
    ON grievances(submitted_at DESC);

CREATE INDEX idx_grievance_logs_grievance_id
    ON grievance_logs(
        grievance_id,
        created_at ASC
    );


-- =====================================================================
-- 11. UPDATED_AT TRIGGERS
-- =====================================================================

CREATE TRIGGER set_profiles_timestamp
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


CREATE TRIGGER set_categories_timestamp
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


CREATE TRIGGER set_officials_timestamp
BEFORE UPDATE ON department_officials
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


CREATE TRIGGER set_grievances_timestamp
BEFORE UPDATE ON grievances
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- =====================================================================
-- 12. ENABLE ROW LEVEL SECURITY
-- =====================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE department_officials ENABLE ROW LEVEL SECURITY;

ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;

ALTER TABLE grievance_logs ENABLE ROW LEVEL SECURITY;


-- =====================================================================
-- 13. RLS POLICIES
-- =====================================================================

CREATE POLICY "Public profiles are readable"
ON profiles
FOR SELECT
USING (true);


CREATE POLICY "Categories are readable by everyone"
ON categories
FOR SELECT
USING (true);


CREATE POLICY "Department officials are readable by everyone"
ON department_officials
FOR SELECT
USING (true);


CREATE POLICY "Grievances are publicly viewable"
ON grievances
FOR SELECT
USING (true);


CREATE POLICY "Grievance logs are publicly viewable"
ON grievance_logs
FOR SELECT
USING (true);


CREATE POLICY "Anyone can lodge a grievance"
ON grievances
FOR INSERT
WITH CHECK (true);


CREATE POLICY "Anyone can insert grievance logs"
ON grievance_logs
FOR INSERT
WITH CHECK (true);


CREATE POLICY "Profiles can be inserted or updated"
ON profiles
FOR ALL
USING (true)
WITH CHECK (true);


-- =====================================================================
-- 14. SAMPLE CATEGORIES
-- =====================================================================

INSERT INTO categories (
    id,
    name,
    slug,
    description,
    sla_days
)
VALUES

(
    'c1000000-0000-0000-0000-000000000001',
    'Drinking Water & Quality',
    'drinking-water',
    'Pipeline leaks, murky drinking water, pump failures, and contamination.',
    7
),

(
    'c1000000-0000-0000-0000-000000000002',
    'Roads & Public Works',
    'roads-potholes',
    'Potholes, damaged culverts, waterlogging on main roads, and street cave-ins.',
    10
),

(
    'c1000000-0000-0000-0000-000000000003',
    'Sanitation & Solid Waste',
    'sanitation-waste',
    'Overflowing garbage vats, blocked drainage, and unattended bio-waste.',
    5
);


-- =====================================================================
-- 15. SAMPLE PROFILES
-- =====================================================================

INSERT INTO profiles (
    id,
    role,
    full_name,
    phone,
    email,
    aadhaar_number,
    state,
    district,
    address_line
)
VALUES

(
    'a1000000-0000-0000-0000-000000000001',
    'citizen',
    'Jayam Patel',
    '9327583699',
    'jayam.patel@example.com',
    '000000000000',
    'Jharkhand',
    'Ranchi',
    'House No. 8, Krishna Colony, Morabadi'
),

(
    'a1000000-0000-0000-0000-000000000002',
    'department_official',
    'Er. Rajesh Sharma',
    '9835100001',
    'rajesh.sharma@example.com',
    '111111111111',
    'Jharkhand',
    'Ranchi',
    'Executive Engineers Quarter, Kanke Road, Ranchi'
),

(
    'a1000000-0000-0000-0000-000000000003',
    'department_official',
    'Er. Ananya Sengupta',
    '9835100002',
    'ananya.sengupta@example.com',
    '222222222222',
    'Jharkhand',
    'Ranchi',
    'PWD Secretariat Office, Doranda, Ranchi'
);


-- =====================================================================
-- 16. DEPARTMENT OFFICIAL MAPPING
-- =====================================================================

INSERT INTO department_officials (
    id,
    profile_id,
    department_name,
    designation,
    assigned_district,
    assigned_category_id
)
VALUES

(
    'd1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000002',
    'Drinking Water & Sanitation Department (DWSD)',
    'Executive Engineer (Rural Water)',
    'Ranchi',
    'c1000000-0000-0000-0000-000000000001'
),

(
    'd1000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000003',
    'Road Construction Department / PWD',
    'Assistant Executive Engineer',
    'Ranchi',
    'c1000000-0000-0000-0000-000000000002'
);


-- =====================================================================
-- 17. SAMPLE GRIEVANCES
-- =====================================================================

INSERT INTO grievances (
    id,
    tracking_code,
    citizen_id,
    category_id,
    assigned_official_id,
    title,
    description,
    urgency,
    status,
    state,
    district,
    block,
    panchayat,
    ward_or_colony,
    landmark,
    latitude,
    longitude,
    affected_population,
    media_urls,
    ai_diagnostic_qa,
    submitted_at
)
VALUES

(
    '61000000-0000-4000-8000-000000000001',

    'JH-2026-WTR-8821',

    'a1000000-0000-0000-0000-000000000001',

    'c1000000-0000-0000-0000-000000000001',

    'd1000000-0000-0000-0000-000000000001',

    'Sewage Contamination in Main Drinking Water Supply Pipeline',

    'For the past 4 days, tap water in Krishna Colony is brown and emits a strong sewage odor due to a burst cross-connection with a nearby municipal drain.',

    'critical',

    'in_progress',

    'Jharkhand',

    'Ranchi',

    'Kanke',

    'Morabadi Urban',

    'Ward 8, Krishna Colony',

    'Near Morabadi Ground Gate No. 3',

    23.3892,

    85.3215,

    350,

    ARRAY[
        'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800'
    ],

    '[
        {
            "question": "How long has the contamination persisted?",
            "answer": "Over 96 hours continuously during morning supply."
        },
        {
            "question": "Are household filters or boiling eliminating the odor?",
            "answer": "No, sediment and odor remain distinct."
        }
    ]'::jsonb,

    NOW() - INTERVAL '2 days'
),

(
    '61000000-0000-4000-8000-000000000002',

    'JH-2026-ROD-4419',

    'a1000000-0000-0000-0000-000000000001',

    'c1000000-0000-0000-0000-000000000002',

    'd1000000-0000-0000-0000-000000000002',

    'Deep 3-Foot Trench Left Unfilled on Ring Road Approach',

    'Underground cable trenching was completed a week ago, but the deep trench on the blind curve of Ring Road has been left open without barricades, leading to frequent two-wheeler accidents.',

    'high',

    'verified',

    'Jharkhand',

    'Ranchi',

    'Namkum',

    'Tupudana',

    'Ring Road Junction',

    'Opposite Hatia Overbridge Crossing',

    23.2981,

    85.2895,

    1200,

    ARRAY[
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800'
    ],

    '[
        {
            "question": "Is night warning signage or reflective tape present?",
            "answer": "None installed; total blackout after 7 PM."
        }
    ]'::jsonb,

    NOW() - INTERVAL '1 day'
);


-- =====================================================================
-- 18. SAMPLE GRIEVANCE LOGS
-- =====================================================================

INSERT INTO grievance_logs (
    grievance_id,
    performed_by,
    previous_status,
    new_status,
    action_type,
    remarks,
    created_at
)
VALUES

(
    '61000000-0000-4000-8000-000000000001',

    'a1000000-0000-0000-0000-000000000001',

    NULL,

    'submitted',

    'CITIZEN_SUBMISSION',

    'Grievance registered with geotagged coordinates and diagnostic Q&A.',

    NOW() - INTERVAL '2 days'
),

(
    '61000000-0000-4000-8000-000000000001',

    'a1000000-0000-0000-0000-000000000002',

    'submitted',

    'in_progress',

    'FIELD_INSPECTION_DISPATCHED',

    'DWSD junior engineer dispatched to isolate the leaking pipeline valve and deploy a temporary water tanker.',

    NOW() - INTERVAL '1 day'
);
