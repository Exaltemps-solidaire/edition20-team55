# Plan d'itérations — Sport dans la Ville (équipe 7XQ8UV)

**Plan validé le 2026-11-18.**

- **Source du plan** : proposé par l'agent (aucun plan d'itérations de l'équipe trouvé dans la passation : pas de fichier `cadrage/*iteration*`, pas de clé `iterations` dans `passation.json`).
- **Référence de spécification** : `ressources/build-spec.md` (vocabulaire du modèle de données, états/transitions, règles d'attribution et de notification, parcours à tester) et `ressources/index.html` (charte visuelle, jetons repris dans `frontend/src/app/globals.css`) — voir l'entrée du 2026-11-18 dans `adr.md`. Le séquencement et le budget de codage restent ceux de ce fichier, pas ceux de la section 11 du build-spec.
- **Temps restant annoncé** : 120 minutes (question posée le 2026-11-18).
- **Durée d'un tour de test PM Lab** : 10 minutes (valeur par défaut, le développeur ne savait pas).
- **Capacité estimée** : une itération coûte au moins codage (≤10 min) + publication (~5 min) + tour de test (10 min) ≈ 25 min. 120 min ⇒ **4 à 5 itérations** tiennent, selon la durée réelle de codage de chacune.
- **Ce qui sort du périmètre** (conforme au PRD, `cadrage/7-prd.md`) : suivi des jeunes (Digisport), contrôles externes des bureaux de contrôle, gestion des prestataires (contrats/garanties), vue cartographique (carte de France), alerte récidive, relance automatique PPUB/direction, connexion/comptes (remplacés par un sélecteur de persona).
- ✂️ **Point de coupe supplémentaire proposé par l'agent** : le « carnet de santé » (hypothèse 3) ne sera pas un écran dédié séparé construit d'un bloc. Il émergera des itérations du flux principal : la fiche équipement affichera sa pastille d'état et son historique en réutilisant les incidents/interventions déjà créés, plutôt qu'un écran construit à part. Si le temps restant le permet en fin de programme, une itération courte peaufinera cet écran.
- ⚠️ **Traduction technique** : la solution décrite s'appuie sur Microsoft 365 (Power Apps, SharePoint, Teams, Power Automate). Cette machine n'impose aucune pile : le besoin métier est repris en web classique — QR code → page web d'équipement, notifications in-app au lieu de Teams, liste au lieu de SharePoint. Aucune fonctionnalité n'est perdue dans cette traduction, mais ce n'est pas ce que montrera littéralement le prototype PRD.

---

## Itération 1 : Choisir son rôle et voir l'écran principal, application déployée

> Temps restant annoncé au début de cette itération : ~115 minutes (2026-11-18). Largement suffisant pour codage (≤10 min) + publication (~5 min) + tour de test (10 min).

- **Dans le périmètre** :
  - écran « Qui êtes-vous ? » au lancement : liste d'une personne par rôle du scénario (RST, directeur national des infrastructures), avec un bouton pour changer de rôle à tout moment ;
  - écran principal après choix du rôle : liste des équipements/terrains d'exemple (données en dur), vide d'incidents ;
  - squelette conforme au contrat de déployabilité : `.env.example`, `DEPLOIEMENT.md`, routes `/health` (front, port 8080) et `/sante` répondant 200.
- **Hors périmètre** : tout signalement, tout scan de QR code, toute donnée réelle de l'association.
- **Critères d'acceptation** :
  - Étant donné l'application démarrée, quand on arrive sur `/`, alors l'écran « Qui êtes-vous ? » propose au moins un persona RST et un persona directeur.
  - Étant donné un persona choisi, quand on valide, alors on arrive sur l'écran principal, qui liste des équipements d'exemple, et un bouton permet de changer de rôle.
  - Étant donné l'application déployée, quand on appelle `/health` et `/sante`, alors les deux répondent 200 avec un corps non vide.
- **Hypothèse de l'équipe couverte** : aucune — itération de squelette, aucune n'est testable sans flux de signalement.
- **Codage estimé** : 10 minutes
- **Fichiers prévus** : page/route d'accueil (persona picker), écran principal (liste équipements), état du persona choisi (contexte/store), `.env.example`, `DEPLOIEMENT.md`
- **Tests unitaires prévus** : aucun — pas de logique métier au-delà de l'affichage et d'une sélection triviale dans cette itération.
- **Étapes ajoutées à la démo** : ouvrir l'app, choisir le persona RST, voir l'écran principal.
- **Bilan** :
  - Durée de codage réelle : 9 minutes (budget 10 min respecté, alarme des 8 minutes déclenchée — le développeur a choisi de finaliser, il n'y avait plus de codage à faire).
  - Demande ajoutée en cours d'itération par le développeur : reprendre le plus fidèlement possible le design du prototype `ressources/example.html` (jetons de couleur, typographie Inter, en-tête, cartes, badges de statut). Intégrée dans le budget initial sans le dépasser, en portant le système de design dans `globals.css` et un composant `EnTete` partagés, plutôt que de reproduire tout le prototype interactif (carte, simulateur téléphone, scan QR) qui reste hors périmètre de cette itération.
  - Critères d'acceptation : les 3 sont satisfaits (vérifiés en local via `curl` sur l'app déployée : `/` liste les deux personas, le choix mène à `/parc` avec la liste d'équipements et un bouton « changer de rôle », `/health` et `/sante` répondent 200 avec un corps non vide sur le port 8080).
  - Reporté : rien de prévu à cette itération n'a été reporté.
  - Bloqué puis résolu hors codage : le démarrage de la plateforme a buté sur la limite de pull anonyme de Docker Hub (`toomanyrequests`) — resté sans rapport avec le code de l'app. Résolu après authentification Docker Hub fournie par le développeur (`podman login`), sans impact sur le budget de codage.
  - Hors DoD, tenté : mise à jour de `e2e/demo.spec.ts` avec le parcours de cette itération (choix du persona RST, affichage de la liste). Le navigateur Chromium de Playwright ne peut pas se lancer sur cette machine (bibliothèques système manquantes, `libnspr4.so`) — la démo est donc écrite mais non exécutable ici ; signalé sans bloquer, comme prévu.
  - **Modifications** :
    - `frontend/src/app/page.tsx`, `page.module.css` — écran « Qui êtes-vous ? » (critère 1).
    - `frontend/src/app/parc/page.tsx`, `page.module.css` — écran principal, liste des équipements, bouton « changer de rôle » (critère 2).
    - `frontend/src/lib/personas.ts`, `frontend/src/lib/equipements.ts` — données d'exemple et logique de sélection du persona (critères 1 et 2).
    - `frontend/src/components/EnTete.tsx`, `frontend/src/app/globals.css`, `frontend/src/app/layout.tsx` — système de design repris du prototype (demande ajoutée en cours d'itération).
    - `frontend/nginx.conf` — en-têtes de sécurité et route `/health`/`/sante` (critère 3).
    - `.env.example`, `DEPLOIEMENT.md` — contrat de déployabilité (critère 3).
    - `api/Dockerfile`, `frontend/Dockerfile` — images de base qualifiées `docker.io/library/…` (contrainte du `/CLAUDE.md` racine).
    - `podman-compose.yml` — déploiement (ports 8080/8081, réseau `core-network`).
    - `e2e/demo.spec.ts` — étapes de démo ajoutées (non exécutable sur cette machine, cf. ci-dessus).

## Itération 2 : Le RST signale un incident depuis la fiche d'un équipement

- **Dans le périmètre** :
  - une fiche équipement accessible depuis l'écran principal (le lien simule le scan du QR code — pas de lecture caméra réelle) ;
  - formulaire de signalement : 3 champs (type, catégorie, constat), photo, niveau d'urgence (Normale / Forte / Danger) ;
  - l'incident envoyé apparaît dans la liste avec date, auteur (le persona courant), photo, statut « Nouveau » ; un incident « Danger » fait passer l'équipement en rouge dans la liste.
- **Hors périmètre** : lecture caméra réelle d'un QR code, mode hors ligne, notifications au directeur.
- **Critères d'acceptation** :
  - Étant donné un RST sur la fiche d'un équipement, quand il remplit les 3 champs, une photo et une urgence, puis envoie, alors un incident « Nouveau » apparaît dans la liste avec sa date et son auteur.
  - Étant donné un champ obligatoire vide, quand il tente d'envoyer, alors le formulaire refuse l'envoi et dit pourquoi.
  - Étant donné un incident créé avec l'urgence « Danger », quand la liste se rafraîchit, alors l'équipement correspondant apparaît en rouge.
- **Hypothèse de l'équipe couverte** : « Nous croyons que le RST peut signaler un incident depuis le terrain en moins de 3 actions et moins de 30 secondes via le QR code » — démontrée qualitativement (le parcours fiche → formulaire → envoi), sans mesure automatique de temps.
- **Codage estimé** : 10 minutes
- **Fichiers prévus** : page fiche équipement, formulaire de signalement, route API de création d'incident, modèle incident/équipement, mise à jour de la liste équipements
- **Tests unitaires prévus** : 2 — validation des champs obligatoires du formulaire ; règle « urgence Danger ⇒ équipement rouge ».
- **Étapes ajoutées à la démo** : depuis l'écran principal, ouvrir un équipement, signaler un incident « Danger », vérifier qu'il apparaît en rouge dans la liste.
- **Bilan** :
  - Durée de codage réelle : 11 minutes (budget cible 5 min annoncé par le développeur largement dépassé, alarme des 8 minutes déclenchée). Dépassement expliqué pour une bonne part par un sous-agent lancé en parallèle sur l'adoption de `ressources/build-spec.md`/`ressources/index.html` comme références (hors scope métier de cette itération, voir commit `7ab43a6`), qui a occupé le même chrono sans être du codage de signalement. Le développeur a choisi de finaliser plutôt que de s'arrêter à mi-chemin.
  - Critères d'acceptation : les 3 sont satisfaits — formulaire complet (type, catégorie, constat, photo, urgence) crée un incident « Nouveau » daté avec l'auteur courant ; un champ manquant bloque l'envoi avec un message listant les champs à compléter (`champsManquants`) ; un incident « Danger » fait passer l'équipement en rouge (« Incident signalé ») à la fois sur sa fiche et dans la liste `/parc` (`aUnIncidentDanger`).
  - Bug corrigé en cours d'itération : la redirection « pas de persona » était appelée pendant le rendu au lieu d'un `useEffect`, ce qui faisait échouer le build statique (`ReferenceError: location is not defined` pendant `generateStaticParams`). Corrigée pour suivre le même pattern que `parc/page.tsx`.
  - Reporté : rien de prévu à cette itération n'a été reporté.
  - Hors DoD, tenté : mise à jour de `e2e/demo.spec.ts` avec le parcours « ouvrir un équipement → signaler un incident Danger → le voir en rouge dans la liste ». Toujours non exécutable sur cette machine (Chromium/`libnspr4.so` manquant, cf. itération 1) — signalé sans bloquer.
  - **Modifications** :
    - `frontend/src/lib/incidents.ts` — types `Incident`/`SaisieIncident`, `champsManquants`, `aUnIncidentDanger`, `chargerIncidents`, `ajouterIncident` (critères 1, 2, 3).
    - `frontend/src/lib/incidents.test.ts` — 4 tests Vitest sur `champsManquants` et `aUnIncidentDanger` (DoD point 2).
    - `frontend/src/lib/equipements.ts` — ajout de l'état `bad` (« Incident signalé ») (critère 3).
    - `frontend/src/app/equipement/[id]/page.tsx`, `FicheEquipement.tsx`, `page.module.css` — fiche équipement, formulaire de signalement, liste des incidents (critères 1, 2, 3).
    - `frontend/src/app/parc/page.tsx` — lignes cliquables vers la fiche équipement, badge rouge calculé depuis les incidents en localStorage (critère 3).
    - `e2e/demo.spec.ts` — étapes de démo ajoutées (non exécutable sur cette machine, cf. ci-dessus).
  - **Correction après signalement (demande du développeur)** : le champ photo simulait un vrai fichier par un simple texte libre, ce qui ne permettait aucun upload réel. Corrigé en 1 minute de codage : `input[type=file]` + lecture en `data:` URL via `FileReader`, stockée telle quelle dans `Incident.photo` (toujours une simple chaîne, pas de changement de type) et affichée en vignette dans la liste des incidents au lieu du texte brut. Aucun backend de stockage ajouté : cohérent avec le choix déjà fait de tout garder en `localStorage` pour cette itération, et la CSP du front autorise déjà `img-src ... data:`. Fichiers touchés : `frontend/src/app/equipement/[id]/FicheEquipement.tsx`, `page.module.css`, `e2e/demo.spec.ts` (utilise `setInputFiles` sur `frontend/public/file.svg`).

## Itération 3 : Le signalement fonctionne sans réseau

- **Dans le périmètre** :
  - si l'envoi échoue faute de réseau, le signalement reste en local (file d'attente) avec un statut visible « en attente d'envoi » ;
  - au retour du réseau, l'envoi repart automatiquement, sans action du RST.
- **Hors périmètre** : déduplication avancée, compression ou gestion fine des photos volumineuses hors ligne.
- **Critères d'acceptation** :
  - Étant donné le navigateur hors ligne, quand le RST envoie un signalement, alors il reste visible avec un statut « en attente d'envoi ».
  - Étant donné le retour en ligne, quand l'évènement survient, alors le signalement part automatiquement et passe au statut « Nouveau ».
  - Étant donné 2 signalements mis en attente hors ligne, quand le réseau revient, alors les deux sont transmis, sans perte.
- **Hypothèse de l'équipe couverte** : « Nous croyons que le mode hors ligne permet au RST de saisir un incident sans réseau et de l'envoyer automatiquement au retour du réseau ; […] aucun incident saisi hors ligne n'est perdu lors du test en mode avion. »
- **Codage estimé** : 10 minutes
- **Fichiers prévus** : file d'attente locale (stockage navigateur), écouteur d'évènement réseau, affichage du statut « en attente »
- **Tests unitaires prévus** : 2 — ajout à la file quand l'envoi échoue ; purge de la file et passage à « Nouveau » après envoi réussi.
- **Étapes ajoutées à la démo** : couper le réseau, signaler un incident, montrer le statut « en attente », remettre le réseau, montrer l'envoi automatique.
- **Bilan** :
  - ⚠️ Temps restant annoncé au début de cette itération : ~15 minutes ou moins — insuffisant pour codage + publication + tour de test PM Lab complet (~25 min). Signalé au développeur (✂️), qui a choisi une version réduite plutôt que de reporter l'itération entièrement.
  - Durée de codage réelle : 1 minute (budget serré tenu).
  - Critères d'acceptation : les 3 sont satisfaits dans leur principe, mais sans vrai réseau à couper : il n'existe aucun appel réseau pour l'envoi d'un incident (tout est déjà en `localStorage`, aucun backend d'incidents). Le statut « hors ligne » est donc déterminé à la soumission via `navigator.onLine`, pas par l'échec d'un appel ; l'équipement de secours au retour en ligne (évènement `online`) fait repasser tous les incidents « en attente » de la fiche à « Nouveau », sans perte (couvert par les 2 tests Vitest ajoutés).
  - Reporté à une itération ultérieure si le temps le permet après le pitch : couper réellement le réseau dans la démo Playwright (`context.setOffline`), et étendre le rafraîchissement automatique à la liste `/parc` (actuellement recalculée seulement au chargement de la page, pas en direct au retour réseau).
  - Hors DoD, non tenté par manque de temps : mise à jour de `e2e/demo.spec.ts` pour ce parcours.
  - **Modifications** :
    - `frontend/src/lib/incidents.ts` — `Incident.statut` accepte désormais `"en_attente"`, `ajouterIncident` prend un paramètre `enLigne`, nouvelle fonction `renvoyerEnAttente` (critères 1, 2, 3).
    - `frontend/src/lib/incidents.test.ts` — 2 tests Vitest ajoutés : mise en attente hors ligne, passage à « Nouveau » sans perte au retour réseau (DoD point 2).
    - `frontend/src/app/equipement/[id]/FicheEquipement.tsx` — écouteur `window.addEventListener("online", ...)`, badge « En attente d'envoi », passage de `navigator.onLine` à `ajouterIncident` (critères 1, 2, 3).

---

## À venir (détaillées au fil de l'eau, selon le temps restant)

1. Notification du directeur national des infrastructures dès qu'un incident arrive, et enregistrement de l'intervention (prestataire, date, type de prise en charge), avec passage de l'équipement à « Réparé, à vérifier ».
2. Validation RST sur place : il revoit la photo de départ, répond OK/KO avec une photo « après » ; OK valide l'incident, KO le rouvre. La fiche équipement affiche à cette occasion sa pastille d'état et l'historique des incidents/interventions (carnet de santé minimal, hypothèse 3).
3. Si le temps le permet : champ libre « situation juridique du terrain » sur la fiche équipement (saisi à la main, jamais déduit), et stabilisation finale pour le pitch.
