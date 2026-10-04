import {
  fetchGrievancesFromSupabase,
  saveGrievanceToSupabase,
  updateGrievanceStatusInSupabase
} from "./supabase";

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
  aiDiagnosticQa?: Array<{ question: string; answer: string }>;
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

// Real-world grievance storage (populated dynamically from Supabase database)
export const INITIAL_GRIEVANCES: Grievance[] = [];

export const INITIAL_PROPOSALS: Proposal[] = [];

export const INITIAL_FUNDED_PROJECTS: FundedProject[] = [];

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
  private citizenProfileId: string = "";
  private citizenAadhaar: string = "";
  private citizenPhone: string = "";
  private citizenName: string = "";
  private citizenAddress: string = "";
  private isAadhaarVerified: boolean = false;
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== "undefined") {
      try {
        // One-time cleanup of all previous trial accounts and trial data
        const isCleaned = localStorage.getItem("jh_portal_clean_trial_v3");
        if (!isCleaned) {
          localStorage.removeItem("jh_portal_grievances");
          localStorage.removeItem("jh_portal_proposals");
          localStorage.removeItem("jh_portal_funded");
          localStorage.removeItem("jh_portal_citizen_profile_id");
          localStorage.removeItem("jh_portal_aadhaar");
          localStorage.removeItem("jh_portal_phone");
          localStorage.removeItem("jh_portal_citizen_name");
          localStorage.removeItem("jh_portal_citizen_address");
          localStorage.removeItem("jh_portal_aadhaar_verified");
          localStorage.removeItem("jh_portal_role");
          localStorage.setItem("jh_portal_clean_trial_v3", "true");
        } else {
          const storedRole = localStorage.getItem("jh_portal_role") as UserRole;
          if (storedRole) this.currentRole = storedRole;

          const storedProps = localStorage.getItem("jh_portal_proposals");
          if (storedProps) this.proposals = JSON.parse(storedProps);

          const storedFunds = localStorage.getItem("jh_portal_funded");
          if (storedFunds) this.fundedProjects = JSON.parse(storedFunds);

          const storedProfileId = localStorage.getItem("jh_portal_citizen_profile_id");
          if (storedProfileId) this.citizenProfileId = storedProfileId;

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
        }
      } catch (err) {
        console.warn("Storage hydration failed", err);
      }

      // Initial async sync from Supabase database
      this.syncFromSupabase();
    }
  }

  public async syncFromSupabase() {
    try {
      const dbGrievances = await fetchGrievancesFromSupabase();
      this.grievances = dbGrievances || [];
      this.notify();
    } catch (err) {
      console.warn("Failed to sync grievances from Supabase:", err);
    }
  }

  public signOut() {
    this.currentRole = "public";
    this.citizenProfileId = "";
    this.citizenAadhaar = "";
    this.citizenPhone = "";
    this.citizenName = "";
    this.citizenAddress = "";
    this.isAadhaarVerified = false;
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("jh_portal_role");
        localStorage.removeItem("jh_portal_citizen_profile_id");
        localStorage.removeItem("jh_portal_aadhaar");
        localStorage.removeItem("jh_portal_phone");
        localStorage.removeItem("jh_portal_citizen_name");
        localStorage.removeItem("jh_portal_citizen_address");
        localStorage.removeItem("jh_portal_aadhaar_verified");
      } catch (e) {
        console.warn("Failed to clear auth from localStorage", e);
      }
    }
    this.notify();
  }

  public clearAllLocalData() {
    this.signOut();
    this.proposals = [];
    this.fundedProjects = [];
    this.grievances = [];
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("jh_portal_proposals");
        localStorage.removeItem("jh_portal_funded");
        localStorage.removeItem("jh_portal_grievances");
      } catch (e) {
        console.warn("Failed to clear all local data", e);
      }
    }
    this.notify();
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
        localStorage.setItem("jh_portal_proposals", JSON.stringify(this.proposals));
        localStorage.setItem("jh_portal_funded", JSON.stringify(this.fundedProjects));
        localStorage.setItem("jh_portal_citizen_profile_id", this.citizenProfileId);
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

  public setCitizenAuth(
    aadhaar: string,
    phone: string,
    name: string = "Citizen User",
    address: string = "Jharkhand",
    verified: boolean = true,
    profileId: string = ""
  ) {
    this.citizenAadhaar = aadhaar;
    this.citizenPhone = phone;
    this.citizenName = name;
    this.citizenAddress = address;
    this.isAadhaarVerified = verified;
    if (profileId) this.citizenProfileId = profileId;
    this.notify();
  }

  public getCitizenAuth() {
    return {
      id: this.citizenProfileId,
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

    // Persist to Supabase PostgreSQL database
    saveGrievanceToSupabase(newEntry, this.citizenProfileId).catch((err) => {
      console.warn("Supabase background save warning:", err);
    });

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

    // Persist status change to Supabase
    updateGrievanceStatusInSupabase(id, status, extra).catch((err) => {
      console.warn("Supabase background status update warning:", err);
    });
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

    // Persist resolution to Supabase
    updateGrievanceStatusInSupabase(grievanceId, "RESOLVED_CLOSED", {
      citizenRating: rating,
      citizenFeedback: feedback,
      resolutionProofPhotoUrl: photoProofUrl,
    }).catch((err) => {
      console.warn("Supabase verifyResolution warning:", err);
    });
  }
}

export const store = new StateStore();
