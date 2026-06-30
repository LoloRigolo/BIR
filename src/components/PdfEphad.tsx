"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { BilanEphadData } from "@/types/bilanEphad";
import { dateFr, extractFirstMetaLine, formatAvLine } from "@/lib/utils";

const S = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    color: "#1a1a1a",
    paddingTop: 42,
    paddingLeft: 48,
    paddingRight: 48,
    paddingBottom: 64,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 10,
    marginBottom: 8,
  },
  pratNom: { fontSize: 13, fontFamily: "Times-Bold", marginBottom: 1 },
  pratMeta: { fontSize: 9, color: "#444", fontFamily: "Helvetica", lineHeight: 1.2 },
  titleBlock: {
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 8,
    marginBottom: 6,
  },
  titleText: { fontSize: 11, fontFamily: "Times-Bold", letterSpacing: 1, marginBottom: 2 },
  titleSub: { fontSize: 9, color: "#555", fontFamily: "Helvetica", fontStyle: "italic" },
  lieuDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "Helvetica",
    fontSize: 9,
    marginBottom: 2,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 2,
    marginTop: 13,
    marginBottom: 4,
  },
  kvRow: { flexDirection: "row", marginBottom: 1, lineHeight: 1.2 },
  kvLabel: { fontFamily: "Helvetica-Bold", color: "#222", fontSize: 9.5, marginRight: 4 },
  kvValue: { fontFamily: "Helvetica", fontSize: 9.5, flex: 1 },
  bodyText: { fontFamily: "Helvetica", fontSize: 9.5, lineHeight: 1.35, textAlign: "justify" },
  checkRow: { flexDirection: "row", alignItems: "center", marginBottom: 3 },
  checkBox: {
    width: 9, height: 9,
    borderWidth: 1, borderColor: "#444",
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  checkFill: { width: 5, height: 5, backgroundColor: "#1a1a1a" },
  checkLabel: { fontFamily: "Helvetica", fontSize: 9.5 },
  footer: {
    position: "absolute",
    left: 48,
    right: 48,
    bottom: 22,
    borderTopWidth: 1,
    borderTopColor: "#bbb",
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#555",
  },
  footerCenter: { color: "#888" },
  footerRight: { textAlign: "right" },
  footerPratNom: { fontFamily: "Helvetica-Bold", color: "#1a1a1a", fontSize: 9 },
});

function SectionTitle({ label }: { label: string }) {
  return <Text style={S.sectionTitle}>{label}</Text>;
}

function KvRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <View style={S.kvRow}>
      <Text style={S.kvLabel}>{label}</Text>
      <Text style={S.kvValue}>{value}</Text>
    </View>
  );
}

function CheckRow({ checked, label }: { checked: boolean; label: string }) {
  return (
    <View style={S.checkRow}>
      <View style={S.checkBox}>
        {checked && <View style={S.checkFill} />}
      </View>
      <Text style={S.checkLabel}>{label}</Text>
    </View>
  );
}

function PageHeader({ data }: { data: BilanEphadData }) {
  return (
    <View style={S.header}>
      <View>
        <Text style={S.pratNom}>{data.pratNom || "Praticien"}</Text>
        <Text style={S.pratMeta}>{data.pratMeta}</Text>
      </View>
      {!!data.pratNom2 && (
        <View style={{ alignItems: "flex-end" }}>
          <Text style={S.pratNom}>{data.pratNom2}</Text>
          <Text style={[S.pratMeta, { textAlign: "right" }]}>{data.pratMeta2}</Text>
        </View>
      )}
    </View>
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
    <View style={S.footer}>
      <Text>{"Fiche d’examen visuel"}{patPrenom ? ` — ${patPrenom} ${patNom}` : ""}</Text>
      <Text style={S.footerCenter}>{page} / {total}</Text>
      <View style={S.footerRight}>
        <Text style={S.footerPratNom}>{pratNom}</Text>
        <Text>{firstMetaLine}</Text>
      </View>
    </View>
  );
}

