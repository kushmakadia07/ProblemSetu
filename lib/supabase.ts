import { createClient } from "@supabase/supabase-js";
import type { Grievance, GrievanceStatus } from "./store";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hfmcazldvitlyuexnrfe.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_UCqq8QvGJWH8OCxM_xsJYw_Az8SUfH5";

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbGrievanceRow {
  id: string;
  citizen_id?: string | null;
  title: string;
  description: string;
  category: string;
  district: string;
  block: string;
  panchayat: string;
  latitude: number | null;
  longitude: number | null;
  urgency: string;
  affected_count: number;
  status: GrievanceStatus;
  media_urls: string[];
  ai_diagnostic_qa: Array<{ question: string; answer: string }>;
  assigned_university_id?: string | null;
  resolution_summary?: string | null;
  resolution_proof_url?: string | null;
  citizen_rating?: number | null;
  citizen_feedback?: string | null;
  submitted_at: string;
  resolved_at?: string | null;
}

export function mapDbRowToGrievance(row: any): Grievance {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    district: row.district,
    block: row.block,
    panchayat: row.panchayat,
    coordinates: {
      lat: row.latitude || 23.3441,
      lng: row.longitude || 85.3096,
    },
    citizenName: row.citizen_name || "Citizen Reporter",
    citizenPhone: row.citizen_phone || "",
    status: row.status as GrievanceStatus,
    urgency: (row.urgency as "Normal" | "High" | "Critical") || "High",
    affectedCount: row.affected_count || 100,
    submittedAt: row.submitted_at ? new Date(row.submitted_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    assignedUniversityId: row.assigned_university_id || undefined,
    resolutionSummary: row.resolution_summary || undefined,
    resolutionProofPhotoUrl: row.resolution_proof_url || undefined,
    citizenRating: row.citizen_rating || undefined,
    citizenFeedback: row.citizen_feedback || undefined,
    mediaUrls: Array.isArray(row.media_urls) ? row.media_urls : [],
    aiDiagnosticQa: Array.isArray(row.ai_diagnostic_qa) ? row.ai_diagnostic_qa : [],
  };
}

export async function fetchGrievancesFromSupabase(): Promise<Grievance[] | null> {
  try {
    const { data, error } = await supabase
      .from("grievances")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch grievances warning:", error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(mapDbRowToGrievance);
    }
    return [];
  } catch (err) {
    console.error("Supabase connection error:", err);
    return null;
  }
}

export async function saveGrievanceToSupabase(g: Grievance): Promise<boolean> {
  try {
    const row = {
      id: g.id,
      title: g.title,
      description: g.description,
      category: g.category,
      district: g.district,
      block: g.block,
      panchayat: g.panchayat,
      latitude: g.coordinates?.lat || 23.3441,
      longitude: g.coordinates?.lng || 85.3096,
      urgency: g.urgency,
      affected_count: g.affectedCount,
      status: g.status,
      media_urls: g.mediaUrls || [],
      ai_diagnostic_qa: g.aiDiagnosticQa || [],
      submitted_at: g.submittedAt ? new Date(g.submittedAt).toISOString() : new Date().toISOString(),
    };

    const { error } = await supabase.from("grievances").insert(row);
    if (error) {
      console.warn("Supabase insert grievance error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase insert exception:", err);
    return false;
  }
}

export async function updateGrievanceStatusInSupabase(
  id: string,
  status: GrievanceStatus,
  extra?: Partial<Grievance>
): Promise<boolean> {
  try {
    const updates: Record<string, any> = { status };
    if (extra?.resolutionSummary) updates.resolution_summary = extra.resolutionSummary;
    if (extra?.resolutionProofPhotoUrl) updates.resolution_proof_url = extra.resolutionProofPhotoUrl;
    if (extra?.citizenRating) updates.citizen_rating = extra.citizenRating;
    if (extra?.citizenFeedback) updates.citizen_feedback = extra.citizenFeedback;

    const { error } = await supabase.from("grievances").update(updates).eq("id", id);
    if (error) {
      console.warn("Supabase update error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase update exception:", err);
    return false;
  }
}

export async function uploadAttachmentToSupabase(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `attachments/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("grievance-media")
      .upload(filePath, file);

    if (uploadError) {
      console.warn("Supabase storage upload error:", uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from("grievance-media").getPublicUrl(filePath);
    return data?.publicUrl || null;
  } catch (err) {
    console.error("Supabase attachment upload exception:", err);
    return null;
  }
}
