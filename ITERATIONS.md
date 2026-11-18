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

## Itération 4 : Le directeur est prévenu et voit l'incident dans sa bannette

- **Prérequis (2 min, inclus dans le budget)** : aligner l'urgence sur « Faible / À traiter / Danger » (E1) ; créer `etats.ts` avec les 5 états, leur couleur, leur icône Lucide et leur libellé, et faire afficher icône + libellé partout où un état apparaît (E2) ; rafraîchir `/parc` sur l'évènement `online` (E5) ; ajouter le persona PPUB Auvergne-Rhône-Alpes (E4).
- **Dans le périmètre** :
  - `regles.ts` : règles R1 à R4 de la spec (Danger → directeur ; Structure ou Fixation → directeur ; terrain de la ville ou sous convention → PPUB de la région ; sinon → RST du terrain). La première règle vraie fixe `attribueA` et `regleAppliquee`, enregistrés sur l'incident à sa réception ;
  - dans `/parc`, panneau **Bannettes** à deux onglets avec compteurs : **Ma bannette** (incidents attribués au persona courant) et **Commune** (tous les incidents ouverts). Ligne : icône d'état, équipement + terrain, constat + ancienneté, personne attribuée (« Vous » si c'est le persona), « À prendre » ;
  - **cartes de notification in-app** à la réception : « Teams, canal Infra [région] » pour tout incident ; « Mail immédiat » en plus si Danger. Chaque carte affiche la règle appliquée et un bouton « Ouvrir le carnet ».
- **Hors périmètre** : onglet « Pour info » et messages aux personnes en copie (itération 7), édition des règles.
- **Critères d'acceptation** :
  - Étant donné un incident Danger signalé par le RST, quand il est reçu, alors il est attribué au directeur (règle R1) et une carte « Teams » et une carte « Mail immédiat » s'affichent.
  - Étant donné le persona directeur, quand il ouvre `/parc`, alors l'incident est en tête de « Ma bannette » et présent dans « Commune », avec le statut « À prendre ».
  - Étant donné un incident « Filet » sur un terrain campus propriétaire, quand il est reçu, alors il est attribué au RST du terrain (règle R4) et n'apparaît pas dans « Ma bannette » du directeur.
  - Étant donné un incident mis en attente hors ligne, quand le réseau revient, alors la liste `/parc` se met à jour sans recharger la page.
