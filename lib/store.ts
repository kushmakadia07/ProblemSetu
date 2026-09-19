// State management and mock data persistence for Jharkhand Societal Innovation Portal

export type UserRole = "public" | "citizen" | "university" | "csr" | "admin";

export type GrievanceStatus =
  | "LODGED"
  | "VERIFIED"
  | "ASSIGNED"
  | "PROTOTYPING"
  | "FIELD_TESTED"
  | "CITIZEN_VERIFYING"
  | "RESOLVED_CLOSED"
  | "ESCALATED";

export interface Grievance {
  id: string;
  title: string;
  description: string;
  category: string;
  district: string;
  block: string;
  panchayat: string;
  coordinates: { lat: number; lng: number };
  citizenName: string;
  citizenPhone: string;
  status: GrievanceStatus;
  urgency: "Normal" | "High" | "Critical";
  affectedCount: number;
  submittedAt: string;
  assignedUniversityId?: string;
  assignedUniversityName?: string;
  assignedDepartment?: string;
  studentTeamName?: string;
  facultyMentorName?: string;
  resolutionSummary?: string;
  resolutionDate?: string;
  resolutionProofPhotoUrl?: string;
  citizenRating?: number;
  citizenFeedback?: string;
  mediaUrls: string[];
}

export interface BOMItem {
  id: string;
  item: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplierType: "Local MSME (Jharkhand)" | "National Vendor" | "Fabrication Lab";
}

export interface Proposal {
  id: string;
  grievanceId: string;
  grievanceTitle: string;
  district: string;
  institutionName: string;
  leadStudentName: string;
  teamMembers: Array<{ name: string; branch: string; role: string; rollNo: string }>;
  facultyMentor: { name: string; designation: string; department: string; email: string };
  trlLevel: number; // 1 - 9
  proposedSolution: string;
  estimatedDurationMonths: number;
  totalBudget: number;
  bom: BOMItem[];
  milestonePhases: Array<{
    phase: string;
    description: string;
    durationWeeks: number;
    amount: number;
    status: "Completed" | "In Progress" | "Upcoming";
  }>;
  status: "DRAFT" | "SUBMITTED" | "CSR_MATCHED" | "FUNDED";
  matchedCsrPartner?: string;
  nepCreditsAwarded: number;
  createdAt: string;
}

export interface FundedProject {
  id: string;
  proposalId: string;
  grievanceId: string;
  projectTitle: string;
  companyName: string;
  committedAmount: number;
  escrowAccountId: string;
  disbursedAmount: number;
  tranches: Array<{
    id: string;
    title: string;
    percentage: number;
    amount: number;
    condition: string;
    status: "Released" | "Awaiting Approval" | "Locked";
    releasedDate?: string;
  }>;
  mentorUpdates: Array<{
    id: string;
    date: string;
    author: string;
    updateText: string;
    milestonePhase: string;
  }>;
  targetVillages: string[];
  beneficiariesCount: number;
}

export interface LeaderboardUniversity {
  rank: number;
  name: string;
  district: string;
  problemsSolved: number;
  activePrototypes: number;
  patentsFiled: number;
  nepCreditsGranted: number;
  score: number;
}

export interface LeaderboardCompany {
  rank: number;
  name: string;
  fundsDeployedLakhs: number;
  projectsBacked: number;
  villagesImpacted: number;
  esgRating: string;
}