export default function PdfEphad({ data }: { data: BilanEphadData }) {
  const avlParts = formatAvLine(data.avlOd, data.avlOg, data.avlAcuite);
  const avpParts = formatAvLine(data.avpOd, data.avpOg, data.avpAcuite);
  const firstMetaLine = extractFirstMetaLine(data.pratMeta);
  const footerProps = {
    patPrenom: data.patPrenom,
    patNom: data.patNom,
    pratNom: data.pratNom,
    firstMetaLine,
    total: 2,
  };

  return (
    <Document>
      {/* ── Page 1 ── */}
      <Page size="A4" style={S.page}>
        <PageHeader data={data} />

        <View style={S.titleBlock}>
          <Text style={S.titleText}>FICHE D&apos;EXAMEN VISUEL</Text>
          {!!data.docType && <Text style={S.titleSub}>{data.docType}</Text>}
        </View>

        <View style={S.lieuDate}>
          {data.docLieu ? (
            <Text>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Lieu : </Text>
              {data.docLieu}
            </Text>
          ) : (
            <Text />
          )}
          <Text>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Date : </Text>
            {dateFr(data.docDate)}
          </Text>
        </View>

        <SectionTitle label="Identité du patient" />
        <KvRow label="Nom :" value={data.patNom} />
        <KvRow label="Prénom :" value={data.patPrenom} />
        <KvRow label="Date de naissance :" value={data.patDdn} />

        {!!data.anamnese && (
          <>
            <SectionTitle label="Anamnèse" />
            <Text style={S.bodyText}>{data.anamnese.trim()}</Text>
          </>
        )}

        {!!data.equipCorrection && (
          <>
            <SectionTitle label="Équipement actuel" />
            <KvRow label="Correction optique portée :" value={data.equipCorrection} />
          </>
        )}

        {!!(data.raOd || data.raOg) && (
          <>
            <SectionTitle label="Réfraction automatique (RA)" />
            <KvRow label="OD :" value={data.raOd} />
            <KvRow label="OG :" value={data.raOg} />
          </>
        )}

        {!!(avlParts || avpParts) && (
          <>
            <SectionTitle label="Acuité visuelle" />
            {!!avlParts && <KvRow label="Vision de loin (VL) :" value={avlParts} />}
            {!!avpParts && <KvRow label="Vision de près (VP) :" value={avpParts} />}
          </>
        )}

        {!!data.correctionRetenue && (
          <>
            <SectionTitle label="Correction optique retenue" />
            <Text style={S.bodyText}>{data.correctionRetenue.trim()}</Text>
          </>
        )}

        <SectionTitle label="Besoin d'examens complémentaires" />
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <View style={{ width: "50%" }}>
            <CheckRow checked={data.examAucun} label="Aucun" />
            <CheckRow checked={data.examFondOeil} label="Fond d'oeil" />
          </View>
          <View style={{ width: "50%" }}>
            <CheckRow checked={data.examOphtalmo} label="Consultation ophtalmologique" />
            <CheckRow checked={data.examOct} label="OCT" />
          </View>
        </View>
        {!!data.examAutre && <KvRow label="Autre :" value={data.examAutre} />}

        {!!data.observations && (
          <>
            <SectionTitle label="Observations" />
            <Text style={S.bodyText}>{data.observations.trim()}</Text>
          </>
        )}

        <PageFooter {...footerProps} page={1} />
      </Page>

      {/* ── Page 2 — Conclusion ── */}
      <Page size="A4" style={S.page}>
        <PageHeader data={data} />

        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 11, textDecoration: "underline", marginTop: 6, marginBottom: 12 }}>
          CONCLUSION :
        </Text>
        <Text style={S.bodyText}>{data.conclusion.trim() || "—"}</Text>

        <PageFooter {...footerProps} page={2} />
      </Page>
    </Document>
  );
}
