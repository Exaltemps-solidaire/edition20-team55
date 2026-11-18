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
});
