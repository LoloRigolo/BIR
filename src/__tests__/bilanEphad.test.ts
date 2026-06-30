import { describe, it, expect } from "vitest";
import { formatAvLine, localDateStr } from "../lib/utils";
import {
  defaultBilanEphadData,
  emptyBilanEphadData,
} from "../types/bilanEphad";

// -- formatAvLine -------------------------------------------------------------

describe("formatAvLine", () => {
  it("returns empty string when all fields are empty", () => {
    expect(formatAvLine("", "", "")).toBe("");
  });

  it("returns only OD when OG and acuite are empty", () => {
    expect(formatAvLine("10/10", "", "")).toBe("OD : 10/10");
  });

  it("returns only OG when OD and acuite are empty", () => {
    expect(formatAvLine("", "9/10", "")).toBe("OG : 9/10");
  });

  it("returns only acuite when OD and OG are empty", () => {
    expect(formatAvLine("", "", "P2")).toBe("Acuité : P2");
  });

  it("joins all three fields with em dash separator", () => {
    expect(formatAvLine("10/10", "9/10", "P2")).toBe(
      "OD : 10/10 — OG : 9/10 — Acuité : P2"
    );
  });

  it("joins OD and OG when acuite is empty", () => {
    expect(formatAvLine("10/10", "9/10", "")).toBe("OD : 10/10 — OG : 9/10");
  });

  it("joins OD and acuite when OG is empty", () => {
    expect(formatAvLine("10/10", "", "P2")).toBe("OD : 10/10 — Acuité : P2");
  });
});

// -- defaultBilanEphadData ----------------------------------------------------

describe("defaultBilanEphadData", () => {
  it("has a practitioner name set by default", () => {
    expect(defaultBilanEphadData.pratNom).toBeTruthy();
  });

  it("has a docType set by default", () => {
    expect(defaultBilanEphadData.docType).toBeTruthy();
  });

  it("has today local date by default", () => {
    expect(defaultBilanEphadData.docDate).toBe(localDateStr());
  });

  it("has all checkbox fields set to false by default", () => {
    expect(defaultBilanEphadData.examAucun).toBe(false);
    expect(defaultBilanEphadData.examOphtalmo).toBe(false);
    expect(defaultBilanEphadData.examFondOeil).toBe(false);
    expect(defaultBilanEphadData.examOct).toBe(false);
  });
});

// -- emptyBilanEphadData ------------------------------------------------------

describe("emptyBilanEphadData", () => {
  it("has empty string for all string fields", () => {
    const stringFields = [
      "pratNom", "pratMeta", "pratNom2", "pratMeta2",
      "docType", "docLieu",
      "patNom", "patPrenom", "patDdn",
      "anamnese", "equipCorrection",
      "raOd", "raOg",
      "avlOd", "avlOg", "avlAcuite",
      "avpOd", "avpOg", "avpAcuite",
      "correctionRetenue", "examAutre", "observations", "conclusion",
    ] as const;
    for (const field of stringFields) {
      expect(emptyBilanEphadData[field]).toBe("");
    }
  });

  it("has all checkbox fields set to false", () => {
    expect(emptyBilanEphadData.examAucun).toBe(false);
    expect(emptyBilanEphadData.examOphtalmo).toBe(false);
    expect(emptyBilanEphadData.examFondOeil).toBe(false);
    expect(emptyBilanEphadData.examOct).toBe(false);
  });

  it("has today local date", () => {
    expect(emptyBilanEphadData.docDate).toBe(localDateStr());
  });
});