- **Hypothèse de l'équipe couverte** : notification Teams du PRD (« le directeur voit chaque incident sans consulter l'Excel »), traduite en notification in-app.
- **Codage estimé** : 10 minutes
- **Fichiers prévus** : `lib/etats.ts`, `lib/regles.ts`, `lib/notifications.ts`, `lib/personas.ts`, `lib/incidents.ts` (urgence, `attribueA`, `regleAppliquee`), `components/Bannettes.tsx`, `components/Notifications.tsx`, `app/parc/page.tsx`
- **Tests unitaires prévus** : 4. R1 prioritaire sur R2 ; R3 sur terrain de la ville ; R4 par défaut ; tri de la bannette (nouveau d'abord, puis gravité).
- **Étapes ajoutées à la démo** : persona RST, signaler un Danger ; passer en persona directeur ; voir les cartes Teams et Mail, puis l'incident en tête de « Ma bannette ».

### Bilan

- **Codage réel** : 9 min (`.iterations/4.debut` → `.iterations/4.fin`), dans le budget malgré l'autorisation de dépassement donnée par le développeur.
- **Décision du développeur** : le développeur a explicitement autorisé à ignorer les limites de taille (max 3 critères, ~5 fichiers) et à garder les 4 critères d'acceptation du plan ci-dessus tel quel, avec 30 minutes disponibles pour l'itération complète (codage + vérification + publication).
- **Simplifications assumées, non demandées explicitement par le développeur** (à reprendre si besoin) :
  - les **prérequis E1/E2 (urgence « Faible/À traiter/Danger », `etats.ts`, icônes Lucide)** n'ont pas été faits : l'urgence reste `normale`/`forte`/`danger` telle qu'en itération 2, et les icônes restent des SVG en ligne (pas de nouvelle dépendance Lucide sous contrainte de temps) ;
  - `notifications.ts`/`Notifications.tsx` n'ont pas été créés séparément : leur logique est repliée directement dans `components/Bannettes.tsx`, pour réduire le nombre de fichiers ;
  - « canal Infra [région] » affiche en réalité la **ville** de l'équipement (`equipement.ville`), faute de champ région dans le modèle actuel ;
  - la **notion de région** de la règle R3 a été simplifiée en un champ `proprietaire: "ville" | "convention" | "prive"` sur `Equipement` (nouveau champ), plutôt qu'un vrai découpage géographique.
- **Modifications** :
  - `frontend/src/lib/regles.ts` (nouveau) : implémente R1 à R4, sert les 1er, 2e et 3e critères d'acceptation (attribution).
  - `frontend/src/lib/equipements.ts` : ajoute `Proprietaire`/`proprietaire` par équipement, nécessaire à R3/R4 ; `EQ-SAE1-FP1` est marqué `"prive"` pour servir le 3e critère (terrain campus propriétaire).
  - `frontend/src/lib/personas.ts` : ajoute le rôle `"ppub"` et le persona Nadia Pastor, nécessaire pour que R3 ait un destinataire.
  - `frontend/src/lib/incidents.ts` : `Incident` porte désormais `attribueA`/`regleAppliquee`, calculés par `attribuer()` dans `ajouterIncident` (qui prend maintenant l'`Equipement` complet, pas seulement son id) ; ajoute `chargerTousIncidents()` (vue toutes bannettes) et `renvoyerTousEnAttente()`/`trierParGraviteEtDate()` pour le 4e critère (rafraîchissement réseau) et le tri de la bannette.
  - `frontend/src/components/Bannettes.tsx` + `.module.css` (nouveaux) : panneau Ma bannette/Commune avec compteurs, cartes de notification Teams/Mail immédiat, sert les 4 critères d'acceptation.
  - `frontend/src/app/parc/page.tsx` : intègre `<Bannettes>`, ajoute l'écoute de l'évènement `online` qui rejoue `renvoyerTousEnAttente()` et force le recalcul (4e critère).
  - `frontend/src/app/equipement/[id]/FicheEquipement.tsx` : adapte l'appel à `ajouterIncident` à sa nouvelle signature (passe l'équipement, pas son id).
  - `frontend/src/lib/regles.test.ts` (nouveau, 3 tests) et `frontend/src/lib/incidents.test.ts` (+1 test) : les 4 tests prévus (R1 prioritaire sur R2, R3 sur terrain de la ville, R4 par défaut, tri de la bannette).
- **Vérifications** : `npm test` (10/10 passent), `npm run build`, `npm run lint` (0 erreur), `./scripts/verifier-deployabilite.sh` (aucune borne franchie).
- **Déployé** : image frontend reconstruite et publiée (`localhost:5000/team55/frontend:dev`), stack recréée (`podman compose up -d --force-recreate`) ; `localhost:8080/`, `/sante` et `localhost:8081/health` répondent 200 depuis la machine. **Reste à confirmer par le développeur depuis son navigateur** : `$URL_PUBLIQUE/health` et `$URL_PUBLIQUE/sante`.

## Itération 5 : Le directeur enregistre l'intervention, photo de réparation obligatoire

- **Dans le périmètre** :
  - sur `/equipement/[id]`, boutons « Prendre en charge » (l'incident quitte « À prendre ») et « Enregistrer l'intervention » (états Incident ouvert et Danger) ;
  - fenêtre **Enregistrer l'intervention** : prestataire (choix parmi 4 valeurs fictives ou texte libre), date, prise en charge **proposée selon la situation juridique** (Campus → Association ; Convention ou Terrain de la ville → Ville ; Sans convention → À arbitrer), modifiable ; **photo de la réparation obligatoire** (`input[type=file]` en data URL, comme la photo du constat), aperçu avec « Reprendre » ;
  - à la validation : création d'une `Intervention` (avec `photoReparation`), équipement en **« Réparé, à vérifier »** (bleu, icône Wrench), carte « Teams, conversation avec [RST] : demande de vérification ».
- **Hors périmètre** : gestion des prestataires et des contrats, vérification par le RST (itération 6).
- **Critères d'acceptation** :
  - Étant donné la fenêtre sans photo, alors « Marquer réparé, à vérifier » est inactif et un message dit pourquoi.
  - Étant donné un terrain sous convention avec la ville, quand la fenêtre s'ouvre, alors la prise en charge proposée est « Ville ».
  - Étant donné une photo ajoutée, quand le directeur valide, alors l'équipement passe à « Réparé, à vérifier » dans la fiche et dans `/parc`, et une carte « demande de vérification » s'affiche.
- **Hypothèse de l'équipe couverte** : préparation de la validation RST (« le directeur sait si l'intervention a réussi »).
- **Codage estimé** : 10 minutes
- **Fichiers prévus** : `lib/interventions.ts`, `lib/etats.ts` (transition), `app/equipement/[id]/FicheEquipement.tsx`, `components/FenetreIntervention.tsx`
- **Tests unitaires prévus** : 3. validation impossible sans photo ; prise en charge proposée par situation juridique ; transition Incident ouvert → Réparé, à vérifier.
- **Étapes ajoutées à la démo** : persona directeur, ouvrir l'équipement depuis la bannette, enregistrer l'intervention (montrer le blocage sans photo), voir le passage au bleu.

## Itération 6 : Le RST vérifie sur place et le carnet de santé se remplit

- **Dans le périmètre** :
  - persona RST : bloc **« À vérifier »** en haut de `/parc` (ou de `/terrain` si l'itération 8 est faite) listant les équipements « Réparé, à vérifier » de ses terrains ;
  - écran **Vérifier** : photo de départ et photo de réparation **côte à côte**, résumé de l'intervention, photo « après », boutons « OK, validé » (exige la photo après) et « KO, rouvrir » ;
  - OK : incident « Validé par le RST », équipement « Vérifié » (vert), carte « Teams : validé sur place » ; KO : incident « Rouvert », de nouveau « À prendre » ;
  - **carnet minimal** sur `/equipement/[id]` : pastille d'état (couleur + icône + libellé), photos dans l'ordre **avant / réparation / après**, historique daté (incidents, interventions, validations triés par date), bloc Attribution (personne, règle).
- **Hors périmètre** : alerte récidive, export, impression.
- **Critères d'acceptation** :
  - Étant donné un équipement « Réparé, à vérifier », quand le RST ouvre la vérification, alors il voit la photo de départ et la photo de réparation côte à côte.
  - Étant donné l'absence de photo après, alors « OK, validé » est inactif.
  - Étant donné OK, alors l'incident est clos et l'équipement repasse au vert ; étant donné KO, alors l'incident redevient « À prendre ».
  - Étant donné un équipement passé par tout le cycle, quand on ouvre sa fiche, alors l'historique daté et les trois photos sont affichés.
- **Hypothèses de l'équipe couvertes** : validation RST ; carnet de santé (« chaque équipement dispose d'un historique daté »).
- **Codage estimé** : 10 minutes
- **Fichiers prévus** : `lib/validations.ts`, `lib/historique.ts` (reconstruction depuis incidents, interventions, validations), `components/Verifier.tsx`, `app/equipement/[id]/FicheEquipement.tsx`, `app/parc/page.tsx`
- **Tests unitaires prévus** : 4. OK impossible sans photo après ; OK clôt et remet à Vérifié ; KO rouvre ; reconstruction de l'historique triée par date.
- **Étapes ajoutées à la démo** : persona RST, « À vérifier », photo après, OK ; ouvrir le carnet et montrer l'historique complet.

## Itération 7 (bonus) : « Pour info » et règles visibles

- **Dans le périmètre** :
  - `regles.ts` calcule aussi `pourInfo` (R1 : RST du terrain, suppléant, PPUB ; R2 : RST du terrain ; R3 : directeur ; R4 : personne), l'auteur n'étant jamais en copie ;
  - troisième onglet **« Pour info »** dans les bannettes, et carte « Teams, pour info : incident sérieux, à regarder » pour R1 et R2 uniquement ;
  - fenêtre **« Voir les règles »** (lecture) avec le tableau R1 à R4 et la phrase d'accompagnement de la spec (F4).
- **Critères d'acceptation** :
  - Étant donné un Danger signalé par le RST, alors la suppléante et la PPUB le voient dans « Pour info » et une carte « pour info » s'affiche ; le RST auteur n'est pas en copie.
  - Étant donné un incident R4, alors aucune carte « pour info » n'est émise.
- **Codage estimé** : 8 minutes
- **Tests unitaires prévus** : 2. liste `pourInfo` par règle ; exclusion de l'auteur.

## Itération 8 (bonus) : Interface ISO prototype

- **Dans le périmètre** :
  - **en-tête** du prototype : marque, fil d'Ariane, persona avec avatar, bouton « Téléphone RST », bascule thème clair / sombre (icônes Lucide Moon / Sun) ;
  - **4 indicateurs cliquables** en haut de `/parc` : Danger, À prendre en charge, Réparés à vérifier, Récidives (étiquette V2, valeur 0 autorisée) ;
  - **route `/terrain`** : parcours RST M1 à M6 dans un **cadre téléphone** sur ordinateur (plein écran sur mobile), avec écran **Identifier** à deux onglets **Badge NFC** (simulé, ondes animées) et **QR code** (simulé) ;
  - **barre d'outils de test** discrète : interrupteur réseau, sélecteur **App Power Apps / Navigateur** (en Navigateur : onglet NFC désactivé, enregistrement hors ligne bloqué avec message) ;
  - animations du prototype : onglets à segment glissant, listes en cascade, compteurs animés, respect de `prefers-reduced-motion`.
- **Hors périmètre** : carte de France (V2), démo guidée (ne jamais la construire).
- **Critères d'acceptation** :
  - Étant donné `/terrain` sur ordinateur, alors le parcours s'affiche dans un cadre téléphone à côté de `/parc`.
  - Étant donné le mode Navigateur et le réseau coupé, alors l'onglet NFC est désactivé et l'enregistrement est refusé avec un message.
  - Étant donné un clic sur un indicateur, alors la liste et la bannette sont filtrées.
- **Codage estimé** : 10 minutes (si dépassement : livrer d'abord indicateurs + en-tête, reporter le cadre téléphone)
- **Tests unitaires prévus** : 1. règle « Navigateur + hors ligne ⇒ enregistrement refusé ».

---

## Dette technique à traiter hors chrono (si une machine le permet)

1. Rendre `e2e/demo.spec.ts` exécutable (Chromium et `libnspr4.so` manquants sur cette machine) et couper réellement le réseau avec `context.setOffline`.
2. Déduplication par `idLocal` (UUID généré à la saisie) pour garantir « jamais de doublon » au renvoi.
3. Photos en data URL dans `localStorage` : prévoir une taille maximale pour ne pas saturer le stockage du navigateur.

## Après le pitch (V2, ne pas construire maintenant)

Carte de France, alerte récidive, relance automatique après 48 h, édition des règles par la référente, administration (terrains, équipements, planche QR, export des identifiants NFC), contrôles planifiés.
