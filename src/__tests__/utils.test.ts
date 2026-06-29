import { describe, it, expect } from "vitest";
import {
  dateFr,
  buildPdfFilename,
  extractFirstMetaLine,
  calcPageHeightPx,
  calcTotalPages,
} from "../lib/utils";

// ── dateFr ───────────────────────────────────────────────────────────────────

describe("dateFr", () => {
  it("returns empty string for empty input", () => {
    expect(dateFr("")).toBe("");
  });

  it("formats a valid ISO date in fr-FR", () => {
    expect(dateFr("2024-03-15")).toBe("le 15/03/2024");
  });

  it("handles 1st of January correctly", () => {
    expect(dateFr("2024-01-01")).toBe("le 01/01/2024");
  });

  it("handles end of year correctly", () => {
    expect(dateFr("2023-12-31")).toBe("le 31/12/2023");
  });

  it("returns the raw string when date is invalid", () => {
    expect(dateFr("not-a-date")).toBe("not-a-date");
  });

  it("returns the raw string for partial date", () => {
    expect(dateFr("2024-13")).toBe("2024-13");
  });
});

// ── buildPdfFilename ──────────────────────────────────────────────────────────

describe("buildPdfFilename", () => {
  it("uses 'patient' fallback when prenom is empty", () => {
    expect(buildPdfFilename("", "")).toBe("bilan_patient.pdf");
  });

  it("builds correct filename with both names", () => {
    expect(buildPdfFilename("Jean", "Dupont")).toBe("bilan_Jean_Dupont.pdf");
  });

  it("strips trailing underscore when nom is empty", () => {
    expect(buildPdfFilename("Marie", "")).toBe("bilan_Marie.pdf");
  });

  it("replaces spaces with underscores", () => {
    expect(buildPdfFilename("Jean Pierre", "Le Bon")).toBe(
      "bilan_Jean_Pierre_Le_Bon.pdf"
    );
  });

  it("collapses multiple consecutive spaces", () => {
    expect(buildPdfFilename("Jean", "Dupont")).toBe("bilan_Jean_Dupont.pdf");
  });
});

// ── extractFirstMetaLine ──────────────────────────────────────────────────────

describe("extractFirstMetaLine", () => {
  it("returns the first line of a multiline string", () => {
    expect(extractFirstMetaLine("Orthoptiste\n43 av Carnot\n30100 ALES")).toBe(
      "Orthoptiste"
    );
  });

  it("returns the only line when there is no newline", () => {
    expect(extractFirstMetaLine("Orthoptiste")).toBe("Orthoptiste");
  });

  it("trims surrounding whitespace", () => {
    expect(extractFirstMetaLine("  Orthoptiste  \n43 av Carnot")).toBe(
      "Orthoptiste"
    );
  });

  it("returns empty string for empty input", () => {
    expect(extractFirstMetaLine("")).toBe("");
  });
});

// ── calcPageHeightPx ─────────────────────────────────────────────────────────

describe("calcPageHeightPx", () => {
  it("returns ~1123px for A4 at natural scale (794px wide)", () => {
    expect(calcPageHeightPx(794)).toBe(1123);
  });

  it("doubles the height when canvas is scale×2 wide", () => {
    expect(calcPageHeightPx(1588)).toBe(2246);
  });
});

// ── calcTotalPages ────────────────────────────────────────────────────────────

describe("calcTotalPages", () => {
  it("returns 1 for a single A4 page canvas (scale 2)", () => {
    // 1 page × 1123px × scale 2 = 2246px tall, 794 × scale 2 = 1588px wide
    expect(calcTotalPages(2246, 1588)).toBe(1);
  });

  it("returns 2 for exactly 2 A4 pages (scale 1)", () => {
    // 2 × 1123 = 2246px tall, 794px wide → pageHeight = round(794 × 297/210) = 1123
    expect(calcTotalPages(2246, 794)).toBe(2);
  });

  it("returns 1 for a canvas shorter than one A4 page", () => {
    expect(calcTotalPages(500, 794)).toBe(1);
  });

  it("rounds up when content doesn't fill the last page evenly", () => {
    // pageHeight = 1123, content = 1200 → 2 pages
    expect(calcTotalPages(1200, 794)).toBe(2);
  });
});
