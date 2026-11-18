# Architecture Decision Record (ADR)

Journal des décisions d'architecture prises pendant le hackathon (dépendance nouvelle, stockage, pattern structurant).

Une entrée par décision, ajoutée à la fin, au format :

```
### AAAA-MM-JJ — <titre court>

- **Décision** : ce qui a été choisi
- **Contexte** : le problème à résoudre
- **Alternatives envisagées** : les autres options, et pourquoi elles sont écartées
- **Conséquences** : les compromis acceptés
```

Le fichier est un journal : on ajoute, on ne réécrit pas. Pour revenir sur une décision, une nouvelle entrée le dit explicitement.

---

## Décisions

### 2026-11-18 — Adoption de `ressources/build-spec.md` et `ressources/index.html` comme références

- **Décision** : `ressources/build-spec.md` devient la spécification de référence pour le vocabulaire du modèle de données (section 6), les états et transitions d'un équipement/incident (section 7), les règles d'attribution et de notification (section 9) et les parcours à tester (section 10). `ressources/index.html` devient la référence visuelle (charte, jetons de couleur/forme/typographie de la section 13) : les jetons de `globals.css` sont alignés exactement sur ses variables CSS, à la place des valeurs approchées reprises précédemment d'un autre prototype (`example.html`, retiré du dépôt).
- **Contexte** : ces deux fichiers ont été déposés dans `ressources/` en cours de hackathon, en plus de la passation initiale. Le document décrit la cible complète (itérations 1 à 4 de la section 11, stack React+Vite+repository pattern de la section 4.3) ; il ne remplace pas le plan déjà validé dans `ITERATIONS.md`, qui reste la référence du séquencement et du budget de codage sur cette machine.
- **Alternatives envisagées** : réécrire l'application avec la stack de la section 4.3 (React 19 + Vite + `repository.ts` + `outbox.ts`) — écarté : l'application existante (Next.js, export statique, pas de backend dédié) fonctionne, est déjà déployée, et le `/CLAUDE.md` racine n'impose aucune pile ; une réécriture ferait perdre le travail déjà publié sans gain pour l'association dans le temps du hackathon.
- **Conséquences** : les iterations suivantes consultent `build-spec.md` pour nommer les champs, états et règles de façon cohérente avec la cible (ex. vocabulaire `etat` de la section 7.1, règles R1–R4 de la section 9.1) même si leur implémentation reste simplifiée (pas de Power Apps/SharePoint, pas de vraies notifications Teams/mail). Les écarts volontaires avec la section 11 (séquencement, stack) sont à signaler dans `ITERATIONS.md` au moment où ils deviennent pertinents, plutôt que résolus d'un bloc ici.
