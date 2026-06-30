"use client";

import { useState } from "react";
import { BilanData, defaultBilanData, emptyBilanData } from "@/types/bilan";
import { BilanEphadData, defaultBilanEphadData, emptyBilanEphadData } from "@/types/bilanEphad";
import { buildPdfFilename, localDateStr } from "@/lib/utils";
import FormPanel from "@/components/FormPanel";
import PreviewPanel from "@/components/PreviewPanel";
import FormEphad from "@/components/FormEphad";
import PreviewEphad from "@/components/PreviewEphad";

type Model = "bilan" | "ephad";

const MODELS: { id: Model; label: string }[] = [
  { id: "bilan", label: "Bilan neuro-visuel" },
  { id: "ephad", label: "Fiche EPADH" },
];

export default function Home() {
  const [model, setModel] = useState<Model>("bilan");

  // â€" Bilan neuro-visuel â€"
  const [bilanData, setBilanData] = useState<BilanData>(defaultBilanData);

  // â€" EPADH â€"
  const [ephadData, setEphadData] = useState<BilanEphadData>(defaultBilanEphadData);

  const [loading, setLoading] = useState(false);

  // â"€â"€ Handlers bilan â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

  function handleBilanChange(field: keyof BilanData, value: string) {
    setBilanData((prev) => ({ ...prev, [field]: value }));
  }

  function handleBilanReset() {
    if (!confirm("Vider tous les champs ?")) return;
    setBilanData({ ...emptyBilanData, docDate: localDateStr() });
  }

  // â"€â"€ Handlers EPADH â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

  function handleEphadChange(field: keyof BilanEphadData, value: string | boolean) {
    setEphadData((prev) => ({ ...prev, [field]: value }));
  }

  function handleEphadReset() {
    if (!confirm("Vider tous les champs ?")) return;
    setEphadData({ ...emptyBilanEphadData, docDate: localDateStr() });
  }

  // â"€â"€ TÃ©lÃ©chargement PDF â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

  async function handleDownload() {
    setLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const filename =
        model === "bilan"
          ? buildPdfFilename(bilanData.patPrenom, bilanData.patNom)
          : buildPdfFilename(ephadData.patPrenom, ephadData.patNom, "ephad");

      let blob: Blob;
      if (model === "bilan") {
        const { default: PdfBilan } = await import("@/components/PdfBilan");
        blob = await pdf(<PdfBilan data={bilanData} />).toBlob();
      } else {
        const { default: PdfEphad } = await import("@/components/PdfEphad");
        blob = await pdf(<PdfEphad data={ephadData} />).toBlob();
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Erreur PDF : " + (e as Error).message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* â"€â"€ Header â"€â"€ */}
      <header className="px-6 bg-white border-b border-[#d0d2d6]">
        <div className="flex items-center gap-4 pt-4 pb-3 flex-wrap">
          <h1 className="text-[17px] font-semibold m-0 mr-2">
            Orthoptie <span className="text-[#2f5fa8]">â†’</span> PDF
          </h1>
          {/* Nav modÃ¨les */}
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
            Remplis les champs, l&apos;aperÃ§u se met Ã  jour en direct.
          </p>
        </div>
      </header>

      {/* â"€â"€ Contenu selon le modÃ¨le â"€â"€ */}
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

    </>
  );
}
