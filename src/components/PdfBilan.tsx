"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { BilanData } from "@/types/bilan";
import { dateFr, extractFirstMetaLine } from "@/lib/utils";

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
    marginBottom: 6,
  },
  pratNom: { fontSize: 13, fontFamily: "Times-Bold", marginBottom: 1 },
  pratMeta: { fontSize: 9, color: "#444", fontFamily: "Helvetica", lineHeight: 1.2 },
  headerDate: { fontSize: 9, color: "#444", fontFamily: "Helvetica" },
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
  subItem: { flexDirection: "row", paddingLeft: 10, marginBottom: 1, lineHeight: 1.2 },
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

function PageHeader({ data }: { data: BilanData }) {
  return (
    <View style={S.header}>
      <View>
        <Text style={S.pratNom}>{data.pratNom || "Praticien"}</Text>
        <Text style={S.pratMeta}>{data.pratMeta}</Text>
      </View>
      <Text style={S.headerDate}>{dateFr(data.docDate)}</Text>
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
      <Text>{"Bilan neuro-visuel"}{patPrenom ? ` — ${patPrenom} ${patNom}` : ""}</Text>
      <Text style={S.footerCenter}>{page} / {total}</Text>
      <View style={S.footerRight}>
        <Text style={S.footerPratNom}>{pratNom}</Text>
        <Text>{firstMetaLine}</Text>
      </View>
    </View>
  );
}

export default function PdfBilan({ data }: { data: BilanData }) {
  const prenom = data.patPrenom || "<Prénom>";
  const nom = data.patNom || "<Nom>";
  const firstMetaLine = extractFirstMetaLine(data.pratMeta);
  const footerProps = {
    patPrenom: data.patPrenom,
    patNom: data.patNom,
    pratNom: data.pratNom,
    firstMetaLine,
    total: 2,
  };

  const introSuffix = [
    data.patAge ? `âgé de ${data.patAge}` : "",
    data.patClasse ? `actuellement en classe de ${data.patClasse}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Document>
      {/* ── Page 1 ── */}
      <Page size="A4" style={S.page}>
        <PageHeader data={data} />

        <Text style={{ fontSize: 10, marginTop: 16, marginBottom: 3 }}>Docteur,</Text>
        <Text style={{ fontSize: 10, lineHeight: 1.35, marginBottom: 10 }}>
          {`Veuillez trouver ci-après le bilan de neuro-visuel : de ${prenom} ${nom}`}
          {introSuffix ? ` ${introSuffix}` : ""}{" ;"}
        </Text>

        <SectionTitle label="Anamnèse" />
        <Text style={S.bodyText}>{data.anamnese.trim() || "—"}</Text>

        <SectionTitle label="Examen sensoriel" />
        <KvRow label="AV :" value={data.sAv} />
        <KvRow label="Lang :" value={data.sLang} />
        <KvRow label="Bagolini :" value={data.sBago} />
        <KvRow label="BP :" value={data.sBp} />

        <SectionTitle label="Étude de l'équilibre oculomoteur" />
        <KvRow label="Esthétique :" value={data.eEsth} />
        <KvRow label="Cta ac :" value={data.eCtaac} />
        <KvRow label="Amplitude de fusion :" value={data.eAmpl} />
        <KvRow label="Motilité :" value={data.eMotil} />
        <KvRow label="Conclusion :" value={data.eConcl} />

        <SectionTitle label="Étude de l'orientation du regard" />
        <KvRow label="Capacité à fixer :" value={data.oFixer} />
        <KvRow label="Poursuite NSUCO :" value={data.oPours} />
        <KvRow label="Saccades NSUCO :" value={data.oSacc} />
        <KvRow label="DEM test :" value={data.oDem} />
        <KvRow label="Mvts oculo-céphaliques / vestibulaires :" value={data.oMvts} />

        <SectionTitle label="Habilités visuelles" />
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9.5, textDecoration: "underline", color: "#222", lineHeight: 1.2 }}>
          Coordination oculo-manuelle
        </Text>
        {!!data.hCoord && (
          <View style={S.subItem}>
            <Text style={S.kvLabel}>{"•  dans l’espace :"}</Text>
            <Text style={[S.kvValue, { marginLeft: 4 }]}>{data.hCoord}</Text>
          </View>
        )}
        {!!data.hHoriz && (
          <View style={S.subItem}>
            <Text style={S.kvLabel}>{"•  sur le plan horizontal :"}</Text>
            <Text style={[S.kvValue, { marginLeft: 4 }]}>{data.hHoriz}</Text>
          </View>
        )}
        <KvRow label="Habilités visio-perceptives 2D :" value={data.hBmti} />
        <KvRow label="Habilités visuo-spatiales (TPVSE) :" value={data.hTpvse} />
        <KvRow label="Habilité visuelle pour le graphisme :" value={data.hGraph} />
        <KvRow label="Test de lecture :" value={data.hLect} />

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