// Initial realistic Jharkhand mock data
export const INITIAL_GRIEVANCES: Grievance[] = [
  {
    id: "JH-SOC-2026-1042",
    title: "High Arsenic & Fluoride Contamination in Shallow Borewells",
    description: "Villagers in Daltonganj block are suffering from dental and skeletal fluorosis due to elevated fluoride (3.8 mg/L) in groundwater. Need a zero-electricity gravity-based adsorption filtration unit.",
    category: "Water & Sanitation",
    district: "Palamu",
    block: "Daltonganj",
    panchayat: "Chhatauna",
    coordinates: { lat: 24.0384, lng: 84.0722 },
    citizenName: "Birsa Munda Oraon",
    citizenPhone: "98351XXXXX",
    status: "CITIZEN_VERIFYING",
    urgency: "Critical",
    affectedCount: 1250,
    submittedAt: "2026-07-14",
    assignedUniversityId: "bit-mesra",
    assignedUniversityName: "Birla Institute of Technology (BIT), Mesra",
    assignedDepartment: "Chemical & Environmental Engineering",
    studentTeamName: "Jal-Shuddhi Innovators",
    facultyMentorName: "Dr. Alok K. Verma (Prof., Environmental Engg)",
    resolutionSummary: "Installed 3 modular biochar and activated alumina gravity filtration chambers at the primary school and community handpump. Water test reports show fluoride reduced to 0.65 mg/L (Safe BIS standard).",
    resolutionDate: "2026-09-02",
    resolutionProofPhotoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80",
    mediaUrls: ["https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=600&auto=format&fit=crop&q=80"]
  },
  {
    id: "JH-SOC-2026-2180",
    title: "Severe Coal Dust Dispersion along Heavy Haulage Rural Road",
    description: "Over 80 coal tippers pass daily through residential lanes causing chronic respiratory illness in schoolchildren. Seeking low-cost IoT automated ultrasonic misting or bio-curtain barrier.",
    category: "Mining Safety & Dust Control",
    district: "Dhanbad",
    block: "Jharia",
    panchayat: "Bhulanbararee",
    coordinates: { lat: 23.7416, lng: 86.4177 },
    citizenName: "Sunita Devi Mahato",
    citizenPhone: "94311XXXXX",
    status: "PROTOTYPING",
    urgency: "Critical",
    affectedCount: 3400,
    submittedAt: "2026-08-01",
    assignedUniversityId: "iit-ism-dhanbad",
    assignedUniversityName: "IIT (ISM) Dhanbad",
    assignedDepartment: "Mining Machinery & Electronics Engg",
    studentTeamName: "CleanBreathe Jharia",
    facultyMentorName: "Prof. R. N. Mukherjee",
    mediaUrls: ["https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&auto=format&fit=crop&q=80"]
  },
  {
    id: "JH-SOC-2026-3391",
    title: "Lack of Cold Storage for Mahua & Lac Forest Produce",
    description: "Tribal self-help groups lose up to 40% of collected Mahua flowers and raw Lac resin due to fungal mold during monsoon humidity. Need a decentralized solar-powered thermo-electric cooler.",
    category: "Agri-Tech & Forest Produce",
    district: "West Singhbhum",
    block: "Chaibasa",
    panchayat: "Jhinkpani",
    coordinates: { lat: 22.4832, lng: 85.7483 },
    citizenName: "Mangal Singh Ho",
    citizenPhone: "97712XXXXX",
    status: "ASSIGNED",
    urgency: "High",
    affectedCount: 820,
    submittedAt: "2026-08-18",
    assignedUniversityId: "nit-jamshedpur",
    assignedUniversityName: "NIT Jamshedpur",
    assignedDepartment: "Mechanical & Renewable Energy Engg",
    studentTeamName: "Van-Dhan Tech",
    facultyMentorName: "Dr. S. K. Choudhary",
    mediaUrls: ["https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&auto=format&fit=crop&q=80"]
  },
  {
    id: "JH-SOC-2026-4405",
    title: "Unstable Single-Phase Grid Power for Rural Health Sub-Centre Vaccine Chillers",
    description: "Frequent 14-hour blackouts in remote tribal hamlet risk spoiling crucial childhood immunization vaccines. Need a reliable micro-solar lithium-iron battery backup with remote GSM telemetry.",
    category: "Clean Energy & Microgrid",
    district: "Dumka",
    block: "Shikaripara",
    panchayat: "Harirampur",
    coordinates: { lat: 24.2711, lng: 87.5255 },
    citizenName: "Ramesh Soren",
    citizenPhone: "99342XXXXX",
    status: "RESOLVED_CLOSED",
    urgency: "Critical",
    affectedCount: 4200,
    submittedAt: "2026-06-10",
    assignedUniversityId: "bit-mesra",
    assignedUniversityName: "Birla Institute of Technology (BIT), Mesra",
    assignedDepartment: "Electrical & Electronics Engg",
    studentTeamName: "Urja-Suraksha",
    facultyMentorName: "Dr. P. R. Thakre",
    resolutionSummary: "Fabricated and commissioned a 1.2 kW rooftop solar microgrid with 48V LiFePO4 battery pack and auto-dialer SMS alerts. Health clinic maintained uninterrupted 2-8°C vaccine storage for 45 consecutive days.",
    resolutionDate: "2026-08-22",
    resolutionProofPhotoUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
    citizenRating: 5,
    citizenFeedback: "Doctors now keep all baby vaccines safe and electricity never cuts off even during thunderstorms. Heartfelt gratitude to the BIT Mesra students and Jharkhand Govt!",
    mediaUrls: ["https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80"]
  },
  {
    id: "JH-SOC-2026-5519",
    title: "Wild Elephant Crop Raid Early Warning Acoustic System",
    description: "Herd movements from Saranda Forest cause major paddy crop destruction and human-animal conflicts in harvest season. Require automated seismic/acoustic sensing nodes to alert villagers via sirens.",
    category: "Rural Infrastructure",
    district: "East Singhbhum",
    block: "Ghatshila",
    panchayat: "Dhalbhumgarh",
    coordinates: { lat: 22.5855, lng: 86.4851 },
    citizenName: "Anil Murmu",
    citizenPhone: "94705XXXXX",
    status: "VERIFIED",
    urgency: "High",
    affectedCount: 2100,
    submittedAt: "2026-08-25",
    mediaUrls: ["https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80"]
  },
  {
    id: "JH-SOC-2026-6623",
    title: "High Infant Malnutrition in Remote Paharia Primitive Tribe Villages",
    description: "Extreme micronutrient deficiency and iron-deficiency anemia in children below 5. Need an affordable local millet-based extrusion fortified weaning food processing machine for women SHGs.",
    category: "Tribal Healthcare",
    district: "Sahebganj",
    block: "Borio",
    panchayat: "Mandro",
    coordinates: { lat: 25.0442, lng: 87.6534 },
    citizenName: "Champa Paharia",
    citizenPhone: "91223XXXXX",
    status: "LODGED",
    urgency: "Critical",
    affectedCount: 1600,
    submittedAt: "2026-09-04",
    mediaUrls: []
  }
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: "PROP-2026-01",
    grievanceId: "JH-SOC-2026-1042",
    grievanceTitle: "High Arsenic & Fluoride Contamination in Shallow Borewells",
    district: "Palamu",
    institutionName: "Birla Institute of Technology (BIT), Mesra",
    leadStudentName: "Amitabh Sen (B.Tech Chemical Engg, Final Year)",
    teamMembers: [
      { name: "Amitabh Sen", branch: "Chemical Engg", role: "Team Lead & Adsorption Lead", rollNo: "BTECH/CHE/22/045" },
      { name: "Priya Hansda", branch: "Civil & Environmental", role: "Hydraulic Chamber CAD", rollNo: "BTECH/CIV/23/012" },
      { name: "Rohan Kujur", branch: "Electronics & IoT", role: "Water Quality Sensor Telemetry", rollNo: "BTECH/ECE/23/089" }
    ],
    facultyMentor: {
      name: "Dr. Alok K. Verma",
      designation: "Professor & Head",
      department: "Dept of Chemical & Environmental Engineering",
      email: "akverma@bitmesra.ac.in"
    },
    trlLevel: 7,
    proposedSolution: "Multi-stage zero-electricity gravity filtration utilizing locally pyrolyzed bone-char/biochar and activated alumina media bed. Incorporates simple visual chemical indicator for filter bed exhaustion.",
    estimatedDurationMonths: 4,
    totalBudget: 185000,
    bom: [
      { id: "b1", item: "Food-grade HDPE Filter Cylinders (200L x 3)", quantity: 3, unitCost: 8500, totalCost: 25500, supplierType: "Local MSME (Jharkhand)" },
      { id: "b2", item: "Activated Alumina (Grade AA-400, 200 kg)", quantity: 200, unitCost: 180, totalCost: 36000, supplierType: "National Vendor" },
      { id: "b3", item: "Engineered Bamboo Biochar Adsorbent", quantity: 150, unitCost: 90, totalCost: 13500, supplierType: "Local MSME (Jharkhand)" },
      { id: "b4", item: "Submersible Low-Power Solar Sensor Node (TDS/pH/Fluoride)", quantity: 1, unitCost: 22000, totalCost: 22000, supplierType: "Fabrication Lab" },
      { id: "b5", item: "Piping, Brass Valves & Civil Stand Fabrication", quantity: 1, unitCost: 38000, totalCost: 38000, supplierType: "Local MSME (Jharkhand)" },
      { id: "b6", item: "Contingency, Lab Water Testing & Certification", quantity: 1, unitCost: 50000, totalCost: 50000, supplierType: "Fabrication Lab" }
    ],
    milestonePhases: [
      { phase: "Phase 1: Lab Adsorption Column Testing", description: "Validate breakthrough curves with 5 mg/L Fluoride water at BIT Mesra lab", durationWeeks: 4, amount: 55000, status: "Completed" },
      { phase: "Phase 2: Pilot Fabrication & Field Delivery", description: "Manufacture 3 field-hardened units and install in Chhatauna Panchayat", durationWeeks: 8, amount: 75000, status: "Completed" },
      { phase: "Phase 3: Citizen Handover & Water Quality Audit", description: "Train Panchayat Jal Sahiya and obtain certified NABL water lab compliance", durationWeeks: 4, amount: 55000, status: "In Progress" }
    ],
    status: "FUNDED",
    matchedCsrPartner: "Tata Steel Foundation",
    nepCreditsAwarded: 12,
    createdAt: "2026-07-20"
  },
  {
    id: "PROP-2026-02",
    grievanceId: "JH-SOC-2026-2180",
    grievanceTitle: "Severe Coal Dust Dispersion along Heavy Haulage Rural Road",
    district: "Dhanbad",
    institutionName: "IIT (ISM) Dhanbad",
    leadStudentName: "Sneha Baranwal (M.Tech Mining Machinery)",
    teamMembers: [
      { name: "Sneha Baranwal", branch: "Mining Machinery", role: "Team Lead & Spray Nozzle Dynamics", rollNo: "MTECH/MM/23/004" },
      { name: "Abhishek Tirkey", branch: "Mechanical Engg", role: "Pneumatic Atomizer Design", rollNo: "BTECH/ME/22/103" },
      { name: "Divya Gupta", branch: "Computer Science", role: "Computer Vision Truck Speed & Dust AI", rollNo: "BTECH/CSE/23/044" }
    ],
    facultyMentor: {
      name: "Prof. R. N. Mukherjee",
      designation: "Associate Professor",
      department: "Dept of Mining Machinery Engineering",
      email: "rnmukherjee@iitism.ac.in"
    },
    trlLevel: 5,
    proposedSolution: "Automated Solar-Powered Ultrasonic Dry-Fog Dust Suppression system. Uses acoustic camera and vibration sensors to detect incoming coal trucks, triggering micro-droplet water mist that traps PM10 particles without making road muddy.",
    estimatedDurationMonths: 6,
    totalBudget: 340000,
    bom: [
      { id: "b201", item: "Ultrasonic Ceramic Atomizer Nozzle Arrays", quantity: 12, unitCost: 4500, totalCost: 54000, supplierType: "National Vendor" },
      { id: "b202", item: "High-Pressure Booster Pump (15 Bar)", quantity: 2, unitCost: 35000, totalCost: 70000, supplierType: "National Vendor" },
      { id: "b203", item: "Solar PV 1.5 kW with MPPT Charge Controller", quantity: 1, unitCost: 85000, totalCost: 85000, supplierType: "Local MSME (Jharkhand)" },
      { id: "b204", item: "IoT Optical Dust Sensor & Micro-controller Enclosure", quantity: 2, unitCost: 28000, totalCost: 56000, supplierType: "Fabrication Lab" },
      { id: "b205", item: "Water Reservoir 2000L & Anti-Clog Sand Filter", quantity: 1, unitCost: 45000, totalCost: 45000, supplierType: "Local MSME (Jharkhand)" },
      { id: "b206", item: "Civil Foundation & Gantry Support Columns", quantity: 1, unitCost: 30000, totalCost: 30000, supplierType: "Local MSME (Jharkhand)" }
    ],
    milestonePhases: [
      { phase: "Phase 1: Wind Tunnel & Nozzle Spray Simulation", description: "Optimize droplet size (10-30 micron) for maximum coal dust adhesion", durationWeeks: 6, amount: 100000, status: "Completed" },
      { phase: "Phase 2: Roadside Prototype Construction", description: "Erect 50-metre test corridor in Jharia Bhulanbararee haulage junction", durationWeeks: 10, amount: 140000, status: "In Progress" },
      { phase: "Phase 3: 60-Day Field Trial & Pollution Board Audit", description: "Measure 75%+ reduction in ambient PM2.5 and PM10 levels", durationWeeks: 8, amount: 100000, status: "Upcoming" }
    ],
    status: "CSR_MATCHED",
    matchedCsrPartner: "Central Coalfields Limited (CCL) / Coal India",
    nepCreditsAwarded: 16,
    createdAt: "2026-08-08"
  },
  {
    id: "PROP-2026-03",
    grievanceId: "JH-SOC-2026-3391",
    grievanceTitle: "Lack of Cold Storage for Mahua & Lac Forest Produce",
    district: "West Singhbhum",
    institutionName: "NIT Jamshedpur",
    leadStudentName: "Kunal Kashyap (B.Tech Mechanical)",
    teamMembers: [
      { name: "Kunal Kashyap", branch: "Mechanical Engg", role: "Team Lead & Thermal Modeling", rollNo: "2022UGME031" },
      { name: "Neha Soren", branch: "Production & Industrial", role: "Peltier Enclosure Fabrication", rollNo: "2023UGPI019" }
    ],
    facultyMentor: {
      name: "Dr. S. K. Choudhary",
      designation: "Assistant Professor",
      department: "Dept of Mechanical Engineering",
      email: "skchoudhary.mech@nitjsr.ac.in"
    },
    trlLevel: 4,
    proposedSolution: "Modular Phase Change Material (PCM) assisted solar thermoelectric cooler designed for 200 kg Mahua batch drying and preservation at 12-15°C with zero chemical fumigants.",
    estimatedDurationMonths: 5,
    totalBudget: 210000,
    bom: [
      { id: "b301", item: "Peltier Thermoelectric Cooling Modules (12706 x 16)", quantity: 16, unitCost: 1200, totalCost: 19200, supplierType: "National Vendor" },
      { id: "b302", item: "Bio-based PCM Thermal Storage Slabs (40 kg)", quantity: 40, unitCost: 850, totalCost: 34000, supplierType: "National Vendor" },
      { id: "b303", item: "Insulated Polyurethane Foam Cabinet (1.5 m³)", quantity: 1, unitCost: 48000, totalCost: 48000, supplierType: "Local MSME (Jharkhand)" },
      { id: "b304", item: "Solar PV Panels 800W & MPPT Battery", quantity: 1, unitCost: 55000, totalCost: 55000, supplierType: "Local MSME (Jharkhand)" },
      { id: "b305", item: "Electronics, Temp/Humidity Sensors & Air Circulator", quantity: 1, unitCost: 28000, totalCost: 28000, supplierType: "Fabrication Lab" },
      { id: "b306", item: "Tribal SHG Field Demonstrator & Manuals (Ho language)", quantity: 1, unitCost: 25800, totalCost: 25800, supplierType: "Fabrication Lab" }
    ],
    milestonePhases: [
      { phase: "Phase 1: PCM Thermal Decay Testing", description: "Simulate 42°C summer heat wave conditions with 18-hour cold retention", durationWeeks: 5, amount: 60000, status: "Upcoming" },
      { phase: "Phase 2: Prototype Assembly & Van-Dhan Kendra Trial", description: "Install unit with Jhinkpani Mahua Cooperative", durationWeeks: 8, amount: 90000, status: "Upcoming" },
      { phase: "Phase 3: SHG Commercial Viability Sign-off", description: "Demonstrate 35% higher selling price for mold-free Grade-A Mahua", durationWeeks: 5, amount: 60000, status: "Upcoming" }
    ],
    status: "SUBMITTED",
    nepCreditsAwarded: 10,
    createdAt: "2026-08-28"
  }
];

