import { createSupabaseServerClient } from "@/lib/supabase/server";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getAllowedAdminEmails() {
  const raw = process.env.ADMIN_ALLOWED_EMAILS ?? process.env.ADMIN_EMAIL ?? "";

  return raw
    .split(/[,\s]+/)
    .map((email) => normalizeEmail(email))
    .filter(Boolean);
}

export function isAdminEmailAllowed(email?: string | null) {
  if (!email) return false;

  const allowedEmails = getAllowedAdminEmails();

  if (allowedEmails.length === 0) {
    return false;
  }

  return allowedEmails.includes(normalizeEmail(email));
}

export function sanitizeNextPath(nextPath: string | null | undefined, fallback = "/admin") {
  if (!nextPath || typeof nextPath !== "string") {
    return fallback;
  }

  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return fallback;
  }

  return nextPath;
}

export async function getAuthenticatedAdmin() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();
  const user = data.user;

  if (error || !isAdminEmailAllowed(user?.email)) {
    return null;
  }

  return { supabase, user };
}
