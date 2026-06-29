"use client";

import { forwardRef } from "react";
import { BilanData } from "@/types/bilan";
import { dateFr, extractFirstMetaLine } from "@/lib/utils";

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

const SheetPreview = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const prenom = data.patPrenom || "<Prénom>";
  const nom = data.patNom || "<Nom>";
  const metaLines = data.pratMeta;
  const firstMetaLine = extractFirstMetaLine(metaLines);

  const footerProps = {
    patPrenom: data.patPrenom,
    patNom: data.patNom,
    pratNom: data.pratNom,
    firstMetaLine,
  };

  return (
    <div ref={ref}>
      {/* ── Page 1 ── */}
      <div style={PAGE_STYLE}>
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
            <p style={{ fontSize: 17, fontWeight: "bold", margin: "0 0 2px" }}>
              {data.pratNom || "Praticien"}
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
          <KvRow label="Lang :" value={data.sLang} />
          <KvRow label="Bagolini :" value={data.sBago} />
          <KvRow label="BP :" value={data.sBp} />
        </KvBlock>

        {/* Équilibre oculomoteur */}
        <SectionTitle>Étude de l&apos;équilibre oculomoteur</SectionTitle>
        <KvBlock>
          <KvRow label="Esthétique :" value={data.eEsth} />
          <KvRow label="Cta ac :" value={data.eCtaac} />
          <KvRow label="Amplitude de fusion :" value={data.eAmpl} />
          <KvRow label="Motilité :" value={data.eMotil} />
          <KvRow label="Conclusion :" value={data.eConcl} />
        </KvBlock>

        {/* Orientation du regard */}
        <SectionTitle>Étude de l&apos;orientation du regard</SectionTitle>
        <KvBlock>
          <KvRow label="Capacité à fixer :" value={data.oFixer} />
          <KvRow label="Poursuite NSUCO :" value={data.oPours} />
          <KvRow label="Saccades NSUCO :" value={data.oSacc} />
          <KvRow label="DEM test :" value={data.oDem} />
          <KvRow
            label="Mvts oculo-céphaliques / vestibulaires :"
            value={data.oMvts}
          />
        </KvBlock>

        {/* Habilités visuelles */}
        <SectionTitle>Habilités visuelles</SectionTitle>
        <KvBlock>
          <div style={{ fontWeight: 600, color: "#222", textDecoration: "underline", lineHeight: 1.6 }}>
            Coordination oculo-manuelle
          </div>
          {data.hCoord && (
            <div style={{ display: "flex", gap: 6, lineHeight: 1.6, paddingLeft: 14 }}>
              <span>•</span>
              <span style={{ fontWeight: 600, color: "#222" }}>dans l&apos;espace :</span>
              <span>{data.hCoord}</span>
            </div>
          )}
          {data.hHoriz && (
            <div style={{ display: "flex", gap: 6, lineHeight: 1.6, paddingLeft: 14 }}>
              <span>•</span>
              <span style={{ fontWeight: 600, color: "#222" }}>sur le plan horizontal :</span>
              <span>{data.hHoriz}</span>
            </div>
          )}
          <KvRow label="Habilités visio-perceptives 2D :" value={data.hBmti} />
          <KvRow label="Habilités visuo-spatiales (TPVSE)" value={data.hTpvse} />
          <KvRow label="Habilité visuelle pour le graphisme" value={data.hGraph} />
          <KvRow label="Test de lecture :" value={data.hLect} />
        </KvBlock>

        <PageFooter {...footerProps} page={1} total={2} />
      </div>

      {/* ── Page 2 — Conclusion ── */}
      <div style={PAGE_STYLE}>
        {/* En-tête */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "2px solid #1a1a1a",
            paddingBottom: 14,
            marginBottom: 24,
          }}
        >
          <div>
            <p style={{ fontSize: 17, fontWeight: "bold", margin: "0 0 2px" }}>
              {data.pratNom || "Praticien"}
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

        <p
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 14,
            fontWeight: "bold",
            textDecoration: "underline",
            margin: "0 0 16px",
          }}
        >
          CONCLUSION :
        </p>
        <p
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 12.5,
            lineHeight: 1.7,
            whiteSpace: "pre-line",
            margin: 0,
            textAlign: "justify",
          }}
        >
          {data.conclusion.trim() ? data.conclusion.trim() : "—"}
        </p>

        <PageFooter {...footerProps} page={2} total={2} />
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

function PageFooter({
  patPrenom,
  patNom,
  pratNom,
  firstMetaLine,
  page,
  total,
}: {
  patPrenom: string;
  patNom: string;
  pratNom: string;
  firstMetaLine: string;
  page: number;
  total: number;
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
        Bilan neuro-visuel
        {patPrenom ? ` — ${patPrenom} ${patNom}` : ""}
      </div>
      <div style={{ color: "#888" }}>
        {page} / {total}
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontWeight: "bold", color: "#222", fontSize: 12 }}>
          {pratNom}
        </div>
        <div>{firstMetaLine}</div>
      </div>
    </div>
  );
}
