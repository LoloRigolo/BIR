"use client";

import { useRef, useState } from "react";
import { BilanData, defaultBilanData, emptyBilanData } from "@/types/bilan";
import { buildPdfFilename, calcPageHeightPx, calcTotalPages } from "@/lib/utils";
import FormPanel from "@/components/FormPanel";
import PreviewPanel from "@/components/PreviewPanel";
import SheetPreview from "@/components/SheetPreview";

export default function Home() {
  const [data, setData] = useState<BilanData>(defaultBilanData);
  const [loading, setLoading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  function handleChange(field: keyof BilanData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset() {
    if (!confirm("Vider tous les champs ?")) return;
    setData({ ...emptyBilanData, docDate: new Date().toISOString().slice(0, 10) });
  }

  async function handleDownload() {
    if (!pdfRef.current) return;
    setLoading(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf").then((m) => ({ jsPDF: m.jsPDF })),
      ]);

      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        width: 794,
        windowWidth: 794,
      });

      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pw = pdf.internal.pageSize.getWidth(); // 210mm
      const ph = pdf.internal.pageSize.getHeight(); // 297mm

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

      pdf.save(buildPdfFilename(data.patPrenom, data.patNom));
    } catch (e) {
      alert("Erreur PDF : " + (e as Error).message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="px-6 py-4 bg-white border-b border-[#d0d2d6] flex items-baseline gap-3 flex-wrap">
        <h1 className="text-[17px] font-semibold m-0">
          Bilan neuro-visuel{" "}
          <span className="text-[#2f5fa8]">→</span> PDF
        </h1>
        <p className="m-0 text-[#6b6e74] text-[13px]">
          Remplis les champs, l&apos;aperçu se met à jour en direct, puis
          télécharge le PDF.
        </p>
      </header>

      <div className="grid grid-cols-[540px_1fr] items-start max-[1080px]:grid-cols-1">
        <FormPanel
          data={data}
          onChange={handleChange}
          onDownload={handleDownload}
          onReset={handleReset}
          loading={loading}
        />
        <PreviewPanel data={data} />
      </div>

      {/* Élément caché à taille naturelle utilisé exclusivement pour la capture PDF */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: "-9999px",
          width: 794,
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <SheetPreview ref={pdfRef} data={data} />
      </div>
    </>
  );
}
