"use client";

import { BilanEphadData } from "@/types/bilanEphad";

interface Props {
  data: BilanEphadData;
  onChange: (field: keyof BilanEphadData, value: string | boolean) => void;
  onDownload: () => void;
  onReset: () => void;
  loading: boolean;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-[#6b6e74] mb-1 cursor-pointer">
        <span>
          {label}
          {hint && <span className="font-normal italic text-[#9a9da3] ml-1">{hint}</span>}
        </span>
        {children}
      </label>
    </div>
  );
}

function Fieldset({ legend, children }: { legend: React.ReactNode; children: React.ReactNode }) {
  return (
    <fieldset className="border border-[#d0d2d6] rounded-[10px] px-3.5 pt-3.5 pb-1.5 mb-4 bg-white">
      <legend className="text-[11px] uppercase tracking-wide text-[#2f5fa8] font-bold px-1.5">
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}

const inputCls =
  "w-full bg-white border border-[#b4b7bd] text-[#1c1d1f] px-2.5 py-2 rounded-[7px] text-[13px] font-[inherit] outline-none focus:border-[#2f5fa8] focus:ring-2 focus:ring-[#dde6f3] transition-all";

const textareaCls = inputCls + " resize-y min-h-[80px] leading-relaxed";

export default function FormEphad({ data, onChange, onDownload, onReset, loading }: Props) {
  const inp = (field: keyof BilanEphadData) => ({
    value: data[field] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(field, e.target.value),
  });

  const chk = (field: keyof BilanEphadData) => ({
    checked: data[field] as boolean,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(field, e.target.checked),
  });

  return (
    <div className="px-5 py-5 border-r border-[#d0d2d6] min-h-[calc(100vh-60px)] bg-[#f4f5f6]">

      <Fieldset legend="Praticien 1">
        <Field label="Nom"><input type="text" className={inputCls} {...inp("pratNom")} /></Field>
        <Field label="Profession / adresse / email" hint="(une info par ligne)">
          <textarea className={textareaCls} {...inp("pratMeta")} />
        </Field>
      </Fieldset>

      <Fieldset legend="Praticien 2 (optionnel)">
        <Field label="Nom"><input type="text" className={inputCls} {...inp("pratNom2")} /></Field>
        <Field label="Profession">
          <input type="text" className={inputCls} {...inp("pratMeta2")} />
        </Field>
      </Fieldset>

      <Fieldset legend="Document">
        <Field label="Type de visite">
          <input type="text" className={inputCls} {...inp("docType")} placeholder="Intervention en Maison de Retraite" />
        </Field>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="Lieu"><input type="text" className={inputCls} {...inp("docLieu")} /></Field>
          <Field label="Date"><input type="date" className={inputCls} {...inp("docDate")} /></Field>
        </div>
      </Fieldset>

      <Fieldset legend="Identité du patient">
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="Nom"><input type="text" className={inputCls} {...inp("patNom")} /></Field>
          <Field label="Prénom"><input type="text" className={inputCls} {...inp("patPrenom")} /></Field>
        </div>
        <Field label="Date de naissance">
          <input type="text" className={inputCls} placeholder="jj/mm/aaaa" {...inp("patDdn")} />
        </Field>
      </Fieldset>

      <Fieldset legend="Anamnèse">
        <textarea className={textareaCls} {...inp("anamnese")} />
      </Fieldset>

      <Fieldset legend="Équipement actuel">
        <Field label="Correction optique portée">
          <input type="text" className={inputCls} {...inp("equipCorrection")} />
        </Field>
      </Fieldset>

      <Fieldset legend="Réfraction automatique (RA)">
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="Œil droit (OD)"><input type="text" className={inputCls} {...inp("raOd")} /></Field>
          <Field label="Œil gauche (OG)"><input type="text" className={inputCls} {...inp("raOg")} /></Field>
        </div>
      </Fieldset>

      <Fieldset legend="Acuité visuelle">
        <p className="text-xs font-semibold text-[#6b6e74] mb-2">Vision de loin (VL)</p>
        <div className="grid grid-cols-3 gap-2.5 mb-3">
          <Field label="OD"><input type="text" className={inputCls} {...inp("avlOd")} /></Field>
          <Field label="OG"><input type="text" className={inputCls} {...inp("avlOg")} /></Field>
          <Field label="Acuité"><input type="text" className={inputCls} {...inp("avlAcuite")} /></Field>
        </div>
        <p className="text-xs font-semibold text-[#6b6e74] mb-2">Vision de près (VP)</p>
        <div className="grid grid-cols-3 gap-2.5">
          <Field label="OD"><input type="text" className={inputCls} {...inp("avpOd")} /></Field>
          <Field label="OG"><input type="text" className={inputCls} {...inp("avpOg")} /></Field>
          <Field label="Acuité"><input type="text" className={inputCls} {...inp("avpAcuite")} /></Field>
        </div>
      </Fieldset>

      <Fieldset legend="Correction optique retenue">
        <textarea className={textareaCls + " min-h-[60px]"} {...inp("correctionRetenue")} />
      </Fieldset>

      <Fieldset legend="Examens complémentaires">
        {(
          [
            { field: "examAucun", label: "Aucun" },
            { field: "examOphtalmo", label: "Consultation ophtalmologique" },
            { field: "examFondOeil", label: "Fond d'œil" },
            { field: "examOct", label: "OCT" },
          ] as const
        ).map(({ field, label }) => (
          <label key={field} className="flex items-center gap-2 text-[13px] text-[#1c1d1f] mb-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-[#2f5fa8]" {...chk(field)} />
            {label}
          </label>
        ))}
        <Field label="Autre">
          <input type="text" className={inputCls} {...inp("examAutre")} />
        </Field>
      </Fieldset>

      <Fieldset legend="Observations">
        <textarea className={textareaCls} {...inp("observations")} />
      </Fieldset>

      <Fieldset legend="Conclusion">
        <textarea className={textareaCls} {...inp("conclusion")} />
      </Fieldset>

      <div className="flex gap-2.5 flex-wrap sticky bottom-0 bg-[#f4f5f6] pt-3.5 pb-1">
        <button
          onClick={onDownload}
          disabled={loading}
          className="bg-[#2f5fa8] text-white border-none px-4 py-3 rounded-lg font-semibold text-sm cursor-pointer hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait transition-all"
        >
          {loading ? "Génération…" : "Télécharger le PDF"}
        </button>
        <button
          onClick={onReset}
          className="bg-white text-[#1c1d1f] border border-[#b4b7bd] px-4 py-3 rounded-lg text-sm cursor-pointer hover:border-[#2f5fa8] transition-all"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
