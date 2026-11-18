import { describe, expect, it } from "vitest";
import { champsManquantsIntervention, priseEnChargeProposee } from "./interventions";
import type { Equipement } from "./equipements";

describe("champsManquantsIntervention", () => {
  it("signale la photo de la réparation absente", () => {
    const manquants = champsManquantsIntervention({ prestataire: "Menuiserie Dupont", date: "2026-11-18", priseEnCharge: "Ville", photoReparation: "" });
    expect(manquants).toEqual(["la photo de la réparation"]);
  });

  it("ne signale rien quand tous les champs sont remplis", () => {
    const manquants = champsManquantsIntervention({
      prestataire: "Menuiserie Dupont",
      date: "2026-11-18",
      priseEnCharge: "Ville",
      photoReparation: "photo.jpg",
    });
    expect(manquants).toEqual([]);
  });
});

describe("priseEnChargeProposee", () => {
  const base: Omit<Equipement, "proprietaire"> = { id: "EQ-1", terrain: "Terrain Test", ville: "Test", type: "But de football", etat: "ok" };

  it("propose l'Association pour un terrain privé", () => {
    expect(priseEnChargeProposee({ ...base, proprietaire: "prive" })).toBe("Association");
  });

  it("propose la Ville pour un terrain de la ville ou sous convention", () => {
    expect(priseEnChargeProposee({ ...base, proprietaire: "ville" })).toBe("Ville");
    expect(priseEnChargeProposee({ ...base, proprietaire: "convention" })).toBe("Ville");
  });
});