export const INITIAL_FUNDED_PROJECTS: FundedProject[] = [
  {
    id: "FUND-2026-01",
    proposalId: "PROP-2026-01",
    grievanceId: "JH-SOC-2026-1042",
    projectTitle: "Palamu Clean Fluoride-Free Drinking Water Biochar Filtration",
    companyName: "Tata Steel Foundation",
    committedAmount: 185000,
    escrowAccountId: "JH-ESCROW-TSF-0091",
    disbursedAmount: 130000,
    tranches: [
      {
        id: "tranche-1",
        title: "Tranche 1: Lab R&D and Adsorption Column Testing",
        percentage: 30,
        amount: 55500,
        condition: "Lab test certificate confirming >90% Fluoride reduction",
        status: "Released",
        releasedDate: "2026-07-28"
      },
      {
        id: "tranche-2",
        title: "Tranche 2: Field Prototype Fabrication & Village Installation",
        percentage: 40,
        amount: 74000,
        condition: "Geotagged photographic verification of installed units in Chhatauna",
        status: "Released",
        releasedDate: "2026-08-25"
      },
      {
        id: "tranche-3",
        title: "Tranche 3: Citizen Handover & Final NABL Certification",
        percentage: 30,
        amount: 55500,
        condition: "Citizen satisfaction rating >4.0 and signed Panchayat verification certificate",
        status: "Awaiting Approval"
      }
    ],
    mentorUpdates: [
      {
        id: "upd-1",
        date: "2026-08-05",
        author: "Dr. Alok K. Verma (Faculty Mentor)",
        updateText: "Adsorption breakthrough curves verified. Activated alumina + bamboo biochar composite reached 93.4% Fluoride adsorption efficiency in continuous flow columns.",
        milestonePhase: "Phase 1: Lab Testing"
      },
      {
        id: "upd-2",
        date: "2026-08-22",
        author: "Amitabh Sen (Student Lead)",
        updateText: "All 3 HDPE filtration chambers delivered and plumbed at Chhatauna Panchayat Primary School and Public Handpump. Flow rate calibrated at 450 L/hr.",
        milestonePhase: "Phase 2: Installation"
      },
      {
        id: "upd-3",
        date: "2026-09-02",
        author: "Dr. Alok K. Verma (Faculty Mentor)",
        updateText: "Water samples tested by NABL accredited lab: Fluoride level 0.65 mg/L (well within permissible BIS limit of 1.0 mg/L). Citizen verification initiated.",
        milestonePhase: "Phase 3: Verification"
      }
    ],
    targetVillages: ["Chhatauna", "Daltonganj Outer Hamlets"],
    beneficiariesCount: 1250
  },
  {
    id: "FUND-2026-02",
    proposalId: "PROP-2026-02",
    grievanceId: "JH-SOC-2026-2180",
    projectTitle: "Jharia Coal Haulage Dust Ultrasonic Micro-Misting Corridor",
    companyName: "Central Coalfields Limited (CCL) / Coal India",
    committedAmount: 340000,
    escrowAccountId: "JH-ESCROW-CCL-0044",
    disbursedAmount: 102000,
    tranches: [
      {
        id: "tranche-201",
        title: "Tranche 1: Aerodynamic Spray Simulation & IoT Circuit Design",
        percentage: 30,
        amount: 102000,
        condition: "Approved CAD blueprints and laboratory aerosol chamber clearance",
        status: "Released",
        releasedDate: "2026-08-15"
      },
      {
        id: "tranche-202",
        title: "Tranche 2: Structural Gantry Erection & Booster Pump Commissioning",
        percentage: 40,
        amount: 136000,
        condition: "Roadside installation milestone inspection by BCCL/CCL CSR Engineer",
        status: "Awaiting Approval"
      },
      {
        id: "tranche-203",
        title: "Tranche 3: Continuous 30-Day Pollution Sensor Verification",
        percentage: 30,
        amount: 102000,
        condition: "JSPCB (Jharkhand State Pollution Control Board) PM10 audit pass",
        status: "Locked"
      }
    ],
    mentorUpdates: [
      {
        id: "upd-201",
        date: "2026-08-14",
        author: "Prof. R. N. Mukherjee (Faculty Mentor)",
        updateText: "Lab ultrasonic atomizers successfully generated 15-25 micron mist droplets capable of capturing PM10 coal dust particles within 1.2 seconds of vehicle passage.",
        milestonePhase: "Phase 1: Spray Testing"
      },
      {
        id: "upd-202",
        date: "2026-09-01",
        author: "Sneha Baranwal (Student Lead)",
        updateText: "Structural gantry foundation completed in Bhulanbararee. Solar PV array mounted and testing automated optical sensors with coal trucks.",
        milestonePhase: "Phase 2: Field Erection"
      }
    ],
    targetVillages: ["Bhulanbararee", "Tisra", "Jharia Collieries"],
    beneficiariesCount: 3400
  }
];

