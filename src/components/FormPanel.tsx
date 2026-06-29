"use client";

import { BilanData } from "@/types/bilan";

interface Props {
  data: BilanData;
  onChange: (field: keyof BilanData, value: string) => void;
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
      <label className="block text-xs font-semibold text-[#6b6e74] mb-1">
        {label}
        {hint && <span className="font-normal italic text-[#9a9da3] ml-1">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function TaTag() {
  return (
    <span className="inline-block text-[9px] bg-[#dde6f3] text-[#2f5fa8] px-1.5 py-0 rounded ml-1.5 uppercase tracking-wide align-middle">
      zone de texte
    </span>
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

const textareaCls = inputCls + " resize-y min-h-[96px] leading-relaxed";

export default function FormPanel({ data, onChange, onDownload, onReset, loading }: Props) {
  const inp = (field: keyof BilanData) => ({
    value: data[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(field, e.target.value),
  });

  return (
    <div className="px-5 py-5 border-r border-[#d0d2d6] min-h-[calc(100vh-60px)] bg-[#f4f5f6]">
      <Fieldset legend="En-tête — praticien">
        <Field label="Nom du praticien">
          <input type="text" className={inputCls} {...inp("pratNom")} />
        </Field>
        <Field label="Profession / adresse / email" hint="(une info par ligne)">
          <textarea className={textareaCls} {...inp("pratMeta")} />
        </Field>
        <Field label="Date">
          <input type="date" className={inputCls} {...inp("docDate")} />
        </Field>
      </Fieldset>

      <Fieldset legend="Patient">
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="Prénom">
            <input type="text" className={inputCls} placeholder="Prénom" {...inp("patPrenom")} />
          </Field>
          <Field label="Nom">
            <input type="text" className={inputCls} placeholder="Nom" {...inp("patNom")} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="Âge">
            <input type="text" className={inputCls} {...inp("patAge")} />
          </Field>
          <Field label="Classe">
            <input type="text" className={inputCls} {...inp("patClasse")} />
          </Field>
        </div>
      </Fieldset>

      <Fieldset legend={<>Anamnès <TaTag /></>}>
        <Field label="Texte libre : 6 lignes max !" hint="(historique, contexte)">
          <textarea className={textareaCls + " min-h-[130px]"} {...inp("anamnese")} />
        </Field>
      </Fieldset>

      <Fieldset legend="Examen sensoriel">
        <Field label="AV"><input type="text" className={inputCls} {...inp("sAv")} /></Field>
        <Field label="Lang"><input type="text" className={inputCls} {...inp("sLang")} /></Field>
        <Field label="Bagolini"><input type="text" className={inputCls} {...inp("sBago")} /></Field>
        <Field label="BP"><input type="text" className={inputCls} {...inp("sBp")} /></Field>
      </Fieldset>

      <Fieldset legend="Équilibre oculomoteur">
        <Field label="Esthétique"><input type="text" className={inputCls} {...inp("eEsth")} /></Field>
        <Field label="Ctaac"><input type="text" className={inputCls} {...inp("eCtaac")} /></Field>
        <Field label="Amplitude de fusion"><input type="text" className={inputCls} {...inp("eAmpl")} /></Field>
        <Field label="Motilité"><input type="text" className={inputCls} {...inp("eMotil")} /></Field>
        <Field label="Conclusion" hint="(courte)">
          <input type="text" className={inputCls} {...inp("eConcl")} />
        </Field>
      </Fieldset>

      <Fieldset legend="Orientation du regard">
        <Field label="Capacité à fixer"><input type="text" className={inputCls} {...inp("oFixer")} /></Field>
        <Field label="Poursuite NSUCO"><input type="text" className={inputCls} {...inp("oPours")} /></Field>
        <Field label="Saccades NSUCO"><input type="text" className={inputCls} {...inp("oSacc")} /></Field>
        <Field label="DEM test"><input type="text" className={inputCls} {...inp("oDem")} /></Field>
        <Field label="Mvts oculo-céph. / vestibulaires">
          <input type="text" className={inputCls} {...inp("oMvts")} />
        </Field>
      </Fieldset>

      <Fieldset legend="Habilités visuelles">
        <div className="mb-3">
          <p className="block text-xs font-semibold text-[#6b6e74] mb-1 underline">Coordination oculo-manuelle</p>
          <Field label="• dans l'espace :"><input type="text" className={inputCls} {...inp("hCoord")} /></Field>
          <Field label="• sur le plan horizontal :"><input type="text" className={inputCls} {...inp("hHoriz")} /></Field>
        </div>
        <Field label="Habilités visio-perceptives 2D (Bmti)"><input type="text" className={inputCls} {...inp("hBmti")} /></Field>
        <Field label="Habilités visuo-spatiales (TPVSE)"><input type="text" className={inputCls} {...inp("hTpvse")} /></Field>
        <Field label="Habilité visuelle pour le graphisme"><input type="text" className={inputCls} {...inp("hGraph")} /></Field>
        <Field label="Test de lecture"><input type="text" className={inputCls} {...inp("hLect")} /></Field>
      </Fieldset>

      <Fieldset legend={<>Conclusion <TaTag /></>}>
        <Field label="Synthèse & proposition de prise en charge">
          <textarea className={textareaCls + " min-h-[130px]"} {...inp("conclusion")} />
        </Field>
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
