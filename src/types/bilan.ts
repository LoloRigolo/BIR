export interface BilanData {
  // En-tête praticien
  pratNom: string;
  pratMeta: string;
  docDate: string;

  // Patient
  patPrenom: string;
  patNom: string;
  patAge: string;
  patClasse: string;

  // Anamnèse
  anamnese: string;

  // Examen sensoriel
  sAv: string;
  sLang: string;
  sBago: string;
  sBp: string;

  // Équilibre oculomoteur
  eEsth: string;
  eCtaac: string;
  eAmpl: string;
  eMotil: string;
  eConcl: string;

  // Orientation du regard
  oFixer: string;
  oPours: string;
  oSacc: string;
  oDem: string;
  oMvts: string;

  // Habilités visuelles
  hCoord: string;
  hHoriz: string;
  hBmti: string;
  hTpvse: string;
  hGraph: string;
  hLect: string;

  // Conclusion
  conclusion: string;
}

export const defaultBilanData: BilanData = {
  pratNom: "Mme RALE Isabelle",
  pratMeta:
    "Orthoptiste\n43 av Carnot\n30100 ALES\nisabelle.rale.orthoptiste@gmail.com",
  docDate: new Date().toISOString().slice(0, 10),

  patPrenom: "",
  patNom: "",
  patAge: "",
  patClasse: "",
  anamnese: "",
  sAv: "",
  sLang: "",
  sBago: "",
  sBp: "",
  eEsth: "",
  eCtaac: "",
  eAmpl: "",
  eMotil: "",
  eConcl: "",
  oFixer: "",
  oPours: "",
  oSacc: "",
  oDem: "",
  oMvts: "",
  hCoord: "",
  hHoriz: "",
  hBmti: "",
  hTpvse: "",
  hGraph: "",
  hLect: "",
  conclusion: "",
};

export const emptyBilanData: BilanData = {
  pratNom: "",
  pratMeta: "",
  docDate: new Date().toISOString().slice(0, 10),
  patPrenom: "",
  patNom: "",
  patAge: "",
  patClasse: "",
  anamnese: "",
  sAv: "",
  sLang: "",
  sBago: "",
  sBp: "",
  eEsth: "",
  eCtaac: "",
  eAmpl: "",
  eMotil: "",
  eConcl: "",
  oFixer: "",
  oPours: "",
  oSacc: "",
  oDem: "",
  oMvts: "",
  hCoord: "",
  hHoriz: "",
  hBmti: "",
  hTpvse: "",
  hGraph: "",
  hLect: "",
  conclusion: "",
};
