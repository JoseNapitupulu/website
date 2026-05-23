import { randomUUID } from "crypto";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { DamageReport, ReportPriority, ReportStatus, ReportUpdate } from "@/types/report";

const REPORT_PHOTO_BUCKET = "damage-report-photos";

function buildTrackingCode() {
  return `KRS-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function getRequiredField(value: FormDataEntryValue | null, fieldName: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Field required: ${fieldName}`);
  }

  return value.trim();
}

export type CreateReportInput = {
  title: string;
  location: string;
  description: string;
  category: string;
  reporterName: string;
  reporterEmail?: string | null;
  priority?: ReportPriority;
  photos?: File[];
};

export type CreateReportResult = {
  report: DamageReport;
  uploadSummary: {
    total: number;
    uploaded: number;
    failed: number;
    errors: string[];
  };
};

export function parseReportFormData(formData: FormData): CreateReportInput {
  const photos = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const reporterEmail = formData.get("reporter_email");

  return {
    title: getRequiredField(formData.get("title"), "title"),
    location: getRequiredField(formData.get("location"), "location"),
    description: getRequiredField(formData.get("description"), "description"),
    category: getRequiredField(formData.get("category"), "category"),
    reporterName: getRequiredField(formData.get("reporter_name"), "reporter_name"),
    reporterEmail: typeof reporterEmail === "string" ? reporterEmail.trim() || null : null,
    priority: (formData.get("priority") as ReportPriority | null) ?? "medium",
    photos
  };
}

export async function listReports(): Promise<DamageReport[]> {
  const supabase = createSupabaseAdminClient();

  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("damage_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase listReports error:", error);
      return [];
    }

    return (data ?? []) as DamageReport[];
  } catch (err) {
    console.error("Unexpected error in listReports:", err);
    return [];
  }
}

export async function listVisibleReports(): Promise<DamageReport[]> {
  const supabase = createSupabaseAdminClient();

  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("damage_reports")
      .select("*")
      .eq("show_in_tracking", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase listVisibleReports error:", error);
      return [];
    }

    return (data ?? []) as DamageReport[];
  } catch (err) {
    console.error("Unexpected error in listVisibleReports:", err);
    return [];
  }
}

export async function getReportByTrackingCode(trackingCode: string) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("damage_reports")
      .select("*")
      .eq("tracking_code", trackingCode)
      .maybeSingle();

    if (error) {
      console.error("Supabase getReportByTrackingCode error:", error);
      return null;
    }

    return data as DamageReport | null;
  } catch (err) {
    console.error("Unexpected error in getReportByTrackingCode:", err);
    return null;
  }
}

export async function getReportById(id: string) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from("damage_reports").select("*").eq("id", id).maybeSingle();

    if (error) {
      console.error("Supabase getReportById error:", error);
      return null;
    }

    return data as DamageReport | null;
  } catch (err) {
    console.error("Unexpected error in getReportById:", err);
    return null;
  }
}

export async function createReport(input: CreateReportInput): Promise<CreateReportResult> {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  const trackingCode = buildTrackingCode();

  const { data: inserted, error: insertError } = await supabase
    .from("damage_reports")
    .insert({
      tracking_code: trackingCode,
      title: input.title,
      location: input.location,
      description: input.description,
      category: input.category,
      reporter_name: input.reporterName,
      reporter_email: input.reporterEmail ?? null,
      priority: input.priority ?? "medium",
      status: "submitted",
      photo_urls: [],
      show_in_tracking: true
    })
    .select()
    .single();

  if (insertError) {
    console.error("createReport: insertError", insertError);
    throw insertError;
  }

  const photoUrls: string[] = [];
  const uploadErrors: string[] = [];
  const totalPhotos = (input.photos ?? []).length;

  for (const photo of input.photos ?? []) {
    const filePath = `reports/${inserted.id}/${Date.now()}-${photo.name}`;
    const upload = await supabase.storage
      .from(REPORT_PHOTO_BUCKET)
      .upload(filePath, photo, {
        contentType: photo.type || "image/jpeg",
        upsert: false
      });

    if (upload.error) {
      uploadErrors.push(`Upload gagal (${photo.name}): ${upload.error.message}`);
      continue;
    }

    const { data: urlData } = supabase.storage.from(REPORT_PHOTO_BUCKET).getPublicUrl(filePath);
    photoUrls.push(urlData.publicUrl);

    const photoInsert = await supabase.from("report_photos").insert({
      report_id: inserted.id,
      storage_path: filePath,
      public_url: urlData.publicUrl,
      file_name: photo.name
    });

    if (photoInsert.error) {
      uploadErrors.push(`Simpan metadata foto gagal (${photo.name}): ${photoInsert.error.message}`);
    }
  }

  const { data: updated, error: updateError } = await supabase
    .from("damage_reports")
    .update({ photo_urls: photoUrls, updated_at: new Date().toISOString() })
    .eq("id", inserted.id)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  return {
    report: updated as DamageReport,
    uploadSummary: {
      total: totalPhotos,
      uploaded: photoUrls.length,
      failed: totalPhotos - photoUrls.length,
      errors: uploadErrors
    }
  };
}

