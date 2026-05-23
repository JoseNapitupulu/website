export const campusLocationOptions = [
  "Gedung A - Lantai 1",
  "Gedung A - Lantai 2",
  "Gedung A - Lantai 3",
  "Gedung B - Lantai 1",
  "Gedung B - Lantai 2",
  "Gedung C - Lantai 1",
  "Laboratorium",
  "Perpustakaan",
  "Kantin",
  "Asrama",
  "Toilet Umum",
  "Koridor / Area Umum"
] as const;

export type CampusLocationOption = (typeof campusLocationOptions)[number];

export function isCampusLocation(value: string): value is CampusLocationOption {
  return (campusLocationOptions as readonly string[]).includes(value);
}
