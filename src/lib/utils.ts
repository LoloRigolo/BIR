export function dateFr(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return (
    "le " +
    d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  );
}

export function localDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function buildPdfFilename(patPrenom: string, patNom: string, prefix = "bilan"): string {
  const prenom = patPrenom || "patient";
  const nom = patNom || "";
  return (
    (prefix + "_" + prenom + "_" + nom)
      .replace(/\s+/g, "_")
      .replace(/_+$/, "") + ".pdf"
  );
}

export function extractFirstMetaLine(pratMeta: string): string {
  return (pratMeta.split("\n")[0] || "").trim();
}

export function calcPageHeightPx(canvasWidth: number): number {
  return Math.round((canvasWidth * 297) / 210);
}

export function calcTotalPages(canvasHeight: number, canvasWidth: number): number {
  return Math.ceil(canvasHeight / calcPageHeightPx(canvasWidth));
}

export function formatAvLine(od: string, og: string, acuite: string): string {
  return [od && `OD : ${od}`, og && `OG : ${og}`, acuite && `Acuité : ${acuite}`]
    .filter(Boolean)
    .join(" — ");
}