export async function updateReportStatus(reportId: string, status: ReportStatus, note?: string) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  const { data: updated, error } = await supabase
    .from("damage_reports")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", reportId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  const updateInsert = await supabase.from("report_updates").insert({
    report_id: reportId,
    status,
    note: note ?? null
  });

  if (updateInsert.error) {
    throw updateInsert.error;
  }

  return updated as DamageReport;
}

export async function updateReportVisibility(reportId: string, showInTracking: boolean) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  const { data: updated, error } = await supabase
    .from("damage_reports")
    .update({ show_in_tracking: showInTracking, updated_at: new Date().toISOString() })
    .eq("id", reportId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return updated as DamageReport;
}

export async function deleteReportById(reportId: string) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  const { data: report, error: reportError } = await supabase
    .from("damage_reports")
    .select("id, status")
    .eq("id", reportId)
    .maybeSingle();

  if (reportError) {
    throw reportError;
  }

  if (!report) {
    throw new Error("Laporan tidak ditemukan.");
  }

  if (report.status !== "resolved") {
    throw new Error("Hanya laporan selesai yang bisa dihapus.");
  }

  const { data: photos, error: photosError } = await supabase
    .from("report_photos")
    .select("storage_path")
    .eq("report_id", reportId);

  if (photosError) {
    throw photosError;
  }

  const storagePaths = (photos ?? [])
    .map((photo) => photo.storage_path)
    .filter((path): path is string => typeof path === "string" && path.length > 0);

  if (storagePaths.length > 0) {
    const { error: removeError } = await supabase.storage.from(REPORT_PHOTO_BUCKET).remove(storagePaths);

    if (removeError) {
      throw removeError;
    }
  }

  const { error: deleteError } = await supabase.from("damage_reports").delete().eq("id", reportId);

  if (deleteError) {
    throw deleteError;
  }

  return {
    reportId,
    removedPhotos: storagePaths.length
  };
}

export function buildReportTimeline(status: ReportStatus) {
  const steps: Array<{ key: ReportStatus; label: string }> = [
    { key: "submitted", label: "Masuk" },
    { key: "in_review", label: "Ditinjau" },
    { key: "assigned", label: "Diteruskan" },
    { key: "in_progress", label: "Dikerjakan" },
    { key: "resolved", label: "Selesai" }
  ];

  const activeIndex = steps.findIndex((step) => step.key === status);

  return steps.map((step, index) => ({
    ...step,
    complete: index <= activeIndex
  }));
}

export async function listReportsWithError(): Promise<{ reports: DamageReport[]; error?: string }> {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return {
      reports: [],
      error: "Supabase belum dikonfigurasi. Set NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY."
    };
  }

  try {
    const { data, error } = await supabase
      .from("damage_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase listReports error:", error);
      return { reports: [], error: error.message ?? JSON.stringify(error) };
    }

    return { reports: (data ?? []) as DamageReport[] };
  } catch (err) {
    console.error("Unexpected error in listReportsWithError:", err);
    return { reports: [], error: String(err) };
  }
}

export async function listReportUpdates(): Promise<ReportUpdate[]> {
  const supabase = createSupabaseAdminClient();

  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("report_updates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase listReportUpdates error:", error);
      return [];
    }

    return (data ?? []) as ReportUpdate[];
  } catch (err) {
    console.error("Unexpected error in listReportUpdates:", err);
    return [];
  }
}