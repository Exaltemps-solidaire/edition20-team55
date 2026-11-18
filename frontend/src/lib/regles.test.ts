import { describe, expect, it } from "vitest";
import { attribuer } from "./regles";
import type { Equipement } from "./equipements";

const terrainVille: Equipement = { id: "EQ-1", terrain: "Terrain ville", ville: "Lyon", type: "But de football", etat: "ok", proprietaire: "ville" };
const terrainPrive: Equipement = { id: "EQ-2", terrain: "Terrain campus", ville: "Saint-Étienne", type: "Filet pare-ballons", etat: "ok", proprietaire: "prive" };

describe("attribuer", () => {
  it("R1 est prioritaire sur R2 : un incident Danger sur une catégorie Structure va au directeur par R1", () => {
    const attribution = attribuer({ categorie: "Structure", urgence: "danger" }, terrainVille);
    expect(attribution.regleAppliquee).toBe("R1");
    expect(attribution.attribueA).toBe("directeur-elise");
  });

  it("R3 s'applique sur un terrain de la ville quand aucune des règles précédentes ne joue", () => {
    const attribution = attribuer({ categorie: "Usure", urgence: "normale" }, terrainVille);
    expect(attribution.regleAppliquee).toBe("R3");
    expect(attribution.attribueA).toBe("ppub-nadia");
  });

  it("R4 s'applique par défaut sur un terrain privé hors structure et hors danger", () => {
    const attribution = attribuer({ categorie: "Usure", urgence: "normale" }, terrainPrive);
    expect(attribution.regleAppliquee).toBe("R4");
    expect(attribution.attribueA).toBe("rst-amara");
  });
});
