// Pas de connexion dans cette version : on incarne un persona choisi dans une liste (cadrage §"Les utilisateurs : pas de connexion").
export type Role = "rst" | "directeur";

export type Persona = {
  id: string;
  nom: string;
  role: Role;
  libelleRole: string;
};

export const PERSONAS: Persona[] = [
  {
    id: "rst-amara",
    nom: "Amara Koné",
    role: "rst",
    libelleRole: "Responsable sportif territorial (RST)",
  },
  {
    id: "directeur-elise",
    nom: "Élise Fontaine",
    role: "directeur",
    libelleRole: "Directeur national des infrastructures",
  },
];

export function trouverPersona(id: string | null): Persona | null {
  return PERSONAS.find((p) => p.id === id) ?? null;
}
