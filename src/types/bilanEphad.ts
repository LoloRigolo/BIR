export interface BilanEphadData {
  // Praticien 1
  pratNom: string;
  pratMeta: string;

  // Praticien 2 (optionnel)
  pratNom2: string;
  pratMeta2: string;

  // Document
  docDate: string;
  docType: string;
  docLieu: string;

  // Patient
  patNom: string;
  patPrenom: string;
  patDdn: string;

  // Anamnèse
  anamnese: string;

  // Équipement actuel
  equipCorrection: string;

  // Réfraction automatique
  raOd: string;
  raOg: string;

  // Acuité visuelle
  avlOd: string;
  avlOg: string;
  avlAcuite: string;
  avpOd: string;
  avpOg: string;
  avpAcuite: string;

  // Correction retenue
  correctionRetenue: string;

  // Examens complémentaires
  examAucun: boolean;
  examOphtalmo: boolean;
  examFondOeil: boolean;
  examOct: boolean;
  examAutre: string;

  // Observations
  observations: string;
}

export const defaultBilanEphadData: BilanEphadData = {
  pratNom: "Mme RALE Isabelle",
  pratMeta: "Orthoptiste\n43 av Carnot\n30100 ALES\nisabelle.rale.orthoptiste@gmail.com",
  pratNom2: "Axel Rakowski",
  pratMeta2: "Opticien",
  docDate: new Date().toISOString().slice(0, 10),
  docType: "Intervention en Maison de Retraite",
  docLieu: "",
  patNom: "",
  patPrenom: "",
  patDdn: "",
  anamnese: "",
  equipCorrection: "",
  raOd: "",
  raOg: "",
  avlOd: "",
  avlOg: "",
  avlAcuite: "",
  avpOd: "",
  avpOg: "",
  avpAcuite: "",
  correctionRetenue: "",
  examAucun: false,
  examOphtalmo: false,
  examFondOeil: false,
  examOct: false,
  examAutre: "",
  observations: "",
};

export const emptyBilanEphadData: BilanEphadData = {
  pratNom: "",
  pratMeta: "",
  pratNom2: "",
  pratMeta2: "",
  docDate: new Date().toISOString().slice(0, 10),
  docType: "",
  docLieu: "",
  patNom: "",
  patPrenom: "",
  patDdn: "",
  anamnese: "",
  equipCorrection: "",
  raOd: "",
  raOg: "",
  avlOd: "",
  avlOg: "",
  avlAcuite: "",
  avpOd: "",
  avpOg: "",
  avpAcuite: "",
  correctionRetenue: "",
  examAucun: false,
  examOphtalmo: false,
  examFondOeil: false,
  examOct: false,
  examAutre: "",
  observations: "",
};
