"use client";

import { forwardRef } from "react";
import { BilanEphadData } from "@/types/bilanEphad";
import { dateFr, extractFirstMetaLine, formatAvLine } from "@/lib/utils";

interface Props {
  data: BilanEphadData;
}

const PAGE_STYLE: React.CSSProperties = {
  width: 794,
  height: 1123,
  background: "#ffffff",
  color: "#1a1a1a",
  fontFamily: "Georgia, 'Times New Roman', serif",
  padding: "56px 64px 90px",
  boxSizing: "border-box",
  position: "relative",
  overflow: "hidden",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: 13,
        fontWeight: "bold",
        margin: "18px 0 6px",
        color: "#1a1a1a",
        borderBottom: "1px solid #ccc",
        paddingBottom: 3,
      }}
    >
      {children}
    </h3>
  );
}

function KvRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", gap: 6, lineHeight: 1.6 }}>
      <span style={{ fontWeight: 600, color: "#222" }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function KvBlock({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: 12.5, lineHeight: 1.6, margin: 0 }}>
      {children}
    </div>
  );
}

function CheckRow({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div style={{ display: "flex", gap: 6, lineHeight: 1.6, alignItems: "center", fontFamily: "Arial, sans-serif", fontSize: 12.5 }}>
      <span style={{ fontSize: 14, lineHeight: 1 }}>{checked ? "☑" : "☐"}</span>
      <span>{label}</span>
    </div>
  );
}


function PageFooter({
  patPrenom,
  patNom,
  pratNom,
  firstMetaLine,
}: {
  patPrenom: string;
  patNom: string;
  pratNom: string;
  firstMetaLine: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        right: 64,
        bottom: 40,
        borderTop: "1px solid #bbb",
        paddingTop: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        fontFamily: "Arial, sans-serif",
        fontSize: 11,
        color: "#555",
      }}
    >
      <div>
        Fiche d&apos;examen visuel
        {patPrenom ? ` — ${patPrenom} ${patNom}` : ""}
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontWeight: "bold", color: "#222", fontSize: 12 }}>{pratNom}</div>
        <div>{firstMetaLine}</div>
      </div>
    </div>
  );
}
const SheetEphad = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const avlParts = formatAvLine(data.avlOd, data.avlOg, data.avlAcuite);
  const avpParts = formatAvLine(data.avpOd, data.avpOg, data.avpAcuite);

  return (
    <div ref={ref}>
      <div style={PAGE_STYLE}>
        {/* En-tête praticiens */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "2px solid #1a1a1a",
            paddingBottom: 14,
            marginBottom: 10,
          }}
        >
          <div>
            <p style={{ fontSize: 17, fontWeight: "bold", margin: "0 0 2px" }}>
              {data.pratNom || "Praticien"}
            </p>
            <p style={{ fontSize: 12, color: "#444", fontFamily: "Arial, sans-serif", margin: 0, lineHeight: 1.45, whiteSpace: "pre-line" }}>
              {data.pratMeta}
            </p>
          </div>
          {data.pratNom2 && (
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 17, fontWeight: "bold", margin: "0 0 2px" }}>{data.pratNom2}</p>
              <p style={{ fontSize: 12, color: "#444", fontFamily: "Arial, sans-serif", margin: 0, lineHeight: 1.45, whiteSpace: "pre-line" }}>
                {data.pratMeta2}
              </p>
            </div>
          )}
        </div>

        {/* Titre */}
        <div style={{ textAlign: "center", borderBottom: "2px solid #1a1a1a", paddingBottom: 10, marginBottom: 10 }}>
          <p style={{ fontSize: 15, fontWeight: "bold", letterSpacing: 1.5, margin: "0 0 2px", textTransform: "uppercase" }}>
            Fiche d&apos;examen visuel
          </p>
          {data.docType && (
            <p style={{ fontSize: 12, color: "#555", margin: 0, fontStyle: "italic", fontFamily: "Arial, sans-serif" }}>
              {data.docType}
            </p>
          )}
        </div>

        {/* Lieu + Date */}
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Arial, sans-serif", fontSize: 12, marginBottom: 4 }}>
          {data.docLieu && <span><strong>Lieu :</strong> {data.docLieu}</span>}
          <span><strong>Date :</strong> {dateFr(data.docDate)}</span>
        </div>

        {/* Identité */}
        <SectionTitle>Identité du patient</SectionTitle>
        <KvBlock>
          <KvRow label="Nom :" value={data.patNom} />
          <KvRow label="Prénom :" value={data.patPrenom} />
          <KvRow label="Date de naissance :" value={data.patDdn} />
        </KvBlock>

        {/* Anamnèse */}
        {data.anamnese && (
          <>
            <SectionTitle>Anamnèse</SectionTitle>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 12.5, lineHeight: 1.6, whiteSpace: "pre-line", margin: "0 0 6px", textAlign: "justify" }}>
              {data.anamnese.trim()}
            </p>
          </>
        )}

        {/* Équipement */}
        {data.equipCorrection && (
          <>
            <SectionTitle>Équipement actuel</SectionTitle>
            <KvBlock>
              <KvRow label="Correction optique portée :" value={data.equipCorrection} />
            </KvBlock>
          </>
        )}

        {/* RA */}
        {(data.raOd || data.raOg) && (
          <>
            <SectionTitle>Réfraction automatique (RA)</SectionTitle>
            <KvBlock>
              <KvRow label="OD :" value={data.raOd} />
              <KvRow label="OG :" value={data.raOg} />
            </KvBlock>
          </>
        )}

        {/* AV */}
        {(avlParts || avpParts) && (
          <>
            <SectionTitle>Acuité visuelle</SectionTitle>
            <KvBlock>
              {avlParts && <KvRow label="Vision de loin (VL) :" value={avlParts} />}
              {avpParts && <KvRow label="Vision de près (VP) :" value={avpParts} />}
            </KvBlock>
          </>
        )}

        {/* Correction retenue */}
        {data.correctionRetenue && (
          <>
            <SectionTitle>Correction optique retenue</SectionTitle>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 12.5, lineHeight: 1.6, whiteSpace: "pre-line", margin: 0 }}>
              {data.correctionRetenue.trim()}
            </p>
          </>
        )}

        {/* Examens complémentaires */}
        <SectionTitle>Besoin d&apos;examens complémentaires</SectionTitle>
        <KvBlock>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 24px" }}>
            <CheckRow checked={data.examAucun} label="Aucun" />
            <CheckRow checked={data.examOphtalmo} label="Consultation ophtalmologique" />
            <CheckRow checked={data.examFondOeil} label="Fond d'œil" />
            <CheckRow checked={data.examOct} label="OCT" />
          </div>
          <KvRow label="Autre :" value={data.examAutre} />
        </KvBlock>

        {/* Observations */}
        {data.observations && (
          <>
            <SectionTitle>Observations</SectionTitle>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 12.5, lineHeight: 1.6, whiteSpace: "pre-line", margin: 0, textAlign: "justify" }}>
              {data.observations.trim()}
            </p>
          </>
        )}

        <PageFooter patPrenom={data.patPrenom} patNom={data.patNom} pratNom={data.pratNom} firstMetaLine={extractFirstMetaLine(data.pratMeta)} />
      </div>
    </div>
  );
});

SheetEphad.displayName = "SheetEphad";
export default SheetEphad;
