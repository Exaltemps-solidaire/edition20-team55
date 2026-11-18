import { expect, test } from "@playwright/test";

// Démo du cas passant, de bout en bout. Chaque itération ajoute ses étapes (test.step).
test("Démo : le cas passant", async ({ page }) => {
  await test.step("J'ouvre l'application", async () => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  await test.step("Je choisis mon profil (RST)", async () => {
    await page.getByText("Amara Koné").click();
    await expect(page).toHaveURL(/\/parc/);
  });

  await test.step("Je vois la liste des équipements", async () => {
    await expect(page.getByRole("heading", { name: "Équipements" })).toBeVisible();
  });

  await test.step("J'ouvre un équipement", async () => {
    await page.getByText("Terrain Lyon 1").first().click();
    await expect(page.getByRole("heading", { name: "Signaler un incident" })).toBeVisible();
  });

  await test.step("Je signale un incident Danger", async () => {
    await page.getByPlaceholder("Ex. Filet déchiré").fill("Panier cassé");
    await page.getByPlaceholder("Ex. Usure").fill("Casse");
    await page.getByPlaceholder("Décrivez ce que vous observez").fill("Le panneau est tombé");
    await page.locator('input[type="file"]').setInputFiles("frontend/public/file.svg");
    await page.getByLabel("Urgence").selectOption("danger");
    await page.getByRole("button", { name: "Envoyer le signalement" }).click();
    await expect(page.getByText("Panier cassé · Casse")).toBeVisible();
  });

  await test.step("Je reviens à la liste, l'équipement est en rouge", async () => {
    await page.goto("/parc");
    await expect(page.getByText("Incident signalé").first()).toBeVisible();
  });
});
