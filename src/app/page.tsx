"use client";

import { useRef, useState } from "react";
import { BilanData, defaultBilanData, emptyBilanData } from "@/types/bilan";
import { BilanEphadData, defaultBilanEphadData, emptyBilanEphadData } from "@/types/bilanEphad";
import { buildPdfFilename, calcPageHeightPx, calcTotalPages } from "@/lib/utils";
import FormPanel from "@/components/FormPanel";
import PreviewPanel from "@/components/PreviewPanel";
import SheetPreview from "@/components/SheetPreview";
import FormEphad from "@/components/FormEphad";
import PreviewEphad from "@/components/PreviewEphad";
import SheetEphad from "@/components/SheetEphad";

type Model = "bilan" | "ephad";

const MODELS: { id: Model; label: string }[] = [
  { id: "bilan", label: "Bilan neuro-visuel" },
  { id: "ephad", label: "Fiche EPADH" },
];

export default function Home() {
  const [model, setModel] = useState<Model>("bilan");

  // — Bilan neuro-visuel —
  const [bilanData, setBilanData] = useState<BilanData>(defaultBilanData);
  const bilanRef = useRef<HTMLDivElement>(null);

  // — EPADH —
  const [ephadData, setEphadData] = useState<BilanEphadData>(defaultBilanEphadData);
  const ephadRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);

  // ── Handlers bilan ──────────────────────────────────────────────────────────

  function handleBilanChange(field: keyof BilanData, value: string) {
    setBilanData((prev) => ({ ...prev, [field]: value }));
  }

  function handleBilanReset() {
    if (!confirm("Vider tous les champs ?")) return;
    setBilanData({ ...emptyBilanData, docDate: new Date().toISOString().slice(0, 10) });
  }

  // ── Handlers EPADH ─────────────────────────────────────────────────────────

  function handleEphadChange(field: keyof BilanEphadData, value: string | boolean) {
    setEphadData((prev) => ({ ...prev, [field]: value }));
  }

  function handleEphadReset() {
    if (!confirm("Vider tous les champs ?")) return;
    setEphadData({ ...emptyBilanEphadData, docDate: new Date().toISOString().slice(0, 10) });
  }

  // ── Téléchargement PDF ──────────────────────────────────────────────────────

  async function handleDownload() {
    const ref = model === "bilan" ? bilanRef : ephadRef;
    if (!ref.current) return;
    setLoading(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf").then((m) => ({ jsPDF: m.jsPDF })),
      ]);

      const canvas = await html2canvas(ref.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        width: 794,
        windowWidth: 794,
      });

      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();

      const pageHeightPx = calcPageHeightPx(canvas.width);
      const totalPages = calcTotalPages(canvas.height, canvas.width);

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage();
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = pageHeightPx;
        const ctx = pageCanvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        const srcY = i * pageHeightPx;
        const srcH = Math.min(pageHeightPx, canvas.height - srcY);
        ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
        pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", 0, 0, pw, ph);
      }

      const filename =
        model === "bilan"
          ? buildPdfFilename(bilanData.patPrenom, bilanData.patNom)
          : buildPdfFilename(ephadData.patPrenom, ephadData.patNom);
      pdf.save(filename);
    } catch (e) {
      alert("Erreur PDF : " + (e as Error).message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── Header ── */}
      <header className="px-6 bg-white border-b border-[#d0d2d6]">
        <div className="flex items-center gap-4 pt-4 pb-3 flex-wrap">
          <h1 className="text-[17px] font-semibold m-0 mr-2">
            Orthoptie <span className="text-[#2f5fa8]">→</span> PDF
          </h1>
          {/* Nav modèles */}
          <nav className="flex gap-1">
            {MODELS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setModel(id)}
                className={[
                  "px-4 py-1.5 rounded-md text-[13px] font-medium transition-all border",
                  model === id
                    ? "bg-[#2f5fa8] text-white border-[#2f5fa8]"
                    : "bg-white text-[#6b6e74] border-[#d0d2d6] hover:border-[#2f5fa8] hover:text-[#2f5fa8]",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </nav>
          <p className="m-0 text-[#6b6e74] text-[13px] ml-auto hidden sm:block">
            Remplis les champs, l&apos;aperçu se met à jour en direct.
          </p>
        </div>
      </header>

      {/* ── Contenu selon le modèle ── */}
      {model === "bilan" ? (
        <div className="grid grid-cols-[540px_1fr] items-start max-[1080px]:grid-cols-1">
          <FormPanel
            data={bilanData}
            onChange={handleBilanChange}
            onDownload={handleDownload}
            onReset={handleBilanReset}
            loading={loading}
          />
          <PreviewPanel data={bilanData} />
        </div>
      ) : (
        <div className="grid grid-cols-[540px_1fr] items-start max-[1080px]:grid-cols-1">
          <FormEphad
            data={ephadData}
            onChange={handleEphadChange}
            onDownload={handleDownload}
            onReset={handleEphadReset}
            loading={loading}
          />
          <PreviewEphad data={ephadData} />
        </div>
      )}

      {/* Éléments cachés pour la capture PDF */}
      <div aria-hidden="true" style={{ position: "fixed", top: 0, left: "-9999px", width: 794, pointerEvents: "none", zIndex: -1 }}>
        <SheetPreview ref={bilanRef} data={bilanData} />
        <SheetEphad ref={ephadRef} data={ephadData} />
      </div>
    </>
  );
}