export const LEADERBOARD_UNIVERSITIES: LeaderboardUniversity[] = [
  { rank: 1, name: "Birla Institute of Technology (BIT), Mesra", district: "Ranchi", problemsSolved: 19, activePrototypes: 11, patentsFiled: 6, nepCreditsGranted: 340, score: 96.8 },
  { rank: 2, name: "IIT (ISM) Dhanbad", district: "Dhanbad", problemsSolved: 17, activePrototypes: 14, patentsFiled: 8, nepCreditsGranted: 280, score: 94.2 },
  { rank: 3, name: "National Institute of Technology (NIT), Jamshedpur", district: "East Singhbhum", problemsSolved: 14, activePrototypes: 9, patentsFiled: 4, nepCreditsGranted: 220, score: 89.5 },
  { rank: 4, name: "Birsa Agricultural University (BAU), Kanke", district: "Ranchi", problemsSolved: 11, activePrototypes: 7, patentsFiled: 3, nepCreditsGranted: 195, score: 84.0 },
  { rank: 5, name: "Kolhan University Engineering College", district: "Chaibasa", problemsSolved: 7, activePrototypes: 5, patentsFiled: 1, nepCreditsGranted: 110, score: 76.4 },
  { rank: 6, name: "Vinoba Bhave University (UCET)", district: "Hazaribagh", problemsSolved: 6, activePrototypes: 4, patentsFiled: 1, nepCreditsGranted: 85, score: 72.1 }
];

