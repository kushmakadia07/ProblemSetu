import { createClient } from "@supabase/supabase-js";
import type { Grievance, GrievanceStatus } from "./store";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hfmcazldvitlyuexnrfe.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_UCqq8QvGJWH8OCxM_xsJYw_Az8SUfH5";

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CitizenProfileData {
  fullName: string;
  phone: string;
  aadhaarNumber?: string;
  state?: string;
  district?: string;
  addressLine?: string;
}

/**
 * Upserts a citizen profile in the Supabase 'profiles' table on successful login/OTP verification.
 * Automatically inserts a new row or updates existing row matching on phone.
 */
export async function upsertCitizenProfileInSupabase(
  profile: CitizenProfileData
): Promise<{ id: string; fullName: string; phone: string } | null> {
  try {
    const cleanPhone = profile.phone.replace(/\D/g, "");
    const cleanAadhaar = (profile.aadhaarNumber || "").replace(/\D/g, "");

    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          full_name: profile.fullName.trim(),
          phone: cleanPhone,
          aadhaar_number: cleanAadhaar || "000000000000",
          state: profile.state || "Jharkhand",
          district: profile.district || "Ranchi",
          address_line: profile.addressLine || "",
          role: "citizen",
          is_verified: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "phone" }
      )
      .select("id, full_name, phone")
      .single();

    if (error) {
      console.warn("Supabase upsert profile warning:", error.message);
      return null;
    }

    console.log(`[SUPABASE] Citizen profile saved/updated:`, data);
    return data ? { id: data.id, fullName: data.full_name, phone: data.phone } : null;
  } catch (err) {
    console.error("Supabase upsert profile exception:", err);
    return null;
  }
}

export function mapDbRowToGrievance(row: any): Grievance {
  return {
    id: row.tracking_code || row.id,
    title: row.title,
    description: row.description,
    category: row.category || "General Infrastructure",
    district: row.district,
    block: row.block || "",
    panchayat: row.panchayat || "",
    coordinates: {
      lat: row.latitude || 23.3441,
      lng: row.longitude || 85.3096,
    },
    citizenName: row.profiles?.full_name || row.citizen_name || "Citizen Reporter",
    citizenPhone: row.profiles?.phone || row.citizen_phone || "",
    status: (row.status?.toUpperCase() as GrievanceStatus) || "LODGED",
    urgency: ((row.urgency?.charAt(0).toUpperCase() + row.urgency?.slice(1)) as "Normal" | "High" | "Critical") || "High",
    affectedCount: row.affected_population || row.affected_count || 100,
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
      .select("*, profiles(full_name, phone)")
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

export async function saveGrievanceToSupabase(g: Grievance, citizenProfileId?: string): Promise<boolean> {
  try {
    // If citizenProfileId is not provided, look up or find a valid profile ID
    let profileId = citizenProfileId;
    if (!profileId && g.citizenPhone) {
      const cleanPhone = g.citizenPhone.replace(/\D/g, "");
      const { data: prof } = await supabase
        .from("profiles")
        .select("id")
        .eq("phone", cleanPhone)
        .maybeSingle();
      if (prof) profileId = prof.id;
    }

    // Fallback to first available citizen profile or create default if needed
    if (!profileId) {
      const { data: firstProf } = await supabase.from("profiles").select("id").limit(1).maybeSingle();
      profileId = firstProf?.id || "a1000000-0000-0000-0000-000000000001";
    }

    const row = {
      tracking_code: g.id,
      citizen_id: profileId,
      title: g.title,
      description: g.description,
      district: g.district,
      block: g.block || null,
      panchayat: g.panchayat || null,
      ward_or_colony: g.panchayat || g.district,
      latitude: g.coordinates?.lat || 23.3441,
      longitude: g.coordinates?.lng || 85.3096,
      urgency: (g.urgency?.toLowerCase() as any) || "medium",
      status: (g.status?.toLowerCase() as any) || "submitted",
      affected_population: g.affectedCount || 10,
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
  trackingCodeOrId: string,
  status: GrievanceStatus,
  extra?: Partial<Grievance>
): Promise<boolean> {
  try {
    const updates: Record<string, any> = { status: status.toLowerCase() };
    if (extra?.resolutionSummary) updates.resolution_summary = extra.resolutionSummary;
    if (extra?.resolutionProofPhotoUrl) updates.resolution_proof_url = extra.resolutionProofPhotoUrl;
    if (extra?.citizenRating) updates.citizen_rating = extra.citizenRating;
    if (extra?.citizenFeedback) updates.citizen_feedback = extra.citizenFeedback;

    const { error } = await supabase
      .from("grievances")
      .update(updates)
      .or(`id.eq.${trackingCodeOrId},tracking_code.eq.${trackingCodeOrId}`);

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
