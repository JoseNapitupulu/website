export type ReportStatus =
  | "submitted"
  | "in_review"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "rejected";

export type ReportPriority = "low" | "medium" | "high";

export interface DamageReport {
  id: string;
  tracking_code: string;
  title: string;
  location: string;
  description: string;
  category: string;
  reporter_name: string;
  reporter_email: string | null;
  status: ReportStatus;
  priority: ReportPriority;
  photo_urls: string[];
  show_in_tracking: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReportUpdate {
  id: string;
  report_id: string;
  status: ReportStatus;
  note: string | null;
  created_at: string;
}