export const LEADERBOARD_COMPANIES: LeaderboardCompany[] = [
  { rank: 1, name: "Tata Steel Foundation (TSF)", fundsDeployedLakhs: 245.5, projectsBacked: 24, villagesImpacted: 82, esgRating: "AAA+ (Leader)" },
  { rank: 2, name: "Coal India / Central Coalfields Ltd (CCL/BCCL)", fundsDeployedLakhs: 198.0, projectsBacked: 19, villagesImpacted: 64, esgRating: "AAA (Leader)" },
  { rank: 3, name: "Jindal Steel & Power CSR", fundsDeployedLakhs: 142.0, projectsBacked: 14, villagesImpacted: 41, esgRating: "AA+ (High)" },
  { rank: 4, name: "NTPC North Karanpura CSR", fundsDeployedLakhs: 115.0, projectsBacked: 11, villagesImpacted: 35, esgRating: "AA (Strong)" },
  { rank: 5, name: "Usha Martin CSR Foundation", fundsDeployedLakhs: 68.5, projectsBacked: 8, villagesImpacted: 22, esgRating: "A+ (Moderate)" }
];

// In-browser state store with localStorage sync
class StateStore {
  private grievances: Grievance[] = INITIAL_GRIEVANCES;
  private proposals: Proposal[] = INITIAL_PROPOSALS;
  private fundedProjects: FundedProject[] = INITIAL_FUNDED_PROJECTS;
  private currentRole: UserRole = "public";
  private citizenAadhaar: string = "";
  private citizenPhone: string = "";
  private citizenName: string = "";
  private citizenAddress: string = "";
  private isAadhaarVerified: boolean = false;
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const storedRole = localStorage.getItem("jh_portal_role") as UserRole;
        if (storedRole) this.currentRole = storedRole;

