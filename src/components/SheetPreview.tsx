"use client";

import { forwardRef } from "react";
import { BilanData } from "@/types/bilan";

function esc(s: string): string {
  return (s || "").replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[c];
  });
}

function dateFr(iso: string): string {
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

function KvRow({
  label,
  value,
  underline,
}: {
  label: string;
  value: string;
  underline?: boolean;
}) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", gap: 6, lineHeight: 1.6 }}>
      <span
        style={{
          fontWeight: 600,
          color: "#222",
          textDecoration: underline ? "underline" : undefined,
        }}
      >
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}

interface Props {
  data: BilanData;
}

const SheetPreview = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const prenom = data.patPrenom || "<Prénom>";
  const nom = data.patNom || "<Nom>";
  const metaLines = data.pratMeta;
  const firstMetaLine = (metaLines.split("\n")[0] || "").trim();

  return (
    <div
      ref={ref}
      style={{
        width: 794,
        minHeight: 1123,
        background: "#ffffff",
        color: "#1a1a1a",
        fontFamily: "Georgia, 'Times New Roman', serif",
        padding: "56px 64px 90px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* En-tête */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "2px solid #1a1a1a",
          paddingBottom: 14,
          marginBottom: 8,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 17,
              fontWeight: "bold",
              margin: "0 0 2px",
            }}
          >
            {esc(data.pratNom) || "Praticien"}
          </p>
          <p
            style={{
              fontSize: 12,
              color: "#444",
              fontFamily: "Arial, sans-serif",
              margin: 0,
              lineHeight: 1.45,
              whiteSpace: "pre-line",
            }}
          >
            {metaLines}
          </p>
        </div>
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 12,
            color: "#444",
            textAlign: "right",
            paddingTop: 2,
          }}
        >
          {dateFr(data.docDate)}
        </div>
      </div>

      {/* Salut + intro */}
      <p style={{ fontSize: 13.5, margin: "22px 0 4px" }}>Docteur,</p>
      <p style={{ fontSize: 13.5, lineHeight: 1.55, margin: "0 0 16px" }}>
        Veuillez trouver ci-après le bilan de neuro-visuel : de{" "}
        <strong>
          {prenom} {nom}
        </strong>
        {data.patAge ? ` âgé de ${data.patAge}` : ""}
        {data.patClasse ? ` actuellement en classe de ${data.patClasse}` : ""} ;
      </p>

      {/* Anamnèse */}
      <SectionTitle>Anamnèse</SectionTitle>
      <p
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 12.5,
          lineHeight: 1.6,
          whiteSpace: "pre-line",
          margin: "0 0 6px",
          textAlign: "justify",
        }}
      >
        {data.anamnese.trim() ? data.anamnese.trim() : "—"}
      </p>

      {/* Examen sensoriel */}
      <SectionTitle>Examen sensoriel</SectionTitle>
      <KvBlock>
        <KvRow label="AV :" value={data.sAv} />
        <KvRow label="Lang –" value={data.sLang} />
        <KvRow label="Bagolini" value={data.sBago} />
        <KvRow label="BP" value={data.sBp} />
      </KvBlock>

      {/* Équilibre oculomoteur */}
      <SectionTitle>Étude de l&apos;équilibre oculomoteur</SectionTitle>
      <KvBlock>
        <KvRow label="Esthétique :" value={data.eEsth} />
        <KvRow label="Ctaac" value={data.eCtaac} />
        <KvRow label="Amplitude de fusion" value={data.eAmpl} />
        <KvRow label="Motilité :" value={data.eMotil} />
        <KvRow label="Conclusion :" value={data.eConcl} />
      </KvBlock>

      {/* Orientation du regard */}
      <SectionTitle>Étude de l&apos;orientation du regard</SectionTitle>
      <KvBlock>
        <KvRow label="Capacité à fixer :" value={data.oFixer} underline />
        <KvRow label="Poursuite NSUCO" value={data.oPours} underline />
        <KvRow label="Saccades NSUCO" value={data.oSacc} underline />
        <KvRow label="DEM test" value={data.oDem} />
        <KvRow
          label="Mvts oculo-céphaliques / vestibulaires"
          value={data.oMvts}
          underline
        />
      </KvBlock>

      {/* Habilités visuelles */}
      <SectionTitle>Habilités visuelles</SectionTitle>
      <KvBlock>
        <KvRow label="Coordination oculo-manuelle" value={data.hCoord} underline />
        <KvRow label="Sur plan horizontal" value={data.hHoriz} />
        <KvRow
          label="Habilités visio-perceptives 2D (Bmti)"
          value={data.hBmti}
          underline
        />
        <KvRow
          label="Habilités visuo-spatiales (TPVSE)"
          value={data.hTpvse}
          underline
        />
        <KvRow
          label="Habilité visuelle pour le graphisme"
          value={data.hGraph}
          underline
        />
        <KvRow label="Test de lecture :" value={data.hLect} underline />
      </KvBlock>

      {/* Conclusion */}
      <p
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 13,
          fontWeight: "bold",
          textDecoration: "underline",
          margin: "20px 0 6px",
        }}
      >
        CONCLUSION :
      </p>
      <p
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 12.5,
          lineHeight: 1.6,
          whiteSpace: "pre-line",
          margin: "0 0 6px",
          textAlign: "justify",
        }}
      >
        {data.conclusion.trim() ? data.conclusion.trim() : "—"}
      </p>

      {/* Pied de page */}
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
          Bilan neuro-visuel
          {prenom !== "<Prénom>" ? ` — ${prenom} ${nom}` : ""}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: "bold", color: "#222", fontSize: 12 }}>
            {data.pratNom}
          </div>
          <div>{firstMetaLine}</div>
        </div>
      </div>
    </div>
  );
});

SheetPreview.displayName = "SheetPreview";
export default SheetPreview;

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

function KvBlock({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: 12.5,
        lineHeight: 1.6,
        margin: 0,
      }}
    >
      {children}
    </div>
  );
}
