"use client";

import { forwardRef } from "react";
import { BilanEphadData } from "@/types/bilanEphad";
import { dateFr } from "@/lib/utils";

interface Props {
  data: BilanEphadData;
}

const PAGE_STYLE: React.CSSProperties = {
  width: 794,
  height: 1123,
  background: "#ffffff",
  color: "#1a1a1a",
  fontFamily: "Arial, sans-serif",
  padding: "48px 56px 80px",
  boxSizing: "border-box",
  position: "relative",
  overflow: "hidden",
};

// ── Sous-composants ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11.5,
        fontWeight: "bold",
        letterSpacing: 0.5,
        textTransform: "uppercase",
        color: "#1a1a1a",
        borderBottom: "1.5px solid #444",
        paddingBottom: 2,
        margin: "16px 0 10px",
      }}
    >
      {children}
    </div>
  );
}

function FilledLine({ label, value }: { label?: string; value?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 9, fontSize: 12 }}>
      {label && <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{label}</span>}
      <span
        style={{
          flex: 1,
          minWidth: 60,
          lineHeight: 1.8,
          paddingLeft: 4,
          color: "#1a1a1a",
        }}
      >
        {value || ""}
      </span>
    </div>
  );
}

function Checkbox({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 12 }}>
      <span
        style={{
          display: "inline-block",
          width: 12,
          height: 12,
          border: "1px solid #444",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {checked && (
          <span style={{ position: "absolute", top: -1, left: 1, fontWeight: "bold", fontSize: 11 }}>✓</span>
        )}
      </span>
      <span>{label}</span>
    </div>
  );
}

// ── Header EPADH ──────────────────────────────────────────────────────────────

function PageHeader({ data }: { data: BilanEphadData }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {/* Praticiens */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 10,
          borderBottom: "1px solid #ccc",
          marginBottom: 8,
        }}
      >
        <div>
          <p style={{ fontSize: 14, fontWeight: "bold", margin: "0 0 1px" }}>
            {data.pratNom || "Praticien"}
          </p>
          <p style={{ fontSize: 11, color: "#444", margin: 0, lineHeight: 1.5, whiteSpace: "pre-line" }}>
            {data.pratMeta}
          </p>
        </div>
        {data.pratNom2 && (
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 14, fontWeight: "bold", margin: "0 0 1px" }}>
              {data.pratNom2}
            </p>
            <p style={{ fontSize: 11, color: "#444", margin: 0, lineHeight: 1.5, whiteSpace: "pre-line" }}>
              {data.pratMeta2}
            </p>
          </div>
        )}
      </div>

      {/* Titre */}
      <div
        style={{
          textAlign: "center",
          borderTop: "2px solid #1a1a1a",
          borderBottom: "2px solid #1a1a1a",
          padding: "7px 0 5px",
          marginBottom: 10,
        }}
      >
        <p style={{ fontSize: 15, fontWeight: "bold", letterSpacing: 1.5, margin: "0 0 2px", textTransform: "uppercase" }}>
          Fiche d&apos;examen visuel
        </p>
        {data.docType && (
          <p style={{ fontSize: 11.5, color: "#555", margin: 0, fontStyle: "italic" }}>
            {data.docType}
          </p>
        )}
      </div>

      {/* Lieu + Date */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
        <FilledLine label="Lieu :" value={data.docLieu} />
        <div style={{ marginLeft: 32, whiteSpace: "nowrap", fontSize: 12 }}>
          <span style={{ fontWeight: 600 }}>Date : </span>
            {dateFr(data.docDate) || ".......... / .......... / .........."}
        </div>
      </div>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────

const SheetEphad = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  return (
    <div ref={ref}>
      <div style={PAGE_STYLE}>
        <PageHeader data={data} />

        {/* Identité */}
        <SectionTitle>Identité du patient</SectionTitle>
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ flex: 1 }}>
            <FilledLine label="Nom :" value={data.patNom} />
          </div>
          <div style={{ flex: 1 }}>
            <FilledLine label="Prénom :" value={data.patPrenom} />
          </div>
        </div>
        <FilledLine label="Date de naissance :" value={data.patDdn} />

        {/* Anamnèse */}
        <SectionTitle>Anamnèse</SectionTitle>
        {[data.anamnese || "", "", ""].slice(0, 3).map((line, i) => (
          <FilledLine key={i} value={i === 0 ? line : ""} />
        ))}

        {/* Équipement actuel */}
        <SectionTitle>Équipement actuel</SectionTitle>
        <FilledLine label="Correction optique portée :" value={data.equipCorrection} />

        {/* Réfraction automatique */}
        <SectionTitle>Réfraction automatique (RA)</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FilledLine label="Œil droit (OD) :" value={data.raOd} />
          <FilledLine label="Œil gauche (OG) :" value={data.raOg} />
        </div>

        {/* Acuité visuelle */}
        <SectionTitle>Acuité visuelle</SectionTitle>
        <div style={{ fontSize: 12, marginBottom: 6 }}>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr 1fr", gap: 8, alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontWeight: 600 }}>Vision de loin (VL)</span>
            <FilledLine label="OD :" value={data.avlOd} />
            <FilledLine label="OG :" value={data.avlOg} />
            <FilledLine label="Acuité :" value={data.avlAcuite} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr 1fr", gap: 8, alignItems: "center" }}>
            <span style={{ fontWeight: 600 }}>Vision de près (VP)</span>
            <FilledLine label="OD :" value={data.avpOd} />
            <FilledLine label="OG :" value={data.avpOg} />
            <FilledLine label="Acuité :" value={data.avpAcuite} />
          </div>
        </div>

        {/* Correction retenue */}
        <SectionTitle>Correction optique retenue</SectionTitle>
        <FilledLine value={data.correctionRetenue} />
        <FilledLine />

        {/* Examens complémentaires */}
        <SectionTitle>Besoin d&apos;examens complémentaires</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
          <Checkbox checked={data.examAucun} label="Aucun" />
          <Checkbox checked={data.examOphtalmo} label="Consultation ophtalmologique" />
          <Checkbox checked={data.examFondOeil} label="Fond d'œil" />
          <Checkbox checked={data.examOct} label="OCT" />
        </div>
        <FilledLine label="Autre :" value={data.examAutre} />

        {/* Observations */}
        <SectionTitle>Observations</SectionTitle>
        {["", "", ""].map((_, i) => (
          <FilledLine key={i} value={i === 0 ? data.observations : ""} />
        ))}

        {/* Signatures */}
        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            bottom: 40,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            borderTop: "1px solid #bbb",
            paddingTop: 10,
          }}
        >
          <div>
            <span style={{ fontWeight: 600 }}>Signature Orthoptiste : </span>
          </div>
          {data.pratNom2 && (
            <div>
              <span style={{ fontWeight: 600, paddingRight: 150 }}>Signature Opticien : </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

SheetEphad.displayName = "SheetEphad";
export default SheetEphad;