        const storedGrv = localStorage.getItem("jh_portal_grievances");
        if (storedGrv) this.grievances = JSON.parse(storedGrv);

        const storedProps = localStorage.getItem("jh_portal_proposals");
        if (storedProps) this.proposals = JSON.parse(storedProps);

        const storedFunds = localStorage.getItem("jh_portal_funded");
        if (storedFunds) this.fundedProjects = JSON.parse(storedFunds);

        const storedAadhaar = localStorage.getItem("jh_portal_aadhaar");
        if (storedAadhaar) this.citizenAadhaar = storedAadhaar;

        const storedPhone = localStorage.getItem("jh_portal_phone");
        if (storedPhone) this.citizenPhone = storedPhone;

        const storedName = localStorage.getItem("jh_portal_citizen_name");
        if (storedName) this.citizenName = storedName;

        const storedAddress = localStorage.getItem("jh_portal_citizen_address");
        if (storedAddress) this.citizenAddress = storedAddress;

        const storedVerified = localStorage.getItem("jh_portal_aadhaar_verified");
        if (storedVerified === "true") this.isAadhaarVerified = true;
      } catch (err) {
        console.warn("Storage hydration failed", err);
      }
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("jh_portal_role", this.currentRole);
        localStorage.setItem("jh_portal_grievances", JSON.stringify(this.grievances));
        localStorage.setItem("jh_portal_proposals", JSON.stringify(this.proposals));
        localStorage.setItem("jh_portal_funded", JSON.stringify(this.fundedProjects));
        localStorage.setItem("jh_portal_aadhaar", this.citizenAadhaar);
        localStorage.setItem("jh_portal_phone", this.citizenPhone);
        localStorage.setItem("jh_portal_citizen_name", this.citizenName);
        localStorage.setItem("jh_portal_citizen_address", this.citizenAddress);
        localStorage.setItem("jh_portal_aadhaar_verified", String(this.isAadhaarVerified));
      } catch (e) {
        console.warn("Failed to persist to localStorage", e);
      }
    }
    this.listeners.forEach((listener) => listener());
  }

  public getRole(): UserRole {
    return this.currentRole;
  }

  public setRole(role: UserRole) {
    this.currentRole = role;
    this.notify();
  }

  public setCitizenAuth(aadhaar: string, phone: string, name: string = "Citizen User", address: string = "Jharkhand", verified: boolean = true) {
    this.citizenAadhaar = aadhaar;
    this.citizenPhone = phone;
    this.citizenName = name;
    this.citizenAddress = address;
    this.isAadhaarVerified = verified;
    this.notify();
  }

  public getCitizenAuth() {
    return {
      aadhaar: this.citizenAadhaar,
      phone: this.citizenPhone,
      name: this.citizenName,
      address: this.citizenAddress,
      isVerified: this.isAadhaarVerified,
    };
  }

  public getGrievances(): Grievance[] {
    return [...this.grievances];
  }

  public getGrievanceById(id: string): Grievance | undefined {
    return this.grievances.find((g) => g.id === id);
  }

  public addGrievance(grv: Omit<Grievance, "id" | "submittedAt" | "status">): Grievance {
    const newId = `JH-SOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry: Grievance = {
      ...grv,
      id: newId,
      status: "LODGED",
      submittedAt: new Date().toISOString().split("T")[0],
    };
    this.grievances = [newEntry, ...this.grievances];
    this.notify();
    return newEntry;
  }

  public updateGrievanceStatus(id: string, status: GrievanceStatus, extra?: Partial<Grievance>) {
    this.grievances = this.grievances.map((g) => {
      if (g.id === id) {
        return { ...g, status, ...extra };
      }
      return g;
    });
    this.notify();
  }

  public getProposals(): Proposal[] {
    return [...this.proposals];
  }

  public addProposal(prop: Omit<Proposal, "id" | "createdAt" | "status">): Proposal {
    const newId = `PROP-${new Date().getFullYear()}-0${this.proposals.length + 1}`;
    const newEntry: Proposal = {
      ...prop,
      id: newId,
      status: "SUBMITTED",
      createdAt: new Date().toISOString().split("T")[0],
    };
    this.proposals = [newEntry, ...this.proposals];

    // Mark grievance as ASSIGNED / PROTOTYPING
    this.updateGrievanceStatus(prop.grievanceId, "ASSIGNED", {
      assignedUniversityName: prop.institutionName,
      studentTeamName: prop.leadStudentName.split(" ")[0] + "'s Team",
      facultyMentorName: prop.facultyMentor.name,
    });

    this.notify();
    return newEntry;
  }

  public getFundedProjects(): FundedProject[] {
    return [...this.fundedProjects];
  }

  public releaseTranche(projectId: string, trancheId: string) {
    this.fundedProjects = this.fundedProjects.map((p) => {
      if (p.id === projectId) {
        let addedDisbursed = 0;
        const updatedTranches = p.tranches.map((t) => {
          if (t.id === trancheId && t.status !== "Released") {
            addedDisbursed = t.amount;
            return {
              ...t,
              status: "Released" as const,
              releasedDate: new Date().toISOString().split("T")[0],
            };
          }
          return t;
        });
        return {
          ...p,
          disbursedAmount: p.disbursedAmount + addedDisbursed,
          tranches: updatedTranches,
        };
      }
      return p;
    });
    this.notify();
  }

  public verifyResolution(grievanceId: string, rating: number, feedback: string, photoProofUrl?: string) {
    this.grievances = this.grievances.map((g) => {
      if (g.id === grievanceId) {
        return {
          ...g,
          status: "RESOLVED_CLOSED" as const,
          citizenRating: rating,
          citizenFeedback: feedback,
          resolutionProofPhotoUrl: photoProofUrl || g.resolutionProofPhotoUrl,
          resolutionDate: new Date().toISOString().split("T")[0],
        };
      }
      return g;
    });
    this.notify();
  }
}

export const store = new StateStore();
